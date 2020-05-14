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
import '../../src/components/checkbox/checkbox';

const template = ({
  checked,
  disabled,
  hideLabel,
  id,
  indeterminate,
  labelText,
  name,
  value,
}: {
  checked?: boolean;
  disabled?: boolean;
  hideLabel?: boolean;
  id?: string;
  indeterminate?: boolean;
  labelText?: string;
  name?: string;
  value?: string;
} = {}) => html`
  <bx-checkbox
    id="${ifDefined(id)}"
    ?checked="${ifDefined(checked)}"
    ?disabled="${ifDefined(disabled)}"
    ?hide-label="${ifDefined(hideLabel)}"
    ?indeterminate="${ifDefined(indeterminate)}"
    label-text="${ifDefined(labelText)}"
    name="${ifDefined(name)}"
    value="${ifDefined(value)}"
  ></bx-checkbox>
`;

describe('a11y compliance of bx-checkbox', function() {
  const formContainer = document.getElementById('form-html-fragment-container');

  it('Should be a11y compliant with minimum attributes', async function() {
    render(
      template({
        id: 'id-foo',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-checkbox: Minimum attributes');
  });

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        id: 'id-foo',
        checked: true,
        disabled: true,
        hideLabel: true,
        indeterminate: true,
        labelText: 'label-text-foo',
        name: 'name-foo',
        value: 'value-foo',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-checkbox: Various attributes');
  });

  afterEach(function() {
    render(undefined!, formContainer!);
  });
});
