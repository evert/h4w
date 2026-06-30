// @ts-check
import { HwWindow } from "./hw-window.mjs";

class HwGroup extends HTMLElement {

  /** @type {string} */
  icon = '/image/icons/win311/PROGM004.PNG';

  connectedCallback() {
    this.win = /** @type {HwWindow} */ (document.createElement('hw-window'));
    this.win.icon = this.icon;
    if (this.hasAttribute('src')) {
      this.win.setAttribute('src', /** @type {string} */ (this.getAttribute('src')));
    }
    this.appendChild(this.win);

    if (this.hasAttribute('src')) {
      this.loadMenu(/** @type {string} */ (this.getAttribute('src')));
    }
  }

  /**
   * Loads a menu JSON file.
   *
   * @param {string} src
   */
  async loadMenu(src) {

    const res = await fetch(src);
    if (!res.ok) {
      console.error("Failed to load menu:", res.status);
      return;
    }
    const json = await res.json();
    this.win.setAttribute('title', json.title ?? 'Untitled');
    if (json.icon) this.win.icon = json.icon;

    const icons = document.createElement('hw-icongrid');
    for (const item of json.items) {
      const icon = document.createElement('hw-icon');
      icon.setAttribute('href', item.href);
      icon.setAttribute('title', item.title);
      if (item.icon) icon.setAttribute('icon', item.icon);
      if (item.type) icon.setAttribute('type', item.type);
      icons.append(icon);
    }
    this.win.replaceContent(icons);

  }

  activate() {
    this.win.activate();
  }

}

customElements.define("hw-group", HwGroup);
