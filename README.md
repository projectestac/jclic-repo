# jclic-repo
**Static repository of JClic projects**

This is a single-page HTML5 application used to publish repositories of JClic projects. A big instance of jclic-repo is
currently running at [http://clic.xtec.cat/repo]

Built with [Polymer web components](https://www.polymer-project.org/1.0/) upon
[Polymer Starter Kit](https://developers.google.com/web/tools/polymer-starter-kit/)

## How to build jclic-repo

jclic-repo uses [Node.js](https://nodejs.org/) modules encapsulated in
[npm](https://www.npmjs.com/) packages. First of all, you must have Node.js
(which includes 'npm' by default) [installed](https://nodejs.org/download/)
on your system.

If you work with Debian/Ubuntu, it's convenient to replace the original node.js packages for those provided by 
[NodeSource](https://github.com/nodesource/distributions).

**jclic-repo** was developed with Node.js Version 0.12, packaged by NodeSource.

To update `npm` to the latest version, run:

```
sudo npm install npm -g
```

We also use [Gulp](http://gulpjs.com/) and [Bower](http://bower.io/) for package dependencies amd automation of building tasks.
You must globally install these packages running:

```
sudo npm install -g gulp bower
```

To install the remaining packages, just go to the project's root directory and run:

```
npm install
bower install
```

This will install Polymer elements, [jclic.js](https://github.com/projectestac/jclic.js) and other required packages
into `node_modules` and `bower_components`

The installation process can be long, so be patient.

To build jclic-repo, just run:

```
gulp
```

This will generate the final files, ready for production, into the `dist` folder.

You must set-up a JClic projects repository tree in `root/projects`. There is a demo tree on
the [samples](https://github.com/projectestac/jclic-repo/tree/samples) branch. Please checkout this
branch on another directory and symlink `root/projects` to it.

To test the module and see the demo in your browser, just launch the test server running:

```
gulp serve:dist
```

The main parameters of the application (like title, language and the location of the `projects` folder)
are defined in [`main.json`](app/main.json).

Another important file is `projects.json`. This file, usually placed at the root of the `projects` folder,
contains a full list of the projects published on the repository and basic information (project's folder,
title, authors, languages, icons, main file...) about them.

Every project folder must have a `project.json` file with a full description. See  the [`samples`](../../tree/samples/projects)
branch for examples of `project.json` and `projects.json` files.

For more detailed instructions please refer to the [readme](https://github.com/PolymerElements/polymer-starter-kit) of Polymer Starter Kit.
