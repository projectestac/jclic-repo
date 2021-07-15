/*!
 *  File    : RepoApp.js
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
//import { loadData } from './utils/data';
import { updateHistoryState } from './utils';
import { useTranslation } from 'react-i18next';
//import RepoList from './components/RepoList';
//import Project from './components/Project';
import Alert from '@material-ui/lab/Alert';
import { mainFont } from './settings';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
    fontFamily: mainFont,
  },
});

/**
 * The main component of this app
 * @param {object} param0 
 * @returns 
 */
function RepoApp({ settings }) {

  const { t } = useTranslation();
  const { projectKey } = settings;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [project, setProject] = useState(null);
  const [listMode, setListMode] = useState(false);
  const [filters, setFilters] = useState({ language: '', subject: '', level: '', text: '', textMatches: [] });

  const findProject = (id, projects = data) => id && projects && projects.find(d => d.id === id) || null;

  // Load the app data
  /*
  useEffect(() => {
    loadData(csv, t)
      .then(projects => {
        setData(projects)
        const searchParams = new URLSearchParams(window.location.search);
        const requestedPrj = searchParams.get(projectKey);
        const prj = findProject(requestedPrj, projects);
        if (requestedPrj && !prj)
          setError(new Error(t('error_unknown_id', { id: requestedPrj })));
        setProject(prj);
        updateHistoryState(prj, projectKey, true);
        window.addEventListener('popstate', ev => {
          const { state } = ev;
          if (state && Object.keys(state).includes(projectKey)) {
            ev.preventDefault();
            setProject(findProject(state[projectKey], projects));
          }
        });
      })
      .catch(err => setError(err))
      .finally(() => {
        setLoading(false);
      });
  }, [csv]);
  */

  // Set temp content for app skeleton
  useEffect(()=>{
    setLoading(false);
  });

  /**
   * Sets the current project, both as internal app state and updating
   * the query param on the location URL
   * @param {string} id - The current project id, or _null_ to display the full repo
   * @param {boolean} replace  - Set to `true` only at the begginig, when `history` is started
   */
  function setProjectID(id, replace = false) {
    if (data) {
      const prj = findProject(id);
      if (id && !prj) {
        setProject(null);
        setError(new Error(t('error_unknown_id', { id })));
        return;
      }
      updateHistoryState(prj, projectKey, replace);
      setProject(prj);
    }
  }

  const styles = useStyles();

  return (
    <div className={styles.root} >
      {
        loading && <Alert severity="info">{t('loading')}</Alert> ||
        error && <Alert severity="error">{error.toLocaleString()}</Alert> ||
        <img src={settings.logo} alt={t('site-title')} title={t('site-title')}/>
        //project && <Project {...{ project, setProjectID, settings, t }} /> ||
        //data && <RepoList {...{ projects: data, setProjectID, settings, listMode, setListMode, filters, setFilters, t }} />
      }
    </div>
  );
}

export default RepoApp;
