/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ifDefined } from 'lit-html/directives/if-defined';
import { html } from 'lit-element';
import { storiesOf } from '@storybook/polymer';
import { action } from '@storybook/addon-actions';
import { withKnobs, number, text } from '@storybook/addon-knobs';
import './code-snippet';

const createProps = () => ({
  copyButtonAssistiveText: text('Assistive text for the copy button (copy-button-assistive-text)', ''),
  copyButtonFeedbackText: text('Feedback text for copy button (copy-button-feedback-text)', ''),
  copyButtonFeedbackTimeout: number('Feedback timeout for copy button (copy-buttobn-feedback-timeout)', 2000),
  onClick: action('click'),
});

storiesOf('Code snippet', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const { copyButtonAssistiveText, copyButtonFeedbackText, copyButtonFeedbackTimeout, onClick } = createProps();
    return html`
      <bx-code-snippet
        copy-button-assistive-text="${ifDefined(!copyButtonAssistiveText ? undefined : copyButtonAssistiveText)}"
        copy-button-feedback-text="${ifDefined(!copyButtonFeedbackText ? undefined : copyButtonFeedbackText)}"
        copy-button-feedback-timeout="${copyButtonFeedbackTimeout}"
        @click="${onClick}"
      ></bx-code-snippet>
    `;
  });
