/*!
 *  File    : JClicRepo.js
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

import React from 'react';
import ReactDOM from 'react-dom';
import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { create } from 'jss';
import RepoApp from './RepoApp';
import merge from 'lodash/merge';
import { parseStringSettings } from './utils';
import { DEFAULT_THEME, DEFAULT_SETTINGS } from './settings';
import { i18nInit } from './i18n';

/**
 * Encloses the main React app into a Web Component with Shadow DOM
 * 
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/Web_Components
 * 
 * Based on RemedialBear and Shawn Mclean answers on StackOveflow:
 * https://stackoverflow.com/a/57128971/3588740
 * https://stackoverflow.com/a/56516753/3896566
 * 
 */
export default class JClicRepo extends HTMLElement {

  connectedCallback() {

    // Parse settings and init language tool and fonts
    const settings = merge(DEFAULT_SETTINGS, parseStringSettings(this.dataset));
    i18nInit(settings);

    // Create a pivot element, where ReactDOM will render the app,
    // and initialize it with our specific style (if set)
    const mountPoint = document.createElement('span');
    const styleAttr = this.getAttribute('style');
    if (styleAttr)
      mountPoint.setAttribute('style', styleAttr);

    // Create a Shadow DOM tree and append the pivot element to it
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(mountPoint);

    // Use the pivot element to create a JSS configuration
    const jss = create({
      ...jssPreset(),
      insertionPoint: mountPoint,
    });

    // Create a MaterialUI theme with responsive fonts, based on current settings
    const theme = responsiveFontSizes(createTheme(merge(DEFAULT_THEME, settings.theme)), {});

    // Wrap the main app in a StylesProvider and ThemeProvider, and render the bundle on the pivot element
    ReactDOM.render(
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <RepoApp {...{ settings }} />
        </ThemeProvider>
      </StylesProvider>,
      mountPoint);
  }
}
