/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import classnames from 'classnames';
import { directive as litDirective, NodePart, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { html, property, customElement, LitElement } from 'lit-element';
import Copy16 from '@carbon/icons/lib/copy/16';
import settings from 'carbon-components/es/globals/js/settings';
import normalizeNull from '../../globals/internal/normalize-null';
import FocusMixin from '../../globals/mixins/focus';
import styles from './copy-button.scss';

const { prefix } = settings;

export const directive = (() => {
  const stateStore = new Map();
  return Object.assign(
    litDirective((values: { assistiveText?: string; feedbackText?: string; timeout?: number; children?: TemplateResult }) => {
      const {
        assistiveText = 'Copy to clipboard',
        feedbackText = 'Copied!',
        timeout = 2000,
        children = html`
          <slot>${Copy16({ class: `${prefix}--snippet__icon` })}</slot>
        `,
      } = values;
      const render = ({ showFeedback, handleClick }: { showFeedback: boolean; handleClick: EventListener }) => {
        const feedbackClasses = classnames(`${prefix}--btn--copy__feedback`, {
          [`${prefix}--btn--copy__feedback--displayed`]: showFeedback,
        });
        return html`
          <button type="button" class="${prefix}--snippet-button" title="${ifDefined(assistiveText)}" @click="${handleClick}">
            ${children}
            <div class="${feedbackClasses}" data-feedback="${ifDefined(feedbackText)}"></div>
          </button>
        `;
      };
      const createState = (state: { part: NodePart }) => {
        const decoratedState = Object.assign(
          {
            handleClick() {
              const { part, timeoutId, handleClick } = decoratedState as any;
              if (timeoutId) {
                clearTimeout(timeoutId);
                (decoratedState as any).timeoutId = undefined;
              }
              part.setValue(
                render({
                  showFeedback: true,
                  handleClick,
                })
              );
              part.commit();
              (decoratedState as any).timeoutId = setTimeout(() => {
                part.setValue(
                  render({
                    showFeedback: false,
                    handleClick,
                  })
                );
                part.commit();
                (decoratedState as any).timeoutId = undefined;
              }, timeout);
            },
          },
          state
        );
        return decoratedState;
      };
      return (part: NodePart) => {
        if (!part.startNode) {
          throw new TypeError('The template part must be `NodePart`.');
        }
        let state = stateStore.get(part);
        if (state === undefined) {
          state = createState({ part });
          stateStore.set(part, state);
        }
        part.setValue(
          render({
            showFeedback: false,
            handleClick: state.handleClick,
          })
        );
      };
    }),
    {
      /**
       * Cleans up orphaned parts. A temporary approach until `lit-html` supports lifecycle callbacks for `NoePart`.
       * Ref: https://github.com/Polymer/lit-html/issues/283
       * @private
       */
      _clean() {
        stateStore.forEach((_, part: NodePart) => {
          const root = part.startNode && part.startNode.getRootNode({ composed: true });
          if (!root || root.nodeType !== Node.DOCUMENT_NODE) {
            stateStore.delete(part);
          }
        });
      },
    }
  );
})();

/**
 * Copy button.
 */
@customElement(`${prefix}-copy-button`)
class BXCopyButton extends FocusMixin(LitElement) {
  /**
   * An assistive text for screen reader to announce, telling that the button copies the content to the clipboard.
   * Corresponds to `button-assistive-text` attribute.
   */
  @property({ attribute: 'button-assistive-text' })
  buttonAssistiveText!: string;

  /**
   * The feedback text. Corresponds to `feedback-text` attribute.
   */
  @property({ attribute: 'feedback-text' })
  feedbackText!: string;

  /**
   * The number in milliseconds to determine how long the tooltip should remain. Corresponds to `feedback-timeout` attribute.
   */
  @property({ type: Number, attribute: 'feedback-timeout' })
  feedbackTimeout!: number;

  createRenderRoot() {
    return this.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  disconnectedCallback() {
    directive._clean();
    super.disconnectedCallback();
  }

  render() {
    directive._clean();
    const { buttonAssistiveText, feedbackText } = this;
    return html`
      ${directive({
        assistiveText: normalizeNull(buttonAssistiveText),
        feedbackText: normalizeNull(feedbackText),
      })}
    `;
  }

  static styles = styles;
}

export default BXCopyButton;
