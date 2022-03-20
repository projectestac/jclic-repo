/*!
 *  File    : DOMRenderer.js
 *  Created : 2022-03-11
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

import React from "react";
import ReactDOM from 'react-dom';
import createCache from '@emotion/cache';
import { parseStringSettings } from './utils';
import MainLayout from "./components/MainLayout";
import Repo from "./components/repo/Repo";
import UserLib from "./components/user/UserLib";

/**
 * Renders the required component (main repository or user library) on a specific DOM component 
 * @param {HTMLElement} root - The DOM element where the requested component will be rendered
 * @param {string*} type - Type of component to be rendered. Can be 'repo' (default) or 'user'
 */
export default function DOMRenderer(root, type = 'repo') {

  const dataSettings = parseStringSettings(root.dataset);
  const Component = type === 'user' ? UserLib : Repo;
  const cache = createCache({ key: 'css', prepend: true });
 
  ReactDOM.render(
    <MainLayout {...{ cache, dataSettings, Component }} />,
    root);
}