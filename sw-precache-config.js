/**
 * Options for Service Worker Precache
 * See: https://github.com/GoogleChromeLabs/sw-precache
 */

/* eslint-env node */

module.exports = {
  cacheId: 'jclic-repo',
  clientsClaim: true,
  directoryIndex: 'index.html',
  staticFileGlobs: [
    '/index.html*',
    '/main.json',
    '/manifest.json',
    '/images/*',
    '/src/jclic-repo.js',
    '/node_modules/@webcompnents/webcomponentsjs/webcomponents-loader.js',
    '/node_modules/@webcompnents/webcomponentsjs/bundles/*',
    '/node_modules/@webcompnents/webcomponentsjs/entrypoints/*',
  ],
  navigateFallback: 'index.html',
  ignoreUrlParametersMatching: [/./],
  importScripts: [],
  runtimeCaching: [{
    urlPattern: /^https:\/\/unpkg\.com\//,
    handler: 'cacheFirst',
  },
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
    handler: 'cacheFirst',
  },
  {
    urlPattern: /^https?:\/\/[\w\/\.]*\/projects\/projects.json/,
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
