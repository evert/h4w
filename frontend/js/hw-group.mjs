// @ts-check
import { HwWindow } from "./hw-window.mjs";

class HwGroup extends HwWindow {

  /** @override */
  icon = '/image/icons/win311/PROGM004.PNG';

  /** @override */
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('src')) {
      this.loadMenu(this.getAttribute('src'));
    }
  }

  /** @override */


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
    if (json.icon) this.icon = json.icon;

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
