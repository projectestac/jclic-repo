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

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from 'react-google-login';
import filesize from 'filesize';
import { checkFetchResponse, clickOnLink, getAbsoluteURL } from '../../utils';
import { Box, Alert, Button, IconButton, CircularProgress, Typography, Link, Avatar } from '@mui/material';
import { LibraryAdd, Delete, CloudDownload, ExitToApp, Eject, Info } from '@mui/icons-material';
import DeleteDialog from './DeleteDialog';
import UploadDialog from './UploadDialog';
import ProjectCard from '../repo/ProjectCard';
import DataCard from '../DataCard';

const AUTH_KEY = '__auth';

function UserLib({ settings }) {

  const { t } = useTranslation();
  const { displayTitle, googleOAuth2Id, userLibApi, repoPath, debug } = settings;
  /**
   * userData fields: {
   *   googleUser,
   *   status (vaildated|error),
   *   id, fullUserName, email, avatar,
   *   expires (ISO date),
   *   currentSize (bytes), quota (bytes),
   *   projects: [
   *     { basePath, name, title, cover, thumbnail, mainFile,
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

  const title = userData ? t('user-repo-title', { user: userData.fullUserName || userData.id }) : t('user-repo');

  useEffect(() => {
    if (!userData) {
      const obj = JSON.parse(sessionStorage.getItem(AUTH_KEY));
      // Consider the authentication code to be valid for the entire session.
      if (obj && obj.googleUser /* && obj.expires && Date.now() < new Date(obj.expires) */)
        loginSuccess(obj.googleUser);
    }
  });

  const loginSuccess = (googleUser) => {
    sessionStorage.removeItem(AUTH_KEY);
    if (googleUser && googleUser.tokenId) {
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
        body: `id_token=${googleUser.tokenId}`,
      })
        .then(checkFetchResponse)
        .then(data => {
          if (!data || data.status !== 'validated') {
            throw new Error(data?.error);
          }
          data.projects.forEach(normalizeProjectFields);
          sessionStorage.setItem(AUTH_KEY, JSON.stringify({ googleUser }));
          setUserData(data);
          setErr(null);
        })
        .catch(error => {
          if (googleUser.disconnect)
            googleUser.disconnect();
          setErr(error?.toString() || t('generic-error'));
        })
        .finally(() => {
          setLoading(false);
        });
    }
    else
      setErr(t('user-repo-login-error'));
  }

  const normalizeProjectFields = project => {
    if (project.basePath)
      project.path = project.basePath;
    if (!project.totalSize)
      project.totalSize = project.totalFileSize;
    return project;
  };

  const loginFailed = ({ error, details }) => {
    sessionStorage.removeItem(AUTH_KEY);
    setUserData(null);
    setLoading(false);
    setErr(`ERROR: ${details} (${error})`);
  }

  const logout = () => {
    if (userData && typeof userData?.googleUser?.disconnect === 'function')
      userData.googleUser.disconnect();
    sessionStorage.removeItem(AUTH_KEY);
    setUserData(null);
    setErr(null);
  }

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
      body: `project=${project.name}`,
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
          <Box sx={{ mt: 3, '& > button': { mr: 2, mb: 2 } }}>
            {!userData &&
              <GoogleLogin
                clientId={googleOAuth2Id}
                buttonText={t('user-repo-login')}
                onSuccess={loginSuccess}
                onFailure={loginFailed}
                isSignedIn={false}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                  <Button variant="contained" startIcon={<ExitToApp />}
                    onClick={renderProps.onClick} disabled={renderProps.disabled}>{t('user-repo-login')}</Button>
                )}
              />
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
                      <Box sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

export default UserLib;