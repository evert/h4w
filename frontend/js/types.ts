export type Group = {
  title: string;
  icon?: string;
  items: GroupItem[];
  menu: Menu[];
}

export type GroupItem = {
  title: string;
  href?: string;
  icon?: string;
  type?: string;
}

export type Menu = {

  /** Label */
  title: string;

  /**
   * If set, open the group with this link
   */
  href?: string;

  /**
   * If set, the menu will perform one of these actions
   */
  action?: 'minimize' | 'maximize' | 'close' | 'restore' | 'theme';

  /**
   * If set the menu is treated as a dropdown menu
   */
  submenu?: Menu[];

  /**
   * Arbitrary value. Meaning depends on the action.
   */
  value?: string;
}
