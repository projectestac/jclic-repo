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
import { jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import { parseStringSettings } from './utils';
import MainLayout from './components/MainLayout';
import Repo from './components/repo/Repo';

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

    // Parse the "data-" props passed to the web component
    const dataSettings = parseStringSettings(this.dataset);

    // Create a pivot element, where ReactDOM will render the app,
    // and initialize it with our specific style (if set)
    const mountPoint = document.createElement('div');
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

    // Render the React component on the pivot element
    ReactDOM.render(
      <MainLayout {...{ jss, dataSettings, Component: Repo }} />,
      mountPoint);
  }
}
