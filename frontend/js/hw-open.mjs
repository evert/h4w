class HwOpen extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {

    const button = document.createElement("button");
    button.textContent = this.textContent;

    this.replaceChildren(button);

    button.addEventListener("click", () => {

      const src = this.getAttribute("src");
      // Find existing window with the same src.
      const existing = document.querySelector('hw-group[src="' + src + '"]');
      if (existing) {
        // Do nothing.
        return;
      }
      const win = document.createElement("hw-group");
      win.setAttribute("src", src);
      document.body.appendChild(win);

    });


  }

}

customElements.define("hw-open", HwOpen);
