/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import classnames from 'classnames';
import { html, property, customElement, LitElement } from 'lit-element';
// import ChevronDown16 from '@carbon/icons/lib/chevron--down/16';
import settings from 'carbon-components/es/globals/js/settings';
import normalizeNull from '../../globals/internal/normalize-null';
import { directive as copyButtonDirective } from '../copy-button/copy-button';
import styles from './code-snippet.scss';

const { prefix } = settings;

/**
 * Code snippet types.
 */
export enum CODE_SNIPPET_TYPE {
  /**
   * Single variant.
   */
  SINGLE = 'single',

  /**
   * Inline variant.
   */
  INLINE = 'inline',

  /**
   * Multi-line variant.
   */
  MULTI = 'multi',
}

// const renderMoreLessButton = ({ expandButtonAssistiveText, children, handleClick }) => html`
//   <button
//     type="button"
//     class="${prefix}--btn ${prefix}--btn--ghost ${prefix}--btn--sm ${prefix}--snippet-btn--expand"
//     @click="${handleClick}"
//   >
//     <span class="${prefix}--snippet-btn--text">
//       ${children}
//     </span>
//     ${ChevronDown16({
//       'aria-label': expandButtonAssistiveText,
//       class: `${prefix}--icon-chevron--down ${prefix}--snippet__icon`,
//       role: 'img',
//     })}
//   </button>
// `;

const renderCode = ({ assistiveText = 'code-snippet', children }) => html`
  <div role="textbox" tabindex="0" class="${prefix}--snippet-container" aria-label="${assistiveText}">
    <code>
      <pre>
        ${children}
      </pre
      >
    </code>
  </div>
`;

/**
 * Basic code snippet.
 */
@customElement(`${prefix}-code-snippet`)
class BXCodeSnippet extends LitElement {
  /**
   * An assistive text for screen reader to advice a DOM node is for code snippet. Corresponds to `code-assistive-text` attribute.
   */
  codeAssistiveText!: string;

  /**
   * An assistive text for screen reader to announce, telling that the button copies the content to the clipboard.
   * Corresponds to `copy-button-assistive-text` attribute.
   */
  @property({ attribute: 'copy-button-assistive-text' })
  copyButtonAssistiveText!: string;

  /**
   * The feedback text for the copy button. Corresponds to `copy-button-feedback-text` attribute.
   */
  @property({ attribute: 'copy-button-feedback-text' })
  copyButtonFeedbackText!: string;

  /**
   * The number in milliseconds to determine how long the tooltip for the copy button should remain.
   * Corresponds to `copy-button-feedback-timeout` attribute.
   */
  @property({ type: Number, attribute: 'copy-button-feedback-timeout' })
  copyButtonFeedbackTimeout!: number;

  render() {
    const { codeAssistiveText, copyButtonAssistiveText, copyButtonFeedbackText } = this;
    return html`
      ${renderCode({
        assistiveText: codeAssistiveText,
        children: html`
          <slot></slot>
        `,
      })}
      ${copyButtonDirective({
        assistiveText: normalizeNull(copyButtonAssistiveText),
        feedbackText: normalizeNull(copyButtonFeedbackText),
      })}
    `;
  }

  static styles = styles;
}

export default BXCodeSnippet;
