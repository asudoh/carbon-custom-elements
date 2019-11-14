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
import '../../src/components/slider/slider';

const template = ({
  disabled,
  labelText,
  max,
  min,
  name,
  step,
  value,
}: {
  disabled?: boolean;
  labelText?: string;
  max?: number;
  min?: number;
  name?: string;
  step?: number;
  value?: number;
} = {}) => html`
  <bx-slider
    ?disabled="${disabled}"
    label-text="${ifDefined(labelText)}"
    max="${ifDefined(max)}"
    min="${ifDefined(min)}"
    name="${ifDefined(name)}"
    step="${ifDefined(step)}"
    value="${ifDefined(value)}"
  ></bx-slider>
`;

describe('a11y compliance of bx-slider', function() {
  const formContainer = document.getElementById('form-html-fragment-container');

  it('Should be a11y compliant with minimum attributes', async function() {
    render(template(), formContainer!);
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-slider: Minimum attributes');
  });

  it('Should be a11y compliant with various attributes', async function() {
    render(
      template({
        disabled: true,
        labelText: 'label-text-foo',
        max: 100,
        min: 0,
        name: 'name-foo',
        step: 5,
        value: 50,
      }),
      formContainer!
    );
    await Promise.resolve();
    await testAATCompliance(formContainer!, 'bx-slider: Various attributes');
  });

  afterEach(function() {
    render(undefined!, formContainer!);
  });
});
