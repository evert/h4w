/**
 * Creates a HTML element with a src attribute or returns one if it already exists.
 *
 * We'll also activate and focus the element.
 *
 * @param {string} src - The src attribute value to look for.
 * @param {string} elementName - The name of the HTML element to create if it doesn't exist.
 * @param {string} title - The title attribute value to set on the element.
 * @returns {HTMLElement} - The created or selected HTML element.
 */
export function createOrFocus(src, elementName, title) {

  const selector = `${elementName}[src="${escapeHtml(src)}"]`;
  console.log("createOrFocus selector:", selector);

  const existing = /** @type {any} */(document.querySelector(selector));
  if (existing) {
    existing.removeAttribute('minimized');
    existing?.activate()
    return existing;
  }

  const el = document.createElement(elementName);
  el.setAttribute('src', src);
  el.setAttribute('title', title);
  document.body.appendChild(el);
  return el;
}

/**
 * Template literal that HTML-escapes
 *
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => (
    out + str + (i < values.length ? escapeHtml(values[i]) : '')
  ), '');

/**
 * @param {unknown} value
 */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
