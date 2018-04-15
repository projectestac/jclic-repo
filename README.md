# jclic-repo
**Static repository of JClic projects**

This is a single-page HTML5 application used to publish repositories of JClic projects. A big instance of jclic-repo is
currently running at [http://clic.xtec.cat/repo]

Built with [Polymer 2.0](https://www.polymer-project.org/) web components

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

## Sponsors that make possible JClic

[![XTEC](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-xtec.png?raw=true)](http://www.xtec.cat)<br>
JClic.js is an open-source project sustained by [XTEC](http://www.xtec.cat), the Telematic Network of the Catalan Ministry of Education.

[![BrowserStack](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-browserstack.png?raw=true)](https://www.browserstack.com)<br>
Checking the operation of JClic.js on different browsers and platforms is possible thanks to virtual machines provided by [BrowserStack](https://www.browserstack.com).

[![JSDelivr](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-jsdelivr.png?raw=true)](http://www.jsdelivr.com/projects/jclic.js)<br>
The production releases of JClic.js are smoothly distributed to the final users thanks to the [JSDelivr](http://www.jsdelivr.com/projects/jclic.js) network of servers.

[![cdnjs](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-cdnjs.png?raw=true)](https://cdnjs.com/libraries/jclic.js)<br>
All project files are also available through [cdnjs](https://cdnjs.com/about), a very powerful content delivery service powered by [Cloudflare](https://www.cloudflare.com).

[![Transifex](https://github.com/projectestac/jclic.js/blob/master/misc/graphics/logo-transifex.png?raw=true)](https://github.com/projectestac/jclic.js/blob/master/TRANSLATIONS.md)<br>
We use [Transifex](https://www.transifex.com/francesc/jclicjs) as a platform to translate JClic.js into many languages. Please read [TRANSLATIONS.md](https://github.com/projectestac/jclic.js/blob/master/TRANSLATIONS.md) if you want to contribute to the project creating a new translation or improving the existing ones.
