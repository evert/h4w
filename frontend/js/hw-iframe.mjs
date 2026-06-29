// @ts-check

class HwIframe extends HTMLElement {

  connectedCallback() {
    const win = document.createElement('hw-window');
    win.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    if (this.hasAttribute('src')) {
      const src = /** @type {string} */ (this.getAttribute('src'));
      win.setAttribute('src', src);
      const iframe = document.createElement('iframe');
      iframe.src = src;
      win.appendChild(iframe);
    }
    this.appendChild(win);
  }

}

customElements.define('hw-iframe', HwIframe);
