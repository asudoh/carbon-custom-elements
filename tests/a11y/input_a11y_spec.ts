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
import { INPUT_TYPE } from '../../src/components/input/input';

const template = ({
  autocomplete,
  autofocus,
  disabled,
  helperText,
  labelText,
  name,
  pattern,
  placeholder,
  readonly,
  required,
  type,
  validityMessage,
  value,
}: {
  autocomplete?: string;
  autofocus?: boolean;
  disabled?: boolean;
  helperText?: string;
  labelText?: string;
  name?: string;
  pattern?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  type?: INPUT_TYPE;
  validityMessage?: string;
  value?: string;
} = {}) => html`
  <bx-input
    autocomplete="${ifDefined(autocomplete)}"
    ?autofocus="${autofocus}"
    ?disabled="${disabled}"
    helper-text="${ifDefined(helperText)}"
    label-text="${ifDefined(labelText)}"
    name="${ifDefined(name)}"
    pattern="${ifDefined(pattern)}"
    placeholder="${ifDefined(placeholder)}"
    ?readonly="${readonly}"
    ?required="${required}"
    type="${ifDefined(type)}"
    validity-message="${ifDefined(validityMessage)}"
    value="${ifDefined(value)}"
  ></bx-input>
`;

describe('a11y compliance of bx-input', function() {
  const formContainer = document.getElementById('form-html-fragment-container');

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        autocomplete: 'on',
        autofocus: true,
        disabled: true,
        helperText: 'helper-text-foo',
        labelText: 'label-text-foo',
        name: 'name-foo',
        pattern: 'pattern-foo',
        placeholder: 'placeholder-foo',
        readonly: true,
        required: true,
        type: INPUT_TYPE.TEXT,
        validityMessage: 'validity-message-foo',
        value: 'value-foo',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-input: Various attributes');
  });

  afterEach(function() {
    render(undefined!, formContainer!);
  });
});
