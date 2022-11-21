### v2.1.3 (2022-11-21)
#### Improvements
- Upgraded components
- Replaced the direct call to Java WebStart, which no longer works, with an informative note when clicking the "install project" button.

### v2.1.2 (2022-10-09)
#### Improvements
- Clean up global CSS directives that can affect the rendering of the Google button.

### v2.1.1 (2022-10-04)
#### Improvements
- Upgraded to [React 18](https://reactjs.org/blog/2022/03/29/react-v18.html) and [MUI 5](https://mui.com/).
- React apps can now be used as [Web Components](https://developer.mozilla.org/es/docs/Web/Web_Components) with [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) for better integration on sites with complex styles, like some WordPress themes.
- Upgraded components.
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
