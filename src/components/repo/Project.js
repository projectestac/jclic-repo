/*!
 *  File    : components/repo/Project.js
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
import { Typography, IconButton, Button, Box, Popover, Input, InputAdornment, Snackbar } from '@mui/material';
import { PlayArrow, ArrowBack, PlayCircleFilled, LocalCafe, CloudDownload, FileCopyOutlined, Close } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { textContent, getPathForProject, formatDate } from '../../utils';
import ProjectDownload from './ProjectDownload';
import { filesize } from 'filesize';
import SEO from '../SEO';
import ShareButtons from '../ShareButtons';
import DataCard from '../DataCard';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function Project({ settings, user, project, fullProjectList, updateAct, canonical, ...props }) {

  const { t } = useTranslation();
  const { langDefault, logo, fullUsersPath, rootRef } = settings;
  const lang = t('lang');
  const {
    fullPath, meta_langs,
    title, author, school, date,
    languages, langCodes, areas, levels, descriptors, description, license,
    relatedTo, mainFile, instFile,
    cover, coverWebp, activities, totalSize,
    // zipFile, files, mediaFiles,
  } = project;

  const k = meta_langs.includes(lang) ? lang : langDefault;
  const pageTitle = `${user ? t('user-repo-title', { user }) : t('repo-title')} - ${title}`;
  const pageDesc = description[k];
  const textDesc = textContent(pageDesc);
  const imgPath = (coverWebp || cover) && `${fullPath}/${coverWebp || cover}` || logo;
  const moodleLink = `${fullPath}/${mainFile}`;
  const projectLink = moodleLink.replace(/\/[^/]*$/, '/index.html');
  const instJavaLink = instFile ? `${fullPath}/${instFile}` : null;
  const embedOptions = {
    width: '800',
    height: '600',
    frameborder: '0',
    allowFullScreen: 'true',
    src: projectLink,
  }
  const getProjectTitle = path => (fullProjectList && fullProjectList?.find(prj => prj.path === path)?.title) || path;

  const [dlgOpen, setDlgOpen] = useState(false);

  // See: https://schema.org/LearningResource
  const sd = {
    '@context': 'https://schema.org/',
    '@type': 'LearningResource',
    name: title,
    teaches: areas && (areas[lang] || areas[langDefault]) || '',
    educationalLevel: levels && (levels[lang] || levels[langDefault]) || '',
    learningResourceType: 'learning activity',
    author: author || '',
    description: textDesc || '',
    inLanguage: langCodes && langCodes.join(',') || '',
    thumbnailUrl: imgPath || '',
    url: projectLink,
  };

  const [instPopAnchorEl, setInstPopAnchorEl] = useState(null);
  const instPopOpen = Boolean(instPopAnchorEl);
  const instPopId = instPopOpen ? 'install-popover' : undefined;
  const [snackOpen, setSnackOpen] = useState(false);
  const handleSnackClose = (_ev, reason) => { if (reason !== 'clickaway') setSnackOpen(false); };

  return (
    <Box {...props}>
      <SEO {...{ settings, title: pageTitle, description: textDesc, author, thumbnail: imgPath, sd, canonical }} />
      <Button sx={{ mb: 2 }} onClick={() => document.referrer === fullUsersPath ? history.back() : updateAct(null, user)}>
        <ArrowBack sx={{ mr: 1 }} />
        {t(user ? 'user-repo-title' : 'repo-title', { user })}
      </Button>
      <Box sx={{ my: 2, minWidth: 0.8, maxWidth: 800 }}>
        <Typography variant="h1" sx={{ color: 'primary.dark', mb: 2 }}>{title}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 3, fontSize: '1.3rem', lineHeight: 'inherit' }}>{author}</Typography>
        <Box>
          {imgPath &&
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Box
                component="img"
                sx={{ minWidth: 96, minHeight: 96, maxWidth: 1, maxHeight: 300 }}
                src={imgPath}
                alt={t('cover-alt')} />
              <IconButton
                sx={{
                  position: 'absolute', opacity: '20%', height: '10rem', width: '10rem',
                  '& svg': { fontSize: 96 },
                  ':hover': { opacity: '90%' }
                }}
                color="primary"
                href={projectLink}
                target="_BLANK"
                title={t('prj-launch-tooltip')}
                size="large">
                <PlayArrow />
              </IconButton>
            </Box>
          }
        </Box>
        <ShareButtons {...{ settings, link: window.location.href, moodleLink, title, description: textDesc, thumbnail: imgPath, embedOptions }} />
        <Box sx={{ '& li': { mb: 2 } }}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {pageDesc}
          </ReactMarkdown>
        </Box>
      </Box>
      <DataCard>
        <tbody>
          <tr>
            <td>{`${t('prj-authors')}:`}</td>
            <td>{author}</td>
          </tr>
          {school &&
            <tr>
              <td>{`${t('prj-school')}:`}</td>
              <td>{school}</td>
            </tr>
          }
          {languages &&
            <tr>
              <td>{`${t('prj-languages')}:`}</td>
              <td>{languages[lang] || languages[langDefault]}</td>
            </tr>
          }
          {areas &&
            <tr>
              <td>{`${t('prj-subjects')}:`}</td>
              <td>{areas[lang] || areas[langDefault]}</td>
            </tr>
          }
          {levels &&
            <tr>
              <td>{`${t('prj-levels')}:`}</td>
              <td>{levels[lang] || levels[langDefault]}</td>
            </tr>
          }
          {descriptors &&
            <tr>
              <td>{`${t('prj-tags')}:`}</td>
              <td>{descriptors[lang] || descriptors[langDefault]}</td>
            </tr>
          }
          {date &&
            <tr>
              <td>{`${t('prj-date')}:`}</td>
              <td>{formatDate(date)}</td>
            </tr>
          }
          {activities &&
            <tr>
              <td>{`${t('prj-numacts')}:`}</td>
              <td>{activities}</td>
            </tr>
          }
          {totalSize &&
            <tr>
              <td>{`${t('prj-size')}:`}</td>
              <td>{filesize(totalSize, { locale: true })}</td>
            </tr>
          }
          {license &&
            <tr>
              <td>{`${t('prj-license')}:`}</td>
              <td dangerouslySetInnerHTML={{ __html: license[lang] || license[langDefault] }}></td>
            </tr>
          }
          {relatedTo &&
            <tr>
              <td>{`${t('prj-related')}:`}</td>
              <td>
                <Box component="ul" sx={{ m: 0, pl: 0, listStyleType: 'none' }}>
                  {relatedTo.map((prj, n) => (
                    <li key={n}><a href={getPathForProject(prj, user)}>{getProjectTitle(prj)}</a></li>
                  ))}
                </Box>
              </td>
            </tr>
          }
        </tbody>
      </DataCard>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& a,button': { mr: 2, mb: 2 },
      }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayCircleFilled />}
          href={projectLink}
          target="_BLANK"
          title={t('prj-launch-tooltip')}
        >
          {t('prj-launch')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudDownload />}
          title={t('prj-download-tooltip')}
          onClick={() => setDlgOpen(true)}
        >
          {t('prj-download')}
        </Button>
        {!user && instJavaLink &&
          <>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<LocalCafe />}
              target="_BLANK"
              title={t('prj-java-inst-tooltip')}
              aria-describedby={instPopId}
              onClick={ev => setInstPopAnchorEl(ev.currentTarget)}
            >
              {t('prj-java-inst')}
            </Button>
            <Popover
              id={instPopId}
              open={instPopOpen}
              anchorEl={instPopAnchorEl}
              onClose={() => { setInstPopAnchorEl(null); setSnackOpen(false); }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              container={() => rootRef.current}
            >
              <Box sx={{ minWidth: 0.8, maxWidth: 600, p: 2 }} >
                <div dangerouslySetInnerHTML={{ __html: t('java-download-info') }} />
                <Input
                  type="text"
                  fullWidth
                  sx={{ fontFamily: 'Monospace', color: 'text.disabled' }}
                  value={instJavaLink}
                  inputProps={{ readOnly: true }}
                  endAdornment={
                    <InputAdornment position="end">
                      <CopyToClipboard text={instJavaLink} onCopy={() => setSnackOpen(true)}>
                        <IconButton aria-label={t('share-copy')} title={t('share-copy')} size="large">
                          <FileCopyOutlined />
                        </IconButton>
                      </CopyToClipboard>
                    </InputAdornment>
                  }
                />
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
            </Popover>
          </>
        }
      </Box>
      <ProjectDownload {...{ settings, dlgOpen, setDlgOpen, project }} />
    </Box>
  );
}

export default Project;
