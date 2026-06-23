// @ts-check
import { HwWindow } from "./hw-window.mjs";

const GROUP_ICON = '/image/icons/win311/PROGM004.PNG';

class HwGroup extends HwWindow {

  /** @override */
  connectedCallback() {
    super.connectedCallback();

    if (this.hasAttribute('src')) {
      const src = this.getAttribute('src');
      const existingIcon = document.querySelector(`.desktop-icons hw-icon a[href="${src}"]`);
      if (existingIcon) {
        existingIcon.closest('hw-icon').remove();
      }
      this.loadMenu(src);
    }
  }

  /** @override */
  minimize() {
    const src = this.getAttribute('src');
    if (!src) {
      this.remove();
      return;
    }

    const desktop = document.querySelector('.desktop-icons');
    if (!desktop) {
      console.error('No .desktop-icons container found');
      return;
    }

    const icon = document.createElement('hw-icon');
    icon.setAttribute('type', 'group');
    icon.setAttribute('href', src);
    icon.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    icon.setAttribute('icon', this.icon ?? GROUP_ICON);
    desktop.append(icon);

    this.remove();
  }

  /**
   * @param {string} src
   */
  async loadMenu(src) {

    const res = await fetch(src);
    if (!res.ok) {
      console.error("Failed to load menu:", res.status);
      return;
    }
    const json = await res.json();
    this.setAttribute('title', json.title ?? 'Untitled');
    this.icon = json.icon;

    const icons = document.createElement('hw-icongrid');
    for (const item of json.items) {
      const icon = document.createElement('hw-icon');
      icon.setAttribute('href', item.href);
      icon.setAttribute('title', item.title);
      if (item.icon) icon.setAttribute('icon', item.icon);
      if (item.type) icon.setAttribute('type', item.type);
      icons.append(icon);
    }
    this.replaceContent(icons);

  }

}

customElements.define("hw-group", HwGroup);
