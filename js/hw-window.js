class HwWindow extends HTMLElement {

  static observedAttributes = ["maximized"];

  constructor() {
    super();
  }

  connectedCallback() {

    this.querySelector("hw-titlebar .maximize").addEventListener("click", () => {
      this.toggleAttribute("maximized");
    });

  }

}

customElements.define("hw-window", HwWindow);
