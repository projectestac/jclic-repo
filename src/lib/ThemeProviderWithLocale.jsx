/**
 *  File    : lib/ThemeProviderWithLocale.jsx
 *  Created : 01/01/2026
 *  By      : Francesc Busquets <francesc@gmail.com>
 *
 *  JClic authoring
 *  Authoring tool for creating JClic activities
 *  https://github.com/frncesc/jclic-authoring
 *
 *  @source https://github.com/frncesc/jclic-authoring
 *
 *  @license EUPL-1.2
 *  @licstart
 *  (c) 2026 Francesc Busquets
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

import * as React from "react";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useMainContext } from "@/contexts";
import { getMuiLocale } from "@/i18n";
// Uncomment this when using MUI X Data Grid:
// import { getDgLocale } from '@/i18n';

/**
 * Overrides MUI's ThemeProvider, filling the provided theme with specific localization strings for
 * mui/material
 *
 * @param {Object} props - The component props.
 * @param {Object} props.theme - Object with MUI theme properties.
 * @param {React.ReactNode} props.children - The child components consumers of the provided MUI theme.
 * @returns {JSX.Element} - The customized ThemeProvider
 */
function ThemeProviderWithLocale({ children }) {
  const {
    i18n: { resolvedLanguage },
  } = useTranslation();
  const { theme } = useMainContext();

  const themeWithLocale = responsiveFontSizes(
    createTheme(
      theme,
      getMuiLocale(resolvedLanguage),
      // Uncomment this when using MUI X Data Grid:
      // getDgLocale(resolvedLanguage),
    ),
  );

  return <ThemeProvider theme={themeWithLocale}>{children}</ThemeProvider>;
}

export { ThemeProviderWithLocale };
