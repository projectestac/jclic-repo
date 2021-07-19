/*!
 *  File    : utils/BackToTop.js
 *  Created : 2021-07-18
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
import Fab from '@material-ui/core/Fab';
import ArrowUp from '@material-ui/icons/ArrowUpward';

// Based on: https://github.com/donaldboulton/publiuslogic/blob/master/src/components/Scroll/index.js

export default function BackToTop({ t, topRef, showBelow, style = {} }) {

  const [show, setShow] = useState(showBelow ? false : true);

  const handleScroll = () => {
    if (window.pageYOffset > showBelow) {
      if (!show) setShow(true);
    } else {
      if (show) setShow(false);
    }
  }

  const handleClick = () => {
    if (topRef?.current)
      topRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    else
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
  }

  useEffect(() => {
    if (showBelow) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  });

  return (
    <Fab
      title={t('top')}
      size="small"
      onClick={handleClick}
      style={{
        visibility: show ? 'visible' : 'hidden',
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        ...style,
      }}
    >
      <ArrowUp />
    </Fab>
  );
}
