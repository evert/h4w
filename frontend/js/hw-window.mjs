// @ts-check no-strict
import { draggable } from "./draggable.mjs";

export class HwWindow extends HTMLElement {

  static observedAttributes = ["title"];
  /** @type {string} */
  icon = '/image/icons/win311/PROGM003.PNG';

  constructor() {
    super();
    if (this.hasAttribute('src')) {
      const src = this.getAttribute('src');
      const existingIcon = document.querySelector(`.desktop-icons hw-icon a[href="${src}"]`);
      if (existingIcon) {
        existingIcon.closest('hw-icon').remove();
      }
    }
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

  }

  activate() {

    for (const win of document.querySelectorAll('hw-window[active], hw-group[active], hw-iframe[active]')) {
      if (win !== this) win.removeAttribute('active');
    }
    this.setAttribute('active', '');
    topZ += 1;
    this.style.zIndex = String(topZ);

  }

  minimize() {
    const desktop = document.querySelector('.desktop-icons');
    if (!desktop) {
      console.error('No .desktop-icons container found');
      return;
    }

    const icon = document.createElement('hw-icon');
    icon.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    icon.setAttribute('icon', this.icon);
    desktop.append(icon);

    icon.querySelector('button').ondblclick = () => {
      icon.remove();
      this.removeAttribute('minimized');
      this.activate();
    };

    this.setAttribute('minimized', '');
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
