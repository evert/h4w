class HwIcon extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {

    const anchor = this.querySelector('a');
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
    });
    anchor.addEventListener("dblclick", (e) => {
      e.preventDefault();
      window.open(anchor.href, anchor.target || "_blank");
    });


  }

}

customElements.define("hw-icon", HwIcon);
