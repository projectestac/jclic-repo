/*!
 *  File    : components/MainLayout.js
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
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import merge from 'lodash/merge';
import { DEFAULT_THEME, DEFAULT_SETTINGS, useSettings } from '../settings';

function MainLayout({ jss, dataSettings, Component }) {

  // Merge default settings with "data-" props
  const settings = useSettings(merge(DEFAULT_SETTINGS, dataSettings));

  // Create a MaterialUI theme with responsive fonts, based on the current settings
  const theme = responsiveFontSizes(createTheme(merge(DEFAULT_THEME, settings.theme)), {});

  // Wrap the main app in a StylesProvider and ThemeProvider
  return (
    <StylesProvider jss={jss}>
      <ThemeProvider theme={theme}>
        <Component settings={settings} />
      </ThemeProvider>
    </StylesProvider>
  );
}

export default MainLayout;
