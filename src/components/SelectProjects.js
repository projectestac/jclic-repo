/*!
 *  File    : components/SelectProjects.js
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
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses, checkFetchResponse } from '../utils';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(_theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '1rem 0.5rem',
  },
  label: {
    flexBasis: '100%',
    marginLeft: '0.5rem',
    marginBottom: '0.5rem',
  },
  formControl: {
    marginRight: '0.5rem',
    marginLeft: '0.5rem',
    width: '10rem',
    flexGrow: 1,
    maxWidth: '21rem',
  },
}));

function SelectProjects({ settings, filters, setFilters, setLoading, setError, ...props }) {

  const { t, jclicSearchService, rootRef } = settings;
  const classes = mergeClasses(props, useStyles());
  const [query, setQuery] = useState(filters?.text || '');
  const handleChange = ev => {
    ev.preventDefault();
    const { target: { name, value } } = ev;
    setFilters({ ...filters, [name]: value === '*' ? '' : value })
  }
  const handleEnterSearch = ev => {
    if (ev.type === 'click' || ev.key === 'Enter') {
      ev.preventDefault();
      if (query) {
        setLoading(true);
        fetch(`${jclicSearchService}?lang=${t('lang')}&method=boolean&q=${encodeURIComponent(query)}`)
          .then(checkFetchResponse)
          .then(textMatches => {
            setFilters({ ...filters, text: query, textMatches });
          })
          .catch(err => setError(err?.toString() || 'Error'));
      }
      else
        setFilters({ ...filters, text: '', textMatches: [] });
    }
  }

  return (
    <div className={classes.root}>
      <Typography color="textSecondary" className={classes['label']}>{t('prj-filter')}</Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-lang-label">{t('prj-language')}</InputLabel>
        <Select
          labelId="select-lang-label"
          name="language"
          MenuProps={{ container: () => rootRef.current }}
          value={filters?.language || ''}
          onChange={handleChange}>
          {t('lang-codes').split('|').map((code) => <MenuItem key={code} value={code}>{t(`lang-${code}`)}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-subj-label">{t('prj-subject')}</InputLabel>
        <Select
          labelId="select-subj-label"
          name="subject"
          MenuProps={{ container: () => rootRef.current }}
          value={filters?.subject || ''}
          onChange={handleChange}>
          {t('subj-codes').split('|').map((code) => <MenuItem key={code} value={code}>{t(`subj-${code}`)}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="select-level-label">{t('prj-level')}</InputLabel>
        <Select
          labelId="select-level-label"
          name="level"
          MenuProps={{ container: () => rootRef.current }}
          value={filters?.level || ''}
          onChange={handleChange}>
          {t('level-codes').split('|').map((code) => <MenuItem key={code} value={code}>{t(`level-${code}`)}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          label={t('prj-text')}
          value={query}
          onChange={({ target: { value } }) => setQuery(value)}
          onKeyPress={handleEnterSearch}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label={t('search')}
                  title={t('search')}
                  onClick={handleEnterSearch}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
          }}
        />
      </FormControl>
    </div>
  );
}

export default SelectProjects;