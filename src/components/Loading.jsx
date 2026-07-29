/*!
 *  File    : components/Loading.js
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
import { Box, Typography, LinearProgress } from "@mui/material";
import { useTranslation } from 'react-i18next';

function Loading({ settings }) {
  const { t } = useTranslation();
  const { displayTitle } = settings;
  return (
    <Box>
      {displayTitle && <Typography sx={{ mb: 2, color: 'primary.dark' }} variant="h1">{t('repo-title')}</Typography>}
      <Typography>{t('loading')}</Typography>
      <LinearProgress sx={{ my: 2 }} />
    </Box>
  );
}

export default Loading;