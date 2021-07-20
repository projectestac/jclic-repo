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
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { checkFetchResponse, getQueryParam, updateHistoryState } from '../../utils';
import { mainFont } from '../../settings';
import Alert from '@material-ui/lab/Alert';
import Loading from '../Loading';
import Project from './Project';
import RepoList from './RepoList';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
    fontFamily: mainFont,
  },
});

function Repo({ settings }) {

  const { t } = useTranslation();
  const { repoList, repoBase } = settings;
  const [fullProjectList, setFullProjectList] = useState(null);
  const [projects, setProjects] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ language: '', subject: '', level: '', text: '', textMatches: [] });
  const [listMode, setListMode] = useState(false);

  const [act, setAct] = useState(getQueryParam('prj'));
  const [user, /* setUser*/] = useState(getQueryParam('user'));

  // Update `fullProjectList`, `projects` and `project`
  useEffect(() => {

    function loadFullProjectList() {
      return fetch(repoList)
        .then(checkFetchResponse)
        .then(_fullList => setFullProjectList(_fullList))
        .catch(err => setError(err?.toString() || 'Error'));
    }

    // Clear previous states
    setError(null);

    // Load the given project
    if (act && (project === null || project.path !== act)) {
      setLoading(true);
      setProject(null);
      setProjects(null);
      const fullPath = `${repoBase}/${act}`;
      // Load a specific project
      fetch(`${fullPath}/project.json`)
        .then(checkFetchResponse)
        .then(_project => {
          _project.path = act;
          _project.fullPath = fullPath;
          setProject(_project);
          setLoading(false);
          if (_project.relatedTo && !fullProjectList)
            loadFullProjectList();
        })
        .catch(err => {
          setError(err?.toString() || 'Error');
        });
    } else if (!act) {
      setLoading(true);
      setProject(null);
      if (fullProjectList) {
        setProjects(fullProjectList.filter(prj => (
          !filters.language || prj?.langCodes?.includes(filters.language))
          && (!filters.subject || prj?.areaCodes?.includes(filters.subject))
          && (!filters.level || prj?.levelCodes?.includes(filters.level))
          && (!filters.text || filters?.textMatches?.includes(prj.path))));
        setLoading(false);
      }
      else
        loadFullProjectList();
    }
  }, [repoBase, act, repoList, project, fullProjectList, filters]);


  /**
   * Sets the current project, both as internal app state and updating
   * the query param on the location URL
   * @param {string} id - The current project id, or _null_ to display the full repo
   * @param {boolean} replace  - Set to `true` only at the begginig, when `history` is started
   */
  function updateAct(act, user = null, replace = false) {
    updateHistoryState(act, user, replace);
    setAct(act);
  }

  const styles = useStyles();

  return (
    <div className={styles.root} ref={settings.rootRef} >
      {
        error && <Alert severity="error">{t('error', { error: error.toLocaleString() })}</Alert> ||
        loading && <Loading {...{ settings }} /> ||
        project && <Project {...{ settings, user, project, fullProjectList, updateAct }} /> ||
        projects && <RepoList {...{ settings, user, projects, filters, setFilters, listMode, setListMode, setLoading, setError, updateAct }} />
      }
    </div>
  );
}

export default Repo;
