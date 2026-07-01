import { createOrFocus, html } from "./util.mjs";
/** @import HwWindow from ('./hw-window.mjs') */

class HwIcon extends HTMLElement {

  /**
   * If the icon is already attached to a window it won't create a new one.
   *
   * @type {HwWindow|null}
   */
  window = null;

  constructor() {
    super();
  }

  connectedCallback() {

    const title = this.getAttribute('title') ?? 'Untitled';
    const type = this.getAttribute('type');
    const iconSrc = resolveIconSrc(this.getAttribute('icon'), title);

    if (!this.hasAttribute('href')) {
      this.setHTMLUnsafe(html`
        <button>
          <img src="${iconSrc}" alt="${title}" />
          <span>${title}</span>
        </button>
      `);
      const img = this.querySelector('img');
      img.addEventListener('error', () => {
        if (img.src.endsWith(FALLBACK_ICON)) return;
        img.src = FALLBACK_ICON;
      });
      this.querySelector('button').addEventListener("dblclick", () => {
        if (this.window) {
          this.window.unminimize();
        }
      });
      return;
    }

    const href = this.getAttribute('href') ?? '#';
    const target = this.getAttribute('target') ?? '_blank';

    this.setHTMLUnsafe(html`
      <a href="${href}" target="${target}">
        <img src="${iconSrc}" alt="${title}" />
        <span>${title}</span>
      </a>
    `);

    const anchor = this.querySelector('a');
    const img = this.querySelector('img');

    img.addEventListener('error', () => {
      if (img.src.endsWith(FALLBACK_ICON)) return;
      img.src = FALLBACK_ICON;
    });

    anchor.addEventListener("click", (e) => {
      e.preventDefault();
    });
    anchor.addEventListener("dblclick", (e) => {
      e.preventDefault();
      if (this.window) this.window.unminimize();
      if (type === 'group') {
        createOrFocus(href, 'hw-group', title);
        return;
      }
      if (type === 'iframe') {
        createOrFocus(href, 'hw-iframe', title);
        return;
      }
      window.open(href, target);
    });

  }

}

const FALLBACK_ICON = '/image/icons/win311/WINHE001.PNG';

/**
 * @param {string|null|undefined} icon
 * @param {string} title
 * @returns {string}
 */
function resolveIconSrc(icon, title) {
  if (!icon) {
    const slug = String(title ?? '').toLowerCase().replace(/\s+/g, '-');
    return `/image/icons/homelab/${slug}.png`;
  }
  if (!icon.includes('/')) {
    return `/image/icons/homelab/${icon}`;
  }
  if (!icon.startsWith('/')) {
    return `/${icon}`;
  }
  return icon;
}

customElements.define("hw-icon", HwIcon);
