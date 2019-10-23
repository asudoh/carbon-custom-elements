/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit-element';
import { storiesOf } from '@storybook/polymer';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import './date-picker';
import './date-picker-input';

const createProps = () => ({
  disabled: boolean('Disabled (disabled)', false),
  enabledRange: text('Minimum/maximum dates in ISO8601 date format, separated by `/` (enabled-range)', ''),
  open: boolean('Open (open)', false),
  value: text('Value in ISO8601 date format, separated by `/` (value)', ''),
  onAfterChanged: action('bx-date-picker-changed'),
});

const createInputProps = () => ({
  hideLabel: boolean('Hide label (hide-label in <bx-date-picker-input>)', false),
  labelText: text('Label text (label-text in <bx-date-picker-input>)', 'Date Picker label'),
  light: boolean('Light variant (light in <bx-date-picker-input>)', false),
  placeholder: text('Placeholder text (placeholder in <bx-date-picker-input>)', 'mm/dd/yyyy'),
  onInput: action('input'),
});

storiesOf('Date picker', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const { disabled, open } = createProps();
    const { hideLabel, labelText, light, placeholder } = createInputProps();
    return html`
      <bx-date-picker ?disabled="${disabled}" ?open="${open}">
        <bx-date-picker-input ?hide-label="${hideLabel}" label-text="${labelText}" ?light="${light}" placeholder="${placeholder}">
        </bx-date-picker-input>
      </bx-date-picker>
    `;
  })
  .add('Single with calendar', () => {
    const { disabled, enabledRange, open, value, onAfterChanged } = createProps();
    const { hideLabel, labelText, light, placeholder, onInput } = createInputProps();
    return html`
      <bx-date-picker
        ?disabled="${disabled}"
        enabled-range="${enabledRange}"
        ?open="${open}"
        value="${value}"
        @bx-date-picker-changed="${onAfterChanged}"
      >
        <bx-date-picker-input
          ?hide-label="${hideLabel}"
          kind="single"
          label-text="${labelText}"
          ?light="${light}"
          placeholder="${placeholder}"
          @input="${onInput}"
        >
        </bx-date-picker-input>
      </bx-date-picker>
    `;
  })
  .add('Range with calendar', () => {
    const { disabled, enabledRange, open, value, onAfterChanged } = createProps();
    const { hideLabel, labelText, light, placeholder, onInput } = createInputProps();
    return html`
      <bx-date-picker
        ?disabled="${disabled}"
        enabled-range="${enabledRange}"
        ?open="${open}"
        value="${value}"
        @bx-date-picker-changed="${onAfterChanged}"
      >
        <bx-date-picker-input
          ?hide-label="${hideLabel}"
          kind="from"
          label-text="${labelText}"
          ?light="${light}"
          placeholder="${placeholder}"
          @input="${onInput}"
        >
        </bx-date-picker-input>
        <bx-date-picker-input
          ?hide-label="${hideLabel}"
          kind="to"
          label-text="${labelText}"
          ?light="${light}"
          placeholder="${placeholder}"
          @input="${onInput}"
        >
        </bx-date-picker-input>
      </bx-date-picker>
    `;
  });
