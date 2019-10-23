/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html, render, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import pick from 'lodash.pick';
import flatpickr from 'flatpickr';
// Just importing the default export does not seem to run `customElements.define()`
/* eslint-disable import/no-duplicates */
import '../../src/components/date-picker/date-picker';
import BXDatePicker from '../../src/components/date-picker/date-picker';
import '../../src/components/date-picker/date-picker-input';
import BXDatePickerInput from '../../src/components/date-picker/date-picker-input';
/* eslint-enable import/no-duplicates */

/**
 * @param formData A `FormData` instance.
 * @returns The given `formData` converted to a classic key-value pair.
 */
const getValues = (formData: FormData) => {
  const values = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of formData.entries()) {
    values[key] = value;
  }
  return values;
};

const inputTemplate = ({
  mode = 'simple',
  hideLabel,
  labelText = '',
  light,
  onInput,
}: {
  mode?: string;
  hideLabel?: boolean;
  labelText?: string;
  light?: boolean;
  onInput: EventListener;
}) => {
  if (mode === 'single') {
    return html`
      <bx-date-picker-input
        ?hide-label="${hideLabel}"
        kind="single"
        label-text="${labelText}"
        ?light="${light}"
        @input="${onInput}"
      >
      </bx-date-picker-input>
    `;
  }
  if (mode === 'range') {
    return html`
      <bx-date-picker-input
        ?hide-label="${hideLabel}"
        kind="from"
        label-text="${labelText}"
        ?light="${light}"
        @input="${onInput}"
      >
      </bx-date-picker-input>
      <bx-date-picker-input ?hide-label="${hideLabel}" kind="to" label-text="${labelText}" ?light="${light}" @input="${onInput}">
      </bx-date-picker-input>
    `;
  }
  return html`
    <bx-date-picker-input ?hide-label="${hideLabel}" label-text="${labelText}" ?light="${light}"> </bx-date-picker-input>
  `;
};

const template = ({
  hasContent = true,
  hasForm,
  mode = 'simple',
  enabledRange = '',
  name,
  open,
  value = '',
  disabled,
  hideLabel,
  labelText = '',
  light,
  onAfterChanged = () => {},
  onInput = () => {},
}: {
  hasContent?: boolean;
  hasForm?: boolean;
  mode?: string;
  enabledRange?: string;
  name?: string;
  open?: boolean;
  value?: string;
  disabled?: boolean;
  hideLabel?: boolean;
  labelText?: string;
  light?: boolean;
  onAfterChanged?: EventListener;
  onInput?: EventListener;
} = {}) => {
  const inner = !hasContent
    ? (undefined! as TemplateResult)
    : html`
        <bx-date-picker
          ?disabled="${disabled}"
          ,
          enabled-range="${enabledRange}"
          name="${ifDefined(name)}"
          ?open="${open}"
          value="${value}"
          @bx-date-picker-changed="${onAfterChanged}"
        >
          ${inputTemplate({
            mode,
            hideLabel,
            labelText,
            light,
            onInput,
          })}
        </bx-date-picker>
      `;
  return !hasContent || !hasForm
    ? inner
    : html`
        <form>${inner}</form>
      `;
};

