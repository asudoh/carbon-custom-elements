import settings from 'carbon-components/es/globals/js/settings';
import { html, property, customElement, LitElement } from 'lit-element';
import styles from './data-table.scss';

const { prefix } = settings;

/**
 * Details of expandable data table row.
 */
@customElement(`${prefix}-table-row-details` as any)
class BXTableRowDetails extends LitElement {
  /**
   * `true` if this table row details should be expanded. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * The number of table columns. Corresponds to the attribute with the same name.
   */
  @property({ type: Number, reflect: true })
  length = 1;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'row');
    }
    super.connectedCallback();
  }

  render() {
    const { length } = this;
    return html`
      <td colspan="${length}">
        <div class="${prefix}--child-row-inner-container"><slot></slot></div>
      </td>
    `;
  }

  static styles = styles;
}

export default BXTableRowDetails;
