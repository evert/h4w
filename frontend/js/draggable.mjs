/**
 * Makes an element draggable using absolute positioning.
 *
 * The 'eventElem' element is the target that a user can draw, but
 * the 'dragElem' is the thing that actually moves.
 *
 * @param {HTMLElement} eventElem
 * @param {HTMLElement} dragElem
 */
export function draggable(eventElem, dragElem) {

  /**
   * Initial coordinates
   */

  /** @type {number} */
  let startX;
  /** @type {number} */
  let startY;
  /** @type {number} */
  let startLeft;
  /** @type {number} */
  let startTop;

  eventElem.addEventListener('pointerdown', /** @param {PointerEvent} e */(e) => {

    eventElem.setPointerCapture(e.pointerId);

    startX = e.clientX;
    startY = e.clientY;
    startLeft = dragElem.offsetLeft;
    startTop = dragElem.offsetTop;

    eventElem.addEventListener('pointermove', move);
    eventElem.addEventListener('pointerup', up, { once: true });
  });

  /**
   * @param {PointerEvent} e
   */
  function move(e) {
    dragElem.style.left = `${startLeft + e.clientX - startX}px`;
    dragElem.style.top = `${startTop + e.clientY - startY}px`;
  }

  /**
   * @param {PointerEvent} e
   */
  function up(e) {
    eventElem.releasePointerCapture(e.pointerId);
    eventElem.removeEventListener('pointermove', move);
  }

}
