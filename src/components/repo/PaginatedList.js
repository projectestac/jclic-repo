/*!
 *  File    : components/repo/PaginatedList.js
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

import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, TablePagination } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { mergeClasses } from '../../utils';

const DEFAULT_ITEMS_PER_PAGE = 25;

const useStyles = makeStyles(_theme => ({
  root: {
  },
  spacer: {
    display: 'none',
  },
  toolbar: {
    flexFlow: 'wrap',
    paddingLeft: '0',
  },
}));

function PaginatedList({ settings, user, projects, updateAct, ...props }) {

  const { t } = useTranslation();
  const { repoBase, rootRef } = settings;
  const classes = mergeClasses(props, useStyles());
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  useEffect(() => setPage(0), [projects]);

  return (
    <div {...props} className={classes.root}>
      <List dense>
        {projects
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
          .map(({ path, title, author, cover, thumbnail }, n) => (
            <ListItem button key={n} className={classes.listElements} onClick={() => updateAct(path, user)}>
              <ListItemAvatar>
                <Avatar variant="square" alt={title} src={`${repoBase}/${user ? `${user}/` : ''}${path}/${thumbnail || cover}`} />
              </ListItemAvatar>
              <ListItemText primary={title} secondary={author} />
            </ListItem>
          ))}
      </List>
      <TablePagination
        classes={{ spacer: classes.spacer, toolbar: classes.toolbar }}
        component="nav"
        page={page}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={ev => setItemsPerPage(ev.target.value)}
        count={projects.length}
        onPageChange={(_ev, p) => setPage(p)}
        labelDisplayedRows={({ from, to, count }) => t('results-count', { from, to, count })}
        labelRowsPerPage={t('results-per-page')}
        backIconButtonText={t('results-page-prev')}
        nextIconButtonText={t('results-page-next')}
        SelectProps={{ MenuProps: { container: () => rootRef.current } }}
      />
    </div >
  );
}

export default PaginatedList;