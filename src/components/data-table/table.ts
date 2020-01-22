/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import settings from 'carbon-components/es/globals/js/settings';
import { html, property, customElement, LitElement } from 'lit-element';
import styles from './data-table.scss';

const { prefix } = settings;

/**
 * Table size.
 */
export enum TABLE_SIZE {
  /**
   * Compact size.
   */
  COMPACT = 'compact',

  /**
   * Short size.
   */
  SHORT = 'short',

  /**
   * Regular size.
   */
  REGULAR = 'regular',

  /**
   * Tall size.
   */
  TALL = 'tall',
}

/**
 * Data table.
 */
@customElement(`${prefix}-table`)
class BXTable extends LitElement {
  /**
   * The table size. Corresponds to the attribute with the same name.
   */
  @property({ reflect: true })
  size = TABLE_SIZE.REGULAR;

  /**
   * `true` if this table should support sorting. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  sort = false;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'table');
    }
    super.connectedCallback();
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  static styles = styles;
}

export default BXTable;
