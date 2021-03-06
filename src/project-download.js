/* eslint-disable indent */
/**
  File    : project-download.html
  Created : 07/06/2017
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
This component makes easy to download all the components of a JClic project in a single ZIP file.

It downloads the components one by one as a raw binary chunks of data, then compresses all data in memory
using [JSZip](https://stuk.github.io/jszip/) and delivers the resulting file to the user
with [FileSaver.js](https://github.com/eligrey/FileSaver.js/)

A progress bar shows the current state of the downloading of individual elements, and a `Cancel` button allows
to abort all pending transfers when requested.

In order to use this component:
  - Set the `project` attribute with a valid JClic Project object (see `repo-data.html`)
  - Open the paper-dialog using `component.$.dialog.open()`
  - Call `component.prepareZipFile()` to start downloading the project ingredients

### Styling

The following custom properties and mixins are available for styling:

Custom property      | Description                         | Default
---------------------|-------------------------------------|----------
`--project-download` | Mixin applied to the full component | {}
*/

/* global Promise */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-progress/paper-progress.js';
import '@polymer/iron-ajax/iron-request.js';
import './shared-icons.js';

import { saveAs } from './utils/FileSaver.js';
import JSZip from './utils/jszip.js';

export default class ProjectDownload extends PolymerElement {
  static get template() {
    return html`
    <style>
       :host {
        @apply --project-download;
      }

      #dialog {
        max-width: 500px;
      }

      #msg {
        color: var(--primary-text-color);
        margin-bottom: 10pt;
      }

      #status {
        color: var(--secondary-text-color);
        font-size: 0.9em;
        overflow-x: hidden;
        min-height: 10pt;
      }

      #err {
        color: var(--error-color);
        font-weight: bold;
        margin-top: 10pt;
      }

      paper-progress {
        width: 100%;
        height: 8px;
        --paper-progress-active-color: var(--dark-primary-color);
      }

      #downloadBtn {
        background-color: var(--default-primary-color);
        color: var(--text-primary-color);
      }

      @media (min-width: 601px) {
        #dialog {
          min-width: 500px;
        }
      }
    </style>

    <paper-dialog id="dialog" modal="" entry-animation="scale-up-animation" exit-animation="fade-out-animation">
      <h2><span>[[labels.download]]</span> "<span>[[project.title]]</span>"</h2>
      <paper-dialog-scrollable>
        <div id="msg"><span>[[log_msg]]</span></div>
        <paper-progress id="progress"></paper-progress>
        <div id="status"><span>[[log_status]]</span></div>
        <div id="err"><span>[[log_err]]</span></div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <!-- Only one of these paper-button elements will be visible at the same time:
             \`cancel\` while downloading ingredients, and \`download\` when the resulting file is finally available -->
        <paper-button id="cancelBtn" raised="" on-click="_cancelDownload">[[labels.cancel]]</paper-button>
        <paper-button id="downloadBtn" raised="" on-click="_downloadFile">
          <iron-icon icon="file-download" class="small" style="margin-right: 4px;"></iron-icon>
          <span>[[labels.downloadFile]]</span>
        </paper-button>
        <paper-icon-button id="closeBtn" icon="close" title="[[labels.close]]" on-click="_cancelDownload"></paper-icon-button>
      </div>
    </paper-dialog>
`;
  }

  static get is() { return 'project-download'; }

  static get properties() {
    return {
      // Object containing the data of the JClic project currently displayed on this card
      project: Object,
      // zipFile is a BLOB containing the compressed data
      zipFile: Object,
      // Name proposed to FileSave.js for the resulting ZIP file
      zipFileName: String,
      // Array of `XMLHttpRequest` objects currently running
      _xhrs: Object,
      // Log messages:
      log_msg: String,
      log_status: String,
      log_err: String,
      //
      // ----------------------------------------------------------------
      // Properties used by this component but initialized in `repo-data`
      // ----------------------------------------------------------------
      // Relative path to the folder where the JClic projects of this repository are located
      repoRoot: String,
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
    };
  }

  static get observers() {
    return [
      '_projectSet(project)',
      '_fileChanged(zipFile)',
    ];
  }

  // A new project has been set, so clear the current zipFile (if any)
  _projectSet(project) {
    if (project) {
      // This will invoke `_fileChanged`
      this.zipFile = null;
    }
  }

  // Monitors changes in `zipFile`, enabling and disabling the `cancel` and `download` buttons accordingly
  _fileChanged(zipFile) {
    if (zipFile) {
      this.$.cancelBtn.style.display = 'none';
      this.$.downloadBtn.style.display = 'flex';
    } else {
      this.$.cancelBtn.style.display = 'flex';
      this.$.downloadBtn.style.display = 'none';
    }
  }

