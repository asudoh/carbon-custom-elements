import settings from 'carbon-components/es/globals/js/settings';
import { html, property, customElement, LitElement } from 'lit-element';
import styles from './data-table.scss';

const { prefix } = settings;

/**
 * Table column type.
 */
export enum TABLE_COLUMN_TYPE {
  /**
   * Regular column.
   */
  REGULAR = 'regular',

  /**
   * Icon column.
   */
  ICON = 'icon',

  /**
   * Menu column.
   */
  MENU = 'menu',
}

/**
 * Data table cell.
 */
@customElement(`${prefix}-table-cell`)
class BXTableCell extends LitElement {
  /**
   * The type of table cell. Corresponds to the attribute with the same name.
   */
  @property({ reflect: true })
  type = TABLE_COLUMN_TYPE.REGULAR;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'cell');
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

export default BXTableCell;
