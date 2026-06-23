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


}

customElements.define('hw-iframe', HwIframe);
