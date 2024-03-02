/*!
 *  File    : components/repo/SelectProjects.js
 *  Created : 2021-07-20
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
import { InputLabel, MenuItem, FormControl, Select, TextField, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function SelectProjects({ settings, filters, updateFilters, currentCount }) {

  const { t } = useTranslation();
  const { rootRef } = settings;
  const [query, setQuery] = useState(filters?.text || '');
  const count = t('repo-num', { count: currentCount, context: `${currentCount}` });

  const handleChange = ev => {
    ev.preventDefault();
    const { target: { name, value } } = ev;
    updateFilters({ ...filters, [name]: value === '*' ? '' : value })
  }

  const handleEnterSearch = ev => {
    if (ev.type === 'click' || ev.key === 'Enter') {
      ev.preventDefault();
      updateFilters({ ...filters, text: query });
    }
  }

  return (
    <Box sx={{
      display: 'flex', flexWrap: 'wrap',
      pb: 2, pt: 1, px: 1,
      backgroundColor: '#f5f5f5',
      '& .type-select-control': {
        mx: 1,
        width: '10rem',
        flexGrow: 1,
        maxWidth: '21rem'
      }
    }}>
      <FormControl sx={{ flexBasis: '100%', mx: 1, mb: 1 }}>
        <TextField
          sx={{ maxWidth: '21rem' }}
          label={t('prj-text')}
          variant="standard"
          value={query}
          onChange={({ target: { value } }) => setQuery(value)}
          onKeyDown={handleEnterSearch}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label={t('search')}
                  title={t('search')}
                  onClick={handleEnterSearch}
                  edge="end"
                  size="large">
                  <Search />
                </IconButton>
              </InputAdornment>
          }}
        />
      </FormControl>
      <FormControl className='type-select-control'>
        <InputLabel id="select-lang-label" variant="standard">{t('prj-language')}</InputLabel>
        <Select
          labelId="select-lang-label"
          name="language"
          variant="standard"
          MenuProps={{ container: () => rootRef.current }}
          value={filters?.language || ''}
          onChange={handleChange}>
          {t('lang-codes').split('|').map((code) => <MenuItem key={code} value={code}>{t(`lang-${code}`)}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl className='type-select-control'>
        <InputLabel id="select-subj-label" variant="standard">{t('prj-subject')}</InputLabel>
        <Select
          labelId="select-subj-label"
          name="subject"
          variant="standard"
          MenuProps={{ container: () => rootRef.current }}
          value={filters?.subject || ''}
          onChange={handleChange}>
          {t('subj-codes').split('|').map((code) => <MenuItem key={code} value={code}>{t(`subj-${code}`)}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl className='type-select-control'>
        <InputLabel id="select-level-label" variant="standard">{t('prj-level')}</InputLabel>
        <Select
          labelId="select-level-label"
          name="level"
          variant="standard"
          MenuProps={{ container: () => rootRef.current }}
          value={filters?.level || ''}
          onChange={handleChange}>
          {t('level-codes').split('|').map((code) => <MenuItem key={code} value={code}>{t(`level-${code}`)}</MenuItem>)}
        </Select>
      </FormControl>
      <Typography variant="body1" sx={{ flexBasis: '100%', mx: 1, mt: 3, color: 'primary.main' }}>
        {`${count}${Object.values(filters).join('') && t('repo-with-filters') || ''}`}
      </Typography>
    </Box>
  );
}

export default SelectProjects;