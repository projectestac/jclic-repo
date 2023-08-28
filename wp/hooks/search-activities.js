// jQuery is already loaded by Astra
/* global jq */

jq(document).ready(async function () {

  const SEARCH_API = 'https://clic.xtec.cat/db/repo-search';
  const PROJECTS_ROOT = 'https://clic.xtec.cat/projects';
  const SITE_ROOT = 'https://projectes.xtec.cat/clic';

  // Performs an API query looking for activities with the provided expression
  async function searchActivities(lang, query) {
    const results = [];
    const matches = await fetch(`${SEARCH_API}/?q=${encodeURIComponent(query)}&lang=${lang}&method=boolean`)
      .then(res => res.json())
      .catch(err => console.error(`Error searching "${query}" in activities with lang "${lang}": ${err}`));
    if (matches?.length) {
      const projects = await fetch(`${PROJECTS_ROOT}/projects.json`)
        .then(res => res.json())
        .catch(err => console.log(`Error retrieving projects list: ${err}`));
      matches.forEach(match => {
        const project = projects.find(p => p.path === match);
        if (project) {
          const { title, author, cover, coverWebp, langCodes } = project;
          const link = `${SITE_ROOT}/${lang}/repo/?prj=${match}`;
          const img = `${PROJECTS_ROOT}/${match}/${coverWebp || cover}`;
          results.push({ title, author, img, link, match, langCodes });
        }
      });
    }
    return results;
  }

  // Block to display while the API query is running 
  function $getWaitingBlock(lang, query) {
    return jq('<div/>')
      .addClass(['ast-separate-container', 'ast-article-post'])
      .append([
        jq('<h2/>')
          .text(
            lang === 'ca' ? `S'estan cercant activitats JClic amb el text "${query}"...` :
              lang === 'es' ? `Buscando actividades JClic con el texto "${query}"...` :
                `Searching for JClic activities containing the text "${query}"...`),
      ]);
  }

  // Results header block 
  function $getResultsHeaderBlock(lang, query, num) {
    return jq('<div/>')
      .addClass(['ast-archive-description'])
      .append([
        jq('<h2/>')
          .text(
            lang === 'ca' ? `S'ha${num > 1 ? 'n' : ''} trobat ${num} activitat${num > 1 ? 's' : ''} JClic amb el text "${query}":` :
              lang === 'es' ? `Se ha${num > 1 ? 'n' : ''} encontrado ${num} actividad${num > 1 ? 'es' : ''} JClic con el texto "${query}":` :
                `Found ${num} JClic activities containing "${query}":`),
      ]);
  }

  // Single result block
  function $getResultBlock({ title, author, img, link, match, langCodes }) {
    return jq('<article/>')
      .addClass(['ast-separate-container', 'ast-article-post'])
      .attr('id', `act-${match}`)
      .append([
        jq(`<img/>`)
          .attr('src', img)
          .attr('alt', title)
          .css({ 'max-height': '6rem', 'margin-bottom': '1rem' }),
        jq('<h2/>')
          .append(jq('<a/>')
            .attr('href', link)
            .text(`${title}${langCodes.length ? ` (${langCodes.join(', ')})` : ''}`)),
        jq('<div/>')
          .addClass(['entry-content', 'clear'])
          .append(jq('<p/>').text(author)),
      ]);
  }

  // Main process starts here

  // Do not act if there are more WP search results
  if (jq('.ast-pagination .next').length === 0) {
    const $main = jq('#main');
    let $mainRow = jq('.ast-row');

    // If there isn't a main row, create it
    if (!$mainRow.length) {
      $mainRow = jq('<div/>').addClass('ast-row');
      $main.append($mainRow);
    }

    // No results foound in WP?
    const $notFound = jq('.no-results');

    // Extract language and query from current URL
    const { pathname, search } = window.location;
    const lang = pathname.split('/')[3];
    const query = (new URLSearchParams(search)).get('s');
    if (lang && query) {

      // Display waiting message
      const $waitingBlock = $getWaitingBlock(lang, query);
      $mainRow.append($waitingBlock);

      // Perform the query
      const results = await searchActivities(lang, query);

      // Remove waiting message
      $waitingBlock.remove();

      if (results.length) {
        // Remove the WP 'not found' message (if exists) and display the results header
        $notFound.remove();
        $mainRow.append($getResultsHeaderBlock(lang, query, results.length));

        // Show results in blocks of max. 10 elements
        let current = 0;
        const maxResults = 10;

        const showResults = () => {
          for (let i = 0; i < maxResults && current < results.length; i++, current++)
            $mainRow.append($getResultBlock(results[current]));

          if (current < results.length - 1)
            $mainRow.append($more);
          else
            $more.remove();
        };

        // "More results" button
        const $more = jq('<div/>')
          .css({ padding: '1.5rem', fontWeight: 'bold' })
          .append(jq('<a/>')
            .attr('href', '#')
            .on('click', ev => {
              // Show next 10 results
              ev.preventDefault();
              showResults();
            })
            .html(
              lang === 'ca' ? 'Més resultats »' :
                lang === 'es' ? 'Más resultados »' :
                  'More results »'
            ));

        // Show first 10 results
        showResults();
      }
    }
  }
});
