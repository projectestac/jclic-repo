/**
  File    : big-project-card.html
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

This component displays all the information available of a specific JClic project, and provides butons for playing,
sharing, installing or downloading it.

The information is dynamically retrieved by `repo-data` from the file `project.json`, located at the root of 
project's folder. This element receives this data already parsed and encapsulated in the `project` property.

The big proect card is currently displayed in a `paper-dialog`

### Styling

The following custom properties and mixins are available for styling:

Custom property      | Description                       | Default
---------------------|-----------------------------------|----------
`--big-project-card` | Mixin applied to the project card | {}

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/neon-animation/animations/scale-up-animation.js';
import '@polymer/neon-animation/animations/fade-out-animation.js';
import './shared-icons.js';
import './shared-styles.js';
import './project-share.js';
import './project-download.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class BigProjectCard extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
      :host {
        line-height: initial;
        @apply --big-project-card;
      }

      #dialog {
        max-width: 700px;
      }

      #cover {
        float: right;
        margin: 5px 0 5px 5px;
        max-width: 50%;
        cursor: pointer;
      }

      #author {
        margin-bottom: 0;
      }

      #school {
        margin-top: 0;
        font-style: italic;
      }

      .data {
        min-width: 80%;
      }

      .label {
        font-weight: bold;
        color: var(--secondary-text-color, #7E7E7E);
        padding-right: 4pt;
        vertical-align: top;
        min-width: 7rem;
      }

      #related ul {
        margin: 0;
        padding-left: 20px;
      }

      #license {
        line-height: 110%;
        font-size: 90%;
        font-style: italic;
      }

      #cclogo {
        margin: 3px 10px 5px 0;
        float: left;
        opacity: 0.7;
      }

      @media screen and (max-width: 700px) {
        #dialog {
          max-width: 100vw;
          margin: 5px;
        }
        .label {
          min-width: 3rem;
        }
      }
    </style>
    <paper-dialog id="dialog" modal="" entry-animation="scale-up-animation">
      <h2 id="title"></h2>
      <paper-dialog-scrollable>
        <!-- image source will be dynamically set in \`_projectChanged\` -->
        <img id="cover" on-tap="_tapPlay">
        <p id="author"></p>
        <p id="school"></p>
        <p id="description"></p>
        <table class="data">
          <tbody><tr>
            <td class="label">
              <span>[[labels.languages]]</span>:</td>
            <td id="languages"></td>
          </tr>
          <tr>
            <td class="label">
              <span>[[labels.subjects]]</span>:</td>
            <td id="areas"></td>
          </tr>
          <tr>
            <td class="label">
              <span>[[labels.levels]]</span>:</td>
            <td id="levels"></td>
          </tr>
          <tr id="trDescriptors">
            <td class="label">
              <span>[[labels.descriptors]]</span>:</td>
            <td id="descriptors"></td>
          </tr>
          <tr>
            <td class="label">
              <span>[[labels.date]]</span>:</td>
            <td id="date"></td>
          </tr>
          <tr id="trActivities">
            <td class="label">
              <span>[[labels.activities]]</span>:</td>
            <td id="activities"></td>
          </tr>
          <tr id="trSize">
            <td class="label">
              <span>[[labels.fileSize]]</span>:</td>
            <td id="size"></td>
          </tr>
          <tr>
            <td class="label">
              <span>[[labels.license]]</span>:</td>
            <td id="license">
              <img id="cclogo" src="images/cclogo.png" alt="">
              <div id="licenseText"></div>
            </td>
          </tr>
          <tr id="trRelated">
            <td class="label">
              <span>[[labels.relatedProjects]]</span>:</td>
            <td id="related"></td>
          </tr>
        </tbody></table>
      </paper-dialog-scrollable>
      <div class="buttons">
        <!-- Buttons with several actions related to the current project-->
        <paper-icon-button id="play" mini="" icon="av:play-circle-filled" title="[[labels.playText]]" on-tap="_tapPlay"></paper-icon-button>
        <paper-icon-button id="installJava" mini="" icon="maps:local-cafe" title="[[labels.installText]]" on-tap="_tapInstallJava"></paper-icon-button>
        <paper-icon-button id="download" mini="" icon="file-download" title="[[labels.downloadText]]" on-tap="_tapDownload"></paper-icon-button>
        <paper-icon-button id="clicZone" mini="" icon="av:video-library" title="[[labels.linkClicZoneText]]" on-tap="_tapClicZone"></paper-icon-button>
        <paper-icon-button id="share" mini="" icon="social:share" title="[[labels.shareText]]" on-tap="_tapShare"></paper-icon-button>
        <paper-icon-button dialog-dismiss="" icon="close" title="[[labels.close]]"></paper-icon-button>
      </div>
    </paper-dialog>

    <!-- Additional dialogs for sharing and downloading the project -->
    <project-share id="shareDlg" settings="[[settings]]" project="[[project]]" lang="[[lang]]" labels="[[labels]]" base-url="[[baseUrl]]" repo-root="[[repoRoot]]"></project-share>
    <project-download id="downloadDlg" project="[[project]]" labels="[[labels]]" repo-root="[[repoRoot]]">

  </project-download>
`;
  }

  static get is() { return 'big-project-card' }

  static get properties() {
    return {
      // Object containing the data of the JClic project currently displayed on this card
      project: Object,
      //
      // ----------------------------------------------------------------
      // Properties used by this component but initialized in `repo-data`
      // ----------------------------------------------------------------
      // URL used as a base for absolute references to project's components
      baseUrl: String,
      // Relative path to the folder where the JClic projects of this repository are located
      repoRoot: String,
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
      //  Main settings of the app, loaded at startup from `main.json`          
      settings: Object,
      //
      // -----------------------------------------------------------------
      // Properties used by this component but initialized in `jclic-repo`
      // -----------------------------------------------------------------
      // Current two-letter language code selected by the user
      lang: String,
    }
  }

  static get observers() {
    return [
      '_projectChanged(project, lang, repoRoot)'
    ]
  }

  // Fill-in the card fields when project data is set
  _projectChanged(prj, lang, repoRoot) {
    this.$.cover.src = (prj && prj.cover && repoRoot) ? `${repoRoot}/${prj.path}/${prj.cover}` : ''
    this.$.title.textContent = prj ? prj.title : ''
    this.$.author.textContent = prj ? prj.author : ''
    this.$.school.textContent = prj ? prj.school : ''
    this.$.description.innerHTML = (prj && lang && prj.description) ? prj.description[lang] : ''
    this.$.languages.textContent = (prj && lang && prj.languages) ? prj.languages[lang] : ''
    this.$.areas.textContent = (prj && lang && prj.areas) ? prj.areas[lang] : ''
    this.$.levels.textContent = (prj && lang && prj.levels) ? prj.levels[lang] : ''

    if (prj && lang && prj.descriptors) {
      this.$.descriptors.textContent = prj.descriptors[lang]
      this.$.trDescriptors.classList.remove('hidden')
    } else {
      this.$.descriptors.textContent = ''
      this.$.trDescriptors.classList.add('hidden')
    }

    this.$.date.textContent = (prj && prj.date) ? prj.date : ''
    const licenseText = (prj && lang && prj.license) ? prj.license[lang] : ''
    this.$.licenseText.innerHTML = licenseText
    if (licenseText && /Creative Commons/i.test(licenseText))
      this.$.cclogo.classList.remove('hidden')
    else
      this.$.cclogo.classList.add('hidden')

    if (prj && prj.relatedTo) {
      var relatedList = prj.relatedTo.map((rel, index) => `<li><a href="?prj=${rel}">${prj.relatedTitles[index]}</a></li>`)
      this.$.related.innerHTML = `<ul>${relatedList.join('\n')}</ul>`
      this.$.trRelated.classList.remove('hidden')
    } else {
      this.$.related.innerHTML = ''
      this.$.trRelated.classList.add('hidden')
    }

    if (prj && prj.activities) {
      this.$.activities.textContent = prj.activities
      this.$.trActivities.classList.remove('hidden')
    } else {
      this.$.activities.textContent = ''
      this.$.trActivities.classList.add('hidden')
    }

    if (prj && prj.totalSize) {
      this.$.size.textContent = `${(prj.totalSize / 1048576).toFixed(2)} MB`
      this.$.trSize.classList.remove('hidden')
    } else {
      this.$.size.textContent = ''
      this.$.trSize.classList.add('hidden')
    }

    this.$.installJava.disabled = !prj || !prj.instFile
    this.$.clicZone.disabled = !prj || !prj.clicZoneURL
  }

  // Launches the project activities
  _tapPlay(ev) {
    if (this.project)
      this.dispatchEvent(new CustomEvent('play', { detail: { project: this.project } }))
    ev.stopPropagation()
  }

  // Opens a link to a JNLP file that will start the installation of the project's Java version, when available
  _tapInstallJava() {
    if (this.project && this.project.instFile)
      window.open(`https://clic.xtec.cat/jnlp/jclic/install.jnlp?argument=${this.baseUrl}${this.repoRoot}/${this.project.path}/${this.project.instFile}`)
  }

  // Downloads the JClic project in SCORM format (not yet implemented!)
  _tapDownload() {
    if (this.project) {
      this.$.downloadDlg.$.dialog.open()
      this.$.downloadDlg.prepareZipFile()
    }
  }

  // Redirects the navigation to the project's page in the legacy clicZone
  _tapClicZone() {
    if (this.project && this.project.clicZoneURL)
      window.open(this.project.clicZoneURL, 'ClicZone')
  }

  // Opens the `project-share` dialog
  _tapShare(ev) {
    this.$.shareDlg.$.dialog.open()
  }

  // Closes this dialog
  close() {
    if (this.$.shareDlg.$.dialog.opened)
      this.$.shareDlg.$.dialog.close()
    if (this.$.dialog.opened)
      this.$.dialog.close()
  }
}

window.customElements.define(BigProjectCard.is, BigProjectCard)
