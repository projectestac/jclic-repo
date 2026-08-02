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

// Import translations
import en from './en.json';
import ca from './ca.json';
import es from './es.json';

import stopwords_en from './stopwords-en.json';
import stopwords_ca from './stopwords-ca.json';
import stopwords_es from './stopwords-es.json';

import user_repo_info_en from './user-repo-info-en.html?raw';
import user_repo_info_ca from './user-repo-info-ca.html?raw';
import user_repo_info_es from './user-repo-info-es.html?raw';

import user_repo_upload_info_en from './user-repo-upload-info-en.html?raw';
import user_repo_upload_info_ca from './user-repo-upload-info-ca.html?raw';
import user_repo_upload_info_es from './user-repo-upload-info-es.html?raw';

import java_download_info_en from './java-download-info-en.html?raw';
import java_download_info_ca from './java-download-info-ca.html?raw';
import java_download_info_es from './java-download-info-es.html?raw';

// Currently supported languages
const SUPPORTED_LANGUAGES = ['en', 'ca', 'es'];

export const STOP_WORDS = {
  en: stopwords_en,
  ca: stopwords_ca,
  es: stopwords_es,
};

// MUI locales for currently supported languages (add or replace as needed)
import { enUS, caES, esES } from "@mui/material/locale";
export const muiLocales = { en: enUS, ca: caES, es: esES };
export function getMuiLocale(lang) {
  return muiLocales[lang] || enUS;
}

/**
 * Initializes the i18n system
 * See https://www.i18next.com/overview/api for detailed options
 * @param {object} settings
 * @param {string} settings.langKey - Key used in querystring to set the language (default: 'lang')
 * @param {string} settings.langDefault - Default language if none is detected (default: 'en')
 * @param {string|null} settings.lang - Force a specific language (overrides detection)
 * @returns {object} - the [i18n](https://www.i18next.com) main object
 */
export function i18nInit(settings) {

  const { langKey = "lang", langDefault = "en", lang = null } = settings;

  // Store supported languages list into settings
  settings.supportedLanguages = SUPPORTED_LANGUAGES;

  return i18n
    .use(LngDetector)
    .use(initReactI18next)
    .init({
      lng: lang,
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
        lookupQuerystring: langKey,
        lookupLocalStorage: 'i18nextLng',
      },
      resources: {
        en: {
          translation: {
            ...en,
            "user-repo-info": user_repo_info_en,
            "user-repo-upload-info": user_repo_upload_info_en,
            "java-download-info": java_download_info_en,
            intlNumber: "{{val, number}}",
            intlDateTime: "{{val, datetime}}",
          },
        },
        ca: {
          translation: {
            ...ca,
            "user-repo-info": user_repo_info_ca,
            "user-repo-upload-info": user_repo_upload_info_ca,
            "java-download-info": java_download_info_ca,
            intlNumber: "{{val, number}}",
            intlDateTime: "{{val, datetime}}",
          },
        },
        es: {
          translation: {
            ...es,
            "user-repo-info": user_repo_info_es,
            "user-repo-upload-info": user_repo_upload_info_es,
            "java-download-info": java_download_info_es,
            intlNumber: "{{val, number}}",
            intlDateTime: "{{val, datetime}}",
          },
        },
      },
      fallbackLng: langDefault,
      interpolation: {
        escapeValue: false,
      },
      // Not needed since i18next v26
      // showSupportNotice: false,
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
