/*!
 *  File    : components/repo/ProjectCard.js
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

import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from '../../utils';
import { Fab, Card } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: '20rem',
    cursor: 'pointer',
  },
  cardContent: {
    position: 'relative',
    height: '10rem',
  },
  title: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '0.5rem 3rem 0.5rem 0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: theme.palette.grey[800],
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  language: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    padding: '0.15rem 0.15rem 0.3rem 0.1rem',
    margin: '0.4rem',
    display: 'inline-block',
    borderRadius: '4px',
    minWidth: '1.5rem',
    lineHeight: '1rem',
    textAlign: 'center',
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.primary.contrastText,
  },
  playBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: '0.4rem',
  },
  cardBottom: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '9pt',
    padding: '0.5rem',
  },
}));

function ProjectCard({ settings, user, project, updateAct, children, ...props }) {

  const { t } = useTranslation();
  const { repoBase } = settings;
  const classes = mergeClasses(props, useStyles());
  const { path, title = 'Untitled', author = 'Unknown author', langCodes = [], mainFile, cover } = project;
  const base = `${repoBase}/${user ? `${user}/` : ''}${path}`;
  const projectLink = `${base}/${mainFile.replace(/[^/]*$/, 'index.html')}`;
  const [raised, setRaised] = useState(false);

  return (
    <Card
      className={classes['card']}
      onMouseOver={() => setRaised(true)}
      onMouseOut={() => setRaised(false)}
      onClick={ev => {
        ev.preventDefault();
        updateAct(path, user);
      }}
      elevation={raised ? 8 : 1}
    >
      <div className={classes.cardContent} style={{ background: `no-repeat center/150% url("${base}/${cover}")` }}>
        {langCodes.map(code => <span key={code} className={classes.language}>{code}</span>)}
        <div className={classes.title}>{title}</div>
        <Fab
          className={classes.playBtn}
          color="primary"
          size="small"
          onClick={ev => {
            ev.preventDefault();
            window.open(projectLink, '_BLANK');
          }}
          title={t('prj-launch-tooltip')}
        >
          <PlayArrow />
        </Fab>
      </div>
      <div className={classes['cardBottom']}>
        {children || author}
      </div>
    </Card>
  );
}

export default ProjectCard;
