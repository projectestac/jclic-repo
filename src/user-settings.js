/**
  File    : user-settings.html
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
This element opens a dialog with few input fields allowing users to set:

- The ordering criteria of projects list (by creation date, title or author name)
- The ordering direction: normal (recent projects first, alphabetic order on names) or reversed.
- A flag indicating that JClic projects should always open at full screen, if available.

### Styling

The following custom properties and mixins are available for styling:

Custom property   | Description                          | Default
------------------|--------------------------------------|----------
`--user-settings` | Mixin applied to the settings dialog | {}
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { sharedStyles } from './shared-styles.js';

class UserSettings extends PolymerElement {
  static get template() {
    return html`
    ${sharedStyles}
    <style>
      :host {
        @apply --user-settings;
      }

      paper-material {
        display: block;
        background-color: #fff;
        padding: 10pt;
        margin-top: 10pt;
      }

      #orderMenu {
        margin-bottom: 10pt;
      }

      paper-item {
        cursor: pointer;
      }

      paper-item .iron-selected {
        background-color: var(--dark-primary-color);
      }

      paper-material>h4 {
        margin-top: 0;
        margin-bottom: 8pt;
      }

      paper-listbox {
        background-color: var(--light-primary-color);
      }
    </style>

    <paper-dialog id="dialog" modal="" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2>[[labels.settings]]</h2>
      <paper-dialog-scrollable>
        <paper-material elevation="1">
          <paper-toggle-button checked="{{_openInNewTab}}">
            <span>[[labels.openInNewTab]]</span>
          </paper-toggle-button>
        </paper-material>
        <paper-material elevation="1">
          <paper-toggle-button checked="{{_fullScreen}}" disabled="[[_noFullScreenAvailable]]">
            <span>[[labels.fullScreen]]</span>
          </paper-toggle-button>
        </paper-material>
        <paper-material elevation="1">
          <h4>[[labels.orderBy]]:</h4>
          <paper-listbox id="orderMenu" selected="{{_order}}">
            <template is="dom-repeat" items="[[orderOptions]]">
              <paper-item id="[[item]]">[[_getLabel(labels, item)]]</paper-item>
            </template>
          </paper-listbox>
          <paper-toggle-button checked="{{_orderInv}}">
            <span>[[labels.inverse]]</span>
          </paper-toggle-button>
        </paper-material>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button raised="" dialog-confirm="" on-click="_ok">[[labels.ok]]</paper-button>
        <paper-button raised="" dialog-dismiss="" on-click="_cancel">[[labels.cancel]]</paper-button>
      </div>
    </paper-dialog>
`;
  }

  static get is() { return 'user-settings'; }

  static get properties() {
    return {
      // When checked (and allowed by the system) activities will be displayed at full screen
      _fullScreen: Boolean,
      // When checked, activities will be opened in a separate tab
      _openInNewTab: Boolean,
      // Current value selected in the `order field` listbox
      _order: Number,
      // When checked, items will be ordered from Z to A
      _orderInv: Boolean,
      // Computed field indicating if full screen mode is available on the current browser
      _noFullScreenAvailable: {
        type: Boolean,
        value: () => (!document.webkitFullscreenEnabled && !document.webkitCancelFullScreen && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) ? true : false,
      },
      // Valid options for `field` in `ordering`
      orderOptions: {
        type: Object,
        value: () => ['date', 'title', 'author'],
      },
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `repo-data`:
      // -----------------------------------------------------------------------------------
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
      // Ordering criteria: {field: '', inv: false}
      ordering: {
        type: Object,
        notify: true,
      },
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `jclic-repo`:
      // -----------------------------------------------------------------------------------
      // Flag indicating whether JClic player has to open in full-screen mode or just inside the current window
      fullScreenPlayer: {
        type: Boolean,
        notify: true,
      },
      // Flag indicating whether JClic player has to open in new tab
      openPlayerInNewTab: {
        type: Boolean,
        notify: true,
      },
    };
  }

  // Gets a label for a specific item translated into the current language
  _getLabel(labels, item) {
    return labels ? (labels[item] || item) : '';
  }

  // Read settings from browser's local storage
  readFromLocalStorage() {
    const storage = window.localStorage;
    this.fullScreenPlayer = storage.getItem('fullScreenPlayer') === 'true';
    this.openPlayerInNewTab = storage.getItem('openPlayerInNewTab') !== 'false';
    const field = storage.getItem('ordering.field');
    if (field)
      this.ordering.field = field;
    this.ordering.inv = storage.getItem('ordering.inv') === 'true';
  }

  // Save settings to browser's local storage
  saveToLocalStorage() {
    const storage = window.localStorage;
    storage.setItem('fullScreenPlayer', false || this.fullScreenPlayer);
    storage.setItem('openPlayerInNewTab', false || this.openPlayerInNewTab);
    storage.setItem('ordering.field', this.ordering.field || '');
    storage.setItem('ordering.inv', false || this.ordering.inv);
  }

  // Opens the dialog
  open() {
    this._fullScreen = this.fullScreenPlayer;
    this._openInNewTab = this.openPlayerInNewTab;
    this._order = (this.ordering && this.ordering.field) ? this.orderOptions.indexOf(this.ordering.field) : 0;
    this._orderInv = this.ordering ? this.ordering.inv || false : false;
    this.$.dialog.open();
  }

  // Caalled when the user cancels the dialog
  _cancel() {
    this.$.dialog.close();
  }

  // Called when the user clicks on OK
  _ok() {
    this.fullScreenPlayer = this._fullScreenEnabled && this._fullScreen ? true : false;
    this.openPlayerInNewTab = this._openInNewTab;
    this.ordering.field = this.orderOptions[this._order];
    this.ordering.inv = this._orderInv;
    this.notifyPath('ordering');
    this.$.dialog.close();
    this.saveToLocalStorage();
  }
}

window.customElements.define(UserSettings.is, UserSettings);
