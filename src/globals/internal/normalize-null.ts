/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @param value A value.
 * @returns `undefined` if the given value is `null`, otherwise the given value itself.
 */
export default value => (value == null ? undefined : value);
