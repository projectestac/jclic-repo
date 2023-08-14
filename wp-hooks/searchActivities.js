/* global jq */

(async () => {

  async function searchActivities(lang, query) {
    const results = [];
    const matches = await fetch(`https://clic.xtec.cat/db/repo-search/?q=${query}&lang=${lang}&method=boolean`)
      .then(res => res.json())
      .catch(err => console.error(`Error searching "${query}" in activities with lang "${lang}": ${err}`));
    if (matches?.length) {
      const projects = await fetch('https://clic.xtec.cat/projects/projects.json')
        .then(res => res.json())
        .catch(err => console.log(`Error retrieving projects list: ${err}`));
      matches.forEach(match => {
        const project = projects.find(p => p.path === match);
        if (project) {
          const { title, author, cover, coverWebp, langCodes } = project;
          const link = `https://projectes.xtec.cat/clic/${lang}/repo/?prj=${match}`;
          const img = `https://clic.xtec.cat/projects/${match}/${coverWebp || cover}`;
          results.push({ title, author, img, link, match, langCodes });
        }
      });
    }
    return results;
  }

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

  function $getArticle({ title, author, img, link, match, langCodes }) {
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

  const $main = jq('#main');
  let $mainRow = jq('.ast-row');
  if (!$mainRow.length) {
    $mainRow = jq('<div/>').addClass('ast-row');
    $main.append($mainRow);
  }
  const $notFound = jq('.no-results');

  const { pathname, search } = window.location;
  const lang = pathname.split('/')[3];
  const query = (new URLSearchParams(search)).get('s');
  if (lang && query) {
    const $waitingBlock = $getWaitingBlock(lang, query);
    $mainRow.append($waitingBlock);

    const results = await searchActivities(lang, query);

    $waitingBlock.remove();

    if (results.length) {
      $notFound.remove();
      results.forEach(result => $mainRow.append($getArticle(result)));
    }
  }

})();
