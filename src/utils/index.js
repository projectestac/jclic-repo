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
 * Parses the provided string expression, returning the most appropiate
 * type: object (or array), boolean, number or string
 * @param {*} s 
 * @returns *
 * @throws exception
 */
export function parseExpression(s = '') {
  // Parse only strings
  if (typeof s !== 'string' || s === '')
    return s;

  // If the expression starts with "{", "[", or is a boolean, parse it as JSON
  if (/(?:^{|^\[|^true$|^false$|^null$)/.test(s))
    return JSON.parse(s);

  // Check if it's a numeric expression
  const n = Number(s);
  if (!isNaN(n))
    return n;

  // Otherwise return the original string
  return s;
}

/**
 * Returns a clone of the provided object, interpreting string values staring with "{" or "[" as JSON expressions that
 * will be parsed and converted to real objects and arrays
 * @param {object} data 
 * @returns object
 */
export function parseStringSettings(data = {}) {
  return Object.keys(data).reduce((result, k) => {
    try {
      result[k] = parseExpression(data[k]);
    } catch (err) {
      console.error('Error parsing value:', data[k], err);
    }
    return result;
  }, {});
}

/**
 * Updates window.history.state and the query params of current URL, thus allowing
 * to navigate between different app states
 * @param {object} settings - Settings to be reflected in search params
 * @param {string} settings.act - Id of the project to display, or `null` to show the projects list
 * @param {string} settings.user - User id for user libraries, or null for main library
 * @param {object} settings.filters - Filters to be applied to the current list of projects
 * @param {string} settings.filters.language - Language filter
 * @param {string} settings.filters.subject - Subject filter
 * @param {string} settings.filters.level - Level filter
 * @param {string} settings.filters.text - Full text search filter
 * @param {boolean} replace - When `true`, the current state is replaced. Otherwise, a new state is pushed.
 */
export function updateHistoryState({ act = '', user = '', filters = {} }, replace = false) {
  const url = new URL(window.location.href);
  setUrlSearchParam(url.searchParams, 'prj', act);
  setUrlSearchParam(url.searchParams, 'user', user);
  setUrlSearchParam(url.searchParams, 'language', !act && filters?.language);
  setUrlSearchParam(url.searchParams, 'subject', !act && filters?.subject);
  setUrlSearchParam(url.searchParams, 'level', !act && filters?.level);
  setUrlSearchParam(url.searchParams, 'text', !act && filters?.text);
  window.history[replace ? 'replaceState' : 'pushState']({ ...window.history.state, prj: act, user, filters }, document.title, url);
}

/**
 * Set/unset a parameter on a URL search section
 * @param {URL.SearchParams} searchParams - The URL.SearchParams object to be updated
 * @param {string} param - Param key name
 * @param {*} value - Value to be set, or `null` to clean it
 * @returns 
 */
export function setUrlSearchParam(searchParams, param, value = '') {
  if (value)
    searchParams.set(param, typeof (value) === 'object' ? JSON.stringify(value) : value.toString());
  else
    searchParams.delete(param);
  return searchParams;
}

/**
 * Checks for network errors in fetch operations,
 * and resolves to a JSON response
 * @param {object} response 
 * @returns Promise
 */
export const checkFetchResponse = response => {
  if (!response.ok) {
    console.error('Bad response:', response);
    throw new Error(response.statusText);
  }
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
 * @param {string} text - The text to process 
 * @returns string
 */
export function htmlContent(text = '') {
  return /<\w*>/.test(text) ? text : text.replace(/\n/g, '<p/>\n');
}

/**
 * Cleans HTML tags, carriage returns and duplicate spaces from a text expression.
 * Useful to obtain plain text expressions for metadata
 * @param {string} text 
 * @returns string
 */
export function textContent(text = '') {
  return text.replace(/(?:<li>|<td>)/g, ' - ').replace(/<[^>]*>/g, ' ').replace(/\n/g, ' ').replace(/  +/g, ' ').trim();
}

/**
 * Build an URL pointing to a specific project, adding params to the search
 * section of the current URL
 * @param {string} act - current project path
 * @param {string=} user - current user
 * @returns string
 */
export function getPathForProject(act, user = null) {
  const url = new URL(window.location);
  if (act)
    url.searchParams.set('prj', act);
  if (user)
    url.searchParams.set('user', user);
  return url.toString();
}

/**
 * Builds a collection of URLs related to a base location, adding specific 'lang' fields
 * for each available language.
 * @param {string} location - Base URL
 * @param {string} lang - Current language
 * @param {string} langKey - Key used for language in the search section. Usually "lang".
 * @param {string[]} supportedLanguages - List of currently supported languages
 * @returns object[] - Array of objects with two properties: 'lang' and 'url'
 */
export function getAllPageVariants(location, lang, langKey, supportedLanguages) {
  const url = new URL(location);
  return supportedLanguages.reduce((result, l) => {
    if (l !== lang) {
      const p = location.indexOf(`/${lang}/`);
      if (p >= 0)
        result.push({ lang: l, href: `${location.substring(0, p)}/${l}/${location.substring(p + 4)}` });
      else {
        url.searchParams.set(langKey, l);
        result.push({ lang: l, href: url.toString() });
      }
    }
    return result;
  }, []);
}

/**
 * Simulates a click on a <a/> element
 * @param {string} url 
 */
export function clickOnLink(url, onNewTab = false) {
  if (onNewTab)
    window.open(url).focus();
  else {
    const link = document.createElement("a");
    link.setAttribute('href', url);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
  }
}

/**
 * Gets an absolute URL from a relative or absolute URL plus optional query params,
 * using the current location as a root path
 * @param {string} path - The absolute or relative path to be absolutized. It can contain some query params.
 * @param {object} params - Query params to be added to the resulting URL (object with key - value pairs)
 * @returns string - The resulting absolute URL
 */
export function getAbsoluteURL(path, params = {}) {
  const { origin, pathname } = window.location;
  const base = /^https?:\/\//.test(path) ? path : `${origin}${/^\//.test(path) ? '' : pathname}${path}`;
  const result = new URL(base);
  Object.keys(params).forEach(k => {
    if (params[k] !== null)
      result.searchParams.set(k, params[k]);
  });
  return result.toString();
}

/**
 * CSS attributes for one-line fields
 */
export const ellipsis = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

/**
 * Converts a date in format DD/MM/YYYY to the current locale date format.
 * In case of error, returns the provided 'date' parameter
 * @param {string} date 
 * @returns string
 */
export function formatDate(date) {
  let [day = 0, month = 0, year = 0] = date.split('/').map(s => parseInt(s));

  // Check possible two-digit year format
  if (year <= 99 && year >= 90)
    year += 1900;
  else if (year <= 50 && year >= 0)
    year += 2000;

  if (day > 0 && day <= 31 && month > 0 && month <= 12 && year > 1990) {
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString();
  }

  // Resolve to the provided string
  return date;
}
