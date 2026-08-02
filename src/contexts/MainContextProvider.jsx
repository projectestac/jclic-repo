
import * as React from "react";
import { deepmerge } from "@mui/utils";
import { i18nInit } from "@/i18n";
import { theme, initFonts } from "@/theme";
import { MainContext } from "./useMainContext.jsx";

// Default settings
const DEFAULT_SETTINGS = {
  // App version from `package.json`, provided by `vite.config.js`
  appId: import.meta.env.VITE_APP_ID,
  // Reference to the root component, implemented in Root
  rootRef: null,
  // List of currently supported languages (to be filled by i18nInit)
  supportedLanguages: [],
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
  fullRepoPath: (new URL(import.meta.env.VITE_REPO_PATH, window.location.href)).href,
  // Path to the users library page
  usersPath: import.meta.env.VITE_USERS_PATH,
  fullUsersPath: (new URL(import.meta.env.VITE_USERS_PATH, window.location.href)).href,
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

export function MainContextProvider(props) {
  const { children, rootRef, dataSettings = {} } = props;
  const settings = deepmerge({ ...DEFAULT_SETTINGS, theme, rootRef }, dataSettings);
  initFonts(settings);
  i18nInit(settings);
  return <MainContext value={settings}>{children}</MainContext>;
}
