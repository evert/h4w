import { escapeHtml } from "./util.mjs";

class HwIcon extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {

    const title = this.getAttribute('title') ?? 'Untitled';
    const href = this.getAttribute('href') ?? '#';
    const target = this.getAttribute('target') ?? '_blank';
    const iconSrc = resolveIconSrc(this.getAttribute('icon'), title);

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
      if (this.getAttribute('type') === 'group') {
        const existing = document.querySelector('hw-group[src="' + href + '"]');
        if (existing) return;
        const win = document.createElement('hw-group');
        win.setAttribute('src', href);
        document.body.appendChild(win);
        return;
      }
      if (this.getAttribute('type') === 'iframe') {
        const existing = document.querySelector('hw-iframe[src="' + href + '"]');
        if (existing) return;
        const win = document.createElement('hw-iframe');
        win.setAttribute('src', href);
        win.setAttribute('title', title);
        document.body.appendChild(win);
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

/**
 * Template literal that HTML-escapes interpolated values.
 *
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
const html = (strings, ...values) =>
  strings.reduce((out, str, i) => (
    out + str + (i < values.length ? escapeHtml(values[i]) : '')
  ), '');

customElements.define("hw-icon", HwIcon);
