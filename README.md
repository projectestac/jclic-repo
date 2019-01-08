# jclic-repo
**Static repository of JClic projects**

This is a single-page HTML5 application used to publish repositories of JClic projects. A big instance of jclic-repo is currently running at [http://clic.xtec.cat/repo]

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to check and build jclic-repo

jclic-repo uses [Node.js](https://nodejs.org/) modules encapsulated in
[npm](https://www.npmjs.com/) packages. First of all, you must have Node.js
(which includes 'npm' by default) [installed](https://nodejs.org/download/)
on your system.

If you work with Debian/Ubuntu, it's convenient to replace the original node.js packages for those provided by 
[NodeSource](https://github.com/nodesource/distributions).

**jclic-repo** was developed with Node.js Version 6.10, packaged by NodeSource.

To install the project dependencies, just go to the project's root directory and run:

```bash
$ npm install
```

The installation process can be long, so be patient.

You must set-up a JClic projects repository tree in `/projects`. There is a demo tree on
the [samples](https://github.com/projectestac/jclic-repo/tree/samples) branch. Please checkout this
branch on another directory and symlink `./projects` to it.

From jclic-repo, launch:

```
cd ..
git clone https://github.com/projectestac/jclic-repo.git --branch samples --single-branch jclic-repo-samples
cd jclic-repo
ln -s ../jclic-repo/samples/projects .
```

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

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
