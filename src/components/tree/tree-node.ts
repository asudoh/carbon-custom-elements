/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { classMap } from 'lit-html/directives/class-map';
import { html, property, customElement, LitElement } from 'lit-element';
import settings from 'carbon-components/es/globals/js/settings';
import CaretDown16 from '@carbon/icons/lib/caret--down/16';
import { FORM_ELEMENT_COLOR_SCHEME } from '../../globals/shared-enums';
import styles from './tree.scss';

export { FORM_ELEMENT_COLOR_SCHEME as TILE_COLOR_SCHEME } from '../../globals/shared-enums';

const { prefix } = settings;

/**
 * Tree node.
 * @element bx-tree-node
 */
@customElement(`${prefix}-tree-node`)
class BXTreeNode extends LitElement {
  /**
   * `true` if there is child tree nodes.
   */
  private _hasChildren = false;

  /**
   * Handles `click` event on the expando button.
   * @param event The event.
   */
  private _handleClickExpando() {
    const { disabled } = this;
    if (!disabled) {
      const { expanded } = this;
      const init = {
        bubbles: true,
        composed: true,
        detail: {
          expanded: !expanded,
        },
      };
      const { eventBeforeToggle, eventToggle } = this.constructor as typeof BXTreeNode;
      const beforeToggleEvent = new CustomEvent(eventBeforeToggle, {
        ...init,
        cancelable: true,
      });
      if (this.dispatchEvent(beforeToggleEvent)) {
        this.expanded = !expanded;
        const afterToggleEvent = new CustomEvent(eventToggle, init);
        this.dispatchEvent(afterToggleEvent);
      }
    }
  }

  /**
   * Handles `slotchange` event.
   * @param event The event.
   */
  private _handleSlotChange(event: Event) {
    const hasContent = (event.target as HTMLSlotElement)
      .assignedNodes()
      .some(node => node.nodeType !== Node.TEXT_NODE || node!.textContent!.trim());
    this._hasChildren = hasContent;
    this.requestUpdate();
  }

  /**
   * The color scheme.
   */
  @property({ attribute: 'color-scheme', reflect: true })
  colorScheme = FORM_ELEMENT_COLOR_SCHEME.REGULAR;

  /**
   * `true` if this tree node should be disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * `true` to show the sub-tree items.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

  /**
   * The label text.
   */
  @property({ attribute: 'label-text' })
  labelText = '';

  /**
   * `true` if this tree node should be selected.
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'treeitem');
    }
    super.connectedCallback();
  }

  updatedCallback(changedProperties) {
    const { _hasChildren: hasChildren } = this;
    if (changedProperties.has('expanded') || changedProperties.has('_hasChildren')) {
      const { expanded } = this;
      if (!hasChildren) {
        this.removeAttribute('aria-expanded');
      } else {
        this.setAttribute('aria-expanded', String(Boolean(expanded)));
      }
    }
    if (changedProperties.has('disabled') || changedProperties.has('selected')) {
      const { disabled, selected } = this;
      this.toggleAttribute('aria-disabled', disabled);
      if (disabled) {
        this.removeAttribute('aria-selected');
      } else {
        this.setAttribute('aria-selected', String(Boolean(selected)));
      }
    }
  }

  render() {
    const {
      disabled,
      expanded,
      labelText,
      _hasChildren: hasChildren,
      _handleClickExpando: handleClickExpando,
      _handleSlotChange: handleSlotChange,
    } = this;
    const toggleClasses = classMap({
      [`${prefix}--tree-parent-node__toggle-icon`]: true,
      [`${prefix}--tree-parent-node__toggle-icon--expanded`]: expanded,
    });
    return html`
      <div class="${prefix}--tree-node__label">
        ${!hasChildren
          ? html`
              <slot name="icon"></slot>
              <slot name="label-text">${labelText}</slot>
            `
          : html`
              <button
                type="button"
                class="${prefix}--tree-parent-node__toggle"
                ?disabled="${disabled}"
                @click="${handleClickExpando}"
              >
                ${CaretDown16({ class: toggleClasses })}
              </button>
              <span class="${prefix}--tree-node__label__details">
                <slot name="icon"></slot>
                <slot name="label-text">${labelText}</slot>
              </span>
            `}
      </div>
      <ul role="group" ?hidden="${!expanded}" class="${prefix}--tree-node__children">
        <slot @slotchange="${handleSlotChange}"></slot>
      </ul>
    `;
  }

  /**
   * The name of the custom event fired before this tree node is being toggled upon a user gesture.
   * Cancellation of this event stops the user-initiated action of toggling this tree node.
   */
  static get eventBeforeToggle() {
    return `${prefix}-tree-node-beingtoggled`;
  }

  /**
   * The name of the custom event fired after this tree node is toggled upon a user gesture.
   */
  static get eventToggle() {
    return `${prefix}-tree-node-toggled`;
  }

  static styles = styles;
}

export default BXTreeNode;
