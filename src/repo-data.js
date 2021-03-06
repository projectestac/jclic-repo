/**
  File    : repo-data.html
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
This component encapsulates the main data operations needed by JClic Repo sites.

The `iron-ajax` component loads the file "main.json" at startup. This file contains information about:

- The list of supported languages (currently `en`, `ca` and `es`)
- Messages and label texts translated into the supported languages
- The lists of available options for subjects, educational levels and project languages, also translated into the supported languages.
- The location of the project's repository main folder, relative to the current location, and the file name of the repository index (usually `projects.json`)

The repository index is also loaded using an `iron-request`, and stored into `_allProjects`.

The public list of currently selected projects is exposed through the public variable `projects`.

Filtering and ordering criteria is stored in special objects called `filter` and `ordering`
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-ajax/iron-request.js';

// import { unidecode } from 'unidecode';
// Simplified version of 'unidecode', thanks to https://stackoverflow.com/a/37511463:
const unidecode = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default class RepoData extends PolymerElement {
  static get template() {
    return html`
    <!-- This component automatically loads \`main.json\` into \`this.settings\`, triggering the actions needed to fill-up the repository -->
    <iron-ajax auto="" url="main.json" handle-as="json" last-response="{{settings}}"></iron-ajax>
`;
  }

  static get is() { return 'repo-data'; }

  static get properties() {
    return {
      // Main settings of the app, loaded at startup from `main.json`
      settings: {
        type: Object,
        observer: '_settingsLoaded',
        notify: true,
      },
      // Current set of labels, titles and messages, translated into the current app language
      labels: {
        type: Object,
        value: {},
        notify: true,
      },
      // Current choices of languages, subjects and levels (expresed in the current language), used to filter the main project list
      selectOptions: {
        type: Object,
        value: () => { return { languages: [], subjects: [], levels: [] }; },
        notify: true,
      },
      // Array containing the full project list of the repository, for internal use only
      _allProjects: {
        type: Array,
      },
      // Last query launched to the full-text search engine
      _lastDescription: {
        type: String,
        value: '',
      },
      // List of project paths matching the last query launched to the full-text search engine
      _selectedPaths: {
        type: Array,
        value: null,
      },
      // Ordered array containing the colection of projects matching the current filter settings
      projects: {
        type: Array,
        value: () => [],
        notify: true,
      },
      // Current set of filtering and searching options
      filter: {
        type: Object,
        value: () => { return { language: '', subject: '', level: '', title: '', author: '', description: '' }; },
        observer: '_filterChanged',
        notify: true,
      },
      // Current ordering options
      ordering: {
        type: Object,
        value: () => { return { field: '', inv: false }; },
        observer: '_orderingChanged',
        notify: true,
      },
      // Relative path to the folder where the JClic projects of this repository are located
      repoRoot: {
        type: String,
        notify: true,
      },
    };
  }

  /**
  Other variables used in this component but declared and initialized by `jclic-repo`:

  Variable name   | Type   | Description
  ----------------|--------|------------------------------------------------------
  `lang`          | String | Current two-letter language code selected by the user
  **/

  static get observers() {
    return [
      '_updateLang(settings, lang)',
    ];
  }

  // Updates `labels`, and `selectOptions` to reflect the current app language
  _updateLang(settings, lang) {
    this.labels = settings && settings.labels && lang && settings.labels[lang] ? settings.labels[lang] : {};
    this.selectOptions = {
      languages: (settings && settings.actLanguages && settings.actLanguages[lang]) ? settings.actLanguages[lang] : [],
      subjects: (settings && settings.actSubjects && settings.actSubjects[lang]) ? settings.actSubjects[lang] : [],
      levels: (settings && settings.actLevels && settings.actLevels[lang]) ? settings.actLevels[lang] : [],
      findIndex: (type, value) => this.selectOptions[type].findIndex(l => l.val === value),
      fullTextEnabled: settings && settings.searchService ? true : false,
    };
    this.labels.selectOptions = this.selectOptions;
  }

  // Called when settings are loaded for first time
  _settingsLoaded() {
    if (this.settings && this.settings.index) {
      // Set the base path for all projects
      this.repoRoot = this.settings.index.path;
      // Load `projects.json`
      document.createElement('iron-request').send({
        url: `${this.repoRoot}/${this.settings.index.file}`,
        handleAs: 'json',
      }).then(xhr => {
        return this._projectsLoaded(xhr.response);
      }).catch(err => console.log('Error loading projects.json:', err));
    }
  }

  // Called when the index of the project's repository has been loaded
  _projectsLoaded(projects = []) {
    // Check and update projects
    projects.forEach(prj => {
      // Set default values to undefined properties:
      prj.langCodes = prj.langCodes || [];
      prj.areaCodes = prj.areaCodes || [];
      prj.levelCodes = prj.levelCodes || [];
      prj.title = prj.title || '';
      prj.author = prj.author || '';
      prj.date = prj.date || '00/00/00';

      // Create two _lowercase plain text_ members, without accents nor special characters, used for filtering and sorting:
      prj.titleCmp = unidecode(prj.title).trim().toLowerCase();
      prj.authorCmp = unidecode(prj.author).trim().toLowerCase();

      // Build a simple, sortable string for the project's date
      // Years beggining with '9' are computed as 199x, otherwise are 20xx
      // Also, add a random number to avoid false equivalences when ordering
      const d = prj.date.split('/');
      prj.dateCmp = (d.length === 3 ? `${d[2] && d[2].charAt(0) === '9' ? '19' : '20'}${d[2]}${d[1]}${d[0]}` : '00000000') + Math.floor(10 + Math.random() * 90);
    });

    // Initialize the main `projects` array
    this._allProjects = projects;
    this._applyFilter(this.filter || {}, null);
  }

  // Loads a specific `project.json` file, returning a Promise
  loadProject(path) {
    //const thisRepo = this;
    return document.createElement('iron-request').send({
      url: `${this.repoRoot}/${path}/project.json`,
      handleAs: 'json',
    }).then(xhr => {
      const project = xhr.response;
      project.path = path;
      if (project.relatedTo)
        project.relatedTitles = project.relatedTo.map(p => this._getProjectTitle(p));
      return project;
    }).catch(err => {
      console.log(`Error loading project: ${err}`);
    });
  }

  // Returns the project title for a specific path
  _getProjectTitle(path) {
    const prj = (this._allProjects && path) ? this._allProjects.find(p => p.path === path) : null;
    var title = prj ? prj.title : path;
    if (prj && title.indexOf('(') < 0 && prj.langCodes && prj.langCodes.length > 0)
      title = `${title} (${prj.langCodes.join(', ')})`;
    return title;
  }

  // Filters the list of current projects according to the criteria established in `filter`
  _filterChanged(f) {
    if (this.settings && this.settings.searchService && f.description && f.description !== this._lastDescription) {
      this._lastDescription = f.description;
      document.createElement('iron-request').send({
        url: `${this.settings.searchService}?lang=${this.lang}&method=boolean&q=${encodeURIComponent(f.description)}`,
        handleAs: 'json',
      }).then(xhr => {
        this._selectedPaths = xhr.response;
        this._applyFilter(f, this._selectedPaths);
      }).catch(err => console.log(`Error in full-text query: ${err}`));
      return;
    }
    else if (this._lastDescription && !f.description) {
      this._lastDescription = '';
      this._selectedPaths = null;
    }
    this._applyFilter(f, this._selectedPaths);
  }

  _applyFilter(f, selection) {
    this.projects = (this._allProjects || []).filter(item => {
      return (selection === null || selection.indexOf(item.path) >= 0) &&
        (!f.language || f.language === '*' || item.langCodes.indexOf(f.language) >= 0) &&
        (!f.subject || f.subject === '*' || item.areaCodes.indexOf(f.subject) >= 0) &&
        (!f.level || f.level === '*' || item.levelCodes.indexOf(f.level) >= 0) &&
        (!f.title || !f.title.trim() || item.titleCmp.indexOf(unidecode(f.title.trim()).toLowerCase()) >= 0) &&
        (!f.author || !f.author.trim() || item.authorCmp.indexOf(unidecode(f.author.trim()).toLowerCase()) >= 0);
    });
  }

  // Sorts the `_allProjects` elements according to the current ordering criteria
  _orderingChanged(ord) {
    if (this._allProjects) {
      const field = ord ? ord.field : '';
      const inv = ord && ord.inv ? -1 : 1;
      this._allProjects.sort((a, b) => {
        return (field === 'date' ? a.dateCmp.localeCompare(b.dateCmp) * -1 :
          field === 'title' ? a.titleCmp.localeCompare(b.titleCmp) :
            field === 'author' ? a.authorCmp.localeCompare(b.authorCmp) : 0) * inv;
      });
      this._filterChanged(this.filter);
    }
  }
}

window.customElements.define(RepoData.is, RepoData);
