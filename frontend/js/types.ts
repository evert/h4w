export type Menu = {
  label: string;
  href?: string;
  action?: 'minimize' | 'maximize' | 'close' | 'restore';
  submenu: Menu[];
}
