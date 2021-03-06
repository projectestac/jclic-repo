/**
 * Options for the Service Worker Precache
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
    '/node_modules/web-animations-js/web-animations-next-lite.min.js',
    '/node_modules/clipboard-polyfill/build/clipboard-polyfill.js',
    '/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
    '/node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
    '/node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js',
  ],
  navigateFallback: 'index.html',
  ignoreUrlParametersMatching: [/./],
  importScripts: [],
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/[\w\/\.]*\/node_modules\/@webcomponents\/webcomponentsjs\/(bundles|entrypoints)\//,
      handler: 'cacheFirst',
    },
    {
      urlPattern: /^https:\/\/unpkg\.com\//,
      handler: 'cacheFirst',
    },
    {
      urlPattern: /^https:\/\/fonts\.[googleapis|gstatic]\.com\//,
      handler: 'fastest',
    },
    {
      urlPattern: /^https?:\/\/[\w\/\.]*\/projects\/projects.json/,
      handler: 'fastest',
    },
    {
      urlPattern: /^https?:\/\/[\w\.]*\/projects\/(?!.*jclic\.js)([\w-\/\.]*)\/(project\.json|[^\/\.]*\.(jpg|png|gif))$/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 3000,
          name: 'projects-cache',
        },
      },
    }],
};
