/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LitElement } from 'lit-element';
import { selectorFocusable } from '../../globals/settings';
import HostListener from '../../globals/decorators/host-listener';
import HostListenerMixin from '../../globals/mixins/host-listener';
import { find } from '../../globals/internal/collection-helpers';
import BXFloatingMenuTrigger from './floating-menu-trigger';

/**
 * Position of floating menu, or trigger button of floating menu.
 */
export interface FloatingMenuPosition {
  /**
   * The left position.
   */
  left: number;

  /**
   * The top position.
   */
  top: number;
}

/**
 * The alignment choices of floating menu.
 */
export enum FLOATING_MENU_ALIGNMENT {
  /**
   * Align the top/left position menu body to the one of its trigger button.
   */
  START = 'start',

  /**
   * Align the center position menu body to the one of its trigger button.
   */
  CENTER = 'center',

  /**
   * Align the bottom/right position menu body to the one of its trigger button.
   */
  END = 'end',
}

/**
 * The direction/positioning/orientation choices of floating menu.
 */
export enum FLOATING_MENU_DIRECTION {
  /**
   * Put menu body at the left of its trigger button.
   */
  LEFT = 'left',

  /**
   * Put menu body at the top of its trigger button.
   */
  TOP = 'top',

  /**
   * Put menu body at the right of its trigger button.
   */
  RIGHT = 'right',

  /**
   * Put menu body at the bottom of its trigger button.
   */
  BOTTOM = 'bottom',
}

/**
 * The group of the direction/positioning/orientation choices of floating menu.
 */
export enum FLOATING_MENU_DIRECTION_GROUP {
  /**
   * Put menu body at the left/right of its trigger button.
   */
  HORIZONTAL = 'horizontal',

  /**
   * Put menu body at the top/bottom of its trigger button.
   */
  VERTICAL = 'vertical',
}

/**
 * Floating menu.
 */
abstract class BXFloatingMenu extends HostListenerMixin(LitElement) {
  /**
   * The DOM element, typically a custom element in this library, launching this floating menu.
   */
  protected parent: BXFloatingMenuTrigger | null = null;

  /**
   * How the menu is aligned to the trigger button. Corresponds to the attribute with the same name.
   */
  abstract alignment: FLOATING_MENU_ALIGNMENT;

  /**
   * The menu direction. Corresponds to the attribute with the same name.
   */
  abstract direction: FLOATING_MENU_DIRECTION;

  /**
   * `true` if the menu should be open. Corresponds to the attribute with the same name.
   */
  abstract open: boolean;

  /**
   * Unique ID used for ID refs.
   */
  protected _uniqueId = Math.random()
    .toString(36)
    .slice(2);

  /**
   * Ensures the ID-ref with the trigger button.
   */
  protected _ensureIDRef() {
    const { id, parent, _uniqueId: uniqueId } = this;
    if (!id) {
      this.id = `__bx-ce-floating-menu_${uniqueId}`;
    }
    if (parent) {
      if (parent && !parent.id) {
        parent.id = `__bx-ce-floating-menu-trigger_${uniqueId}`;
      }
      this.setAttribute('aria-labeledby', parent.id);
      parent.setAttribute('aria-controls', this.id);
    }
  }

  /**
   * Handles `blur` event on this element.
   * @param event The event.
   */
  @HostListener('shadowRoot:blur')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  protected _handleBlur = ({ target, relatedTarget }: FocusEvent) => {
    const oldContains = target !== this && this.contains(target as Node);
    const currentContains = relatedTarget !== this && this.contains(relatedTarget as Node);
    const { open, parent } = this;
    if (open && parent && relatedTarget && oldContains && !currentContains) {
      this.syncUserInitiatedState((this.open = false));
    }
  };

  /**
   * Ensures this menu body gets floated when it opens.
   * @param open The new open state.
   */
  protected _syncState(open: boolean) {
    if (open && !this.parent) {
      this.parent = this.parentElement as BXFloatingMenuTrigger;
      this.container.appendChild(this);
    }
  }

  /**
   * The horizontal/vertical direction with regard to how the menu is aligned to the trigger button.
   */
  get alignmentDirection() {
    return {
      [FLOATING_MENU_DIRECTION.LEFT]: FLOATING_MENU_DIRECTION_GROUP.VERTICAL,
      [FLOATING_MENU_DIRECTION.TOP]: FLOATING_MENU_DIRECTION_GROUP.HORIZONTAL,
      [FLOATING_MENU_DIRECTION.RIGHT]: FLOATING_MENU_DIRECTION_GROUP.VERTICAL,
      [FLOATING_MENU_DIRECTION.BOTTOM]: FLOATING_MENU_DIRECTION_GROUP.HORIZONTAL,
    }[this.direction];
  }

  /**
   * The DOM element to put this menu into.
   */
  get container() {
    return this.closest((this.constructor as typeof BXFloatingMenu).selectorContainer) || this.ownerDocument!.body;
  }

