#!/usr/bin/env node
import { parseArgs } from 'node:util';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

function help() {
  console.error(
`This script fetches an icon from a URL, and turns it into something
resembling a Windows 3.11 icon. At the moment we just resize it to
32x32 and don't anti-alias, so results may vary.

This script requires imagick to be installed and available in the PATH.

Usage: node fetch-icon.mjs <url>`);
}


const { values, positionals } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h',
    }
  },
  strict: true,
  allowPositionals: true,
});

if (values.help) {
  help();
  process.exit(0);
}

if (positionals.length < 1) {
  help();
  process.exit(1);
}

const url = new URL(positionals[0]);
const fileBaseName = url.hostname;

console.log('First seeing if the URL was already an icon');

const attempt1 = url;
console.log('Trying to fetch icon from', attempt1.href);
const res1 = await fetch(attempt1);
if (res1.ok) {
  if (res1.headers.get('Content-Type')?.startsWith('image/')) {
    console.log('Fetched icon from', attempt1.href);
    await processFile(res1, fileBaseName, '-orig.ico');
    process.exit(0);
  }
}

// Trying /favicon.ico first because it's more likely to be a low
// resulution icon.
const attempt2 = new URL('/favicon.ico', url);
console.log('Trying to fetch icon from', attempt1.href);
const res2 = await fetch(attempt2);
if (res2.ok) {

  if (res2.headers.get('Content-Type') !== 'text/html') {
    console.warn('Got served text/html, assuming it\'s a badly configured SPA');
  } else { 
    console.log('Fetched icon from', attempt1.href);
    await processFile(res2, fileBaseName, '-orig.ico');
    process.exit(0);
  }
}
console.log('Failed to fetch icon from', attempt1.href, 'with status', res2.status);

console.log('Trying to detect icon from HTML');
const htmlRes = await fetch(url);
if (!htmlRes.ok) {
  console.error('Failed to fetch HTML from', url.href, 'with status', htmlRes.status);
  process.exit(1);
}
const html = await htmlRes.text();

const iconHref = findIconLink(html);

if (!iconHref) {
  console.error('Failed to detect icon from HTML <link> tags');
  process.exit(1);
}

const iconUrl = new URL(iconHref, url);
console.log('Trying to fetch icon from', iconUrl.href);
const res3 = await fetch(iconUrl);
if (!res3.ok) {
  console.error('Failed to fetch icon from', iconUrl.href, 'with status', res3.status);
  console.error('Giving up');
  process.exit(1);
}
console.log('Fetched icon from', iconUrl.href);
await processFile(res3, fileBaseName, '-detected.ico');

async function processFile(res, fileBaseName, suffix) {
  console.log('Stored original in ', fileBaseName + suffix);
  fs.writeFileSync(fileBaseName + suffix, new Uint8Array(await res.arrayBuffer()));
  console.log('Processing icon with imagick');

  const targetName = fileBaseName + '.png';
  console.log('Output will be stored in', targetName);

  spawnSync('magick', [
    fileBaseName + suffix,
    '-resize', '32x32!',
    '-antialias',
    'PNG8:' + targetName,
  ], {
    stdio: 'inherit',
  });

}


function findIconLink(html) {
  const iconMatch = html.match(/<link[^>]+>/ig);
  if (!iconMatch) return null
  const links = [];
  for(const match of iconMatch) {
    const rel = match.match(/rel=((["'][^"']+["'])|([^\s]+\s))/i);
    const href = match.match(/href=((["'][^"']+["'])|([^\s]+[\s>]))/i);
    if (rel && href) {
      links.push({
        rel: rel[1].replace(/['">]/g, '').trim(),
        href: href[1].replace(/['">]/g, '').trim(),
      });
    }
  }

  for(const link of links) {
    if (link.rel.toLowerCase().includes('icon')) {
      console.log('Found icon link:', link);
      return link.href;
    }
  }

  return null;
}
