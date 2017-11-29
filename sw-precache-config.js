/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */

module.exports = {
  cacheId: 'main_repository',
  staticFileGlobs: [
    '/index.htm',
    '/index.html*',
    '/main.json',
    '/manifest.json',
    '/images/*',
    '/src/jclic-repo.html',
    '/bower_components/webcomponentsjs/*',
    '/bower_components/es6-promise-polyfill/*',
  ],
  navigateFallback: 'index.html',
  ignoreUrlParametersMatching: [/./],
  runtimeCaching: [{
    urlPattern: /^https:\/\/unpkg\.com\//,
    handler: 'cacheFirst',
  },
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
    handler: 'cacheFirst',
  },
  {
    urlPattern: /^https?:\/\/[\w\.]*\/projects\/projects.json/,
    handler: 'fastest',
  },
  {
    urlPattern: /^https?:\/\/[\w\.]*\/projects\/[\w\/\.]*\/(project\.json|cover\.(jpg|png|gif))/,
    handler: 'cacheFirst',
    options: {
      cache: {
        maxEntries: 800,
        name: 'projects-cache',
      },
    },
  }],
};
