/*!
 *  File    : App.js
 *  Created : 08/01/2019
 *  By      : Francesc Busquets <francesc@gmail.com>
 *
 *  JClic Repo
 *  Static repository of JClic projects
 *  https://projectestac.github.io/jclic-repo
 *  https://clic.xtec.cat/repo
 *
 *  @source https://github.com/projectestac/jclic-repo
 * 
 *  @license EUPL-1.2
 *  @licstart
 *  (c) 2000-2019 Catalan Educational Telematic Network (XTEC)
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
 */

import React, { Component } from 'react';
import Utils from './utils/Utils'

// Theme
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import color_primary from '@material-ui/core/colors/teal';  // was indigo (teal)
import color_secondary from '@material-ui/core/colors/green';  // was pink (green)
import color_error from '@material-ui/core/colors/red';

/**
 * Main Material-UI theme
 */
const theme = createMuiTheme({
  palette: {
    primary: { main: color_primary[500] },
    secondary: { main: color_secondary[500] },
    error: { main: color_error[500] },
  },
  typography: {
    useNextVariants: true,
  },
});


class App extends Component {

  /**
   * Miscellaneous operations to be performed at startup
   */
  componentDidMount() {
    // Load Google's "Roboto" font
    Utils.loadGFont('Roboto');
  }

  render() {
    return (
      <CssBaseline>
        <MuiThemeProvider theme={theme}>
          <div>
            <p>Hello world!</p>
          </div>
        </MuiThemeProvider>
      </CssBaseline>
    );
  }
}

export default App;
