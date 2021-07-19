/*!
 *  File    : i18n/index.js
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

import i18n from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ca from './ca.json';
import es from './es.json';

import stopwords_en from './stopwords_en.json';
import stopwords_ca from './stopwords_ca.json';
import stopwords_es from './stopwords_es.json';

export const supportedLanguages = ['en', 'ca', 'es'];

export const STOP_WORDS = {
  en: stopwords_en,
  ca: stopwords_ca,
  es: stopwords_es,
};

/**
 * Initializes the i18n system
 * See https://www.i18next.com/overview/api for detailed options
 * @param {object} options
 * @returns {object} - the [i18n](https://www.i18next.com) main object
 */
export function i18nInit({ langKey = 'lang', langDefault = 'en' }) {
  return i18n
    .use(LngDetector)
    .use(initReactI18next)
    .init({
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
        lookupQuerystring: langKey,
        lookupLocalStorage: 'i18nextLng',
      },
      resources: {
        en: {
          translation: en,
        },
        ca: {
          translation: ca,
        },
        es: {
          translation: es,
        },
      },
      fallbackLng: langDefault,
      interpolation: {
        escapeValue: false,
      },
    });
}

/**
 * Checks id the provided text is a 'stopword' for the specified language
 * @param {string} word - The word to check
 * @param {string} lang - The language to use
 * @returns boolean - `true` if it's a 'stopword'
 */
export function isStopWord(word = '', lang) {
  return STOP_WORDS[lang].includes(word.trim().toLowerCase());
}

/**
 * Returns a large string with all single words in a text fragment, excluding those defined as "stop words"
 * for the specified language.
 * Useful for full text search engines
 * @param {string} text - The text fragment to process
 * @param {string} lang - The code of the language to check for stopwords
 * @returns string - A long string with all words, separed by whitespaces, ignoring duplicates and excluding stopwords.
 */
export function getTextTokens(text, lang) {
  text = text
    // Remove URLS
    .replace(/https?:[-/.\w?=#&%@]+/g, '')
    // Remove ISO dates
    .replace(/\d{4}-\d{2}-\d{2}T[-\w.:]+/g, '')
    // Take symbols as separators
    .replace(/[-_\s(){}[\]#*<>,.;:¿?/'@~=+\\|¡!"£$€^&`´]+/g, ' ')
    // Convert to lower case
    .toLowerCase();

  // Convert text to an array of unique words
  const tokens = Array.from(new Set(text.split(' ')))
    // Exclude stopwords and single chars
    .filter(token => token.length > 1 && !STOP_WORDS[lang].includes(token))
    // Sort list
    .sort();

  return tokens.join(' ');
}
