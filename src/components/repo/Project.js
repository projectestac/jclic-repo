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
import { Typography, IconButton, Button } from '@material-ui/core';
import { PlayArrow, ArrowBack, PlayCircleFilled, LocalCafe, CloudDownload } from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { mergeClasses, textContent, getPathForProject } from '../../utils';
import ProjectDownload from './ProjectDownload';
import filesize from 'filesize';
import SEO from '../SEO';
import ShareButtons from '../ShareButtons';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  title: {
    color: `${theme.palette.primary.dark}`,
    marginBottom: '0.5rem',
  },
  backBtn: {
    marginBottom: '1rem',
  },
  cover: {
    minWidth: '96px',
    minHeight: '96px',
    maxWidth: '100%',
    maxHeight: '300px',
  },
  btnContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  overlayBtn: {
    position: 'absolute',
    opacity: '20%',
    height: '10rem',
    width: '10rem',
    "& svg": {
      fontSize: 96,
    },
    "&:hover": {
      opacity: '90%',
    },
  },
  mainBlock: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  description: {
    "& li": {
      marginBottom: '1rem',
    },
    [theme.breakpoints.up('sm')]: {
      width: '80%',
    },
  },
  dataCard: {
    borderCollapse: 'collapse',
    minWidth: '80%',
    maxWidth: '800px',
    marginTop: '2rem',
    marginBottom: '1.5rem',
    "& td": {
      border: 'none',
      borderBottom: '1px solid lightgray',
      borderTop: '1px solid lightgray',
      padding: '0.5rem',
      paddingLeft: 0,
    },
    "& td:first-child": {
      width: '9rem',
      fontWeight: 'bold',
      paddingRight: '8pt',
      verticalAlign: 'top',
    },
  },
  related: {
    margin: 0,
    paddingLeft: 0,
    listStyleType: 'none',
  },
  buttons: {
    display: 'flex',
    flexWrap: 'wrap',
    "& a,button": {
      marginRight: '1rem',
      marginBottom: '1rem',
    }
  },
  leftIcon: {
    marginRight: '0.5rem',
  },
}));

function Project({ settings, user, project, fullProjectList, updateAct, ...props }) {

  const { t } = useTranslation();
  const { jnlpInstaller, langDefault, logo, fullUsersPath } = settings;
  const lang = t('lang');
  const {
    fullPath, meta_langs,
    title, author, school, date,
    languages, langCodes, areas, levels, descriptors, description, license,
    relatedTo, mainFile, instFile,
    cover, activities, totalSize,
    // zipFile, files, mediaFiles,
  } = project;

  const classes = mergeClasses(props, useStyles());
  const k = meta_langs.includes(lang) ? lang : langDefault;
  const pageTitle = `${user ? t('user-repo-title', { user }) : t('repo-title')} - ${title}`;
  const pageDesc = description[k];
  const textDesc = textContent(pageDesc);
  const imgPath = cover && `${fullPath}/${cover}` || logo;
  const moodleLink = `${fullPath}/${mainFile}`;
  const projectLink = moodleLink.replace(/\/[^/]*$/, '/index.html');
  const instJavaLink = instFile ? jnlpInstaller.replace('%%FILE%%', `${fullPath}/${instFile}`) : null;
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
    teaches: areas[lang] || areas[langDefault],
    educationalLevel: levels[lang] || levels[langDefault],
    learningResourceType: 'learning activity',
    author: author,
    description: textDesc,
    inLanguage: langCodes.join(','),
    thumbnailUrl: imgPath,
    url: projectLink,
  };

  return (
    <div {...props}>
      <SEO {...{ settings, title: pageTitle, description: textDesc, author, thumbnail: imgPath, sd }} />
      <Button className={classes.backBtn} onClick={() => document.referrer === fullUsersPath ? history.back() : updateAct(null, user)}>
        <ArrowBack className={classes.leftIcon} />
        {t(user ? 'user-repo-title' : 'repo-title', { user })}
      </Button>
      <Typography variant="h1" className={classes.title}>{title}</Typography>
      <ShareButtons {...{ settings, link: window.location.href, moodleLink, title, description: textDesc, thumbnail: imgPath, embedOptions }} />
      <div className={classes.mainBlock}>
        {imgPath &&
          <div className={classes.btnContainer}>
            <img src={imgPath} className={classes.cover} alt={t('cover-alt')} />
            <IconButton
              className={classes.overlayBtn}
              color="primary"
              href={projectLink} target="_BLANK"
              title={t('prj-launch-tooltip')}
            >
              <PlayArrow />
            </IconButton>
          </div>
        }
        <ReactMarkdown
          className={classes.description}
          rehypePlugins={[rehypeRaw]}
        >
          {pageDesc}
        </ReactMarkdown>
      </div>
      <table className={classes.dataCard}>
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
              <td>{date}</td>
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
                <ul className={classes.related}>
                  {relatedTo.map((prj, n) => (
                    <li key={n}><a href={getPathForProject(prj, user)}>{getProjectTitle(prj)}</a></li>
                  ))}
                </ul>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div className={classes.buttons}>
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<LocalCafe />}
            href={instJavaLink}
            target="_BLANK"
            title={t('prj-java-inst-tooltip')}
          >
            {t('prj-java-inst')}
          </Button>
        }
      </div>
      <ProjectDownload {...{ settings, dlgOpen, setDlgOpen, project }} />
    </div>
  );
}

export default Project;
