/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, render } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import testAATCompliance from './test-a11y-compliance';
import '../../src/components/copy-button/copy-button';

const template = ({
  buttonAssistiveText,
  feedbackText,
  feedbackTimeout,
}: {
  buttonAssistiveText?: string;
  feedbackText?: string;
  feedbackTimeout?: number;
} = {}) =>
  html`
    <bx-copy-button
      button-assistive-text="${ifDefined(buttonAssistiveText)}"
      feedback-text="${ifDefined(feedbackText)}"
      feedback-timeout="${feedbackTimeout}"
    ></bx-copy-button>
  `;

describe('a11y compliance of bx-copy-button', function() {
  const container = document.getElementById('html-fragment-container');

  it('Should be a11y compliant with minimum attributes', async function() {
    render(template(), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-copy-button: Minimum attributes');
  });

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        buttonAssistiveText: 'button-assistive-text-foo',
        feedbackText: 'feedback-text-foo',
        feedbackTimeout: 16,
      }),
      container!
    );
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-copy-button: Various attributes');
  });

  afterEach(function() {
    render(undefined!, container!);
  });
});
