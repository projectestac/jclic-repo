/*!
 *  File    : components/user/DeleteDialog.js
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

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';

function DeleteDialog({ settings, deletePrj, setDeletePrj, deleteAction }) {

  const { rootRef } = settings;
  const { t } = useTranslation();

  return (
    <Dialog
      container={() => rootRef.current}
      open={deletePrj !== null}
      onClose={() => setDeletePrj(null)}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">{t('user-repo-delete')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {deletePrj === 'waiting' ?
            t('user-repo-delete-wait') :
            t('user-repo-confirm-delete', { project: deletePrj?.title })
          }
        </DialogContentText>
        {deletePrj === 'waiting' && <LinearProgress style={{ marginTop: '2rem', marginBottom: '3rem' }} />}
      </DialogContent>
      {deletePrj !== 'waiting' &&
        <DialogActions>
          <Button onClick={() => setDeletePrj(null)} color="primary">{t('cancel')}</Button>
          <Button onClick={() => deleteAction(deletePrj)} color="primary" autoFocus>{t('user-repo-delete-project')}</Button>
        </DialogActions>
      }
    </Dialog>
  );
}

export default DeleteDialog;