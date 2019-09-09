/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import settings from 'carbon-components/es/globals/js/settings';
import { property, customElement, LitElement } from 'lit-element';
import OverflowMenuVertical16 from '@carbon/icons/lib/overflow-menu--vertical/16';
import HostListener from '../../globals/decorators/host-listener';
import FocusMixin from '../../globals/mixins/focus';
import HostListenerMixin from '../../globals/mixins/host-listener';
import { find } from '../../globals/internal/collection-helpers';
import BXFloatingMenu from '../floating-menu/floating-menu';
import BXFloatingMenuTrigger from '../floating-menu/floating-menu-trigger';
import styles from './overflow-menu.scss';

const { prefix } = settings;

/**
 * Overflow menu.
 */
@customElement(`${prefix}-overflow-menu`)
class BXOverflowMenu extends HostListenerMixin(FocusMixin(LitElement)) implements BXFloatingMenuTrigger {
  /**
   * The menu body.
   */
  private _menuBody: BXFloatingMenu | null = null;

  /**
   * Handles `click` event on the trigger button.
   */
  @HostListener('shadowRoot:click')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleClickTrigger = () => {
    this._syncUserInitiatedState((this.open = !this.open));
  };

  /**
   * Handles `keydown` event on the trigger button.
   */
  @HostListener('keydown')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleKeydownTrigger = ({ key, target }: KeyboardEvent) => {
    if (target === this && (key === ' ' || key === 'Enter')) {
      this._syncUserInitiatedState((this.open = !this.open));
    }
  };

  private _syncUserInitiatedState(open: boolean) {
    this._syncState(open);
    const { _menuBody: menuBody } = this;
    if (menuBody) {
      menuBody.syncUserInitiatedState(this.open);
    }
  }

  /**
   * Ensures the menu body and `aria-expanded` attribute gets in sync with the given open state.
   * @param open The new open state.
   */
  private _syncState(open: boolean) {
    if (open && !this._menuBody) {
      this._menuBody = find(this.childNodes, elem => (elem.constructor as typeof BXFloatingMenu).FLOATING_MENU);
    }
    const { _menuBody: menuBody } = this;
    if (menuBody) {
      menuBody.open = open;
      this.setAttribute('aria-expanded', String(Boolean(open)));
    }
  }

  /**
   * `true` if the dropdown should be open. Corresponds to the attribute with the same name.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * @returns The position of the trigger button in the viewport.
   */
  get triggerPosition() {
    return this.getBoundingClientRect();
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    if (!this.hasAttribute('tabindex')) {
      // TODO: Should we use a property?
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'true');
    }
    if (!this.hasAttribute('aria-expanded')) {
      this.setAttribute('aria-expanded', 'false');
    }
    super.connectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('open')) {
      // For programmatic change in `open` state,
      // ensures the state of menu body as well as `aria-expanded` are in sync with the new `open` state
      this._syncState(this.open);
    }
  }

  render() {
    return OverflowMenuVertical16({
      class: `${prefix}--overflow-menu__icon`,
    });
  }

  /**
   * The CSS selector to find the trigger button.
   */
  static selectorTrigger = '#trigger';

  static styles = styles; // `styles` here is a `CSSResult` generated by custom WebPack loader
}

export default BXOverflowMenu;
