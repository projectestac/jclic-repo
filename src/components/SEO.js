/*!
 *  File    : components/SEO.js
 *  Created : 2021-07-19
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

import React from 'react';
import { Helmet } from 'react-helmet';
import { getAllPageVariants } from '../utils';

function SEO({ settings, location = null, title, author = '', description = '', meta = [], thumbnail = null, canonical = '', sd = null, ...props }) {

  const { t, supportedLanguages, langKey } = settings;
  const mainUrl = canonical || location || window.location.href;
  const metaDescription = description || t('site-description');
  const metaAuthor = author || t('site-title');
  const lang = t('lang');
  const alt = lang && getAllPageVariants(mainUrl, lang, langKey, supportedLanguages) || [];

  const metaTags = [
    {
      name: 'description',
      content: metaDescription,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: thumbnail ? 'summary_large_image' : 'summary',
    },
    {
      name: 'twitter:creator',
      content: metaAuthor,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
  ].concat(meta);

  if (thumbnail) {
    metaTags.push(
      {
        name: 'twitter:image',
        content: thumbnail,
      },
      {
        property: 'og:image',
        content: thumbnail,
      },
    );
  }

  const links = alt.map(({ lang, href }) => ({
    rel: 'alternate',
    hreflang: lang,
    href,
  }));
  if (canonical)
    links.push({ rel: 'canonical', content: canonical });

  return (
    <Helmet
      {...props}
      titleTemplate={`%s | ${t('site-title')}`}
    >
      <html lang={lang} />
      <title>{title}</title>
      {metaTags.map((m, n) => <meta key={n} {...m} />)}
      {sd && <script type="application/ld+json" className="structured-data-list">{JSON.stringify(sd)}</script>}
      {links.map((l, n) => <link key={n} {...l} />)}
    </Helmet>
  );
}

export default SEO;