  /**
   * The position of this floating menu.
   */
  get position(): FloatingMenuPosition {
    const { triggerPosition } = this.parent!;
    if (!triggerPosition) {
      throw new TypeError('Missing information of trigger button position.');
    }

    const { container } = this;
    const { left: refLeft = 0, top: refTop = 0, right: refRight = 0, bottom: refBottom = 0 } = triggerPosition;
    const { width, height } = this.getBoundingClientRect();
    const { scrollLeft, scrollTop } = container;
    const { left: containerLeft = 0, top: containerTop = 0 } = container.getBoundingClientRect();
    const refCenterHorizontal = (refLeft + refRight) / 2;
    const refCenterVertical = (refTop + refBottom) / 2;

    if (
      (container !== this.ownerDocument!.body || containerLeft !== 0 || containerTop !== 0) &&
      container.ownerDocument!.defaultView!.getComputedStyle(container).getPropertyValue('position') === 'static'
    ) {
      throw new Error('Floating menu container must not have `position:static`.');
    }

    const { alignment, alignmentDirection, direction } = this;
    if (Object.values(FLOATING_MENU_ALIGNMENT).indexOf(alignment) < 0) {
      throw new Error(`Wrong menu alignment: ${alignment}`);
    }
    if (Object.values(FLOATING_MENU_DIRECTION).indexOf(direction) < 0) {
      throw new Error(`Wrong menu position direction: ${direction}`);
    }

    const alignmentStart = {
      [FLOATING_MENU_DIRECTION_GROUP.HORIZONTAL]: {
        [FLOATING_MENU_ALIGNMENT.START]: () => refLeft,
        [FLOATING_MENU_ALIGNMENT.CENTER]: () => refCenterHorizontal - width / 2,
        [FLOATING_MENU_ALIGNMENT.END]: () => refRight - width,
      },
      [FLOATING_MENU_DIRECTION_GROUP.VERTICAL]: {
        [FLOATING_MENU_ALIGNMENT.START]: () => refTop,
        [FLOATING_MENU_ALIGNMENT.CENTER]: () => refCenterVertical - height / 2,
        [FLOATING_MENU_ALIGNMENT.END]: () => refBottom - height,
      },
    }[alignmentDirection][alignment]();

    const { left, top } = {
      [FLOATING_MENU_DIRECTION.LEFT]: () => ({
        left: refLeft - width + scrollLeft,
        top: alignmentStart + scrollTop,
      }),
      [FLOATING_MENU_DIRECTION.TOP]: () => ({
        left: alignmentStart + scrollLeft,
        top: refTop - height + scrollTop,
      }),
      [FLOATING_MENU_DIRECTION.RIGHT]: () => ({
        left: refRight + scrollLeft,
        top: alignmentStart + scrollTop,
      }),
      [FLOATING_MENU_DIRECTION.BOTTOM]: () => ({
        left: alignmentStart + scrollLeft,
        top: refBottom + scrollTop,
      }),
    }[direction]();

    return {
      left: left - containerLeft,
      top: top - containerTop,
    };
  }

  async syncUserInitiatedState(open: boolean) {
    this._syncState(open);
    await this.updateComplete;
    if (open) {
      const { selectorPrimaryFocus, selectorFocusable: selectorFocusableForFloatingMenu } = this
        .constructor as typeof BXFloatingMenu;
      const primaryFocusNode = this.querySelector(selectorPrimaryFocus);
      if (primaryFocusNode) {
        (primaryFocusNode as HTMLElement).focus();
      } else {
        const focusable = find(this.querySelectorAll(selectorFocusableForFloatingMenu), elem =>
          Boolean((elem as HTMLElement).offsetParent)
        );
        ((focusable as HTMLElement) || this).focus();
      }
    } else {
      const { parent } = this;
      if (parent) {
        parent.focus();
      }
    }
  }

  updated(changedProperties) {
    const { open } = this;
    if (changedProperties.has('open')) {
      // For programmatic change in `open` state, ensures the menu body gets floated when the menu is open
      this._syncState(open);
    }
    if ((changedProperties.has('alignment') || changedProperties.has('direction') || changedProperties.has('open')) && open) {
      const { left, top } = this.position;
      this.style.left = `${left}px`;
      this.style.top = `${top}px`;
    }
  }

  /**
   * A constant indicating that this class is a floating menu.
   */
  static FLOATING_MENU = true;

  /**
   * A selector selecting focusable nodes.
   */
  static selectorFocusable = selectorFocusable;

  /**
   * A selector selecting the nodes that should be focused when this floating menu gets open.
   */
  static selectorPrimaryFocus = `[data-floating-menu-primary-focus]`;

  /**
   * The CSS selector to find the element to put this floating menu in.
   */
  static selectorContainer = '[data-floating-menu-container]';
}

export default BXFloatingMenu;
