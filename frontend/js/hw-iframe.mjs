// @ts-check
/** @import { HwWindow } from "./hw-window.mjs" */

class HwIframe extends HTMLElement {

  /** @type {HwWindow} */
  win;

  connectedCallback() {
    this.win = /** @type {HwWindow} */ (document.createElement('hw-window'));
    this.win.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    this.win.app = this;
    if (this.hasAttribute('src')) {
      const src = /** @type {string} */ (this.getAttribute('src'));
      this.win.setAttribute('src', src);
      const iframe = document.createElement('iframe');
      iframe.src = src;
      this.win.appendChild(iframe);
    }
    this.appendChild(this.win);
  }

  activate() {
    this.win.activate();
  }
}

customElements.define('hw-iframe', HwIframe);
