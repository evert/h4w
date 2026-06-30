// @ts-check no-strict
import { draggable } from "./draggable.mjs";

export class HwWindow extends HTMLElement {

  static observedAttributes = ["title"];
  /** @type {string} */
  icon = '/image/icons/win311/PROGM003.PNG';

  /** @type {HTMLElement|null} */
  desktopIcon = null;

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
      <div class="content"></div>
    `);

    this.querySelector('div').replaceChildren(...children);
    this.querySelector('hw-titlebar h1').textContent = this.getAttribute("title") ?? "Untitled";

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

    draggable(this.querySelector('hw-titlebar h1'), this);

    const rect = this.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (!this.style.left) {
      this.style.left = `${(viewportWidth - rect.width) / 2}px`;
    }
    if (!this.style.top) {
      this.style.top = `${(viewportHeight - rect.height) / 2}px`;
    }

  }

  activate() {

    for (const win of document.querySelectorAll('hw-window[active]')) {
      if (win !== this) win.removeAttribute('active');
    }
    this.setAttribute('active', '');
    topZ += 1;
    this.style.zIndex = String(topZ);
    this.unminimize();

  }

  minimize() {
    const desktop = document.querySelector('.desktop-icons');
    if (!desktop) {
      console.error('No .desktop-icons container found');
      return;
    }

    const icon = this.desktopIcon ?? document.createElement('hw-icon');
    icon.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    icon.setAttribute('icon', this.icon);
    desktop.append(icon);
    this.desktopIcon = icon;

    icon.querySelector('button').ondblclick = () => {
      this.unminimize();
    };

    this.setAttribute('minimized', '');
  }

  unminimize() {
    if (this.desktopIcon) {
      this.desktopIcon.remove();
      this.desktopIcon = null;
    }
    this.removeAttribute('minimized');
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

let topZ = 0;

customElements.define("hw-window", HwWindow);
