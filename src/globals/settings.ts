/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import settings from 'carbon-components/es/globals/js/settings';

const { prefix } = settings;

/**
 * A selector selecting focusable nodes.
 * Borrowed from `carbon-angular`.
 */
const selectorFocusable = `
  a[href], area[href], input:not([disabled]),
  button:not([disabled]),select:not([disabled]),
  textarea:not([disabled]),
  iframe, object, embed, *[tabindex], *[contenteditable=true],
  ${prefix}-btn,
  ${prefix}-checkbox,
  ${prefix}-dropdown,
  ${prefix}-modal,
  ${prefix}-modal-close-button,
  ${prefix}-inline-notification,
  ${prefix}-toast-notification,
  ${prefix}-overflow-menu,
  ${prefix}-overflow-menu-item,
  ${prefix}-search,
  ${prefix}-structured-list,
  ${prefix}-clicksable-tile,
  ${prefix}-selectable-tile,
  ${prefix}-tooltip,
  ${prefix}-header-menu-button,
  ${prefix}-header-menu,
  ${prefix}-header-name,
  ${prefix}-header-nav-item
`;

/**
 * A selector selecting tabbable nodes.
 * Borrowed from `carbon-angular`.
 */
const selectorTabbable = `
  a[href], area[href], input:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  iframe, object, embed, *[tabindex]:not([tabindex='-1']), *[contenteditable=true],
  ${prefix}-btn,
  ${prefix}-checkbox,
  ${prefix}-dropdown,
  ${prefix}-modal,
  ${prefix}-modal-close-button,
  ${prefix}-inline-notification,
  ${prefix}-toast-notification,
  ${prefix}-overflow-menu,
  ${prefix}-overflow-menu-item,
  ${prefix}-search,
  ${prefix}-structured-list,
  ${prefix}-clicksable-tile,
  ${prefix}-selectable-tile,
  ${prefix}-tooltip,
  ${prefix}-header-menu-button,
  ${prefix}-header-menu,
  ${prefix}-header-name,
  ${prefix}-header-nav-item
`;

// Because we're going to have a bunch of exports
// eslint-disable-next-line import/prefer-default-export
export { selectorFocusable, selectorTabbable };