describe('bx-date-picker', function() {
  describe('Simple mode', function() {
    let datePicker: BXDatePicker | null;

    beforeEach(async function() {
      render(template({ mode: 'simple' }), document.body);
      await Promise.resolve();
      datePicker = document.body.querySelector('bx-date-picker');
    });

    it('Should not instantiate Flatpickr', async function() {
      const { calendar } = datePicker!;
      expect(calendar).toBeFalsy();
    });

    afterEach(function() {
      render(template({ hasContent: false }), document.body);
    });
  });

  describe('Single mode', function() {
    let datePicker: BXDatePicker | null;
    let datePickerInput: BXDatePickerInput | null;

    beforeEach(async function() {
      render(template({ mode: 'single' }), document.body);
      await Promise.resolve();
      datePicker = document.body.querySelector('bx-date-picker');
      datePickerInput = document.body.querySelector('bx-date-picker-input');
    });

    it('Should instantiate Flatpickr', async function() {
      const { calendar } = datePicker!;
      expect(calendar).toBeTruthy();
      const { config, loadedPlugins } = datePicker!.calendar!;
      expect(pick(config, ['allowInput', 'appendTo', 'dateFormat', 'locale', 'maxDate', 'minDate', 'positionElement'])).toEqual({
        allowInput: true,
        appendTo: datePicker!.shadowRoot!.getElementById('floating-menu-container'),
        dateFormat: 'm/d/Y',
        locale: flatpickr.l10ns.default,
        maxDate: undefined,
        minDate: undefined,
        positionElement: datePickerInput!.input,
      });
      expect(loadedPlugins.sort()).toEqual([
        'carbonFlatpickrCSSClassPlugin',
        'carbonFlatpickrFixEventsPlugin',
        'carbonFlatpickrFocusPlugin',
        'carbonFlatpickrIconPlugin',
        'carbonFlatpickrMonthSelectPlugin',
        'carbonFlatpickrShadowDOMEventsPlugin',
        'carbonFlatpickrStateHandshakePlugin',
      ]);
    });

    it('Should support programmatic change of the date', async function() {
      datePicker!.value = '2000-07-15';
      await Promise.resolve();
      expect(datePicker!.calendar!.selectedDates.map(item => item.getTime())).toEqual([new Date(2000, 6, 15).getTime()]);
    });

    afterEach(function() {
      render(template({ hasContent: false }), document.body);
    });
  });

  describe('Range mode', function() {
    let datePicker: BXDatePicker | null;
    let datePickerInputStart: BXDatePickerInput | null;

    beforeEach(async function() {
      render(template({ mode: 'range' }), document.body);
      await Promise.resolve();
      datePicker = document.body.querySelector('bx-date-picker');
      datePickerInputStart = document.body.querySelector('bx-date-picker-input[kind="from"]');
    });

    it('Should instantiate Flatpickr', async function() {
      const { calendar } = datePicker!;
      expect(calendar).toBeTruthy();
      const { config, loadedPlugins } = datePicker!.calendar!;
      expect(pick(config, ['allowInput', 'appendTo', 'dateFormat', 'locale', 'maxDate', 'minDate', 'positionElement'])).toEqual({
        allowInput: true,
        appendTo: datePicker!.shadowRoot!.getElementById('floating-menu-container'),
        dateFormat: 'm/d/Y',
        locale: flatpickr.l10ns.default,
        maxDate: undefined,
        minDate: undefined,
        positionElement: datePickerInputStart!.input,
      });
      expect(loadedPlugins.sort()).toEqual([
        'carbonFlatpickrCSSClassPlugin',
        'carbonFlatpickrFixEventsPlugin',
        'carbonFlatpickrFocusPlugin',
        'carbonFlatpickrIconPlugin',
        'carbonFlatpickrMonthSelectPlugin',
        'carbonFlatpickrShadowDOMEventsPlugin',
        'carbonFlatpickrStateHandshakePlugin',
        'range',
      ]);
    });

    it('Should support programmatic change of the date', async function() {
      datePicker!.value = '2000-07-10/2000-07-20';
      await Promise.resolve();
      expect(datePicker!.calendar!.selectedDates.map(item => item.getTime())).toEqual([
        new Date(2000, 6, 10).getTime(),
        new Date(2000, 6, 20).getTime(),
      ]);
    });
  });

  describe('Event-based form participation', function() {
    it('Should respond to `formdata` event', async function() {
      render(
        template({
          hasForm: true,
          name: 'name-foo',
          value: '20200101',
        }),
        document.body
      );
      await Promise.resolve();
      const formData = new FormData();
      const event = new CustomEvent('formdata', { bubbles: true, cancelable: false, composed: false });
      (event as any).formData = formData; // TODO: Wait for `FormDataEvent` being available in `lib.dom.d.ts`
      const form = document.querySelector('form');
      form!.dispatchEvent(event);
      expect(getValues(formData)).toEqual({ 'name-foo': '20200101' });
    });

    it('Should not respond to `formdata` event if disabled', async function() {
      render(
        template({
          hasForm: true,
          disabled: true,
          name: 'name-foo',
          value: '20200101',
        }),
        document.body
      );
      await Promise.resolve();
      const formData = new FormData();
      const event = new CustomEvent('formdata', { bubbles: true, cancelable: false, composed: false });
      (event as any).formData = formData; // TODO: Wait for `FormDataEvent` being available in `lib.dom.d.ts`
      const form = document.querySelector('form');
      form!.dispatchEvent(event);
      expect(getValues(formData)).toEqual({});
    });
  });

  afterEach(function() {
    render(template({ hasContent: false }), document.body);
  });
});
