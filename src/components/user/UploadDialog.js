/*!
 *  File    : components/user/UploadDialog.js
 *  Created : 2021-07-21
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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, LinearProgress, Box } from '@mui/material';
import { filesize } from 'filesize';
import { useTranslation } from 'react-i18next';

function UploadDialog({ settings, uploadDlg, setUploadDlg, userData, uploadAction }) {

  const { rootRef } = settings;
  const { t } = useTranslation();

  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('');
  const [err, setErr] = useState(null);
  const [warn, setWarn] = useState(null);
  const [ready, setReady] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const availSpace = userData ? userData.quota - userData.currentSize : 0;

  const reset = () => {
    setFile(null);
    setFolder('');
    setErr(null);
    setWarn(null);
    setReady(false);
    setWaiting(false);
  }

  const handleUploadClick = ev => {
    if (ev.target.files && ev.target.files.length > 0) {
      const file = ev.target.files[0];
      const folder = file.name.substring(0, file.name.indexOf('.')).trim().replace(/[\W]/gi, '_').toLowerCase() || 'prj';
      setFile(file);
      setFolder(folder);
      checkErrors(file, folder);
    }
  }

  const updateFolder = ev => {
    const folder = ev.target.value;
    setFolder(folder);
    checkErrors(file, folder);
  }

  const checkErrors = (file, folder) => {
    let err = null;
    if (!file.name.toLowerCase().endsWith('.scorm.zip'))
      err = t('user-repo-err-bad-type');
    else if (file.size > availSpace)
      err = t('user-repo-err-quota');
    else if (!folder)
      err = t('user-repo-err-no-name');
    else if (/[\W]/gi.test(folder))
      err = t('user-repo-err-bad-chars');

    setErr(err);
    setReady(err === null);

    if (folder && userData.projects.find(prj => prj.name === folder))
      setWarn(t('user-repo-warn-dir-exists'));
    else
      setWarn(null);
  }

  const uploadProject = () => {
    if (file && folder && !err) {
      setWaiting(true);
      setReady(false);
      uploadAction(file, folder);
    }
  }

  return (
    <Dialog
      container={() => rootRef.current}
      fullWidth
      maxWidth="md"
      open={uploadDlg}
      slotProps={{ transition: { onExited: reset } }}
      aria-labelledby="upload-dialog-title"
    >
      <DialogTitle id="upload-dialog-title">{t('user-repo-upload-title')}</DialogTitle>
      <DialogContent sx={{ '& > *': { my: 2 } }}>
        <Box sx={{ '& .code': { fontFamily: 'Monospace' } }} dangerouslySetInnerHTML={{ __html: t('user-repo-upload-info') }} />
        <input
          type="file"
          accept=".scorm.zip"
          style={{ display: 'none' }}
          id="input-file"
          onChange={handleUploadClick}
          disabled={waiting}
        />
        <label htmlFor="input-file">
          <Button component="span" variant="contained" disabled={waiting}>{t('user-repo-upload-select-file')}</Button>
        </label>
        {file &&
          <>
            <Box sx={{ mt: 2 }}>
              {t('user-repo-upload-selected-file')} <Box component="span" sx={{ fontWeight: 'bold' }}>{file.name}</Box> ({filesize(file.size, { locale: true })})
            </Box>
            <TextField
              sx={{ width: '100%', maxWidth: '18rem' }}
              label={t('user-repo-upload-current-directory')}
              value={folder}
              onChange={updateFolder}
              disabled={waiting}
            />
          </>
        }
        <Box sx={{ height: '4rem' }}>
          {warn && <Box sx={{ color: 'warning.dark' }}>{warn}</Box>}
          {err && <Box sx={{ color: 'error.dark' }}>{err}</Box>}
          {waiting &&
            <Box sx={{ mt: 2, '& > *': { my: 1 } }}>
              <div>{t('user-repo-uploading')}</div>
              <LinearProgress />
            </Box>
          }
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={uploadProject} disabled={!ready || waiting} color="primary">{t('user-repo-upload-publish')}</Button>
        <Button onClick={() => setUploadDlg(false)} color="primary" disabled={waiting}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadDialog;
