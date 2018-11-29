/**
  File    : shared-styles.html
  Created : 13/04/2017
  By      : Francesc Busquets <francesc@gmail.com>

  JClic Repo
  Static repository of JClic projects
  https://projectestac.github.io/jclic-repo
  https://clic.xtec.cat/repo

  @source https://github.com/projectestac/jclic-repo

  Based on "Polymer Starter Kit v2.0"
    https://www.polymer-project.org
    Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
    http://polymer.github.io/LICENSE.txt

  @license EUPL-1.1
  @licstart
  (c) 2000-2017 Catalan Educational Telematic Network (XTEC)

  Licensed under the EUPL, Version 1.1 or -as soon they will be approved by
  the European Commission- subsequent versions of the EUPL (the "Licence");
  You may not use this work except in compliance with the Licence.

  You may obtain a copy of the Licence at:
  https://joinup.ec.europa.eu/software/page/eupl

  Unless required by applicable law or agreed to in writing, software
  distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  Licence for the specific language governing permissions and limitations
  under the Licence.
  @licend
*/

/* Styles sherd by all components */

//import '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/polymer-element.js';

// Colors obtained from https://www.materialpalette.com (excluding "paper-input")
/**
 *  Unused mixins (leave it commented while not used)
 * --project-card-play-button: {};
 * --search-button: {};
 * --projects-list: {};
 * --project-card: {};
 * --project-card-title: {};
 * --project-card-language-box: {};
 * --project-card-author: {};
 * --big-project-card: {};
 * --project-share: {};
 * --social-buttons: {};
 * --projects-selector: {};
 * --jclic-player {};
 * --user-settings {};
 * --info-pages {};
 */

export const sharedStyles = html`
<style>
  .wrap {
    white-space: normal;
  }

  .hidden {
    display: none;
  }
       
  :root {
    --dark-primary-color: #1976D2;
    --default-primary-color: #2196F3;
    --light-primary-color: #BBDEFB;
    --text-primary-color: #FFFFFF;
    --accent-color: #536DFE;
    --primary-background-color: #F8F8F8;
    --primary-text-color: #212121;
    --secondary-text-color: #757575;
    --disabled-text-color: #BDBDBD;
    --divider-color: #BDBDBD;
    --error-color: red;

    --drawer-menu-color: #f1f1f1;
    --drawer-border-color: 1px solid #ccc;
    --drawer-toolbar-border-color: 1px solid rgba(0, 0, 0, 0.22);

    --paper-menu-background-color: #f1f1f1;
    --menu-link-color: #111;

    --app-drawer-width: 180pt;
    --paper-dialog-background-color: var(--paper-menu-background-color);
    --paper-listbox-background-color: #eee;

    --paper-dialog-scrollable: {
      padding-bottom: 10px;
    };

    --project-card-content-height: 170px;
    --projects-list-background-color: var(--paper-menu-background-color);
  }
</style>
`;
