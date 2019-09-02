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
import { forEach } from '../../globals/internal/collection-helpers';

/**
 * The configuration for the Flatpickr plugin to set CSS classes specific to this design system.
 */
export interface DatePickerCSSClassPluginConfig {
  /**
   * The CSS class for the calendar dropdown.
   */
  classCalendarContainer: string;

  /**
   * The CSS class for the month navigator.
   */
  classMonth: string;

  /**
   * The CSS class for the container of the weekdays.
   */
  classWeekdays: string;

  /**
   * The CSS class for the container of the days.
   */
  classDays: string;

  /**
   * The CSS class applied to each weekdays.
   */
  classWeekday: string;

  /**
   * The CSS class applied to each days.
   */
  classDay: string;

  /**
   * The CSS class applied to the "today" highlight if there are any dates selected.
   */
  classNoBorder: string;

  /**
   * The CSS selector for Flatpickr's month navigator.
   */
  selectorFlatpickrMonth: string;

  /**
   * The CSS selector applied to Flatpickr's each weekdays.
   */
  selectorFlatpickrWeekday: string;

  /**
   * The CSS class applied to Flatpickr's "today" highlight.
   */
  classFlatpickrToday: string;
}

/**
 * @param config Plugin configuration.
 * @returns A Flatpickr plugin to set CSS classes specific to this design system.
 */
export default (config: DatePickerCSSClassPluginConfig): Plugin => (fp: FlatpickrInstance) => {
  /**
   * Handles creation of Flatpickr's day element.
   * @param elem The created Flatpickr's day element.
   */
  const handleDayCreate = (_selectedDates, _value, _fp, elem: HTMLElement) => {
    const { selectedDates } = fp;
    const { classDay, classNoBorder, classFlatpickrToday } = config;
    elem.classList.add(classDay);
    if (elem.classList.contains(classFlatpickrToday) && selectedDates!.length > 0) {
      elem.classList.add(classNoBorder);
    } else if (elem.classList.contains(classFlatpickrToday) && selectedDates!.length === 0) {
      elem.classList.remove(classNoBorder);
    }
  };

  /**
   * Sets CSS classes specific to this design system.
   */
  const ensureClasses = () => {
    const { calendarContainer, monthNav, weekdayContainer, daysContainer } = fp;
    if (calendarContainer) {
      calendarContainer.classList.add(config.classCalendarContainer);
    }
    if (monthNav) {
      const { selectorFlatpickrMonth, classMonth } = config;
      const month = monthNav.querySelector(selectorFlatpickrMonth);
      if (month) {
        month.classList.add(classMonth);
      }
    }
    if (weekdayContainer) {
      const { selectorFlatpickrWeekday, classWeekdays, classWeekday } = config;
      weekdayContainer.classList.add(classWeekdays);
      forEach(weekdayContainer.querySelectorAll(selectorFlatpickrWeekday), item => {
        item.innerHTML = item.innerHTML.replace(/\s+/g, '');
        item.classList.add(classWeekday);
      });
    }
    if (daysContainer) {
      const { classDays } = config;
      daysContainer.classList.add(classDays);
    }
  };

  /**
   * Registers this Flatpickr plugin.
   */
  const register = () => {
    fp.loadedPlugins.push('carbonFlatpickrCSSClassPlugin');
  };

  return {
    onDayCreate: [handleDayCreate],
    onReady: [register, ensureClasses],
  };
};
