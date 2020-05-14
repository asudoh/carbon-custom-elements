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
import { RADIO_BUTTON_ORIENTATION } from '../../src/components/radio-button/radio-button-group';
import { RADIO_BUTTON_LABEL_POSITION } from '../../src/components/radio-button/radio-button';

const template = ({
  disabled,
  hideLabel,
  labelPosition,
  labelText,
  name,
  orientation,
  value,
}: {
  disabled?: boolean;
  hideLabel?: boolean;
  labelPosition?: RADIO_BUTTON_LABEL_POSITION;
  labelText?: string;
  name?: string;
  orientation?: RADIO_BUTTON_ORIENTATION;
  value?: string;
} = {}) => html`
  <bx-radio-button-group
    ?disabled="${ifDefined(disabled)}"
    label-position="${ifDefined(labelPosition)}"
    orientation="${ifDefined(orientation)}"
    name="${ifDefined(name)}"
    value="${ifDefined(value)}"
  >
    <bx-radio-button
      ?hide-label="${ifDefined(hideLabel)}"
      label-text="${ifDefined(labelText)}"
      value="value-foo"
    ></bx-radio-button>
    <bx-radio-button
      ?hide-label="${ifDefined(hideLabel)}"
      label-text="${ifDefined(labelText)}"
      value="value-bar"
    ></bx-radio-button>
    <bx-radio-button
      ?hide-label="${ifDefined(hideLabel)}"
      label-text="${ifDefined(labelText)}"
      value="value-baz"
    ></bx-radio-button>
  </bx-radio-button-group>
`;

describe('a11y compliance of bx-radio-button', function() {
  const formContainer = document.getElementById('form-html-fragment-container');

  it('Should be a11y compliant with minimum attributes', async function() {
    render(template(), formContainer!);
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-radio-button: Minimum attributes');
  });

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        disabled: true,
        hideLabel: true,
        labelPosition: RADIO_BUTTON_LABEL_POSITION.LEFT,
        labelText: 'label-text-foo',
        name: 'name-foo',
        orientation: RADIO_BUTTON_ORIENTATION.VERTICAL,
        value: 'value-baz',
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-radio-button: Various attributes');
  });

  afterEach(function() {
    render(undefined!, formContainer!);
  });
});
