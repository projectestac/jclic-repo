/*!
 *  File    : patch-koko-api.js
 *  Created : 2024-04-20
 *  By      : Francesc Busquets <francesc@gmail.com>
 *
 *  JClic repo
 *  Dynamic repository of JClic activities
 *  https://clic.xtec.cat
 *
 *  @source https://github.com/projectestac/jclic-repo
 *
 *  @license EUPL-1.2
 *  @licstart
 *  (c) 2021 Educational Telematic Network of Catalonia (XTEC)
 *
 *  Licensed under the EUPL, Version 1.2 or -as soon they will be approved by
 *  the European Commission- subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *
 *  You may obtain a copy of the Licence at:
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  Licence for the specific language governing permissions and limitations
 *  under the Licence.
 *  @licend
 *  @module
 */

// Fake post ids for the projects library are built adding this value to the each visited project ID
const POST_ID_BASE = 50000;

// Main URL of the projects library 
const REPO_BASE = 'https://projectes.xtec.cat/clic/ca/repo/';

// Get the full list of projects
async function loadProjects() {
  return fetch('https://clic.xtec.cat/projects/projects.json')
    .then(res => res.json());
}

// Intercepts 'window.fetch', providing patched results
function patchFetchAPI(projects) {
  let originalFetch = null;
  if (!originalFetch) {
    originalFetch = window.fetch;
    window.fetch = async function (url, options) {
      if (/koko-analytics\/v1\/posts/.test(url)) {
        return originalFetch(url, options)
          .then(response => {
            return response.json()
              .then(result => {
                response.json = () => patchKokoResponse(result, projects);
                return response;
              });
          });
      }
      else
        return originalFetch(url, options);
    }
  }
}

// Patches the provided array of 'post' objects, replacing title and link when id greater or equal than the fake ID base
function patchKokoResponse(posts, projects) {
  posts.forEach(post => {
    if (post.id >= POST_ID_BASE) {
      const project = projects.find(prj => prj.id === post.id - POST_ID_BASE);
      if (project) {
        post.post_title = `REPO: ${project.title} [${project.path}]`;
        post.post_permalink = `${REPO_BASE}?prj=${project.path}`;
      }
    }
  });
  return posts;
}

// Main function
(async function () {
  const projects = await loadProjects();
  // Filter future AJAX updates
  patchFetchAPI(projects);
  // Update current data
  if (window.koko_analytics?.data?.posts)
    patchKokoResponse(window.koko_analytics.data.posts, projects);
})();
