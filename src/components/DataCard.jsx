/*!
 *  File    : components/DataCard.js
 *  Created : 2022-03-19
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

import { styled } from '@mui/material/styles'

const DataCard = styled('table')(({ _theme }) => ({
  borderCollapse: 'collapse',
  minWidth: '80%',
  maxWidth: '800px',
  marginTop: '2rem',
  marginBottom: '1.5rem',
  lineHeight: '1.5',
  "& td": {
    border: 'none',
    borderBottom: '1px solid lightgray',
    borderTop: '1px solid lightgray',
    padding: '0.5rem',
    paddingLeft: 0,
  },
  "& td:first-of-type": {
    width: '9rem',
    fontWeight: 'bold',
    paddingRight: '8pt',
    verticalAlign: 'top',
  },
}));

export default DataCard;
