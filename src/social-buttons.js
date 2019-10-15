/**
  File    : social-buttons.html
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
This component allows to share a specific content on the following social networks:

- Facebook
- Google+
- Pinterest
- Twitter
- Google Classroom

It also builds a button pointing to a `mailto:` link, useful for sharing the content by e-mail.

The following element attributes must be specified about the content to share:

- An URL pointing to the main content (`url`)
- The URL of a caption image (`imgurl`)
- A brief description of the content (`text`)
- A boolean value indicating if the "Add to Classroom" button should be included (`with-classroom`)

Also, the following fields should be supplied via `settings`:

- A valid Facebook API ID, in `facebookShareID` (see https://developers.facebook.com/docs/apps/register)
- A valid twitter ID for the sender, in `twitterVia`

### Styling

The following custom properties and mixins are available for styling:

Custom property      | Description                         | Default
---------------------|-------------------------------------|----------
`--social-buttons`   | Mixin applied to the full component | {}

*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `<iron-iconset-svg name="sbtn" size="24">
  <svg>
    <defs>
      <g id="facebook-box">
        <path d="M19,4V7H17A1,1 0 0,0 16,8V10H19V13H16V20H13V13H11V10H13V7.5C13,5.56 14.57,4 16.5,4M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z"></path>
      </g>
      <g id="pinterest-box">
        <path d="M13,16.2C12.2,16.2 11.43,15.86 10.88,15.28L9.93,18.5L9.86,18.69L9.83,18.67C9.64,19 9.29,19.2 8.9,19.2C8.29,19.2 7.8,18.71 7.8,18.1C7.8,18.05 7.81,18 7.81,17.95H7.8L7.85,17.77L9.7,12.21C9.7,12.21 9.5,11.59 9.5,10.73C9.5,9 10.42,8.5 11.16,8.5C11.91,8.5 12.58,8.76 12.58,9.81C12.58,11.15 11.69,11.84 11.69,12.81C11.69,13.55 12.29,14.16 13.03,14.16C15.37,14.16 16.2,12.4 16.2,10.75C16.2,8.57 14.32,6.8 12,6.8C9.68,6.8 7.8,8.57 7.8,10.75C7.8,11.42 8,12.09 8.34,12.68C8.43,12.84 8.5,13 8.5,13.2A1,1 0 0,1 7.5,14.2C7.13,14.2 6.79,14 6.62,13.7C6.08,12.81 5.8,11.79 5.8,10.75C5.8,7.47 8.58,4.8 12,4.8C15.42,4.8 18.2,7.47 18.2,10.75C18.2,13.37 16.57,16.2 13,16.2M20,2H4C2.89,2 2,2.89 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z"></path>
      </g>
      <g id="twitter-box">
        <path d="M17.71,9.33C17.64,13.95 14.69,17.11 10.28,17.31C8.46,17.39 7.15,16.81 6,16.08C7.34,16.29 9,15.76 9.9,15C8.58,14.86 7.81,14.19 7.44,13.12C7.82,13.18 8.22,13.16 8.58,13.09C7.39,12.69 6.54,11.95 6.5,10.41C6.83,10.57 7.18,10.71 7.64,10.74C6.75,10.23 6.1,8.38 6.85,7.16C8.17,8.61 9.76,9.79 12.37,9.95C11.71,7.15 15.42,5.63 16.97,7.5C17.63,7.38 18.16,7.14 18.68,6.86C18.47,7.5 18.06,7.97 17.56,8.33C18.1,8.26 18.59,8.13 19,7.92C18.75,8.45 18.19,8.93 17.71,9.33M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z"></path>
      </g>
      <g id="google-plus-box">
        <path d="M20,2A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4C2,2.89 2.9,2 4,2H20M20,12H18V10H17V12H15V13H17V15H18V13H20V12M9,11.29V13H11.86C11.71,13.71 11,15.14 9,15.14C7.29,15.14 5.93,13.71 5.93,12C5.93,10.29 7.29,8.86 9,8.86C10,8.86 10.64,9.29 11,9.64L12.36,8.36C11.5,7.5 10.36,7 9,7C6.21,7 4,9.21 4,12C4,14.79 6.21,17 9,17C11.86,17 13.79,15 13.79,12.14C13.79,11.79 13.79,11.57 13.71,11.29H9Z"></path>
      </g>
      <g id="mail">
        <path d="M 4 2 C 2.895 2 2 2.895 2 4 L 2 20 C 2 21.105 2.895 22 4 22 L 20 22 C 21.105 22 22 21.105 22 20 L 22 4 C 22 2.89 21.1 2 20 2 L 4 2 z M 6.664 6.941 L 17.635 6.941 C 18.389 6.941 19.008 7.498 19.008 8.176 L 19.008 15.574 C 19.008 16.252 18.389 16.807 17.635 16.807 L 6.664 16.807 C 5.910 16.807 5.293 16.252 5.293 15.574 L 5.301 8.176 C 5.301 7.498 5.910 6.941 6.664 6.941 z M 6.664 8.176 L 6.664 9.408 L 12.150 12.490 L 17.635 9.408 L 17.635 8.176 L 12.150 11.258 L 6.664 8.176 z"></path>
      </g>
      <g id="classroom" transform="scale(0.42),translate(4,4)">
        <rect id="Rectangle-1-Copy-8" fill="#FFC112" x="0" y="0" width="48" height="48"></rect>
        <rect id="Rectangle-1-Copy-11" fill="#21A465" x="4" y="4" width="40" height="40"></rect>
        <g id="Shape-Copy-2-+-Shape-Copy" transform="translate(8, 16)">
          <path d="M28,6 C28,4.896 27.104,4 26,4 C24.896,4 24,4.896 24,6 C24,7.104 24.896,8 26,8 C27.104,8 28,7.104 28,6 Z M26,9 C23.108,9 20,10.419 20,12.175 L20,14 L32,14 L32,12.175 C32,10.419 28.892,9 26,9 L26,9 Z M8,6 C8,4.896 7.104,4 6,4 C4.896,4 4,4.896 4,6 C4,7.104 4.896,8 6,8 C7.104,8 8,7.104 8,6 Z M6,9 C3.108,9 0,10.419 0,12.175 L0,14 L12,14 L12,12.175 C12,10.4194 8.892,9 6,9 L6,9 Z" id="Shape-Copy-2" fill="#57BB8A"></path>
          <path d="M16.002,6 C17.657,6 19,4.657 19,3 C19,1.345 17.657,0 16.002,0 C14.345,0 13,1.345 13,3 C13,4.657 14.345,6 16.002,6 L16.002,6 Z M8.171,11.667 L8.171,14 L24,14 L24,11.667 C24,9.088 19.901,7 16.086,7 C12.270,7 8.171,9.088 8.171,11.667 Z" id="Shape-Copy" fill="#F7F7F7"></path>
        </g>
        <polygon id="Shape" fill="#F1F1F1" points="28 41 40 41 40 44 28 44"></polygon>
      </g>
    </defs>
  </svg>
</iron-iconset-svg>`;
document.head.appendChild(documentContainer.content);

export default class SocialButtons extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        @apply --social-buttons;
      }

      .social {
        height: 28px;
        width: 28px;
        padding: 0;
        margin: 0;
        color: var(--secondary-text-color, var(--primary-text-color));
      }

      .facebook {
        color: #3b5998;
      }

      .googleplus {
        color: #dd4b39;
      }

      .pinterest {
        color: #bd081c;
      }

      .twitter {
        color: #55acee;
      }

      .email {
        color: #0166ff;
      }

      a {
        color: inherit;
      }

    </style>
    <a href="[[linkToFacebook]]" target="_blank"><paper-icon-button class="social facebook" icon="sbtn:facebook-box" title="Facebook"></paper-icon-button></a>
    <a href="[[linkToGooglePlus]]" target="_blank"><paper-icon-button class="social googleplus" icon="sbtn:google-plus-box" title="Google Plus"></paper-icon-button></a>
    <a href="[[linkToPinterest]]" target="_blank"><paper-icon-button class="social pinterest" icon="sbtn:pinterest-box" title="Pinterest"></paper-icon-button></a>
    <a href="[[linkToTwitter]]" target="_blank"><paper-icon-button class="social twitter" icon="sbtn:twitter-box" title="Twitter"></paper-icon-button></a>
    <a href="[[linkToMail]]" target="_blank"><paper-icon-button class="social email" icon="sbtn:mail" title="email"></paper-icon-button></a>
    <a href="[[linkToClassroom]]" target="_blank" id="classroom" class="hidden"><paper-icon-button class="social classroom" icon="sbtn:classroom" title="Add to Classroom"></paper-icon-button></a>
`;
  }

  static get is() { return 'social-buttons'; }

  static get properties() {
    return {
      // URL of shared resource
      url: String,
      // URL of the caption image
      imgurl: String,
      // Brief description of the shared resource
      text: String,
      // The "Share to Classroom" button will be displayed only when `true`
      withClassroom: {
        type: Boolean,
        value: false,
      },
      // Computed links to social networks:
      linkToFacebook: String,
      linkToGooglePlus: String,
      linkToPinterest: String,
      linkToTwitter: String,
      linkToMail: String,
      linkToClassroom: String,
      //
      // -----------------------------------------------------------------------------------
      // Other variables used in this component but declared and initialized in `repo-data`:
      // -----------------------------------------------------------------------------------
      // Main settings of the app, loaded at startup from `main.json`
      settings: Object,
      // Current set of labels, titles and messages, translated into the current app language
      labels: Object,
    };
  }

  static get observers() {
    return [
      '_computeLinks(settings, url, imgurl, text, labels)',
    ];
  }

  // Computes the link to be used with each social network, based on the current resource data
  _computeLinks(settings, url, imgurl, text, labels) {
    if (settings && url && imgurl && text && labels) {
      const eFBId = encodeURIComponent(settings.facebookShareID);
      const eHash = encodeURIComponent(settings.shareHashtags.join(','));
      const eTWVia = encodeURIComponent(settings.twitterVia);
      const eUrl = encodeURIComponent(url);
      const eImg = encodeURIComponent(imgurl);
      const eText = encodeURIComponent(text);
      const eDesc = encodeURIComponent(labels.check);
      const eRedirect = encodeURIComponent(settings.facebookRedirect || window.location.href);
      const eMailBody = encodeURIComponent(`${text}\n\n${labels.check}:\n${url}`);

      this.linkToFacebook = `https://www.facebook.com/dialog/feed?app_id=${eFBId}&link=${eUrl}&picture=${eImg}&name=${eText}&description=${eDesc}&redirect_uri=${eRedirect}`;
      this.linkToGooglePlus = `https://plus.google.com/share?url=${eUrl}`;
      this.linkToPinterest = `https://pinterest.com/pin/create/button/?url=${eUrl}&media=${eImg}&description=${eDesc}`;
      this.linkToTwitter = `https://twitter.com/intent/tweet?text=${eText}&url=${eUrl}&hashtags=${eHash}&via=${eTWVia}`;
      this.linkToMail = `mailto:?subject=${eText}&body=${eMailBody}`;
      if (this.withClassroom) {
        this.linkToClassroom = `https://classroom.google.com/u/0/share?url=${eUrl}`;
        this.$.classroom.classList.remove('hidden');
      } else {
        this.$.classroom.classList.add('hidden');
      }
    }
  }
}

window.customElements.define(SocialButtons.is, SocialButtons);
