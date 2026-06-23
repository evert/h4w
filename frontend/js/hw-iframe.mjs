// @ts-check
import { HwWindow } from "./hw-window.mjs";

class HwIframe extends HwWindow {

  /** @override */
  connectedCallback() {
    super.connectedCallback();
    if (this.hasAttribute('src')) {
      const iframe = document.createElement('iframe');
      iframe.src = this.getAttribute('src');
      this.replaceContent(iframe);
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
    icon.setAttribute('type', 'iframe');
    icon.setAttribute('href', src);
    icon.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    if (this.icon) icon.setAttribute('icon', this.icon);
    desktop.append(icon);

    this.remove();
  }

}

customElements.define('hw-iframe', HwIframe);
