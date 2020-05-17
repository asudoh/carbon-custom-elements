/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import settings from 'carbon-components/es/globals/js/settings';
import { customElement } from 'lit-element';
import HostListener from '../../globals/decorators/host-listener';
import HostListenerMixin from '../../globals/mixins/host-listener';
import RadioGroupManager, { NAVIGATION_DIRECTION, ManagedRadioButtonDelegate } from '../../globals/internal/radio-group-manager';
import SelectableTile from './selectable-tile';

const { prefix } = settings;

/**
 * Map of navigation direction by key.
 */
const navigationDirectionForKey = {
  ArrowUp: NAVIGATION_DIRECTION.BACKWARD,
  Up: NAVIGATION_DIRECTION.BACKWARD, // IE
  ArrowDown: NAVIGATION_DIRECTION.FORWARD,
  Down: NAVIGATION_DIRECTION.FORWARD, // IE
};

/**
 * The interface for `RadioGroupManager` for radio tile.
 */
class RadioTileDelegate implements ManagedRadioButtonDelegate {
  /**
   * The radio tile to target.
   */
  private _tile: BXRadioTile;

  constructor(tile: BXRadioTile) {
    this._tile = tile;
  }

  get checked() {
    return this._tile.selected;
  }

  set checked(checked) {
    const { _tile: tile } = this;
    const { eventChange } = tile.constructor as typeof BXRadioTile; // eslint-disable-line no-use-before-define
    tile.selected = checked;
    this.tabIndex = checked ? 0 : -1;
    tile.dispatchEvent(
      new CustomEvent(eventChange, {
        bubbles: true,
        composed: true,
        detail: {
          checked,
        },
      })
    );
  }

  get tabIndex() {
    return this._tile.tabIndex;
  }

  set tabIndex(tabIndex) {
    this._tile.tabIndex = tabIndex;
  }

  get name() {
    return this._tile.name;
  }

  compareDocumentPosition(other: RadioTileDelegate) {
    return this._tile.compareDocumentPosition(other._tile);
  }

  focus() {
    this._tile.focus();
  }
}

/**
 * Single-selectable tile.
 * @element bx-radio-tile
 */
@customElement(`${prefix}-radio-tile`)
class BXRadioTile extends HostListenerMixin(SelectableTile) {
  /**
   * The radio group manager associated with the radio button.
   */
  private _manager: RadioGroupManager | null = null;

  /**
   * The interface for `RadioGroupManager` for radio button.
   */
  private _radioButtonDelegate = new RadioTileDelegate(this);

  /**
   * The `type` attribute of the `<input>`.
   */
  protected _inputType = 'radio';

  /**
   * Handles `keydown` event on this element.
   */
  @HostListener('keydown')
  // @ts-ignore: The decorator refers to this method but TS thinks this method is not referred to
  private _handleKeydown = (event: KeyboardEvent) => {
    const { _radioButtonDelegate: radioButtonDelegate } = this;
    const manager = this._manager;
    if (radioButtonDelegate && manager) {
      const navigationDirection = navigationDirectionForKey[event.key];
      if (navigationDirection) {
        manager.select(manager.navigate(radioButtonDelegate, navigationDirection));
        event.preventDefault(); // Prevent default (scrolling) behavior
      }
      if (event.key === ' ' || event.key === 'Enter') {
        manager.select(radioButtonDelegate);
      }
    }
  };

  /**
   * Handles `change` event on the `<input>` in the shadow DOM.
   */
  protected _handleChange() {
    super._handleChange();
    if (this._manager) {
      this._manager.select(this._radioButtonDelegate);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._manager) {
      this._manager = RadioGroupManager.get(this.getRootNode({ composed: true }) as Document);
    }
    const { name, _radioButtonDelegate: radioButtonDelegate, _manager: manager } = this;
    if (radioButtonDelegate && name) {
      manager!.add(this._radioButtonDelegate);
    }
  }

  disconnectedCallback() {
    const { _radioButtonDelegate: radioButtonDelegate, _manager: manager } = this;
    if (radioButtonDelegate && manager) {
      manager.delete(radioButtonDelegate);
    }
    super.disconnectedCallback();
  }

  shouldUpdate(changedProperties) {
    const { _manager: manager } = this;
    if (manager && changedProperties.has('name')) {
      manager.delete(this._radioButtonDelegate, changedProperties.get('name'));
    }
    return true;
  }

  updated(changedProperties) {
    const { _manager: manager, name } = this;
    if (changedProperties.has('name')) {
      if (manager && name) {
        manager.add(this._radioButtonDelegate);
      }
      this.setAttribute('tabindex', !name || !manager || !manager.shouldBeFocusable(this._radioButtonDelegate) ? '-1' : '0');
    }
  }

  /**
   * The name of the custom event fired after this radio tile changes its checked state.
   */
  static get eventChange() {
    return `${prefix}-radio-tile-changed`;
  }
}

export default BXRadioTile;
