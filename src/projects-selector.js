/**
  File    : projects-selector.html
  Created : 18/04/2017
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
  (c) 2000-2019 Catalan Educational Telematic Network (XTEC)

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
This component provides user input controls for searching specific content in the repository of JClic projects.
The search criteria is dynamically stored in a compound object called `filter`, usually provided by `repo-data`.
Changes in this object should trigger a refresh in the main projects showcase.

### Styling

The following custom properties and mixins are available for styling:

Custom property       | Description                          | Default
----------------------|--------------------------------------|----------
`--search-button`     | Mixin applied to the "Search" button | `{}`
`--projects-selector` | Mixin applied to the selector        | `{}`
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import './shared-icons.js';

export default class ProjectsSelector extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        padding: 1em;
        @apply --projects-selector;
      }

      paper-dropdown-menu-light {
        width: 100%;
      }

      paper-item {
        min-height: 2em;
        cursor: pointer;        
      }

      #searchBtn {
        margin-top: 15px;
        margin-left: 0;
        background-color: var(--default-primary-color);
        color: var(--text-primary-color);
        @apply --search-button;
      }

      h3 {
        color: var(--secondary-text-color);
      }
    </style>

    <h3>[[labels.searchTitle]]</h3>

    <paper-dropdown-menu-light id="dropLang" label="[[labels.languages]]">
      <paper-listbox slot="dropdown-content" class="dropdown-content" on-iron-select="readInputFieldValues">
        <template is="dom-repeat" items="[[selectOptions.languages]]">
          <paper-item data-type="language" data-val\$="[[item.val]]">[[item.text]]</paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu-light>

    <paper-dropdown-menu-light id="dropSubj" label="[[labels.subjects]]">
      <paper-listbox slot="dropdown-content" class="dropdown-content" on-iron-select="readInputFieldValues">
        <template is="dom-repeat" items="[[selectOptions.subjects]]">
          <paper-item data-type="subject" data-val\$="[[item.val]]">[[item.text]]</paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu-light>

    <paper-dropdown-menu-light id="dropLev" label="[[labels.levels]]">
      <paper-listbox slot="dropdown-content" class="dropdown-content" on-iron-select="readInputFieldValues">
        <template is="dom-repeat" items="[[selectOptions.levels]]">
          <paper-item data-type="level" data-val\$="[[item.val]]">[[item.text]]</paper-item>
        </template>
      </paper-listbox>
    </paper-dropdown-menu-light>

    <paper-input id="title" class="textInput" label="[[labels.title]]" on-change="readInputFieldValues"></paper-input>
    <paper-input id="author" class="textInput" label="[[labels.author]]" on-change="readInputFieldValues"></paper-input>
    <paper-input id="description" class="textInput" label="[[labels.description]]" on-change="readInputFieldValues"></paper-input>

    <paper-button raised="" class="search" on-click="_clickOnSearchBtn" id="searchBtn">
      <iron-icon icon="search" class="small" style="margin-right: 4px;"></iron-icon>
      <span>[[labels.search]]</span>
    </paper-button>
`;
  }

  static get is() { return 'projects-selector'; }

  static get properties() {
    return {
      // Flag to disable the main event listener while input fields are programatically updated
      _updatingFields: {
        type: Boolean,
        value: false,
      },
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `repo-data`:
      // -----------------------------------------------------------------------------------
      // Current set of labels, titles and messages, translated into the current app language.
      labels: Object,
      // Current choices of languages, subjects and levels, expresed in the current language and used to filter the main project list.
      selectOptions: Object,
      // Current set of filtering and searching options.
      filter: {
        type: Object,
        notify: true,
      },
    };
  }

  static get observers() {
    return [
      '_checkFullTextEnabled(selectOptions)',
    ];
  }

  // Enables or disables full text search input field
  _checkFullTextEnabled(selectOptions) {
    // Show/hide the description field
    if (selectOptions && selectOptions.fullTextEnabled)
      this.$.description.classList.remove('hidden');
    else
      this.$.description.classList.add('hidden');
  }

  // Checks if the content of the provided object `f` is equivalent to the current filter settings
  // Returns `true` when `this.filter` has not been created, or when the value of any of its fields differs from the value of the same field in `f`
  filterDiffers(f) {
    return !this.filter || ['language', 'subject', 'level', 'title', 'author', 'description'].find(ff => this.filter[ff] !== f[ff]);
  }

  // Click on `search` button force a filter update
  _clickOnSearchBtn() {
    this.readInputFieldValues(true);
  }

  // Reads the values stored in the form controls, and updates `this.flter` if needed
  readInputFieldValues(forceFilterUpdate) {
    if (!this._updatingFields) {
      const f = {
        language: this.$.dropLang.contentElement.selectedItem ? this.$.dropLang.contentElement.selectedItem.dataset.val : '*',
        subject: this.$.dropSubj.contentElement.selectedItem ? this.$.dropSubj.contentElement.selectedItem.dataset.val : '*',
        level: this.$.dropLev.contentElement.selectedItem ? this.$.dropLev.contentElement.selectedItem.dataset.val : '*',
        title: this.$.title.value || '',
        author: this.$.author.value || '',
        description: this.$.description.value || '',
      };
      if (forceFilterUpdate === true || this.filterDiffers(f))
        this.filter = f;
    }
  }

  // Sets a new value for `this.filter` and updates the form controls accordingly
  setFilter(f) {
    if (this.filterDiffers(f)) {
      // Disable event listener flag
      this._updatingFields = true;
      // Fill-in input fields with the new values
      this.$.dropLang.contentElement.selected = this.selectOptions.findIndex('languages', f.language || '*');
      this.$.dropSubj.contentElement.selected = this.selectOptions.findIndex('subjects', f.subject || '*');
      this.$.dropLev.contentElement.selected = this.selectOptions.findIndex('levels', f.level || '*');
      this.$.title.value = f.title || '';
      this.$.author.value = f.author || '';
      this.$.description.value = f.description || '';
      // Update `this.filter`
      this.filter = f;
      // Re-enable event listener flag
      this._updatingFields = false;
    }
  }
}

window.customElements.define(ProjectsSelector.is, ProjectsSelector);
