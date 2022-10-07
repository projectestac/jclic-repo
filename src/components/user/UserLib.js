/*!
 *  File    : components/user/UserLib.js
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

/* global google */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { filesize } from 'filesize';
import { checkFetchResponse, clickOnLink, getAbsoluteURL, ellipsis } from '../../utils';
import { Box, Alert, Button, IconButton, CircularProgress, Typography, Link, Avatar } from '@mui/material';
import { LibraryAdd, Delete, CloudDownload, Eject, Info } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog';
import UploadDialog from './UploadDialog';
import ProjectCard from '../repo/ProjectCard';
import DataCard from '../DataCard';

const GOOGLE_BUTTON_ID = 'googleButton';
const GOOGLE_BUTTON_SLOT = 'googleButtonSlot';

function UserLib({ settings }) {

  const googleButtonRef = useRef(null);
  const { t } = useTranslation();
  const { displayTitle, userLibApi, repoPath, debug, googleOAuth2Id, gsiApi, authKey, isWebComponent } = settings;
  /**
   * userData fields: {
   *   googleUser,
   *   status (vaildated|error),
   *   id, fullUserName, email, avatar,
   *   expires (ISO date),
   *   currentSize (bytes), quota (bytes),
   *   projects: [
   *     { basePath, name, title, cover, coverWebp, thumbnail, mainFile,
   *       author, school, date,
   *       meta_langs, description: {lang:desc,}, langCodes: [lang,], languages: {lang:langName,}, levels: {lang:level,}, areas: {lang:area,},
   *       files: [file,], totalFileSize(bytes)
   *     },
   *   ]
   * }
   */
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [deletePrj, setDeletePrj] = useState(null);
  const [uploadDlg, setUploadDlg] = useState(false);
  const [googleScript, setGoogleScript] = useState(null);

  const title = userData ? t('user-repo-title', { user: userData.fullUserName || userData.id }) : t('user-repo');

  const loadGSI = () => {
    // Load Google Identity Services Javascript API
    if (!googleScript) {
      const scriptTag = document.createElement('script');
      scriptTag.src = gsiApi;
      scriptTag.async = true;
      scriptTag.defer = true;
      scriptTag.onload = () => {

        if (!google) {
          console.error('Global object "google" not found!');
          return;
        }

        // Initialize API
        google.accounts.id.initialize({
          client_id: googleOAuth2Id,
          auto_select: false,
          callback: response => loginSuccess(response.credential),
          cancel_on_tap_outside: false,
        });

        // Render Google Button
        const buttonHost = isWebComponent ? document.getElementById(GOOGLE_BUTTON_ID) : googleButtonRef.current;
        if (!buttonHost)
          console.error('Unable to find any HTML element suitable to be used as host for the Google log-in button');
        else
          google.accounts.id.renderButton(
            buttonHost,
            {
              type: 'standard', // 'standard' or 'button'
              theme: 'filled_blue', // 'outline', 'filled_blue' or 'filled_black'
              size: 'large', // 'large', 'medium' or 'small'
              text: 'signin', // 'signin_with', 'signup_with', 'continue_with' or 'signin'
              shape: 'rectangular', // 'rectangular', 'pill', 'circle' or 'square'
              logo_alignment: 'left', // 'left', 'center'
              width: 300, // max: 400
            }
          );
        // Also display the One Tap dialog (WARNING: Only works for the first login!)
        // google.accounts.id.prompt();
      };

      scriptTag.onerror = (error) => {
        console.error('Error loading Google Identity Services', error);
      };

      // Place the script tag
      document.head.appendChild(scriptTag);
      setGoogleScript(scriptTag);

      // Return a cleaning function to `useEffect`
      return () => {
        document.head.removeChild(googleScript);
        setGoogleScript(null);
      }
    }
  };

  useEffect(() => {
    if (!userData) {
      const obj = JSON.parse(sessionStorage.getItem(authKey));
      // Consider the authentication code to be valid for the entire session.
      if (obj && obj.credential /* && obj.expires && Date.now() < new Date(obj.expires) */)
        loginSuccess(obj.credential);
      else
        return loadGSI();
    }
  }, []);

  const loginSuccess = (credential) => {
    sessionStorage.removeItem(authKey);
    if (credential) {
      setLoading(true);
      fetch(`${userLibApi}/getUserInfo`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({ NEW_API: true, id_token: credential }),
      })
        .then(checkFetchResponse)
        .then(data => {
          if (!data || data.status !== 'validated') {
            throw new Error(data?.error);
          }
          data.projects.forEach(normalizeProjectFields);
          sessionStorage.setItem(authKey, JSON.stringify({ credential }));
          setUserData(data);
          setErr(null);
        })
        .catch(error => setErr(error?.toString() || t('generic-error')))
        .finally(() => {
          setLoading(false);
        });
    }
    else
      setErr(t('user-repo-login-error'));
  }

  const logout = () => {
    if (userData) {
      sessionStorage.removeItem(authKey);
      setUserData(null);
      setErr(null);
      if (!googleScript)
        loadGSI();
    }
  }

  const normalizeProjectFields = project => {
    if (project.basePath)
      project.path = project.basePath;
    if (!project.totalSize)
      project.totalSize = project.totalFileSize;
    return project;
  };

  const uploadProject = () => {
    setUploadDlg(true);
  }

  const deleteProject = (project) => (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDeletePrj(project);
  }

  const deleteAction = (project) => {
    setDeletePrj('waiting');
    debug && console.log(`Project "${project.title}" should be deleted`);

    fetch(`${userLibApi}/deleteProject`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({ project: project.name }),
    })
      .then(checkFetchResponse)
      .then(response => {
        if (response.status === 'ok' ||
          // Workaround for NFS delay when deleting files
          (response.status === 'error' && response.error && response.error.indexOf('Unable to delete directory') >= 0)) {
          const updatedUserData = { ...userData };
          updatedUserData.projects = userData.projects.filter(prj => prj.name !== project.name);
          updatedUserData.currentSize -= project.totalSize;
          setUserData(updatedUserData);
        }
        else
          throw new Error(response.error || t('unknown-error'));
      })
      .catch(error => {
        alert(t('user-repo-delete-err', { error: error?.toString() || t('generic-error') }));
      })
      .finally(() => {
        setDeletePrj(null);
      });
  }

  const uploadAction = (file, folder) => {
    const data = new FormData();
    data.append('scormFile', file);
    data.append('project', folder);
    fetch(`${userLibApi}/uploadUserFile`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      body: data,
    })
      .then(checkFetchResponse)
      .then(response => {
        if (response.status === 'ok' && response.project) {
          const project = normalizeProjectFields(response.project);
          const updatedUserData = { ...userData };
          const updatedProject = userData.projects.find(prj => prj.name === project.name);
          if (updatedProject) {
            updatedUserData.currentSize -= updatedProject.totalSize;
            updatedUserData.projects = userData.projects.filter(prj => prj.name !== project.name);
          }
          updatedUserData.projects.push(project);
          updatedUserData.currentSize += project.totalSize;
          setUserData(updatedUserData);
        }
        else
          throw new Error(response.error || t('unknown-error'));
      })
      .catch(error => {
        alert(t('user-repo-upload-err', { error: error?.toString() || t('generic-error') }));
      })
      .finally(() => {
        setUploadDlg(false);
      });
  }

  const downloadProject = (project) => (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    clickOnLink(`${userLibApi}/downloadUserProject?prj=${userData.id}/${project.basePath}`);
  }

  const userRepoPath = userData && getAbsoluteURL(repoPath, { user: userData.id });
  const updateAct = (path, user) => clickOnLink(getAbsoluteURL(repoPath, { prj: path, user }));

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, typography: 'body1' }} ref={settings.rootRef} >
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1, mb: 1.5 }}>
        {displayTitle && <Typography variant="h1" sx={{ color: 'primary.dark' }}>{title}</Typography>}
        {userData && <Avatar alt={userData.fullUserName} src={userData.avatar} sx={{ width: 56, height: 56 }} />}
      </Box>
      <Box sx={{ minWidth: 0.8, maxWidth: 800 }} dangerouslySetInnerHTML={{ __html: t('user-repo-info') }} />
      {err && <Alert severity="error">{t('error', { error: err.toLocaleString() })}</Alert>}
      {loading && <CircularProgress sx={{ my: 2 }} />}
      {!loading &&
        <>
          <Box id="loginArea" sx={{ mt: 3, '& > button': { mr: 2, mb: 2 } }}>
            {!userData &&
              <Box sx={{ maxWidth: '300px' }} >
                <slot name={GOOGLE_BUTTON_SLOT} ref={googleButtonRef}></slot>
              </Box>
            }
            {userData && <Button variant="contained" startIcon={<Eject />} onClick={logout}>{t('user-repo-logout')}</Button>}
            {userData && <Button variant="contained" startIcon={<LibraryAdd />} onClick={uploadProject}>{t('user-repo-upload-project')}</Button>}
          </Box>
          {userData &&
            <>
              <DataCard>
                <tbody>
                  <tr>
                    <td>{`${t('user-repo-user')}:`}</td>
                    <td>{userData.fullUserName || userData.id} ({userData.email})</td>
                  </tr>
                  <tr>
                    <td>{`${t('user-repo-library')}:`}</td>
                    <td>
                      <Box sx={{ maxWidth: 400, ...ellipsis }}>
                        <Link href={userRepoPath}>{userRepoPath}</Link>
                      </Box>
                    </td>
                  </tr>
                  <tr>
                    <td>{`${t('user-repo-projects')}:`}</td>
                    <td>{userData.projects.length}</td>
                  </tr>
                  <tr>
                    <td>{`${t('user-repo-quota')}:`}</td>
                    <td>{t('user-repo-quota-exp', { current: filesize(userData.currentSize, { locale: true }), quota: filesize(userData.quota, { locale: true }) })}</td>
                  </tr>
                </tbody>
              </DataCard>
              <Typography variant="h3" color="primary">{t('user-repo-projects')}</Typography>
              {(userData.projects.length === 0 && <p>{t('user-repo-no-projects')}</p>) ||
                <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: { xs: 1, sm: 2 }, '& a:link': { textDecoration: 'none' } }}>
                  {userData.projects.map((project, n) => (
                    <ProjectCard key={n} {...{ settings, user: userData.id, updateAct, project }} >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1 }}>
                          {`${t('prj-size')}: ${filesize(project.totalSize, { locale: true })}`}<br />
                          {`${t('prj-numfiles')}: ${project.files.length}`}
                        </Box>
                        <IconButton
                          aria-label={t('prj-more-info')}
                          title={t('prj-more-info')}
                          color="primary"
                          size="large">
                          <Info />
                        </IconButton>
                        <IconButton
                          onClick={downloadProject(project)}
                          aria-label={t('prj-download')}
                          title={t('prj-download')}
                          color="primary"
                          size="large">
                          <CloudDownload />
                        </IconButton>
                        <IconButton
                          onClick={deleteProject(project)}
                          aria-label={t('user-repo-delete-project')}
                          title={t('user-repo-delete-project')}
                          color="primary"
                          size="large">
                          <Delete />
                        </IconButton>
                      </Box>
                    </ProjectCard>
                  ))}
                </Box>
              }
            </>
          }
        </>
      }
      <DeleteDialog {...{ settings, deletePrj, setDeletePrj, deleteAction }} />
      <UploadDialog {...{ settings, uploadDlg, setUploadDlg, userData, uploadAction }} />
    </Box>
  );
}

UserLib.createSlotClients = (parent) => {
  const buttonTag = document.createElement('div');
  buttonTag.id = GOOGLE_BUTTON_ID;
  buttonTag.slot = GOOGLE_BUTTON_SLOT;
  parent.appendChild(buttonTag);
}

export default UserLib;