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
import '../../src/components/toggle/toggle';

const template = ({
  checked,
  checkedText,
  disabled,
  id,
  labelText,
  name,
  value,
  uncheckedText,
}: {
  checked?: boolean;
  checkedText?: string;
  disabled?: boolean;
  id?: string;
  labelText?: string;
  name?: string;
  value?: string;
  uncheckedText?: string;
} = {}) => html`
  <bx-toggle
    id="${ifDefined(id)}"
    ?checked="${ifDefined(checked)}"
    checked-text="${ifDefined(checkedText)}"
    ?disabled="${ifDefined(disabled)}"
    label-text="${ifDefined(labelText)}"
    name="${ifDefined(name)}"
    value="${ifDefined(value)}"
    unchecked-text="${ifDefined(uncheckedText)}"
  ></bx-toggle>
`;

describe('a11y compliance of bx-toggle', function() {
  const formContainer = document.getElementById('form-html-fragment-container');

  it('Should be a11y compliant with minimum attributes', async function() {
    render(
      template({
        id: 'id-foo',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-toggle: Minimum attributes');
  });

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        id: 'id-foo',
        checked: true,
        checkedText: 'checked-text-foo',
        disabled: true,
        labelText: 'label-text-foo',
        name: 'name-foo',
        value: 'value-foo',
        uncheckedText: 'unchecked-text-foo',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-toggle: Various attributes');
  });

  afterEach(function() {
    render(undefined!, formContainer!);
  });
});
