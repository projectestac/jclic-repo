
/**
 * JavaScript snippet to be used inside the Koko Analytics dashboard
 * to have significant info about posts with fake ids
 */

// Max number of posts to retrieve
const POSTS_LIMIT = 2000;

// Fake post ids for the projects library are built adding this value to the each visited project ID
const POST_ID_BASE = 50000;

// Main URL of the projects library 
const REPO_BASE = 'https://projectes.xtec.cat/clic/ca/repo/';

// Time between table scans (milliseconds)
const UPDATE_INTERVAL = 3000;

// Get the full list of projects and post statistics
async function loadData() {

  const projects = await fetch('https://clic.xtec.cat/projects/projects.json')
    .then(res => res.json());

  const { root, startDate, endDate, nonce } = window.koko_analytics;

  const posts = await fetch(
    `${root}koko-analytics/v1/posts?offset=0&limit=${POSTS_LIMIT}&start_date=${startDate}&end_date=${endDate}`,
    { headers: { 'X-Wp-Nonce': nonce } })
    .then(res => res.json());

  return { projects, posts };
}

// Scans the 'top posts' table looking for posts with ID greater than POST_ID_BASE,
// replacing the current text content '(no title)' with the real title and link to the project
function updatePages(posts, projects) {
  const rows = document.querySelectorAll('.top-posts .ka-topx--row');
  rows.forEach(row => {
    const rank = Number(row.querySelector('.ka-topx--rank')?.textContent);
    if (rank > 0 && posts[rank - 1]?.id >= POST_ID_BASE) {
      const id = posts[rank - 1].id - POST_ID_BASE;
      const project = projects.find(prj => prj.id === id);
      if (project) {
        const col = row.querySelector('.ka-topx--col');
        if (col) {
          const text = `<em>${project.title}</em> [${project.path}]`;
          col.innerHTML = `<a href="${REPO_BASE}?prj=${project.path}">${text}</a>`;
        }
        else
          console.error(`No 'col' element in row ${rank}`);

      }
      else
        console.error(`Unknown project id: ${id}`);
    }
  });
}

// Main process starts here
(async function () {
  const { projects, posts } = await (loadData());
  updatePages(posts, projects);
  window.setInterval(() => updatePages(posts, projects), UPDATE_INTERVAL);
})();

