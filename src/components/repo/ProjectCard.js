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
import { Fab, Card, Box } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function ProjectCard({ settings, user, project, updateAct, children }) {

  const { t } = useTranslation();
  const { repoBase, usersBase } = settings;
  const { path, title = 'Untitled', author = 'Unknown author', langCodes = [], mainFile, cover, coverWebp } = project;
  const base = `${user ? usersBase : repoBase}/${user ? `${user}/` : ''}${path}`;
  const projectLink = `${base}/${mainFile.replace(/[^/]*$/, 'index.html')}`;
  const [raised, setRaised] = useState(false);

  return (
    <Card
      sx={{ maxWidth: '28rem', cursor: 'pointer' }}
      onMouseOver={() => setRaised(true)}
      onMouseOut={() => setRaised(false)}
      onClick={ev => {
        ev.preventDefault();
        updateAct(path, user);
      }}
      elevation={raised ? 8 : 1}
    >
      <Box
        sx={{ position: 'relative', height: '10rem' }}
        style={{ background: `no-repeat center/150% url("${base}/${coverWebp || cover}")` }}
      >
        {langCodes.map(code => (
          <Box component="span" key={code} sx={{
            fontSize: '0.8rem', fontWeight: 'bold',
            display: 'inline-block',
            m: '0.4rem', borderRadius: '4px', minWidth: '1.5rem',
            p: '0.15rem 0.15rem 0.3rem 0.1rem',
            lineHeight: '1rem', textAlign: 'center',
            backgroundColor: 'info.dark',
            color: 'primary.contrastText',
          }}>
            {code}
          </Box>))}
        <Box sx={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          p: '0.5rem 3rem 0.5rem 0.5rem',
          fontSize: '1rem', fontWeight: 'bold',
          color: 'grey.800',
          backgroundColor: 'rgba(255,255,255,0.85)',
        }}>
          {title}
        </Box>
        <Fab
          sx={{
            position: 'absolute',
            right: 0, bottom: 0,
            margin: '0.4rem',
          }}
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
      </Box>
      <Box sx={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '9pt',
        p: 1,
      }}>
        {children || author}
      </Box>
    </Card>
  );
}

export default ProjectCard;
