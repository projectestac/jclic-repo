/**
  File    : project-share.html
  Created : 03/05/2017
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
This component offers the following sharing options for a given JClic project:

- A direct link to the activities
- A link to a `big-project-card`with information about the project
- A clip of HTTML code, useful for embedding the project in a blog or site
- A direct link to the main `.jclic` file, useful for Moodle

Al options can be copied to the system's clipboard, or directly shared on social networks

### Styling

The following custom properties and mixins are available for styling:

Custom property      | Description                         | Default
---------------------|-------------------------------------|----------
`--project-share`    | Mixin applied to the full component | {}
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-styles/typography.js';
import './shared-icons.js';
import './social-buttons.js';

import * as clipboard from 'clipboard-polyfill';

export default class ProjectShare extends PolymerElement {
  static get template() {
    return html`
    <style>
       :host {
        --paper-input-container-input-color: var(--secondary-text-color);
        @apply --project-share;
      }

      #dialog {
        max-width: 500px;
        margin: 24px;
      }

      @media (min-width: 601px) {
        #dialog {
          min-width: 500px;
          margin: 24px 40px;
        }
      }

      paper-input {
        margin-top: 0;
      }

      .vertical-section {
        @apply --shadow-elevation-2dp;
        background-color: #fff;
        padding: 0 10pt 10pt 10pt;
        margin: 10pt 0;
      }

      .horizontal-section-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
      }

      .moodle-logo {
        height: 18pt;
        margin-top: 8px;
      }

    </style>

    <paper-dialog id="dialog" modal="" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2 class="wrap"><span>[[labels.share]]</span> "<span>[[title]]</span>"</h2>
      <paper-dialog-scrollable>
        <div class="vertical-section-container">

          <!-- Share a direct link to the activities -->
          <div class="vertical-section">
            <paper-input id="linkToActivities" label="[[labels.linkToActivities]]" readonly="true" value="[[linkToActivities]]">
              <paper-icon-button slot="suffix" icon="content-copy" title="[[labels.copy]]" data-value\$="[[linkToActivities]]" on-click="_copy"></paper-icon-button>
            </paper-input>
            <social-buttons settings="[[settings]]" url="[[linkToActivities]]" imgurl="[[imgFullPath]]" text="[[title]]" labels="[[labels]]" with-classroom="true"></social-buttons>
          </div>

          <!-- Share a link to a \`big-project-card\` with information about the project -->
          <div class="vertical-section">
            <paper-input label="[[labels.linkToProject]]" readonly="true" value="[[linkToPage]]">
              <paper-icon-button slot="suffix" icon="content-copy" title="[[labels.copy]]" data-value\$="[[linkToPage]]" on-click="_copy"></paper-icon-button>
            </paper-input>
            <social-buttons settings="[[settings]]" url="[[linkToPage]]" imgurl="[[imgFullPath]]" text="[[title]]" labels="[[labels]]"></social-buttons>
          </div>

          <!-- Share a clip of HTTML code, useful for embedding the project in a blog or site -->
          <div class="vertical-section">
            <paper-input label="[[labels.embedCode]]" readonly="true" value="[[embedCode]]">
              <paper-icon-button slot="suffix" icon="content-copy" title="[[labels.copy]]" data-value\$="[[embedCode]]" on-click="_copy"></paper-icon-button>
            </paper-input>
            <div class="horizontal-section-container">
              <paper-radio-group selected="{{embedSize}}">
                <paper-radio-button name="small">640x390</paper-radio-button>
                <paper-radio-button name="medium">800x600</paper-radio-button>
                <paper-radio-button name="full">100%</paper-radio-button>
              </paper-radio-group>
            </div>
          </div>

          <!-- Share a direct link to main \`.jclic\` file, useful for Moodle -->
          <div class="vertical-section">
            <!-- WARNING: "img src" paths are always relative to the root document, not to the component! -->
            <img src="images/moodle-logo.png" class="moodle-logo">
            <paper-input label="[[labels.linkForMoodle]]" readonly="true" value="[[linkForMoodle]]">
              <paper-icon-button slot="suffix" icon="content-copy" title="[[labels.copy]]" data-value\$="[[linkForMoodle]]" on-click="_copy"></paper-icon-button>
            </paper-input>
          </div>
        </div>

      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-icon-button dialog-dismiss="" icon="close" title="[[labels.close]]"></paper-icon-button>
      </div>

      <!-- "toast" message box that will appear when copying any text elements  -->
      <paper-toast id="copied" text="[[labels.copied]]" />

    </paper-dialog>
`;
  }

  static get is() { return 'project-share'; }

  static get properties() {
    return {
      // Current project
      project: Object,
      // Expression used as a project's title
      title: String,
      // URL pointing to a JClic player launching the activities
      linkToActivities: String,
      // URL pointing to a `big-project-card` with full project info
      linkToPage: String,
      // URL pointing to a `.jclic` file, used by the JClic module for Moodle
      linkForMoodle: String,
      // URL pointing to the project's cover image
      imgFullPath: String,
      // Embeddable code that, when inserted on a blog or site, will create a JClic player launching the activities
      embedCode: String,
      // Type of dimensions set on `embedCode`. Valid values are: `small` (640x390), `medium` (800x600) and `full` (100%)
      embedSize: {
        type: String,
        value: 'medium',
      },
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `jclic-repo`:
      // -----------------------------------------------------------------------------------
      // URL used as a base for absolute references to project's components
      baseUrl: String,
      // Current two-letter language code selected by the user
      lang: String,
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `repo-data`:
      // -----------------------------------------------------------------------------------
      // Main settings of the app, loaded at startup by `repo-data`
      settings: Object,
      // Relative path to the folder where the JClic projects of this repository are located
      repoRoot: String,
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,

    };
  }

  static get observers() {
    return [
      '_projectChanged(project, repoRoot)',
      '_embedChanged(linkToActivities, embedSize)',
    ];
  }

  // Called when the project is set or changed
  _projectChanged(prj, repoRoot) {
    this.title = prj ? prj.title : '';
    const indexFile = prj && prj.files && repoRoot ? prj.files.find(f => /^(.*\/)*index.html$/.test(f)) : null;
    this.linkToActivities = prj && repoRoot ?
      (indexFile ? this._sp(`${this.baseUrl}${repoRoot}/${prj.path}/${indexFile}`) : `${this.baseUrl}player.html?${prj.path}/${prj.mainFile}`) :
      '';
    this.linkToPage = prj && repoRoot ? `${this.baseUrl}index.html?prj=${prj.path}` : '';
    this.imgFullPath = prj && repoRoot ? this._sp(`${this.baseUrl}${repoRoot}/${prj.path}/${prj.cover}`) : '';
    this.linkForMoodle = prj && repoRoot ? this._sp(`${this.baseUrl}${repoRoot}/${prj.path}/${prj.mainFile}`) : '';
  }

  // Called when the users selects a different size for `embedCode`
  _embedChanged(link, size) {
    const dim = size === 'small' ? { w: 640, h: 390 } : size === 'full' ? { w: '100%', h: '100%' } : { w: 800, h: 600 };
    this.embedCode = link ? `<iframe width="${dim.w}" height="${dim.h}" frameborder="0" allowFullScreen="true" src="${link}"></iframe>` : '';
  }

  // Puts into the system clipboard the data associated with the button generating the passed event
  _copy(ev) {
    if (ev.target && ev.target.dataset.value) {
      if (this.$.copied.opened)
        this.$.copied.close();
      this.$.copied.noCancelOnOutsideClick = false;
      this.$.copied.positionTarget = ev.target;
      clipboard.writeText(ev.target.dataset.value).then(this.$.copied.open.bind(this.$.copied));
    }
  }

  // Simplifies URL expressions with a `dot-dot` (`/../`) fragment
  _sp(s) {
    // Middle parenthesis gets `dor-dot` and previous path with all slashes (like `/repo/../` in `https://clic.xtec.cat/repo/../projects/myproject`)
    const re = /(.*)(\/\w*\/\.\.\/)(.*)/;
    // Get only the first ($1) and last ($3) fragments, replacing the middle one ($2) by a single slash (`\/`)
    return (s && re.test(s)) ? s.replace(re, '$1\/$3') : s;
  }
}

window.customElements.define(ProjectShare.is, ProjectShare);
