export type Icon = {
  title: string;
  href: string;
  icon?: string;
}

export type Menu = {
  title: string;
  items: Icon[];
}


export type MdnsIcon = Icon & {
  hostname: string;
  ip: string | null;
  services: string[];
}
