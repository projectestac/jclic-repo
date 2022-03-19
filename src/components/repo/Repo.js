/*!
 *  File    : components/repo/Repo.js
 *  Created : 2021-07-15
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

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { checkFetchResponse, getQueryParam, updateHistoryState } from '../../utils';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Loading from '../Loading';
import Project from './Project';
import RepoList from './RepoList';

export const EMPTY_FILTERS = { language: '', subject: '', level: '', text: '', textMatches: [] };

function Repo({ settings }) {

  const { t } = useTranslation();
  const { repoList, repoBase, usersBase, jclicSearchService } = settings;
  const [fullProjectList, setFullProjectList] = useState(null);
  const [projects, setProjects] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    language: getQueryParam('language'),
    subject: getQueryParam('subject'),
    level: getQueryParam('level'),
    text: getQueryParam('text'),
  });
  const [listMode, setListMode] = useState(false);

  const [act, setAct] = useState(getQueryParam('prj'));
  const [user, setUser] = useState(getQueryParam('user'));

  // Load the full project list
  function loadFullProjectList() {
    return fetch(user ? `${usersBase}/${user}/projects.json` : repoList)
      .then(checkFetchResponse)
      .then(setFullProjectList)
      .catch(err => setError(err?.toString() || 'Error'));
  }

  // Update the current project, optionally with history update
  function updateAct(newAct, newUser = null, replace = false, updateHistory = true) {
    if (updateHistory)
      updateHistoryState(newAct, newUser, filters, replace);
    if (user !== newUser) {
      // Clear activity list when user changes
      setFullProjectList(null);
      setProjects(null);
    }
    setUser(newUser);
    setAct(newAct);
  }

  // Update the filters, optionally with history update
  function updateFilters(newFilters, replace = false, updateHistory = true) {
    if (updateHistory)
      updateHistoryState(act, user, newFilters, replace);
    if (newFilters.text !== filters.text)
      updateFullTextResults(newFilters.text);
    setFilters(newFilters);
  }

  // Fetch the API for projects containing specific query terms
  function updateFullTextResults(query) {
    !user && fetch(`${jclicSearchService}?lang=${t('lang')}&method=boolean&q=${encodeURIComponent(query)}`)
      .then(checkFetchResponse)
      .then(textMatches => setFilters({ ...filters, text: query, textMatches }))
      .catch(err => {
        // Don't throw a blocking error: just notify the incident on the console
        console.error('Error fetching search results', err);
      });
  }

  // Operations to be performed when 'act', 'fullProjectList' or 'filters' are changed
  useEffect(() => {
    // Clear previous states
    setError(null);
    // If 'act' is set, load its project data
    if (act && (project === null || project.path !== act)) {
      setLoading(true);
      setProject(null);
      setProjects(null);
      const fullPath = user ? `${usersBase}/${user}/${act}` : `${repoBase}/${act}`;
      // Load a specific project
      fetch(`${fullPath}/project.json`)
        .then(checkFetchResponse)
        .then(_project => {
          _project.path = act;
          _project.fullPath = fullPath;
          setProject(_project);
          setLoading(false);
          if (!user && _project.relatedTo && !fullProjectList)
            loadFullProjectList();
        })
        .catch(err => {
          setError(err?.toString() || 'Error');
        });
    } else if (!act) {
      setLoading(true);
      setProject(null);
      if (fullProjectList) {
        setProjects(
          user ?
            fullProjectList :
            fullProjectList.filter(prj => (
              !filters.language || prj?.langCodes?.includes(filters.language))
              && (!filters.subject || prj?.areaCodes?.includes(filters.subject))
              && (!filters.level || prj?.levelCodes?.includes(filters.level))
              && (!filters.text || filters?.textMatches?.includes(prj.path))));
        setLoading(false);
      }
      else
        loadFullProjectList();
    }
  }, [act, user, fullProjectList, filters]);

  // Operations to be performed at app startup
  useEffect(() => {
    // Start a new browser history
    updateHistoryState(act, user, filters, true);
    // Attach the 'popstate' event handler
    window.addEventListener('popstate', ev => {
      const { state } = ev;
      if (state && Object.keys(state).includes('prj')) {
        ev.preventDefault();
        updateAct(state.prj, state.user, false, false);
        updateFilters(state.filters, false, false);
      }
    });
    // Check if a full text search should be performed
    if (!user && filters.text)
      updateFullTextResults(filters.text);
  }, [window]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, typography: 'body1' }} ref={settings.rootRef} >
      {
        error && <Alert severity="error">{t('error', { error: error.toLocaleString() })}</Alert> ||
        loading && <Loading {...{ settings }} /> ||
        project && <Project {...{ settings, user, project, fullProjectList, updateAct }} /> ||
        projects && <RepoList {...{ settings, user, projects, filters, updateFilters, listMode, setListMode, setLoading, setError, updateAct }} />
      }
    </Box>
  );
}

export default Repo;
