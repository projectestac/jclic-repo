/*!
 *  File    : components/repo/RepoList.js
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

import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { mergeClasses } from '../../utils';
import BackToTop from '../BackToTop';
import { Typography, Paper } from '@mui/material';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { List, ViewComfy } from '@mui/icons-material';
import SEO from '../SEO';
import ShareButtons from '../ShareButtons';
import SelectProjects from './SelectProjects';
import PaginatedList from './PaginatedList';
import ScrollMosaic from './ScrollMosaic';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    '&h1': {
      fontSize: '12pt',
    },
  },
  title: {
    color: `${theme.palette.primary.dark}`,
    marginBottom: '0.5rem',
  },
  selectProjects: {
    marginTop: '1rem',
    marginBottom: '1rem',
    maxWidth: '1200px',
  },
  displayMode: {
    background: 'transparent',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

function RepoList({ settings, user, projects, filters, updateFilters, listMode, setListMode, setLoading, setError, updateAct, ...props }) {

  const { t } = useTranslation();
  const { displayTitle, displaySubtitle, logo, twitterCard } = settings;
  const classes = mergeClasses(props, useStyles());
  const title = user ? t('user-repo-title', { user }) : t('repo-title');
  const description = user ? t('user-repo-description', { user }) : t('repo-description');
  const projectCount = t('repo-num', { count: projects.length, context: `${projects.length}` });

  return (
    <div {...props} className={classes.root}>
      <SEO {...{ settings, title, description, thumbnail: twitterCard }} />
      {(displayTitle || user) && <Typography variant="h1" className={classes.title}>{title}</Typography>}
      {displaySubtitle && !user && <Typography variant="subtitle1">{t('repo-description')}</Typography>}
      <ShareButtons {...{ settings, title: t('site-title'), description: t('site-description'), thumbnail: twitterCard || logo, link: window.location.href }} />
      {!user &&
        <Paper className={classes.selectProjects}>
          <SelectProjects {...{ settings, filters, updateFilters, setLoading, setError }} />
        </Paper>
      }
      <Typography variant="body2">{projectCount}</Typography>
      <ToggleButtonGroup
        className={classes.displayMode}
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
      {(listMode
        && <PaginatedList {...{ user, projects, settings, updateAct }} />)
        || <ScrollMosaic {...{ user, projects, settings, updateAct }} />
      }
      <BackToTop {...{ settings, showBelow: 300 }} />
    </div >
  );
}

export default RepoList;