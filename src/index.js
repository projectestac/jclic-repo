/*!
 *  File    : index.js
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

/* global VERSION */

import { getWebComponentClass } from './ReactWebComponent';
import MainLayout from './components/MainLayout';
import Repo from './components/repo/Repo';
import UserLib from './components/user/UserLib';
import DOMRenderer from './DOMRenderer';

// Log app version from package.json
// Const VERSION is intitialized by Webpack
console.log(`JClicRepo version ${VERSION}`);

// Define web components
customElements.define('jclic-repo', getWebComponentClass(MainLayout, Repo));
customElements.define('jclic-user-lib', getWebComponentClass(MainLayout, UserLib));

// Define the global DOMRenderer function
window.JClicRepoDOMRenderer = DOMRenderer;
