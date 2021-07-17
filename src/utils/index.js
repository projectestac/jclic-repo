/*!
 *  File    : utils/index.js
 *  Created : 2021-07-15
 *  By      : Francesc Busquets <francesc@gmail.com>
 *
 *  JClic repo
 *  Dynamic repository of JClic activities
 *  https://clic.xtec.cat
 *
 *  @source https://github.com/projectestac/jclic-repo
 *
 *  @license EUPL-1.2
 *  @licstart
 *  (c) 2021 Educational Telematic Network of Catalonia (XTEC)
 *
 *  Licensed under the EUPL, Version 1.2 or -as soon they will be approved by
 *  the European Commission- subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *
 *  You may obtain a copy of the Licence at:
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  Licence for the specific language governing permissions and limitations
 *  under the Licence.
 *  @licend
 *  @module
 */

/**
 * Combines a potential `className` field passed in `props` with the element
 * class name specified in `classes.root`
 * @param {Object} props - Inherited properties. Can contain a `className` property. Can also be _null_.
 * @param {Object} classes - Class set to be used. Only the `root` element, if exists, will be re-factorized.
 * @param {String=} root - Optional parameter with an alternative name for the `root` key.
 */
export function mergeClasses(props, classes, root = 'root') {
  if (props && props.className && classes && classes[root])
    classes[root] = `${classes[root]} ${props.className}`;
  return classes;
}

/**
 * Loads the specified Google Font
 * @param {string=} fontName - The name of the Google Font to be loaded. Default is 'Roboto'
 * @param {string=} weights - The desired font weights, separed by comma. Defaults to '300,400,500,700'
 */
export function loadGoogleFont(fontName = 'Roboto', weights = '300,400,500,700') {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css?family=${fontName}:${weights}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Returns a clone of the provided object, interpreting string values staring with "{" or "[" as JSON expressions that
 * will be parsed and converted to real objects and arrays
 * @param {object} data 
 * @returns object
 */
export function parseStringSettings(data = {}) {
  return Object.keys(data).reduce((result, k) => {
    const v = data[k];
    result[k] = /^[{[]/.test(v) ? JSON.parse(v) : v === 'true' ? true : v === 'false' ? false : v;
    return result;
  }, {});
}

/**
 * Updates window.history.state and the query params of current URL, thus allowing
 * to navigate between different app states
 * @param {string} act - Id of the project to display, or `null` to show the projects list
 * @param {string} user - User id for user libraries, or null for main library
 * @param {boolean} replace - When `true`, the current state is replaced. Otherwise, a new state is pushed.
 */
export function updateHistoryState(act, user, replace = false) {
  const url = new URL(window.location.href);
  url.searchParams.set('prj', act || '');
  url.searchParams.set('user', user || '');
  window.history[replace ? 'replaceState' : 'pushState']({ ...window.history.state, prj: act, user: user }, document.title, url);
}

/**
 * Checks for network errors in fetch operations,
 * and resolves to a JSON response
 * @param {object} response 
 * @returns Promise
 */
export const checkFetchResponse = response => {
  if (!response.ok)
    throw new Error(response.statusText);
  return response.json();
};

/**
 * Gets the value of the specified parameter on the query section
 * of the current location, or `null` if not set
 * @param {string} param - The parameter name
 * @returns string
 */
export function getQueryParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param) || null;
}

/**
 * Replaces newline chars (\n) by <p/> tags on the provided text if it contains HTML.
 * @param {string} desc 
 * @returns string
 */
export function htmlContent(desc = '') {
  return /<\w*>/.test(desc) ? desc : desc.replace(/\n/g, '<p/>\n');
}

export function getPathForProject(act, user = null) {
  const url = new URL(window.location);
  url.searchParams.set('prj', act);
  if (user)
    url.searchParams.set('user', user);
  return url.toString();
}
