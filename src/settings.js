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

import { useRef } from 'react';
import { loadGoogleFont } from './utils';
import { supportedLanguages, i18nInit } from './i18n';

export const mainFont = ['Roboto', 'Arial', '"sans-serif"'].join(',');
export const titleFont = ['"Open Sans"', 'Arial', '"sans-serif"'].join(',');
// export const titleFont = mainFont;
export function initFonts({ alreadyLoadedFonts = '' }) {
  const fontsList = new Set(alreadyLoadedFonts.split(','));
  if (!fontsList.has('Roboto'))
    loadGoogleFont('Roboto', '300,400,500,700');
  if (!fontsList.has('Open Sans'))
    loadGoogleFont('Open Sans', '400,700');
}

export const DEFAULT_THEME = {
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#fbc02d' },
  },
  typography: {
    fontFamily: mainFont,
    fontDisplay: 'swap', // Fa res???
    h1: {
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: '2.8rem',
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
    body1: {
      fontFamily: mainFont,
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
  components: {
    'MuiTablePagination': {
      styleOverrides: {
        spacer: {
          display: 'none',
        },
        toolbar: {
          flexFlow: 'wrap',
          paddingLeft: '0 !important',
        },
      }
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
  debug: import.meta.env.VITE_DEBUG === 'true',
  // Selected language (or _null_ for auto-detect)
  lang: import.meta.env.VITE_LANG || null,
  // Key used for the language query param on the URL
  langKey: import.meta.env.VITE_LANG_KEY,
  // Fallback language
  langDefault: import.meta.env.VITE_LANG_DEFAULT,
  // Base URL for JClic projects library, without ending '/'
  repoBase: import.meta.env.VITE_REPO_BASE,
  // Full URL to projects list
  repoList: import.meta.env.VITE_REPO_LIST,
  // Link to the JNLP JClic Installer
  jnlpInstaller: import.meta.env.VITE_JNLP_INSTALLER,
  // API entry point of the JClic repo search service
  jclicSearchService: import.meta.env.VITE_JCLIC_SEARCH_SERVICE,
  // Base URL for JClic user projects, without ending '/'
  usersBase: import.meta.env.VITE_USERS_BASE,
  // Path to the repository page
  repoPath: import.meta.env.VITE_REPO_PATH,
  // Path to the users library page
  usersPath: import.meta.env.VITE_USERS_PATH,
  // Google OAuth2 API id
  googleOAuth2Id: import.meta.env.VITE_GOOGLE_OAUTH2_ID,
  // API base for user's library
  userLibApi: import.meta.env.VITE_USERLIB_API,
  // Google Identity Services endpoint
  gsiApi: import.meta.env.VITE_GSI_API,
  // Key used to store credentials in browser session
  authKey: import.meta.env.VITE_AUTH_KEY,
  // Facebook app id (used in share button)
  facebookId: import.meta.env.VITE_FACEBOOK_ID,
  // Google Analytics code
  analyticsUA: import.meta.env.VITE_ANALYTICS_UA,
  // Absolute URL of the repository logo
  logo: import.meta.env.VITE_LOGO,
  // Absolute URL of the main Twitter card
  twitterCard: import.meta.env.VITE_TWITTER_CARD,
  // Show the main title
  displayTitle: import.meta.env.VITE_DISPLAY_TITLE === 'false' ? false : true,
  // Show the subtitle
  displaySubtitle: import.meta.env.VITE_DISPLAY_SUBTITLE === 'false' ? false : true,
  // Show the "back to top" button when scrolling large lists of activities
  displayBackToTop: import.meta.env.VITE_DISPLAY_BACK_TO_TOP === 'false' ? false : true,
  // Array of names of fonts already loaded by the container page
  alreadyLoadedFonts: import.meta.env.VITE_ALREADY_LOADED_FONTS || '',
  // Maximum number of parallel threads when downloading activities
  maxThreads: Number(import.meta.env.VITE_MAX_THREADS) || 20,
  // Enable reporting to Koko Analytics WordPress plugin, if available
  kokoAnalyticsEnabled: window?.koko_analytics?.url && import.meta.env.VITE_KOKO_ANALYTICS_ENABLED === 'true',  
  // Integer to be added to JClic project ids to compute fake WP post ids when reporting to Koko Analytics
  kokoAnalyticsBaseId: Number(import.meta.env.VITE_KOKO_ANALYTICS_BASE_ID) || 50000,
  // Runing as custom web component
  isWebComponent: false,
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
