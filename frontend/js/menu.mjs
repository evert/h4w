/**
 * @param {HTMLLIElement} menuItemElem
 */
export function menu(menuItemElem) {

  const subMenu = menuItemElem.querySelector('menu');

  if (!subMenu) {
    // Nothing to do
    return;
  }

  /**
   * @param {MouseEvent} ev
   */
  menuItemElem.addEventListener('click', function click(_ev) {

    subMenu.toggleAttribute('open');

  });

}
