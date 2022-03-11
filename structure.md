

## Main structure
[index.js](src/index.js)
Subclass of [ReactWebComponent](src/ReactWebComponent.js) - Extends HTMLElement (not React yet)
  `div` (as _mountPoint_)
    ReactDOM.render
    [MainLayout](src/components/MainLayout.js)
      CacheProvider (from '@emotion/react')
        ThemeProvider (from '@material-ui/styles')
          Component (Repo or UserLib)

## Repo with list
[repo.js](src/components/repo/Repo.js)
Repo
  `div`
    [RepoList](src/components/repo/RepoList.js)

## Repo with project
[repo.js](src/components/repo/Repo.js)
Repo
  `div`
    [Project](src/components/repo/Project.js)

## UserLib
