import { Hono } from 'hono';
import Core, { EmittedEvent, type Device } from 'mdns-listener-advanced';

function iconForDevice(services: string[]): string {
  if (services.includes('_smb._tcp')) return 'image/icons/win311/WINFI001.PNG';
  return 'image/icons/win311/TERMI001.PNG';
}

// hostname.local → IPv4  (from A records)
const hostToIp = new Map<string, string>();
// service-instance.local → target hostname.local  (from SRV records)
const instanceToTarget = new Map<string, string>();
// all service instance names seen via PTR records
const ptrInstances = new Set<string>();

function stripDot(name: string): string {
  return name.replace(/\.$/, '');
}

const mdns = new Core(null, null, { disablePublisher: true });
const event = mdns.listen();

event.on(EmittedEvent.DISCOVERY, (device: Device) => {
  const name = stripDot(device.name);

  if (device.type === 'A' && typeof device.data === 'string') {
    hostToIp.set(name, device.data);
  } else if (device.type === 'SRV') {
    const target = (device.data as { target?: string }).target;
    if (target) instanceToTarget.set(name, stripDot(target));
  } else if (device.type === 'PTR' && typeof device.data === 'string') {
    ptrInstances.add(stripDot(device.data));
  }
});

event.on(EmittedEvent.ERROR, (err: Error) => {
  console.error('mDNS error:', err);
});

mdns.scan();
setInterval(() => mdns.scan(), 30_000);

// Extracts a human-readable display name from an mDNS instance name, or null to discard.
function extractDeviceName(raw: string): string | null {
  if (raw.includes('.in-addr.arpa') || raw.includes('.ip6.arpa')) return null;

  const name = raw.replace(/\.local\.?$/, '').replace(/\.$/, '');

  if (/^\._?[^.]+\._(tcp|udp)$/.test(name) || name.startsWith('_')) return null;

  const instanceMatch = name.match(/^(.+?)\._[^.]+\._(tcp|udp)$/);
  if (instanceMatch) {
    const instance = instanceMatch[1]!;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(instance)) return null;
    const withoutMac = instance.replace(/^[0-9A-F]{12}@/i, '');
    const cleaned = withoutMac
      .replace(/\s*\[[^\]]+\]$/, '')   // strip Avahi " [MAC]" / " [hash]" suffix
      .replace(/-[0-9a-f]{8,}$/i, '')  // strip hex-hash suffix
      .trim();
    if (!cleaned) return null;
    if (/^[0-9a-f]+$/i.test(cleaned) && cleaned.length >= 8) return null;
    return cleaned;
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(name)) return null;
  if (/^[0-9a-f]+$/i.test(name) && name.length >= 8) return null;

  return name;
}

// Higher = better display name. Prefer service-instance names (have spaces/capitals).
function nameScore(name: string): number {
  let score = name.length;
  if (/\s/.test(name)) score += 20;
  if (/[A-Z]/.test(name)) score += 10;
  return score;
}

// Slugify a display name into a routable .local hostname.
function toHostname(name: string): string {
  return name.toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Fallback grouping key when no IP is available.
function normalizeKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export const neighbourhood = new Hono();

function extractServiceType(instance: string): string | null {
  const m = instance.replace(/\.local\.?$/, '').match(/\.(_[^.]+\._(tcp|udp))$/);
  return m ? m[1]! : null;
}

neighbourhood.get('/neighbourhood', (c) => {
  type Group = { hostname: string | null; ip: string | null; names: string[]; services: string[] };
  // Primary: group by IPv4 (definitive identity)
  const byIp = new Map<string, Group>();
  // Fallback: group by normalized name for devices with no A record yet
  const byKey = new Map<string, Group>();

  // Seed IP groups from A records so hostname-only devices appear too.
  // Only add the hostname to names if it's a usable display name (not hex/UUID).
  for (const [host, ip] of hostToIp) {
    if (!byIp.has(ip)) {
      const shortName = host.replace(/\.local\.?$/, '');
      const displayName = extractDeviceName(shortName);
      byIp.set(ip, { hostname: shortName, ip, names: displayName ? [displayName] : [], services: [] });
    }
  }

  // Merge service instances into IP groups, or fall back to key groups.
  for (const instance of ptrInstances) {
    const displayName = extractDeviceName(instance);
    if (!displayName) continue;

    const target = instanceToTarget.get(instance);
    const ip = target ? hostToIp.get(target) : undefined;
    const svc = extractServiceType(instance);

    if (ip) {
      const g = byIp.get(ip)!;
      if (!g.names.includes(displayName)) g.names.push(displayName);
      if (!g.hostname && target) g.hostname = target.replace(/\.local\.?$/, '');
      if (svc && !g.services.includes(svc)) g.services.push(svc);
    } else {
      // IP not yet seen — group by normalized name as best effort.
      const key = normalizeKey(displayName);
      if (!byKey.has(key)) byKey.set(key, { hostname: null, ip: null, names: [], services: [] });
      const g = byKey.get(key)!;
      if (!g.names.includes(displayName)) g.names.push(displayName);
      if (!g.hostname && target) g.hostname = target.replace(/\.local\.?$/, '');
      if (svc && !g.services.includes(svc)) g.services.push(svc);
    }
  }

  const items: Array<{ title: string; icon: string; href: string; hostname: string; ip: string | null; services: string[] }> = [];

  function makeItem({ hostname, ip, names, services }: Group) {
    if (names.length === 0) return null;
    const title = names.reduce((best, n) => nameScore(n) >= nameScore(best) ? n : best, names[0]!);
    const host = hostname ?? toHostname(title);
    return { title, icon: iconForDevice(services), href: `http://${host}.local`, hostname: host, ip, services };
  }

  const usedHostnames = new Set<string>();

  for (const group of byIp.values()) {
    const item = makeItem(group);
    if (item) {
      usedHostnames.add(item.hostname);
      items.push(item);
    }
  }
  // Skip byKey entries whose hostname is already covered by a byIp group.
  for (const group of byKey.values()) {
    const item = makeItem(group);
    if (item && !usedHostnames.has(item.hostname)) items.push(item);
  }

  return c.json({ title: 'Network Neighbourhood', items });
});
