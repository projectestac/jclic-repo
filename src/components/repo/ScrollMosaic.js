/*!
 *  File    : components/repo/ScrollMosaic.js
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

import React, { useState, useEffect } from 'react';
import InfiniteScroll from '../InfiniteScroll';
import ProjectCard from './ProjectCard';
import { Box } from '@mui/material';

const blockSize = 30;

function ScrollMosaic({ settings, user, projects, updateAct, ...props }) {

  const [page, setPage] = useState(0);
  const [items, setItems] = useState(projects.slice(0, page * blockSize));

  const loadMore = () => {
    setPage(page + 1);
    setItems(projects.slice(0, page * blockSize));
  }

  useEffect(() => {
    setPage(0);
    loadMore();
  }, [projects]);

  return (
    <InfiniteScroll
      {...props}
      pageStart={0}
      initialLoad={true}
      loadMore={loadMore}
      hasMore={projects.length > items.length}
      threshold={250}
      useWindow={true}
    >
      <Box sx={{
        my: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
        gap: 2,
        "& a:link": { textDecoration: 'none' }
      }}>
        {items.map((project, n) => (
          <ProjectCard key={n} {...{ settings, user, project, updateAct }} />
        ))}
      </Box>
    </InfiniteScroll>
  );
}

export default ScrollMosaic;