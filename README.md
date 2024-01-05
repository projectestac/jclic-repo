# JClic Repo

***Front-end [React](https://reactjs.org/) [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
for repositories of [JClic](https://projectestac.github.io/jclic) activities***

### JClic activities, projects and repositories
The JClic authoring system binds data into [JClic projects](https://github.com/projectestac/jclic/wiki/JClic-Guide%3A-The-creation-of-a-new-project). Each project has its own metadata, media library (images, sounds...) and a variable number of [activities](https://github.com/projectestac/jclic/wiki/JClic-Guide%3A-Types-of-activities) chained into one or more [activity sequences](https://github.com/projectestac/jclic/wiki/JClic-Guide%3A-Sequencing-activities).

[JClic Author](https://github.com/projectestac/jclic/wiki/JClic-Guide%3A-The-creation-of-activities) can be used to create and edit JClic projects.

When done, JClic projects can be saved and exported into three different formats:

- Save into a single file with extension `.jclic.zip`. This is the native format currently used by "JClic Player" and "JClic Author" (desktop Java apps).
- Export to HTML5 into a directory on your local file system, thus allowing the activities to be played on any modern web browser. This option creates the following files:
  - `project.json`: Contains all the metadata associated to the JClic project: title, authorship, description, educational level, language, topic, license...
  - `index.html`: Used to launch the project on any modern web browser, both as standalone page or embedded in another context.
  - _`projectname.jclic`_: An [XML](https://en.wikipedia.org/wiki/XML) file containing the description of the project activities and sequences.
  - `imsmanifest.xml`: Makes the exported content compatible with [SCORM](https://en.wikipedia.org/wiki/Sharable_Content_Object_Reference_Model) 1.2.
  - The media files (images, sounds, fonts...) used as ingredients on the activities.
- Export into a single file with extension `.scorm.zip`, useful when integrating JClic activities on Virtual Learning Environments.

A _JClic repository_ consists of a root directory with a set of subdirectories, each one containing the HTML5 version of a JClic project. A single file named `projects.json` should be located on the root directory, acting as an index of the repository projects. This file contains a full list of the projects and basic information (project's folder, title, authors, languages, icons, main file...) about them.

There are currently two types of activity repositories in the [clicZone](https://projectes.xtec.cat/clic): the [main library](https://projectes.xtec.cat/clic/en/repo/),
with more than 2,000 projects, and hundreds of small personal repositories where registered users (currently Catalan teachers) can upload and publish their own JClic projects.

See  the [`samples`](../../tree/samples/projects) branch for examples of `projects.json` and individual `project.json` files.

### Web Components
This application generates a single `jclic-repo.min.js` file that, when loaded on an HTML document, registers two web components:

- `jclic-repo`: Displays the content of any JClic repository.
- `jclic-user-lib`: Allows registered users to log-in and manage its own library content.

See below for details about the two components.

### How to check and build jclic-repo

First, you must have Node.js (which includes 'npm' by default) [installed](https://nodejs.org/download/) on your system.

To install the dependencies, just go to the project's root directory and run:

```bash
$ npm ci
```

You must set up a JClic projects repository tree in `/test/repo/projects`. There is a demo tree on
the [samples](https://github.com/projectestac/jclic-repo/tree/samples) branch of this repository. Please check out this
branch on another directory and copy or symlink it.

From jclic-repo, launch:

```bash
# Go one level below jclic-repo and clone the samples branch:
$ cd ..
$ git clone https://github.com/projectestac/jclic-repo.git --branch samples --single-branch jclic-repo-samples
# Go back to jclic-repo and create a symlink to the sample projects directory:
$ cd jclic-repo/test/repo
$ ln -s ../../../jclic-repo-samples/projects .
```

To see the demo in your browser, just launch the test server:

```bash
# Launch the development server:
$ npm start
```

To build jclic-repo, just run:

```bash
# Build the production site
$ npm run build
```

This will generate the file `jclic-repo.min.js`, ready for production, into the `dist` folder.

To test the `jclic-user-lib` component you will also need to launch your own instance of the [ClicZone API](https://github.com/projectestac/zonaclic/tree/master/app).

### Application parameters

The main parameters of the application should be defined on `.env.development` and `.env.production`. See [`.env.example`](.env.example)
for details about it.

Many parameters defined in these ".env" files can be set also as `data-` properties on the web component tags. For example,
you can set the default language to English on `.env.production`:

``` bash
LANG_DEFAULT="en"
```

... and change it to Spanish in a specific web component instance, just adding data parameters:

```html
<jclic-repo data-lang-default="es" />
```

### jclic-repo
This component can display two different pages:

<div style="padding-left:3rem">

#### Full catalog ([RepoList.js](./src/components/repo/RepoList.js))

Shows the full catalog of the repository. Users can switch between two display modes: 'cards' (default) or 'list'.

A basic search engine is provided, allowing to filter results by language, educational level and topic. Search can be improved using the clicZone [full text search API](https://github.com/projectestac/zonaclic/blob/master/app/db/repo-search/index.php).

#### Project page ([Project.js](./src/components/repo/Project.js))

Page with information about a single project, with buttons allowing to launch the activities, download it in SCORM format or launch a [Java Web Start](https://en.wikipedia.org/wiki/Java_Web_Start) installer.

</div>

The switch between the two display modes is set by means of parameters on the URL query section:
- `prj`: When set, the _Project page_ mode is activated. Otherwise, the component will show the full catalog. The value of this parameter must be the subdirectory name of the project to be shown. For example:
```html
https://my-jclic-site.com/repo?prj=myproject
```
- `user`: When set in addition to `prj`, a user's project will be shown. For example:
```html
https://my-jclic-site.com/repo?user=johndeere&prj=mypersonalproject
```

State switching is recorded on the [browser history](https://developer.mozilla.org/en-US/docs/Web/API/Window/history), thus allowing
to use the `back` and `forward` navigation buttons when different pages are visited.

The content of the `<head>` section of the host page is dynamically updated with metadata about the information being currently displayed by the component.

### jclic-user-lib
This web component allows registered users to manage their personal library of JClic projects.

The log-in is currently done with the [Google OAuth API](https://developers.google.com/identity/protocols/oauth2) protocol. See [`.env.example`](.env.example) for the required *GOOGLE_OAUTH2_ID* param.

The component acts just as a front-end to the API functions of the [ClicZone userlib API](https://github.com/projectestac/zonaclic/tree/master/app/db/userlib).

## Sponsors that make possible JClic

[![XTEC](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-xtec.png?raw=true)](http://www.xtec.cat)<br>
JClic.js is an open-source project sustained by [XTEC](http://www.xtec.cat), the Telematics Network of the Catalan Ministry of Education.

[![BrowserStack](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-browserstack.png?raw=true)](https://www.browserstack.com)<br>
Checking the operation of JClic.js on different browsers and platforms is possible thanks to virtual machines provided by [BrowserStack](https://www.browserstack.com).

[![JSDelivr](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-jsdelivr.png?raw=true)](http://www.jsdelivr.com/projects/jclic.js)<br>
The production releases of JClic.js are smoothly distributed to the final users thanks to the [JSDelivr](http://www.jsdelivr.com/projects/jclic.js) network of servers.

[![cdnjs](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-cdnjs.png?raw=true)](https://cdnjs.com/libraries/jclic.js)<br>
All project files are also available through [cdnjs](https://cdnjs.com/about), a very powerful content delivery service powered by [Cloudflare](https://www.cloudflare.com).

[![Transifex](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-transifex.png?raw=true)](https://github.com/projectestac/jclic.js/blob/master/TRANSLATIONS.md)<br>
We use [Transifex](https://www.transifex.com/francesc/jclicjs) as a platform to translate JClic.js into many languages. Please read [TRANSLATIONS.md](https://github.com/projectestac/jclic.js/blob/master/TRANSLATIONS.md) if you want to contribute to the project creating a new translation or improving the existing ones.
