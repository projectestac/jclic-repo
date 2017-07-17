# jclic-repo
**Static repository of JClic projects**

This is a single-page HTML5 application used to publish repositories of JClic projects. A big instance of jclic-repo is
currently running at [http://clic.xtec.cat/repo]

Built with [Polymer](https://www.polymer-project.org/) web components. This branch is a backport to __Polymer 1__ of `master` branch, based on __Polymer 2__, made for compatibility with legacy browsers.

## How to check and build jclic-repo

jclic-repo uses [Node.js](https://nodejs.org/) modules encapsulated in
[npm](https://www.npmjs.com/) packages. First of all, you must have Node.js
(which includes 'npm' by default) [installed](https://nodejs.org/download/)
on your system.

If you work with Debian/Ubuntu, it's convenient to replace the original node.js packages for those provided by 
[NodeSource](https://github.com/nodesource/distributions).

**jclic-repo** was developed with Node.js Version 6.10, packaged by NodeSource.

To update `npm` to the latest version, run:

```
sudo npm install -g npm
```

We also use [Polymer CLI](https://www.polymer-project.org/2.0/docs/tools/polymer-cli) and [Bower](http://bower.io/) for package dependencies amd automation of building tasks.
You must globally install these packages running:

```
sudo npm install -g bower polymer-cli
```

To install the remaining packages, just go to the project's root directory and run:

```
bower install
```

This will install the Polymer web components and other required packages into `bower_components`

The installation process can be long, so be patient.

You must set-up a JClic projects repository tree in `/projects`. There is a demo tree on
the [samples](https://github.com/projectestac/jclic-repo/tree/samples) branch. Please checkout this
branch on another directory and symlink `dist/default/projects` to it.

From jclic-repo, launch:

```
cd ..
git clone https://github.com/projectestac/jclic-repo.git --branch samples --single-branch jclic-repo-samples
cd jclic-repo
ln -s ../jclic-repo/samples/projects .
```

To test the module and see the demo in your browser, just launch the test server running:

```
polymer serve
```

The main parameters of the application (like title, language and the location of the `projects` folder)
are defined in [`main.json`](app/main.json).

Another important file is `projects.json`. This file, usually placed at the root of the `projects` folder,
contains a full list of the projects published on the repository and basic information (project's folder,
title, authors, languages, icons, main file...) about them.

Every project folder must have a `project.json` file with a full description. See  the [`samples`](../../tree/samples/projects)
branch for examples of `project.json` and `projects.json` files.

To build jclic-repo, just run:

```
polymer build
```

This will generate the final files, ready for production, into the `dist/default` folder. Note that the
parameter `index.path` of `main.json` must point to a valid JClic repository folder.

