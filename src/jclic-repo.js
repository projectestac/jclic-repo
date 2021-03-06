/**
  File    : jclic-repo.html
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
This is the shell component of the basic JClic-repo app.

The component contains an `app-drawer-layout` with three main zones:
- An `app-drawer` placed at left, containing a `projects-selector` and an `info-pages` component.
- An `app-header` containing an `app-toolbar` with title and language selector
- The main showcase of JClic projects, presented as small `project-card` components into a `projects-list`.

Some other functional components are also declared and included at this level:
- A `paper-spinner-lite`, used to display an animation while waiting for data
- A `big-project-card` where the project's full description will be shown
- An `user-settings` dialog
- A `repo-data` component, without any graphic element, responsible of data retrieval and orchestration.
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import './shared-icons.js';
import './repo-data.js';
import './projects-list.js';
import './projects-selector.js';
import './big-project-card.js';
import './user-settings.js';
import './info-pages.js';

export default class JClicRepo extends PolymerElement {
  static get template() {

    return html`
    <style>
       :host {
        display: block;
      }

      app-drawer-layout:not([narrow]) [drawer-toggle] {
        display: none;
      }

      app-header {
        color: var(--text-primary-color);
        background-color: var(--default-primary-color);
      }

      app-header paper-icon-button {
        --paper-icon-button-ink-color: var(--text-primary-color);
      }

      #langSelector {
        font-size: 12pt;
      }

      .langItem {
        color: var(--text-primary-color);
        text-decoration: none;
        padding: 0 0.3em;
        border-right: 1pt solid;
      }

      .langItem:last-of-type {
        border-right: none;
        padding-right: 0;
      }

      .currentLang {
        font-weight: 800;
      }

      /* Workaround to avoid the default -120px bottom position in app-drawer: */
      #drawer {
        bottom: 0;
      }

      .footer {
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        width: 100%;
      }

      .numProjects {
        font-size: 10pt;
        margin: 8px;
        text-align: right;
        flex-grow: 2;
      }

      #spinner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      #mainContainer {
        background-color: var(--projects-list-background-color);
      }
    </style>

    <app-drawer-layout fullbleed="">

      <!-- Drawer content -->
      <app-drawer id="drawer" slot="drawer">
        <projects-selector id="selector" labels="[[labels]]" select-options="[[selectOptions]]" filter="{{filter}}"></projects-selector>
        <div class="footer">
          <paper-icon-button id="settingsBtn" icon="settings" title="[[labels.settings]]" on-click="_setUserSettings"></paper-icon-button>
          <paper-icon-button id="infoBtn" icon="info" title="[[labels.about]]" on-click="_displayInfo"></paper-icon-button>
          <span class="numProjects">[[projects.length]] [[labels.projects]]</span>
        </div>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout id="mainContainer" has-scrolling-region="">
        <!-- Title bar -->
        <app-header slot="header" condenses="" reveals="" effects="waterfall">
          <app-toolbar>
            <paper-icon-button icon="menu" title="[[labels.searchTitle]]" drawer-toggle=""></paper-icon-button>
            <div main-title="">[[labels.mainTitle]]</div>
            <div id="langSelector">
              <template is="dom-repeat" items="[[settings.languages]]"><a href="#" class="langItem" id="[[item.id]]" title="[[item.name]]" on-click="_clickOnLang">[[item.id]]</a></template>
            </div>
          </app-toolbar>
        </app-header>
        <iron-pages attr-for-selected="page" selected="[[page]]">
          <section page="projects">
            <!-- Projects showcase -->
            <projects-list name="projects" main-container="[[_getMainContainer()]]" repo-root="[[repoRoot]]" projects="[[projects]]" labels="[[labels]]" on-play="playProject" on-show="showProject"></projects-list>
          </section>
          <section page="info">
            <!-- Info pages -->
            <info-pages id="info" settings="[[settings]]" lang="[[lang]]" labels="[[labels]]" on-close="_closeInfo"></info-pages>
          </section>
        </iron-pages>
      </app-header-layout>

    </app-drawer-layout>

    <!-- Animated image displayed while waiting for data -->
    <paper-spinner-lite active="true" id="spinner" alt="[[labels.loading]]"></paper-spinner-lite>

    <!-- Project card, dynamically filled on demand with the current project data -->
    <big-project-card id="bigPrj" lang="[[lang]]" labels="[[labels]]" repo-root="[[repoRoot]]" base-url="[[baseUrl]]" settings="[[settings]]" on-iron-overlay-opened="_dlgOpened" on-iron-overlay-closed="_projectClosed" on-play="playProject"></big-project-card>

    <!-- Dialog used to set user perferences about ordering and full-screen -->
    <user-settings id="userSettings" labels="[[labels]]" ordering="{{ordering}}" full-screen-player="{{fullScreenPlayer}}"></user-settings>

    <!-- Auxiliary element used for miscellaneous operations related to the repository data -->
    <repo-data id="repo" repo-root="{{repoRoot}}" settings="{{settings}}" lang="[[lang]]" labels="{{labels}}" select-options="{{selectOptions}}" projects="{{projects}}" filter="{{filter}}" ordering="{{ordering}}"></repo-data>
