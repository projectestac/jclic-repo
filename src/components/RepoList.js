/*!
 *  File    : components/RepoList.js
 *  Created : 2021-07-16
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

import React, { useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from '../utils';
import BackToTop from '../utils/BackToTop';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SEO from './SEO';
import ShareButtons from './ShareButtons';
//import SelectProjects from './SelectProjects';
import PaginatedList from './PaginatedList';
import ScrollMosaic from './ScrollMosaic';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { List, ViewComfy } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    '&h1': {
      fontSize: '12pt',
    },
  },
  title: {
    color: `${theme.palette.primary.dark}`,
  },
  selectProjects: {
    marginTop: '1rem',
    marginBottom: '1rem',
    maxWidth: '1200px',
  },
  infoBar: {
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  viewMode: {
    background: 'transparent',
  },
  projectCount: {
    flexGrow: 1,
    marginLeft: '1rem',
    textAlign: 'right',
  }
}));

function RepoList({ t, settings, user = null, projects, filters, setFilters, listMode, setListMode, setLoading, setError, updateAct, ...props }) {

  const { repoBase, jclicSearchService, displayTitle, displaySubtitle, logo, twitterCard } = settings;
  const classes = mergeClasses(props, useStyles());
  const title = user ? t('user-repo-title', { user }) : t('repo-title');
  const description = user ? t('user-repo-description', { user }) : t('repo-description');
  const projectCount = t(
    projects.length === 0 ? 'repo-num-zero' : projects.length === 1 ? 'repo-num-single' : 'repo-num-plural',
    { num: projects.length }); // Todo: use "formatNumber" equivalent
  const topRef = useRef();

  return (
    <div {...props} className={classes.root}>
      <SEO {...{ settings, t, title, description, thumbnail: twitterCard }} />
      {displayTitle && <Typography variant="h1">{title}</Typography>}
      {displaySubtitle && !user && <Typography variant="subtitle1">{t('repo-description')}</Typography>}
      <ShareButtons {...{ settings, t, title: t('site-title'), description: t('site-description'), thumbnail: twitterCard || logo, link: window.location.href }} />
      {!user &&
        <Paper className={classes['selectProjects']}>
          {/* <SelectProjects {...{ intl, jclicSearchService, filters, setFilters, setLoading, setError }} /> */}
        </Paper>
      }
      <div className={classes['infoBar']} ref={topRef}>
        <ToggleButtonGroup
          className={classes['viewMode']}
          size="small"
          value={listMode}
          exclusive
          onChange={_ev => setListMode(!listMode)}
          aria-label={t('repo-view-mode')}
        >
          <ToggleButton value={false} title={t('repo-view-cards')}>
            <ViewComfy />
          </ToggleButton>
          <ToggleButton value={true} title={t('repo-view-list')}>
            <List />
          </ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="body2" className={classes['projectCount']}>{projectCount}</Typography>
      </div>
      {(listMode && <PaginatedList {...{ t, user, projects, settings, updateAct }} />)
        || <ScrollMosaic {...{ t, user, projects, settings, updateAct }} />
      }
      <BackToTop {...{ t, topRef, showBelow: 300 }} />
    </div >
  );
}

export default RepoList;