  // This is the main method of this component: checks the current project, downloads all its components and prepares
  // a compressed BLOB ready to be served as a ZIP file
  prepareZipFile() {

    // Clear current dialog
    this._clearDlg();

    // Run only if `project` is not null
    if (this.project) {

      this.log_msg = this.labels.preparingSCORM;

      // This is where the ingredients will be stored
      const zip = new JSZip();

      // Get the zip file name from the last part of the project path
      const basePath = `${this.repoRoot || '.'}/${this.project.path}/`;
      const fileParts = basePath.split('/');
      this.zipFileName = `${fileParts[fileParts.length - 2]}.scorm.zip`;

      // Detect if the main `.jclic` file resides into a subdirectory (usually 'jclic.js/' in projects published on the clicZone library)
      // We will remove this subdirectory in the resulting ZIP file, thus simplifying its internal structure
      const lastSepPos = this.project.mainFile.lastIndexOf('/');
      let subdir = lastSepPos >= 0 ? this.project.mainFile.substring(0, lastSepPos + 1) : '';
      // Escape all the special characters -/\^$*+?.()[]{} in `subdir`. This usually will just replace '/' by '\/' and '.' by '\.'
      subdir = subdir.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Build a regExp used to remove all references to `subdir` in `project.json`
      const pathToRemove = new RegExp(subdir, 'g');

      // Make a normalized copy of 'project'
      const prj = JSON.parse(JSON.stringify(this.project).replace(pathToRemove, ''));
      // Delete some fields added by `repo-data`
      delete prj.path;
      delete prj.titleCmp;
      delete prj.authorCmp;
      delete prj.dateCmp;

      // Add the modified 'project.json' to the ZIP file
      zip.file('project.json', JSON.stringify(prj, null, ' '), {});

      // Here we will start downloading ingredients
      this.log_msg = this.labels.downloadingIngredients;

      // The 'minus-one' here is because one of the files (`project.json`) has already been pushed to `zip` and don't be downloaded again
      this._initProgress(this.project.files.length - 1);

      // Save all download requests on an array of `Promise` objects
      // Save also an array of `XMLHttpRequest`, useful to abort the pending requests
      this._xhrs = [];
      const promises = [];

      // exclude `project.json`, already stored in the zip file
      this.project.files.filter(f => f !== 'project.json')
        .forEach(file => {
          let xhr;
          var filePromise = new Promise((resolve, reject) => {
            // Call the static method `getBinaryContent` (see below), where the promise will be finally fullfilled or rejected
            xhr = ProjectDownload.getBinaryContent(basePath + file, (err, data) => {
              if (err)
                reject(err);
              else {
                this.log_status = file;
                // Compress and save the resulting data in `zip`
                zip.file(file.replace(pathToRemove, ''), data, { binary: true });
                this.$.progress.value++;
                resolve(true);
              }
            });
            if (this._xhrs) { this._xhrs.push(xhr); }
          });
          promises.push(filePromise);
        });

      // Wait for all promises to be fulfilled
      Promise.all(promises).then(
        // Success (_data is an array of `true`, not used)
        _data => {
          // The process has successfully finished, so clear the references to XMLHttpRequests
          this._xhrs = null;
          // Generate a zip BLOB and store it on `zipFile`
          this.log_msg = this.labels.pleaseWaitCompressing;
          this.log_status = '';
          zip.generateAsync({ type: 'blob' }).then(
            // On success
            blob => {
              this.log_msg = this.labels.zipFileAvailable;
              // This assignment will launch `_fileChanged`
              this.zipFile = blob;
            },
            // On error
            err => {
              this.log_err = `${this.labels.errorGeneratingZip}: ${err}`;
            }
          );
        },
        // Rejected with error code
        err => {
          this._xhrs = null;
          this.log_err = err;
          this.log_status = '';
        });
    }
  }

  // Cancels the downloading of project ingredients
  _cancelDownload() {
    this._clearDlg();
    this.$.dialog.close();
    if (this._xhrs) {
      this._xhrs.forEach(xhr => {
        if (xhr.readyState < 4) {
          try {
            xhr.abort();
          } catch (err) {
            // Should not occur
            console.log(`Error cancelling XHR: ${err}`);
          }
        }
      });
      this._xhrs = null;
    }
    this.zipFile = null;
  }

  // Clears current dialog messages
  _clearDlg() {
    this.log_msg = '';
    this.log_status = '';
    this.log_err = '';
    this._initProgress();
  }

  // Gives the resulting BLOB simulating the downloading of a ZIP file
  _downloadFile() {
    if (this.zipFile) {
      // `saveAs` provided by [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
      saveAs(this.zipFile, this.zipFileName);
      this._cancelDownload();
    }
  }

  // Inits the progress bar with a maximum value
  _initProgress(max = 0) {
    this.$.progress.value = 0;
    this.$.progress.max = max;
  }

  /**
   * Retrieves the content of a remote file as a binary object
   *
   * Adapted from Stuart Knightley's [JSZipUtils](https://github.com/Stuk/jszip-utils)
   *
   * This modified version returns an `XMLHttpRequest` object (or `null` in case of error)
   * that can be useful for cancelling pending transactions at user request
   *
   **/
  static getBinaryContent(path, callback) {
    let xhr = null;
    try {
      xhr = new XMLHttpRequest();
      xhr.open('GET', path, true);
      if ('responseType' in xhr)
        xhr.responseType = 'arraybuffer';
      if (xhr.overrideMimeType)
        xhr.overrideMimeType('text/plain; charset=x-user-defined');

      xhr.onreadystatechange = function (evt) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 0) {
            let file = null;
            let err = null;
            try {
              // for xhr.responseText, the 0xFF mask is applied by JSZip
              file = xhr.response || xhr.responseText;
            } catch (e) {
              err = new Error(e);
            }
            callback(err, file);
          } else { callback(new Error(`downloading "${path}": ${this.status} - ${this.statusText}`), null); }
        }
      };
      xhr.send();
    } catch (e) {
      xhr = null;
      callback(new Error(e), null);
    }
    return xhr;
  }
}

window.customElements.define(ProjectDownload.is, ProjectDownload);