`;
  }

  static get is() { return 'jclic-repo'; }

  static get properties() {
    return {
      // Parametres passed via the `query` section of the current URL
      params: {
        type: Object,
        value: null,
      },
      // Current two-letter language code selected by the user
      lang: {
        type: String,
        notify: true,
      },
      // Flag indicating whether JClic player has to open in full-screen mode or just inside the current window
      fullScreenPlayer: {
        type: Boolean,
        value: false,
      },
      // Miscellaneous options passed to JClic player
      playerOptions: {
        type: Object,
        value: {},
      },
      // URL used as a base for absolute references to project's components
      baseUrl: {
        type: String,
        computed: '_getBaseUrl(settings)',
      },
      // Relative path of current project
      currentProjectId: String,
      // Main page to be display on the main app area. Valid options are: `projects` and `info`
      page: {
        type: String,
        value: 'projects',
      },
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `repo-data`:
      // -----------------------------------------------------------------------------------
      // Relative path to the folder where the JClic projects of this repository are located
      repoRoot: String,
      // Main settings of the app, loaded at startup from `main.json`
      settings: Object,
      // Current choices of languages, subjects and levels, expresed in the current language and used to filter the main project list
      selectOptions: Object,
      // Current set of filtering and searching options
      filter: Object,
      // Current ordering options
      ordering: Object,
      // Ordered array containing the colection of projects matching the current filter settings
      projects: Object,
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
    };
  }

  static get observers() {
    return [
      '_checkPreferredLanguage(settings)',
      '_checkParams(settings, params)',
      '_langSelected(lang)',
      '_queryChanged(currentProjectId, filter, params, lang)',
    ];
  }

  // Used to pass `mainContainer` to `projects-list` (needed for dynamic scrolling)
  _getMainContainer() {
    return this.$.mainContainer;
  }

  // Gets the URL used as a base for absolute links to projects
  _getBaseUrl() {
    const path = window.location.pathname;
    return `${window.location.origin}${path.substring(0, path.lastIndexOf('/'))}/`;
  }

  // Triggered when the user chooses a language
  _clickOnLang(e) {
    e.preventDefault();
    this.lang = this.settings.languages[e.model.index].id;
    this._queryChanged();
    return false;
  }

  // Updates the language selector, displaying in bold type the current one
  _langSelected(lang) {
    lang = lang || this.lang;
    if (lang) {
      this.$.langSelector.querySelectorAll('.langItem').forEach(l => {
        if (l.id === lang)
          l.classList.add('currentLang');
        else
          l.classList.remove('currentLang');
      });
    }
  }

  // Triggered by settings button
  _setUserSettings() {
    this.$.userSettings.open();
  }

  // Triggered by info button
  _displayInfo() {
    const search = `?lang=${this.lang}&page=info`;
    if (search !== window.location.search)
      window.history.pushState({}, '', `index.html${search}`);
    this.page = 'info';
  }

  // Called when the user closes the info pages
  _closeInfo() {
    this.page = 'projects';
    this._queryChanged();
  }

  // Opens a big project card with a specific project data
  showProject(path) {
    // Check if `path` is a custom event fired by a project-card
    if (path instanceof CustomEvent)
      path = path.detail.path;
    this.$.spinner.active = true;
    this.$.repo.loadProject(path).then(project => {
      this.$.spinner.active = false;
      this.$.bigPrj.project = project;
      this.$.bigPrj.$.dialog.open();
      this.currentProjectId = project.path;
      document.querySelector('title').innerHTML = `${this.labels.mainTitle}: ${project.title}`;
    }).catch(err => {
      this.$.spinner.active = false;
      console.log(`Error loading project ${path}: ${err}`);
    });
  }

  // Called when `big-project-card` is closed
  _projectClosed() {
    this.currentProjectId = null;
    this._queryChanged();
    document.querySelector('title').innerHTML = this.labels.mainTitle;
  }

  // Launches the project activities
  playProject(prj) {
    // Check if `prj` is a custom event fired by a `project-card` or a `big-project-card`
    if (prj instanceof CustomEvent) {
      prj = prj.detail.project;
      this.$.bigPrj.close();
    }
    // Open "index.html" in new tab:
    const prjUrl = `${this.repoRoot}/${prj.path}/${prj.mainFile}`;
    const indexUrl = prjUrl.replace(/\/[^\/]*$/, '/index.html');
    // TODO: Add playerOptions to indexUrl as query string
    window.open(indexUrl, '_BLANK');

    // Update query
    this.currentProjectId = prj.path;
    this._queryChanged();
  }

  // called when a new dialog opens
  _dlgOpened() {
    // Adjust the real size of dialogs even after its content has been modified
    // setTimeout(() => dispatchEvent(new Event('resize')), 100);
    setTimeout(() => this.$.bigPrj.$.dialog.playAnimation({}), 100);
  }

  // Called by Polymer when all components have been initialized
  ready() {
    super.ready();

    // Read settings from local storage
    this.$.userSettings.readFromLocalStorage();

    // Read the parameters passed on the `search` section of current URL, if any
    // From: http://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
    this.params = window.location.search ?
      window.JSON.parse('{"' + window.decodeURI(window.location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}') :
      {};
    if (this.params.logLevel)
      this.playerOptions.logLevel = this.params.logLevel;
    if (this.params.page && this.params.page === 'info')
      this._displayInfo();
  }

  // Try to determine the user's preferred language
  _checkPreferredLanguage(settings) {
    if (settings && settings.languages && settings.languages.length) {
      // Stop waiting animation, if already running
      this.$.spinner.active = false;
      // Create an array to store possible values
      var tries = [];
      // If "lang=" was programatically set, check it
      if (this.lang)
        tries.push(this.lang);
      // If "lang=" was on location.search, check it
      if (this.params && this.params.lang)
        tries.push(this.params.lang);
      // Add user's preferred languages, if any
      if (window.navigator.languages)
        tries = tries.concat(window.navigator.languages);
      // Add the navigator main language, if defined
      if (window.navigator.language)
        tries.push(window.navigator.language);
      this.lang = (tries.find(v => settings.languages.find(l => v.indexOf(l.id) === 0) !== undefined) || 'en').substr(0, 2);

      // Workaround to set/unset the "langSelected" class to langItems in #langSelector when dom-repeat finishes
      var thisRepo = this;
      setTimeout(() => thisRepo._langSelected(), 100);
    }
  }

  // Opens the big project card of the project passed as a parameter in the query section of the current URL
  _checkParams(settings, params) {
    if (settings && params) {
      if (params.prj) {
        this.showProject(params.prj);
        params.prj = null;
      }
      else if (params.language || params.subject || params.level || params.title || params.author) {
        this.$.selector.setFilter({
          language: params.language || '*',
          subject: params.subject || '*',
          level: params.level || '*',
          title: params.title || '',
          author: params.author || '',
        });
        params.language = null;
        params.subject = null;
        params.level = null;
        params.title = null;
        params.author = null;
        this._queryChanged();
      }
      params.processed = true;
    }
  }

  // Updates the current window URL with the params needed to reproduce current state
  _queryChanged() {
    if (this.lang && this.params && this.params.processed) {
      this.page = 'projects';
      let search = `?lang=${this.lang}`;
      if (this.currentProjectId)
        search = `${search}&prj=${this.currentProjectId}`;
      else if (this.filter) {
        ['language', 'subject', 'level', 'title', 'author'].forEach(f => {
          if (this.filter[f] && this.filter[f] !== '*')
            search = `${search}&${f}=${encodeURIComponent(this.filter[f])}`;
        });
      }
      if (search !== window.location.search)
        window.history.pushState({}, '', `index.html${search}`);
    }
  }
}

window.customElements.define(JClicRepo.is, JClicRepo);
