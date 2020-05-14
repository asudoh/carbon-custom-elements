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
import { CODE_SNIPPET_TYPE } from '../../src/components/code-snippet/code-snippet';

const template = ({
  codeAssistiveText,
  collapseButtonText,
  copyButtonAssistiveText,
  copyButtonFeedbackText,
  copyButtonFeedbackTimeout,
  expandButtonText,
  type,
}: {
  codeAssistiveText?: string;
  collapseButtonText?: string;
  copyButtonAssistiveText?: string;
  copyButtonFeedbackText?: string;
  copyButtonFeedbackTimeout?: number;
  expandButtonText?: string;
  type?: CODE_SNIPPET_TYPE;
} = {}) =>
  html`
    <bx-code-snippet
      code-assistive-text="${ifDefined(codeAssistiveText)}"
      collapse-button-text="${ifDefined(collapseButtonText)}"
      copy-button-assistive-text="${ifDefined(copyButtonAssistiveText)}"
      copy-button-feedback-text="${ifDefined(copyButtonFeedbackText)}"
      copy-button-feedback-timeout="${copyButtonFeedbackTimeout}"
      expand-button-text="${ifDefined(expandButtonText)}"
      type="${ifDefined(type)}"
    ></bx-code-snippet>
  `;

describe('a11y compliance of bx-code-snippet', function() {
  const container = document.getElementById('html-fragment-container');

  it('Should be a11y compliant with minimum attributes for single line mode', async function() {
    render(template(), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-code-snippet: Minimum attributes for single line mode');
  });

  it('Should be a11y compliant with minimum attributes for multi line mode', async function() {
    render(template({ type: CODE_SNIPPET_TYPE.MULTI }), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-code-snippet: Minimum attributes for multi line mode');
  });

  it('Should be a11y compliant with minimum attributes for inline mode', async function() {
    render(template({ type: CODE_SNIPPET_TYPE.INLINE }), container!);
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-code-snippet: Minimum attributes for inline mode');
  });

  it('Should be a11y compliant with various attributes for single line mode', async function() {
    render(
      template({
        codeAssistiveText: 'code-assistive-text-foo',
        copyButtonAssistiveText: 'copy-button-assistive-text-foo',
        copyButtonFeedbackText: 'copy-button-feedback-text-foo',
        copyButtonFeedbackTimeout: 16,
      }),
      container!
    );
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-code-snippet: Various attributes for single line mode');
  });

  it('Should be a11y compliant with various attributes for multi line mode', async function() {
    render(
      template({
        type: CODE_SNIPPET_TYPE.MULTI,
        codeAssistiveText: 'code-assistive-text-foo',
        copyButtonAssistiveText: 'copy-button-assistive-text-foo',
        copyButtonFeedbackText: 'copy-button-feedback-text-foo',
        copyButtonFeedbackTimeout: 16,
      }),
      container!
    );
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-code-snippet: Various attributes for multi line mode');
  });

  it('Should be a11y compliant with various attributes for inline mode', async function() {
    render(
      template({
        type: CODE_SNIPPET_TYPE.INLINE,
        codeAssistiveText: 'code-assistive-text-foo',
        copyButtonAssistiveText: 'copy-button-assistive-text-foo',
        copyButtonFeedbackText: 'copy-button-feedback-text-foo',
        copyButtonFeedbackTimeout: 16,
      }),
      container!
    );
    await Promise.resolve();
    await testAATCompliance(container!, 'bx-code-snippet: Various attributes for inline mode');
  });

  afterEach(function() {
    render(undefined!, container!);
  });
});
