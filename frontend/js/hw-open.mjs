import { createOrFocus } from "./util.mjs";

class HwOpen extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {

    const button = document.createElement("button");
    button.textContent = this.textContent;

    this.replaceChildren(button);

    button.addEventListener("click", () => {

      createOrFocus(
        this.getAttribute('src'),
        'hw-group',
        this.getAttribute('title')
      );

    });

  }

}

customElements.define("hw-open", HwOpen);
