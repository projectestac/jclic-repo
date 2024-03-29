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
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ellipsis, clickOnLink, getAbsoluteURL } from '../../utils';

const DEFAULT_ITEMS_PER_PAGE = 25;

function PaginatedList({ settings, user, projects, updateAct, ...props }) {

  const { t } = useTranslation();
  const { repoBase, usersBase, rootRef, repoPath } = settings;
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const base = user ? `${usersBase}/${user}` : repoBase;
  useEffect(() => setPage(0), [projects]);

  return (
    <div {...props}>
      <List dense>
        {projects
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage)
          .map(({ path, title, author, cover, coverWebp, thumbnail }, n) => (
            <ListItemButton
              key={n}
              sx={{ borderBottom: '1px solid lightgray', pl: 0, '&:first-of-type': { borderTop: '1px solid lightgray' } }}
              onClick={ev => {
                ev.preventDefault();
                if (ev.ctrlKey)
                  clickOnLink(getAbsoluteURL(repoPath, { prj: path, user, list: 'true' }), true);
                else
                  updateAct(path, user);
              }}>
              <ListItemAvatar>
                <Avatar variant="square" alt={title} src={`${base}/${path}/${thumbnail || coverWebp || cover}`} />
              </ListItemAvatar>
              <ListItemText primary={title} secondary={author} secondaryTypographyProps={ellipsis} />
            </ListItemButton>
          ))}
      </List>
      <TablePagination
        component="nav"
        sx={{
          '& > div': {
            justifyContent: 'flex-end',
          }
        }}
        page={page}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onRowsPerPageChange={({ target: { value } }) => {
          setItemsPerPage(value);
          setPage(0);
        }}
        count={projects.length}
        onPageChange={(_ev, p) => setPage(p)}
        labelDisplayedRows={({ from, to, count }) => t('results-count', { from, to, count })}
        labelRowsPerPage={t('results-per-page')}
        slotProps={{
          actions: {
            previousButton: { title: t('results-page-prev') },
            nextButton: { title: t('results-page-next') },
          },
          select: { MenuProps: { container: () => rootRef.current } },
        }}
      />
    </div >
  );
}

export default PaginatedList;