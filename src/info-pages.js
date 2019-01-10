/**
  File    : info-pages.html
  Created : 24/05/2017
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

/*
This component shows information about the JClic project in different languages.

The real content displayed in this page is stored on the `info` section at `main.json`
There should be one array of blocks for each supported language.
Each block has a title, an optional icon and link, and one or more paragraphs with HTML content.

### Styling

The following custom properties and mixins are available for styling:

Custom property   | Description                       | Default
------------------|-----------------------------------|----------
`--info-pages`    | Mixin applied to the info pages   | {}

*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './social-buttons.js';
import { sharedStyles } from './shared-styles.js';

class InfoPages extends PolymerElement {
  static get template() {
    return html`
    ${sharedStyles}
    <style>
       :host {
        font-size: 11pt;
        @apply --info-pages;
      }

      paper-material {
        display: block;
        position: relative;
        margin: 10pt;
        padding: 10pt;
        padding-left: 64pt;
        background-color: var(--primary-background-color);
        color: var(--primary-text-color);
      }

      h2 {
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      .appIcon {
        position: absolute;
        top: 0;
        left: 0;
        margin: 10px;
        width: 64px;
      }

      #footer {
        margin-left: 10pt;
      }

      #closeBtn {
        position: absolute;
        right: 0;
      }
    </style>

    <template id="main" is="dom-repeat" items="[[info]]">
      <paper-material elevation="2">
        <h2>[[item.title]]</h2>
        <template is="dom-if" if="[[item.icon]]">
          <a href="[[item.link]]"><img src="[[settings.infoImgBasePath]]/[[item.icon]]" alt="[[item.title]]" class="appIcon"></a>
        </template>
        <template is="dom-repeat" items="[[item.text]]">
          <p data-raw\$="[[item]]">[[item]]</p>
        </template>
      </paper-material>
    </template>

    <div id="footer" class="horizontal layout">
      <social-buttons settings="[[settings]]" url="[[_getUrl()]]" imgurl="[[_getImgUrl()]]" text="[[labels.mainTitle]]" labels="[[labels]]" lang="[[lang]]"></social-buttons>
      <paper-icon-button id="closeBtn" icon="close" title="[[labels.close]]" on-click="_close"></paper-icon-button>
    </div>
`;
  }

  static get is() { return 'info-pages'; }

  static get properties() {
    return {
      // Current set of texts for info-pages, translated into the current app language
      info: Array,
      //
      // ----------------------------------------------------------------
      // Properties used in this component but initialized in `repo-data`
      // ----------------------------------------------------------------
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
      // Main settings of the app, loaded at startup from `main.json`
      settings: Object,
      //
      // -----------------------------------------------------------------
      // Properties used in this component but initialized in `jclic-repo`
      // -----------------------------------------------------------------
      // Current two-letter language code selected by the user
      lang: String,
    };
  }

  static get observers() {
    return [
      '_updateContent(settings, lang)',
    ];
  }

  // Sets the `info` array based on the current app language
  _updateContent(settings, lang) {

    this.info = settings && settings.info && lang && settings.info[lang] ? settings.info[lang] : [];

    // Skip this step when `info` is empty
    if (this.info.length) {
      // Force synchronous rendering of the main `dom-repeat` template
      this.$.main.render();
      // Update the content of paragraphs with anchor links and other HTML tags filtered out by Polymer
      // (each "p" element has its real HTML content stored in a "data-raw" attribute)
      const p = this.root.querySelectorAll('p');
      for (let i = 0; i < p.length; i++)
        if (p[i].dataset.raw)
          p[i].innerHTML = p[i].dataset.raw;
    }
  }

  // Gets the URL used as a base for absolute links to images and other sources
  _getBaseUrl() {
    let path = window.location.pathname;
    const p = path.lastIndexOf('/');
    path = path.substring(0, p) + '/';
    return window.location.origin + path;
  }

  // URI of this info page (used in `social-buttons`)
  _getUrl() {
    return `${this._getBaseUrl()}index.html?page=info`;
  }

  // The big JClic logo (used in `social-buttons`)
  _getImgUrl() {
    return `${this._getBaseUrl()}images/manifest/icon-512x512.png`;
  }

  // Fires a custom `close` event
  _close(ev) {
    this.dispatchEvent(new CustomEvent('close'), ev);
  }
}

window.customElements.define(InfoPages.is, InfoPages);
