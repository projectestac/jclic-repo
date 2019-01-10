/**
  File    : projects-list.html
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
This is where the `project-card` elements of current projects will be displayed.
The `_visibleProjects` property contains the list of projects currently included in the showcase.
projects are dynamically loaded and added to `_visibleProjects` as the the container scrolls down.
This behavior is controlled by an `iron-scroll-threshold` element that calls `loadMoreProjects` when
a lower threshold (initially set to 300px) is near to be reached.

### Styling

The following custom properties and mixins are available for styling:

Custom property   | Description                          | Default
------------------|--------------------------------------|----------
`--projects-list` | Mixin applied to the project's list  | {}
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import { sharedStyles } from './shared-styles.js';
import './project-card.js';

class ProjectsList extends PolymerElement {
  static get template() {
    return html`
    ${sharedStyles}
    <style>
       :host {
        display: block;
        text-align: center;
        @apply --projects-list;
      }
    </style>

    <!-- The projects showcase -->
    <template id="cards" is="dom-repeat" items="[[_visibleProjects]]">
      <project-card repo-root="[[repoRoot]]" project="[[item]]" labels="[[labels]]" on-play="notifyEvent" on-show="notifyEvent"></project-card>
    </template>

    <!-- The scrolling controller -->
    <iron-scroll-threshold id="scroll" on-lower-threshold="loadMoreProjects" scroll-target="[[scrollingContainer]]" lower-threshold="[[lowerThreshold]]"></iron-scroll-threshold>
`;
  }

  static get is() { return 'projects-list'; }

  static get properties() {
    return {
      // Collection of projects currently present on the showcase. Will grow as container scrolls down.
      _visibleProjects: {
        type: Array,
        value: () => [],
      },
      // Distance (in pixels) between the position of the viewport lower side and the bottom of the container below wich more projects will be added to `_visibleProjects`
      lowerThreshold: {
        type: Number,
        value: 300,
      },
      // Regular of the `project-card` elements, including margins
      cardsWidth: {
        type: Number,
        value: 210,
      },
      // Link to the app main container, usually an `app-header-layout`
      mainContainer: Object,
      // Link to the scrolling region of the main container, usually the `#contentContainer` element of `app-header-layout`
      scrollingContainer: Object,
      //
      // ----------------------------------------------------------------
      // Properties used in this component but initialized in `repo-data`
      // ----------------------------------------------------------------
      // Relative path to the folder where the JClic projects of this repository are located
      repoRoot: String,
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
      // Ordered array containing the colection of projects matching the current filter settings
      projects: Array,
    };
  }

  static get observers() {
    return [
      '_projectsUpdated(projects)',
      '_containerUpdated(mainContainer)',
    ];
  }

  // Notify `play` and `show` events from cards to `jclic-repo`
  notifyEvent(ev) {
    this.dispatchEvent(new CustomEvent(ev.type, { detail: ev.detail }));
  }

  // Called when the `mainContainer` property is initially set
  _containerUpdated(mainContainer) {
    if (mainContainer && mainContainer.$.contentContainer)
      this.scrollingContainer = mainContainer.$.contentContainer;
  }

  // Called when the `projects` array is updated.
  _projectsUpdated(projects) {
    // Remove all elements from `_visibleProjects`
    this.splice('_visibleProjects', 0, this._visibleProjects.length + 1);
    // Load more projects
    if (projects && projects.length > 0)
      this.loadMoreProjects(this.getItemsPerPage());
  }

  // Guess the number of `project-card` elements that fit in each row
  getCardsH() {
    return this.mainContainer ? Math.ceil(this.mainContainer.offsetWidth / this.cardsWidth) : 20;
  }

  // Guess the number of project cards that fits on the current page
  getItemsPerPage() {
    const cardsH = this.getCardsH();
    const cardsV = Math.ceil(this.mainContainer.offsetHeight / this.cardsWidth) + 1;
    return Math.max(20, cardsH * cardsV);
  }

  // Adds more elements to `_visibleProjects`, when available
  loadMoreProjects(num) {
    if (this.projects && this.projects.length > this._visibleProjects.length) {
      if (!num || isNaN(num))
        num = 2 * this.getCardsH();

      var p = this._visibleProjects.length;
      const lim = Math.min(this.projects.length, p + num);
      while (p < lim)
        this.push('_visibleProjects', this.projects[p++]);
    }
    this.$.scroll.clearTriggers();
  }
}

window.customElements.define(ProjectsList.is, ProjectsList);
