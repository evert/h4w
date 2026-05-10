// @ts-check no-strict
import { draggable } from "./draggable.mjs";

class HwWindow extends HTMLElement {

  static observedAttributes = ["title"];

  constructor() {
    super();
  }

  connectedCallback() {

    const children = Array.from(this.children);

    this.setHTMLUnsafe(`<hw-titlebar>
        <button class="context-menu">Context menu</button>
        <h1>Homelab for workgroups</h1>
        <button class="minimize">Minimize</button>
        <button class="maximize">Maximize</button>
      </hw-titlebar>

      <menu>
        <li>File</li>
        <li>Edit</li>
        <li><hw-open src="/menu/credits.json">About</hw-open></li>
      </menu>
      <div class="content">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
      </div>
    `);

    this.querySelector('div').replaceChildren(...children);
    this.querySelector('hw-titlebar h1').textContent = this.getAttribute("title") ?? "Unitled";

    this.querySelector("hw-titlebar .maximize").addEventListener("click", () => {
      this.toggleAttribute("maximized");
    });

    this.querySelector("hw-titlebar .minimize").addEventListener("click", () => {
      this.minimize();
    });

    this.addEventListener("mousedown", () => {
      this.activate();
    });
    this.activate();

    if (this.hasAttribute('src')) {
      const src = this.getAttribute('src');
      const existingIcon = document.querySelector(`.desktop-icons hw-icon a[href="${src}"]`);
      if (existingIcon) {
        existingIcon.closest('hw-icon').remove();
      }
      this.loadMenu(src);
    }
    draggable(this.querySelector('hw-titlebar h1'), this);

  }

  activate() {

    for (const win of document.querySelectorAll('hw-window[active]')) {
      if (win !== this) win.removeAttribute('active');
    }
    this.setAttribute('active', '');
    topZ += 1;
    this.style.zIndex = String(topZ);

  }

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
    icon.setAttribute('is-menu', '');
    icon.setAttribute('href', src);
    icon.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    icon.setAttribute('icon', this.icon ?? GROUP_ICON);
    desktop.append(icon);

    this.remove();

  }

  /**
   * @param  {string[]|Element[]} newContent
   */
  async replaceContent(...newContent) {

    if (typeof newContent[0] === "string") {
      this.querySelector(".content").innerHTML = newContent[0];
    } else if (newContent[0] instanceof HTMLElement) {
      const contentEl = this.querySelector(".content");
      contentEl.replaceChildren(...newContent);
    } else {
      console.error("Invalid content type. Must be a string or HTMLElement.");
    }

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
    for(const item of json.items) {
      const icon = document.createElement('hw-icon');
      icon.setAttribute('href', item.href);
      icon.setAttribute('title', item.title);
      if (item.icon) icon.setAttribute('icon', item.icon);
      icons.append(icon);
    }
    this.replaceContent(icons);

  }

  /**
   * @param {string} name
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case "title": {
        const h1 = this.querySelector('hw-titlebar h1');
        if (h1) h1.textContent = newValue;
        break;
      }
    }
  }

}


const GROUP_ICON = '/image/icons/win311/PROGM004.PNG';

let topZ = 0;

customElements.define("hw-window", HwWindow);
