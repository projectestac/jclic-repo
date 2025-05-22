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
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { CacheProvider } from '@emotion/react';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { DEFAULT_SETTINGS, useSettings, initFonts } from '../settings';

function MainLayout({ cache, dataSettings, Component }) {

  // Merge default settings with "data-" props
  const settings = useSettings(deepmerge(DEFAULT_SETTINGS, dataSettings));

  // Initialize needed fonts
  initFonts(settings);

  // Create a MaterialUI theme with responsive fonts, based on the current settings
  const theme = responsiveFontSizes(createTheme(settings.theme), {});

  return (
    <HelmetProvider>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <Component settings={settings} />
        </ThemeProvider>
      </CacheProvider>
    </HelmetProvider>
  );
}

export default MainLayout;
