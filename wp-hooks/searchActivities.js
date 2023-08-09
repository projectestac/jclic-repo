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
          const { title, author, cover, coverWebp } = project;
          const link = `https://projectes.xtec.cat/clic/${lang}/repo/?prj=${match}`;
          const img = `https://clic.xtec.cat/projects/${match}/${coverWebp || cover}`;
          results.push({ title, author, img, link, match });
        }
      });
    }
    return results;
  }

  function $getArticle({ title, author, img, link, match }) {
    return jq('<artile />')
      .addClass(['post', 'type-post', 'has-post-thumbnail', 'ast-grid-common-col', 'ast-full-width', 'ast-article-post', 'ast-width-md-12'])
      .attr('id', `act-${match}`)
      .append(
        jq('<div/>').addClass(['ast-post-format-', 'blog-layout-1', 'ast-no-date-box']).append(
          jq('<div/>').addClass(['post-content', 'ast-grid-common-col']).append(
            [
              jq('<div/>').addClass(['ast-blog-featured-section', 'post-thumb', 'ast-grid-common-col', 'ast-float']).append(
                jq('<div/>').addClass(['post-thumb-img-content', 'post-thumb']).append(
                  jq('<a/>').attr('href', link).append(
                    jq('<img>')
                      .addClass(['attachment-large', 'size-large', 'wp-post-image'])
                      .attr('src', img)
                      .attr('alt', title)
                      .css('max-height', '80pt')
                  )
                )
              ),
              jq('<header/>').addClass('entry-header').append(
                jq('<h2/>').addClass('entry-title').append(
                  jq('<a/>')
                    .attr('href', link)
                    .attr('rel', 'bookmark')
                    .text(title)
                )
              ),
              jq('<div/>').addClass(['entry-content', 'clear']).attr('itemprop', 'text').append(
                jq('<p/>').text(author)
              )
            ]
          )
        )
      );
  }

  const $main = jq('#main');
  let $mainRow = jq('.ast-row');

  const { pathname, search } = window.location;
  const lang = pathname.split('/')[3];
  const query = (new URLSearchParams(search)).get('s');
  if (lang && query) {
    // TODO: show waiting block
    const results = await searchActivities(lang, query);
    // TODO: Remove waiting block
    if (results.length) {
      // TODO: Remove $notFound
      // const $notFound = jq('.no-results');
      if (!$mainRow.length) {
        $mainRow = jq('<div/>').addClass('ast-row');
        $main.append($mainRow);
      }
      results.forEach(result => $mainRow.append($getArticle(result)));
    }
  }

})();


