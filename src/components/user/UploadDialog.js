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
import { makeStyles } from "@material-ui/core/styles";
import { mergeClasses } from '../../utils';
// import { getResolvedVersionForLanguage } from '../../utils/node';
import filesize from 'filesize';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
  },
  content: {
    '& > *': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
  input: {
    display: 'none',
  },
  info: {
    height: '4rem',
  },
  fileInfo: {
    marginTop: theme.spacing(2),
  },
  fileName: {
    fontWeight: 'bold',
  },
  folder: {
    width: '100%',
    maxWidth: '18rem',
  },
  error: {
    color: theme.palette.error.dark,
  },
  warning: {
    color: theme.palette.warning.dark,
  },
  waiting: {
    marginTop: theme.spacing(2),
    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  instructions: {
    "& .code": {
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: "1.2rem",
    },
  },
}));

function UploadDialog({ settings, uploadDlg, setUploadDlg, userData, uploadAction, ...props }) {

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

  const classes = mergeClasses(props, useStyles());

  return (
    <Dialog
      container={() => rootRef.current}
      className={classes['root']}
      open={uploadDlg}
      TransitionProps={{ onExit: reset }}
      aria-labelledby="upload-dialog-title"
    >
      <DialogTitle id="upload-dialog-title">{t('user-repo-upload-title')}</DialogTitle>
      <DialogContent className={classes['content']}>
        <div className={classes['instructions']} dangerouslySetInnerHTML={{ __html: t('user-repo-upload-info') }} />
        <input
          type="file"
          accept=".scorm.zip"
          className={classes['input']}
          id="input-file"
          onChange={handleUploadClick}
          disabled={waiting}
        />
        <label htmlFor="input-file">
          <Button component="span" variant="contained" disabled={waiting}>{t('user-repo-upload-select-file')}</Button>
        </label>
        {file &&
          <>
            <div className={classes['fileInfo']}>
              {t('user-repo-upload-selected-file')} <span className={classes['fileName']}>{file.name}</span> ({filesize(file.size, { locale: true })})
            </div>
            <TextField
              className={classes['folder']}
              label={t('user-repo-upload-current-directory')}
              value={folder}
              onChange={updateFolder}
              disabled={waiting}
            />
          </>
        }
        <div className={classes['info']}>
          {warn && <div className={classes['warning']}>{warn}</div>}
          {err && <div className={classes['error']}>{err}</div>}
          {waiting &&
            <div className={classes['waiting']}>
              <div>{t('user-repo-uploading')}</div>
              <LinearProgress />
            </div>
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={uploadProject} disabled={!ready || waiting} color="primary">{t('user-repo-upload-publish')}</Button>
        <Button onClick={() => setUploadDlg(false)} color="primary" disabled={waiting}>{t('cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadDialog;
