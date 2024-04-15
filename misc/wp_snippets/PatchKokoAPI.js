
// Fake post ids for the projects library are built adding this value to the each visited project ID
const POST_ID_BASE = 50000;

// Main URL of the projects library 
const REPO_BASE = 'https://projectes.xtec.cat/clic/ca/repo/';

// Get the full list of projects
async function loadProjects() {
  return fetch('https://clic.xtec.cat/projects/projects.json')
    .then(res => res.json());
}

// Intercepts 'window.fetch', providing patched results
function patchFetchAPI(projects) {
  let originalFetch = null;
  if (!originalFetch) {
    originalFetch = window.fetch;
    window.fetch = async function (url, options) {
      if (/koko-analytics\/v1\/posts/.test(url)) {
        return originalFetch(url, options)
          .then(response => {
            return response.json()
              .then(result => {
                response.json = () => patchKokoResponse(result, projects);
                return response;
              });
          });
      }
      else
        return originalFetch(url, options);
    }
  }
}

// Patches the provided array of 'post' objects, replacing title and link when id greater or equal than the fake ID base
function patchKokoResponse(posts, projects) {
  posts.forEach(post => {
    if (post.id >= POST_ID_BASE) {
      const project = projects.find(prj => prj.id === post.id - POST_ID_BASE);
      if (project) {
        post.post_title = `REPO: ${project.title} [${project.path}]`;
        post.post_permalink = `${REPO_BASE}?prj=${project.path}`;
      }
    }
  });
  return posts;
}

// Scans the 'top posts' table looking for posts with ID greater than POST_ID_BASE,
// replacing the current text content '(no title)' with the real title and link to the project
function updateCurrentView(posts) {
  document.querySelectorAll('.top-posts .ka-topx--row')?.forEach(row => {
    const rank = Number(row.querySelector('.ka-topx--rank')?.textContent);
    if (rank > 0 && rank <= posts.length && posts[rank - 1]?.id >= POST_ID_BASE) {
      const { post_title, post_permalink } = posts[rank - 1];
      const col = row.querySelector('.ka-topx--col');
      if (col)
        col.innerHTML = `<a href="${post_permalink}">${post_title}</a>`;
    }
  });
}

// Main function
(async function () {
  const projects = await loadProjects();
  // Filter future AJAX updates
  patchFetchAPI(projects);
  // Update current results
  if (window.koko_analytics?.data?.posts) {
    patchKokoResponse(window.koko_analytics.data.posts, projects);
    updateCurrentView(window.koko_analytics.data.posts);
  }
})();
