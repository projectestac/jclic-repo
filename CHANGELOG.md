### v2.3.2 (2025-06-15)
#### Bug fixes
- Updated some [MUI](https://mui.com/material-ui/) deprecated functions to equivalents in V7, according to the [MUI deprecation guide](https://mui.com/material-ui/migration/migrating-from-deprecated-apis/#transitionprops).

#### Improvements
- Upgraded peer dependencies
- Using 'eslint.config.mjs' instead of '.eslintrc.js' (deprecated in [Eslint](https://eslint.org/) V9)

### v2.3.1 (2025-05-22)
#### Improvements
- Replaced discontinued [`react-helmet](https://www.npmjs.com/package/react-helmet) package by [`@dr.pogodin/react-helmet`](https://www.npmjs.com/package/@dr.pogodin/react-helmet) for compatibility with React v19. 
- Upgraded peer dependencies

### v2.3.0 (2025-01-29)
#### Improvements
- Upgraded to [React](https://react.dev/) v.19
- Removed discontinued peer [`react-copy-to-clipboard`](https://www.npmjs.com/package/react-copy-to-clipboard)
- Updated peer dependencies

### v2.2.0 (2024-11-15)
#### Improvements
- Upgrade to [MUI](https://mui.com/material-ui/) v6.1
- Updated peer dependencies
- Updated instrucions in user library

### v2.1.13 (2024-05-24)
#### Improvements
- Updated peer dependencies
- Scroll the page to the top of the main component when a new project is set

### v2.1.12 (2024-04-07)
#### Improvements
- Updated peer dependencies
- Report project page views to Koko Analytics WordPress plugin, if available.
- Improve error messages

### v2.1.11 (2024-04-01)
#### Improvements
- Updated peer dependencies.
- CTRL+click on card opens the project in new tab
- Improved SEO with 'canonical' and 'alternate' head tags
- Added some PHP snippets for WordPress
- Display dates in the current locale format
- Improved the usability of 'switch to list' control
- Optimized search box

### v2.1.4 (2023-02-03)
#### Improvements
- Updated peer dependencies.
- Removed default padding in main components.

### v2.1.3 (2022-11-21)
#### Improvements
- Updated peer dependencies.
- Replaced the direct call to Java WebStart, which no longer works, with an informative note when clicking the "install project" button.

### v2.1.2 (2022-10-09)
#### Improvements
- Clean up global CSS directives that can affect the rendering of the Google button.

### v2.1.1 (2022-10-04)
#### Improvements
- Upgraded to [React 18](https://reactjs.org/blog/2022/03/29/react-v18.html) and [MUI 5](https://mui.com/).
- React apps can now be used as [Web Components](https://developer.mozilla.org/es/docs/Web/Web_Components) with [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) for better integration on sites with complex styles, like some WordPress themes.
- Updated peer dependencies.
- Added support for [WebP](https://developers.google.com/speed/webp/) file format in project covers.
- Update styling to [MUI5](https://mui.com/) with [`sx` props](https://mui.com/system/getting-started/the-sx-prop/).
- Set back-to-top button optional.
- Added a standard React DOM renderer, to be able to use the apps without the Web Component envelope.
- Added support for the new [Google Identity Services](https://developers.google.com/identity/oauth2/web) API.

### v2.0.7 (2021-09-19)
#### Improvements
- Optimized expression parsing
- Re-styled cards and titles
- Optimized grid layout

### v2.0.5 (2021-08-15)
#### Improvements
- Display user name in title

### v2.0.4 (2021-08-15)
#### Improvements
- Optimized login in userLib
- Use Markdown as default text format

### v2.0.3 (2021-07-31)
#### Improvements
- Style HTML snippets with makeStyles

### v2.0.2 (2021-07-29)
#### Improvements
- Added info blocks to userLib

### v2.0.1 (2021-07-25)
#### Improvements
- Added 'lang' param in settings
- User libraries
- Improved history management
- Use babel-eslint to allow ES2022 features
- Implemented project downloading
- Added "share to social" buttons

### v2.0.0 (2021-07-23)
- Initial commit with a web component skeleton, based on React
- Ported **JClic Repo** to [React](https://reactjs.org/) from [Polymer](https://polymer-library.polymer-project.org/)
- Ported **userLib** to [React](https://reactjs.org/) from original vanilla JavaScript with [Material Design Lite](https://getmdl.io/) and [JQuery](https://jquery.com/) 
