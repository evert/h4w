// @ts-check no-strict
import { draggable } from "./draggable.mjs";
import { createOrFocus } from "./util.mjs";
/** @import HwIcon from ('./hw-icon.mjs') */
/** @import Menu from ('./menu.ts') */

export class HwWindow extends HTMLElement {

  static observedAttributes = ["title"];
  /** @type {string} */
  icon = '/image/icons/win311/PROGM003.PNG';

  /** @type {HTMLElement|null} */
  desktopIcon = null;

  /** @type {HTMLElement|null} */
  app;

  connectedCallback() {

    const children = Array.from(this.children);

    this.setHTMLUnsafe(`<hw-titlebar>
        <button class="context-menu">Context menu</button>
        <h1>Homelab for workgroups</h1>
        <button class="minimize">Minimize</button>
        <button class="maximize">Maximize</button>
      </hw-titlebar>

      <menu></menu>
      <div class="content"></div>
    `);

    this.querySelector('div').replaceChildren(...children);
    this.querySelector('hw-titlebar h1').textContent = this.getAttribute("title") ?? "Untitled";

    this.querySelector("hw-titlebar .maximize").addEventListener("click", () => {
      this.toggleMaximize();
    });

    this.querySelector("hw-titlebar .minimize").addEventListener("click", () => {
      this.minimize();
    });

    this.addEventListener("mousedown", () => {
      this.activate();
    });
    this.recoverDesktopIcon();
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

    this.setMenu([
      {
        label: "File",
        submenu: [
          { label: "Minimize", action: 'minimize' },
          { label: "Maximize", action: 'maximize' },
          { label: "Restore", action: 'restore' },
          { label: "Close", action: 'close' }
        ]
      },
      {
        label: "Edit",
        submenu: [
          { label: "This is just decorative" }
        ]
      },
      {
        label: "Credits",
        href: "/menu/credits.json"
      }
    ]);

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

    const icon = /** @type {HwIcon} */(this.desktopIcon ?? document.createElement('hw-icon'));
    icon.setAttribute('title', this.getAttribute('title') ?? 'Untitled');
    icon.setAttribute('icon', this.icon);
    icon.window = this;

    desktop.append(icon);
    this.desktopIcon = icon;
    this.setAttribute('minimized', '');
  }

  unminimize() {
    if (this.desktopIcon) {
      this.desktopIcon.remove();
    }
    this.removeAttribute('minimized');
  }

  toggleMaximize() {
    this.toggleAttribute('maximized');
  }


  /**
   * If there's a disconnected desktop icon, this method will reconnect it.
   */
  recoverDesktopIcon() {
    if (!this.desktopIcon && this.app?.getAttribute('src')) {
      const src = this.app.getAttribute('src');
      this.desktopIcon = document.querySelector(`.desktop-icons hw-icon[href="${src}"]`);
    }
    return this.desktopIcon;
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

  /**
   * @param {Menu[]} menu
   */
  setMenu(menu) {

    this.querySelector('menu').replaceChildren(...renderMenu(menu, this));

  }

}

let topZ = 0;

customElements.define("hw-window", HwWindow);


/**
 * @param {Menu[]} menuItems
 * @param {HwWindow} wdw
 * @returns {HTMLElement[]}
 */
function renderMenu(menuItems, wdw) {

  const children = [];
  for(const menuItem of menuItems) {
    const li = document.createElement('li');
    if (menuItem.action) li.setAttribute('data-action', menuItem.action);
    const span = document.createElement('span');
    span.textContent = menuItem.label;
    li.appendChild(span);

    if (menuItem.submenu && menuItem.submenu.length > 0) {
      const submenu = document.createElement('menu');
      submenu.append(...renderMenu(menuItem.submenu, wdw));
      li.appendChild(submenu);

    }
    setupMenuAction(menuItem, li, wdw);

    children.push(li);
  }
  return children;
}

/**
 * @param {Menu} menuItem
 * @param {HTMLElement} elem
 * @param {HwWindow} wdw
 */
function setupMenuAction(menuItem, elem, wdw) {

  if (menuItem?.submenu?.length > 0) {
    elem.addEventListener('click', (event) => {
      event.stopPropagation();
      elem.toggleAttribute('open');
    });
    return;
  }

  if (menuItem.href) {
    elem.addEventListener('click', (event) => {
      event.stopPropagation();
      createOrFocus(menuItem.href, 'hw-group', menuItem.label);
    });
  }
  switch (elem.getAttribute('data-action')) {
    case 'minimize':
      elem.addEventListener('click', () => {
        wdw.minimize();
      });
      break;
    case 'maximize':
    case 'restore':
      elem.addEventListener('click', () => {
        wdw.toggleMaximize();
      });
      break;
  }


}
