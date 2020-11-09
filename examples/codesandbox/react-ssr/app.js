/**
 * @license
 *
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import App from './views/App.js';

const app = express();

app.get('/', async function topRoute(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.send(ReactDOMServer.renderToString(React.createElement(App)));
  res.end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
