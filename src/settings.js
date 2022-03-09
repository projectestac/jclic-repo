/*!
 *  File    : settings.js
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

/* global process */

import { useRef } from 'react';
import { loadGoogleFont } from './utils';
import { supportedLanguages, i18nInit } from './i18n';

export const mainFont = ['Roboto', 'Arial', '"sans-serif"'].join(',');
export const titleFont = ['"Open Sans"', 'Arial', '"sans-serif"'].join(',');
export function initFonts() {
  loadGoogleFont('Roboto');
  loadGoogleFont('Open Sans');
}

export const DEFAULT_THEME = {
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#fbc02d' },
  },
  typography: {
    fontFamily: mainFont,
    fontDisplay: 'swap',
    h1: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '1.5rem',
      marginBottom: '0.6rem',
    },
    body3: {
      fontFamily: mainFont,
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle1: {
      lineHeight: 'normal',
    }
  },
};

// See `.env.example` for example settings
export const DEFAULT_SETTINGS = {
  // List of currently supported languages
  supportedLanguages,
  // Current theme
  theme: DEFAULT_THEME,
  // Share buttons to be displayed, and metadata used when sharing
  shareSites: { twitter: true, facebook: true, telegram: true, whatsapp: true, pinterest: true, email: true, moodle: true, classroom: true, embed: true },
  shareMeta: { hash: 'JClic,edu', via: 'xtec' },
  // When `true`, debug messages should be displayed on the console
  debug: process.env.DEBUG === 'true',
  // Selected language (or _null_ for auto-detect)
  lang: process.env.LANG || null,
  // Key used for the language query param on the URL
  langKey: process.env.LANG_KEY,
  // Fallback language
  langDefault: process.env.LANG_DEFAULT,
  // Base URL for JClic projects library, without ending '/'
  repoBase: process.env.REPO_BASE,
  // Full URL to projects list
  repoList: process.env.REPO_LIST,
  // Link to the JNLP JClic Installer
  jnlpInstaller: process.env.JNLP_INSTALLER,
  // API entry point of the JClic repo search service
  jclicSearchService: process.env.JCLIC_SEARCH_SERVICE,
  // Base URL for JClic user projects, without ending '/'
  usersBase: process.env.USERS_BASE,
  // Path to the repository page
  repoPath: process.env.REPO_PATH,
  // Path to the users library page
  usersPath: process.env.USERS_PATH,
  // Google OAuth2 API id
  googleOAuth2Id: process.env.GOOGLE_OAUTH2_ID,
  // API base for user's library
  userLibApi: process.env.USERLIB_API,
  // Facebook app id (used in share button)
  facebookId: process.env.FACEBOOK_ID,
  // Google Analytics code
  analyticsUA: process.env.ANALYTICS_UA,
  // Absolute URL of the repository logo
  logo: process.env.LOGO,
  // Absolute URL of the main Twitter card
  twitterCard: process.env.TWITTER_CARD,
  // Show the main title
  displayTitle: process.env.DISPLAY_TITLE === 'false' ? false : true,
  // Show the subtitle
  displaySubtitle: process.env.DISPLAY_SUBTITLE === 'false' ? false : true,
  // Maximum number of parallel threads when downloading activities
  maxThreads: Number(process.env.MAX_THREADS) || 20,
};

export function useSettings(settings = DEFAULT_SETTINGS) {

  // Convert relative paths to full paths
  settings.fullRepoPath = (new URL(settings.repoPath, window.location.href)).href;
  settings.fullUsersPath = (new URL(settings.usersPath, window.location.href)).href;

  // Init language tool
  i18nInit(settings);

  // Add a reference to the root component in settings
  settings.rootRef = useRef();

  return settings;
}

export default useSettings;