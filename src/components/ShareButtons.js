/*!
 *  File    : components/ShareButtons.js
 *  Created : 2021-07-19
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
import { IconButton, Paper, Input, InputAdornment, Snackbar, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { Email, Facebook, X, Telegram, Pinterest, WhatsApp, Code, Close, FileCopyOutlined } from '@mui/icons-material';
import ClassroomIcon from '../assets/classroom.svg';
import MoodleIcon from '../assets/moodle.svg';
import { useTranslation } from 'react-i18next';

const E = encodeURIComponent;

function ShareButtons({ settings, link, moodleLink, title, description, thumbnail, embedOptions, emailBody = null }) {

  const { t } = useTranslation();
  const {
    shareSites: { twitter, facebook, telegram, whatsapp, pinterest, email, moodle, classroom, embed },
    shareMeta: { hash, via },
    facebookId,
  } = settings;

  const [embedBox, setEmbedBox] = useState(false);
  const [moodleBox, setMoodleBox] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const handleSnackClose = (_ev, reason) => { if (reason !== 'clickaway') setSnackOpen(false); };
  const buildEmbedCode = (options) => options ? `<iframe ${Object.keys(options).map(key => `${key}="${options[key]}"`).join(' ')}></iframe>` : null;
  const [embedCode, setEmbedCode] = useState(buildEmbedCode(embedOptions));
  const [embedSize, setEmbedSize] = useState('800x600');
  const handleChangeEmbedSize = (ev) => {
    setEmbedSize(ev.target.value);
    const wh = ev.target.value.split('x');
    setEmbedCode(buildEmbedCode({ ...embedOptions, width: wh[0], height: wh[1] }));
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap',
        //'& button': { mlx: -0.6 },
        '& svg': { width: 24, height: 24 }
      }}>
        {twitter && title && link &&
          <a
            href={`https://twitter.com/intent/tweet?text=${E(title)}&url=${E(link)}${hash ? `&hashtags=${E(hash)}` : ''}${via ? `&via=${E(via)}` : ''}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              sx={{ color: '#000' }}
              aria-label={t('share-twitter')}
              title={t('share-twitter')}
              size="large">
              <X style={{
                // Add extra margin to make 'X' logo visually similar to others
                width: '20px', height: '20px',
                margin: '2px'
              }} />
            </IconButton>
          </a>
        }
        {facebook && title && link &&
          <a
            href={`https://www.facebook.com/dialog/feed?app_id=${facebookId}&link=${E(link)}${thumbnail ? `&picture=${E(thumbnail)}` : ''}&name=${E(title)}${description ? `&description=${E(description)}` : ''}&redirect_uri=${E('https://facebook.com')}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              sx={{ color: '#3c5a98' }}
              aria-label={t('share-facebook')}
              title={t('share-facebook')}
              size="large">
              <Facebook />
            </IconButton>
          </a>
        }
        {telegram && title && link &&
          <a
            href={`https://telegram.me/share/url?url=${E(link)}&text=${E(`${title}\n${description || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              sx={{ color: '#37aee2' }}
              aria-label={t('share-telegram')}
              title={t('share-telegram')}
              size="large">
              <Telegram />
            </IconButton>
          </a>}
        {whatsapp && title && link &&
          <a
            href={`https://api.whatsapp.com/send?text=${E(`${title}\n${link}`)}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              sx={{ color: '#2cb842' }}
              aria-label={t('share-whatsapp')}
              title={t('share-whatsapp')}
              size="large">
              <WhatsApp />
            </IconButton>
          </a>
        }
        {pinterest && thumbnail && title && link &&
          <a
            href={`https://pinterest.com/pin/create/button/?url=${E(link)}&media=${E(thumbnail)}&description=${E(title)}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              sx={{ color: '#cb2128' }}
              aria-label={t('share-pinterest')}
              title={t('share-pinterest')}
              size="large">
              <Pinterest />
            </IconButton>
          </a>
        }
        {email && title &&
          <a
            href={`mailto:?subject=${E(title)}&body=${E(emailBody || `${title}\n\n${description || ''}\n${link}`)}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              sx={{ color: '#0a5191' }}
              aria-label={t('share-email')}
              title={t('share-email')}
              size="large">
              <Email />
            </IconButton>
          </a>
        }
        {classroom && link &&
          <a
            href={`https://classroom.google.com/u/0/share?url=${E(link)}`}
            target="_blank"
            rel="noopener noreferrer">
            <IconButton
              aria-label={t('share-classroom')}
              title={t('share-classroom')}
              size="large">
              <ClassroomIcon />
            </IconButton>
          </a>
        }
        {moodle && moodleLink &&
          <IconButton
            aria-label={t('share-moodle')}
            title={t('share-moodle')}
            onClick={() => {
              setSnackOpen(false);
              setMoodleBox(!moodleBox);
              setEmbedBox(false);
            }}
            size="large">
            <MoodleIcon />
          </IconButton>
        }
        {embed && embedCode &&
          <IconButton
            aria-label={t('share-embed')}
            title={t('share-embed')}
            onClick={() => {
              setSnackOpen(false);
              setMoodleBox(false);
              setEmbedBox(!embedBox);
            }}
            size="large">
            <Code />
          </IconButton>
        }
      </Box>
      {moodle && moodleLink && moodleBox &&
        <Paper sx={{ p: 2, mb: 2, maxWidth: '60rem' }} elevation={2}>
          <label htmlFor="moodleLink" dangerouslySetInnerHTML={{ __html: t('share-moodle-label') }} />
          <Input
            type="text"
            fullWidth
            sx={{ fontFamily: 'Monospace', color: 'text.disabled' }}
            id="moodleLink"
            value={moodleLink}
            inputProps={{ readOnly: true }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={t('share-copy')}
                  title={t('share-copy')}
                  size="large"
                  onClick={() => {
                    navigator.clipboard.writeText(moodleLink)
                      .then(() => setSnackOpen(true));
                  }}>
                  <FileCopyOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        </Paper>
      }
      {embed && embedCode && embedBox &&
        <Paper sx={{ p: 2, mb: 2, maxWidth: '60rem' }} elevation={2}>
          <label htmlFor="embedLink">{t('share-embed-label')}</label>
          <Input
            type="text"
            fullWidth
            id="embedLink"
            value={embedCode}
            inputProps={{ readOnly: true }}
            sx={{ fontFamily: 'Monospace', color: 'text.disabled' }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={t('share-copy')}
                  title={t('share-copy')}
                  size="large"
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode)
                      .then(() => setSnackOpen(true));
                  }}>
                  <FileCopyOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
          <RadioGroup
            sx={{ flexDirection: 'row', justifyContent: 'center' }}
            aria-label={t('share-embed-size')}
            value={embedSize}
            onChange={handleChangeEmbedSize}>
            <FormControlLabel value={'640x390'} control={<Radio />} label="640x390" />
            <FormControlLabel value={'800x600'} control={<Radio />} label="800x600" />
            <FormControlLabel value={'100%x800'} control={<Radio />} label="100%" />
          </RadioGroup>
        </Paper>
      }
      <Snackbar
        sx={{ position: 'absolute', top: '9rem' }}
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        message={t('share-copied')}
        action={
          <IconButton size="small" aria-label={t('close')} title={t('close')} color="inherit" onClick={handleSnackClose}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}

export default ShareButtons;
