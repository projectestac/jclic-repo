// See:
// https://medium.freecodecamp.org/how-to-build-a-pwa-with-create-react-app-and-custom-service-workers-376bd1fdc6d3
// https://github.com/GoogleChromeLabs/sw-precache

module.exports = {
  cacheId: 'main_repository',
  staticFileGlobs: [
    'build/index.html',
    'build/*.json',
    'build/*.js',
    'build/static/css/**.css',
    'build/static/js/**.js',
    'build/ico/favicon.ico',
  ],
  swFilePath: './build/service-worker.js',
  templateFilePath: './node_modules/sw-precache/service-worker.tmpl',
  stripPrefix: 'build/',
  navigateFallback: 'index.html',
  ignoreUrlParametersMatching: [/./],
  runtimeCaching: [
    { urlPattern: /\/ico\//, handler: 'cacheFirst' },
    { urlPattern: /\/img\//, handler: 'cacheFirst' },
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
      urlPattern: /^https?:\/\/[\w\.]*\/projects\/[\w\/\.]*\/(project\.json|cover\.(jpg|png|gif))/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 3000,
          name: 'projects-cache',
        },
      },
    }],
}