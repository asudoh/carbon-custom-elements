/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import { Plugin } from 'flatpickr/dist/types/options';
import on from 'carbon-components/es/globals/js/misc/on';
import Handle from '../../globals/internal/handle';
import { find } from '../../globals/internal/collection-helpers';

interface ExtendedFlatpickrInstance extends FlatpickrInstance {
  /**
   * The handle for `keydown` event handler in calendar dropdown.
   */
  _hBXCEDatePickerKeydown?: Handle | null;
}

const moveDays = {
  ArrowLeft: -1,
  Left: -1,
  ArrowUp: -7,
  Up: -7,
  ArrowRight: 1,
  Right: 1,
  ArrowDown: 7,
  Down: 7,
};

const MILLISECONDS_IN_DAY = 86400000;

class CalendarDate {
  year = 1970;

  month = 0;

  date = 0;

  constructor({
    year,
    month,
    date,
    localDate,
    utcDate,
  }: {
    year?: number;
    month?: number;
    date?: number;
    localDate?: Date;
    utcDate?: Date;
  }) {
    if (typeof year !== 'undefined') {
      this.year = year!;
    }
    if (typeof month !== 'undefined') {
      this.month = month!;
    }
    if (typeof date !== 'undefined') {
      this.date = date!;
    }
    if (localDate) {
      this.year = localDate.getFullYear();
      this.month = localDate.getMonth();
      this.date = localDate.getDate();
    }
    if (utcDate) {
      this.year = utcDate.getFullYear();
      this.month = utcDate.getMonth();
      this.date = utcDate.getDate();
    }
  }

  getLocalDate() {
    const { year, month, date } = this;
    return new Date(year, month, date);
  }

  adjustDate({ date = 0 }) {
    return new CalendarDate({ utcDate: new Date(Date.UTC(this.year, this.month, this.date) + date * MILLISECONDS_IN_DAY) });
  }
}

/**
 * @param config Plugin configuration.
 * @returns
 *   A Flatpickr plugin to handle events.
 *   Some event handlers in Flatpickr won't work is the calendar dropdown is put in shadow DOM, due to event retargetting.
 */
export default (): Plugin => (fp: ExtendedFlatpickrInstance) => {
  const getDateElem = localDate =>
    find(fp.daysContainer!.firstElementChild!.children, ({ dateObj }: any) => localDate.getTime() === dateObj.getTime());

  /**
   * Handles `keydown` event.
   */
  const handleKeydown = (event: KeyboardEvent) => {
    const { ctrlKey, key, target } = event;
    if (key in moveDays) {
      if (!ctrlKey) {
        const { dateObj } = target as any;
        const calendarDate = new CalendarDate({ localDate: dateObj });
        const adjustedCalendarDate = calendarDate.adjustDate({ date: moveDays[key] });
        const { month } = calendarDate;
        const { month: adjustedMonth } = adjustedCalendarDate;
        const adjustedDate = adjustedCalendarDate.getLocalDate();
        if (adjustedMonth !== month) {
          fp.changeMonth(Math.sign(adjustedDate.getTime() - dateObj.getTime()));
        }
        const movedDateElem = getDateElem(adjustedDate);
        if (movedDateElem) {
          movedDateElem.focus();
        }
      }
      event.preventDefault();
    }
  };

  /**
   * Releases event listeners used in Flatpickr plugin.
   */
  const release = () => {
    if (fp._hBXCEDatePickerKeydown) {
      fp._hBXCEDatePickerKeydown = fp._hBXCEDatePickerKeydown.release();
    }
  };

  /**
   * Registers this Flatpickr plugin.
   */
  const register = () => {
    fp.loadedPlugins.push('carbonFlatpickrShadowDOMEventsPlugin');
    release();
    fp._hBXCEDatePickerKeydown = on(fp.calendarContainer, 'keydown', handleKeydown);
  };

  return {
    onReady: [register],
    onDestroy: [release],
  };
};
