/**
  File    : jclic-player.html
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
/* Load the latest JClic.js package from unpkg.com */
/* Alternative sources are:
     - "../jclic.js"
*/
/*

This component contains a JClic Player and is used to launch the current JClic project. It's a full layer placed at top (z-index: 10),
initially hidden (display: none)

### Styling

The following custom properties and mixins are available for styling:

Custom property   | Description                       | Default
------------------|-----------------------------------|----------
`--jclic-player`  | Mixin applied to the host         | {}

*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import './shared-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class JClicPlayerElement extends PolymerElement {
  static get template() {
    return html`
    <style include="shared-styles">
       :host {
        @apply --jclic-player;
        display: none;
        position: absolute;
        margin: 0;
        padding: 0;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10;
      }
    </style>
    <!-- JClic.js will build the player inside this div: -->
    <div id="player"></div>
`;
  }

  static get is() { return 'jclic-player' }

  static get properties() {
    return {
      // Options passed to the JClic Player (see https://github.com/projectestac/jclic.js/blob/master/src/JClicPlayer.js#L122)
      options: Object,
      // When `true`, the player will switch automatically to full screen, if available on current device
      fullScreen: Boolean,
      // When `true`, activities should open in a new tab
      newTab: Boolean,
      // Project file to be loaded
      project: {
        type: String,
        observer: '_setProject',
      },
      // Object of type JClicPlayer currently running (if any)
      _currentPlayer: {
        type: Object,
        value: null,
        reflectToAttribute: false,
        notify: false,
      }
    }
  }

  // Sets/unsets the JClic project to be launched on the player
  _setProject(prj) {
    if (prj && this.newTab)
      window.open(prj.replace(/\/[^\/]*$/, '/index.html'), '_BLANK')
    else if (prj) {
      this.style.display = 'block'
      this._currentPlayer = window.JClicObject.loadProject(this.$.player, prj, this.options || null)
      if (this.fullScreen)
        this._currentPlayer.skin.setScreenFull(true)
    } else {
      this.style.display = 'none'
      if (this._currentPlayer)
        this._currentPlayer.reset()
    }
  }
}

window.customElements.define(JClicPlayerElement.is, JClicPlayerElement)
