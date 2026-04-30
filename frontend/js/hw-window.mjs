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

    if (this.hasAttribute('src')) {
      this.loadMenu(this.getAttribute('src'));
    }
    draggable(this.querySelector('hw-titlebar h1'), this);

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

    const icons = document.createElement('hw-icongrid');
    for(const item of json.items) {
      const icon = document.createElement('hw-icon');
      icon.setHTMLUnsafe(html`<a href="${item.href}" target="_blank"><img src="${item.icon}" alt="${item.title}" /><span>${item.title}</span></a>`);
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
      case "title":
        this.querySelector('hw-titlebar h1').textContent = newValue;
        break;
    }
  }

}


/**
 * Template literal to escape HTML content
 *
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    const value = values[i];

    return out + str + (
      i < values.length ? escapeHtml(value) : ''
    );
  }, '');

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}


customElements.define("hw-window", HwWindow);
