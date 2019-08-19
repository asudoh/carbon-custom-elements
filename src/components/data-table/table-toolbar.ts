import settings from 'carbon-components/es/globals/js/settings';
import { html, customElement, LitElement } from 'lit-element';
import styles from './data-table.scss';

const { prefix } = settings;

/**
 * Data table toolbar.
 */
@customElement(`${prefix}-table-toolbar`)
class BXTableToolbar extends LitElement {
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
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

export default BXTableToolbar;
