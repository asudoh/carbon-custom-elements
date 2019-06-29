import settings from 'carbon-components/es/globals/js/settings';
import { html, property, customElement, LitElement } from 'lit-element';
import styles from './data-table.scss';

const { prefix } = settings;

/**
 * Data table container.
 */
@customElement(`${prefix}-data-table` as any)
class BXDataTable extends LitElement {
  /**
   * `true` if the header should be sticky. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  sticky = false;

  render() {
    return html`
      <section class="${prefix}--data-table_inner-container"><slot></slot></section>
    `;
  }

  static styles = styles;
}

export default BXDataTable;
