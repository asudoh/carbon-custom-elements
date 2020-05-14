/**
 * @license
 *
 * Copyright IBM Corp. 2019
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const specContext = require.context('.', true, /_a11y_spec\.ts$/);
specContext.keys().forEach(specContext);
