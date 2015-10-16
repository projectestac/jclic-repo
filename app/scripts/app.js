/*
 Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* global Polymer */
/* global $ */
/* global deployJava */
/* global unidecode */

(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  var app = document.querySelector('#app');

  app.options = {};

  app.javaDisabled = false;

  app.lang = 'en';
  app.langIndex = 0;
  app.languages = [
    {id: 'en', name: 'English'},
    {id: 'ca', name: 'català'},
    {id: 'es', name: 'español'}];
  app.title = '';
  app.description = '';
  app.langLabel = '';
  app.searchLabel = '';

  app.actLanguages = [];
  app.currentLang = 0;

  app.actSubjects = [];
  app.currentSubject = 0;

  app.actLevels = [];
  app.currentLevel = 0;

  app.currentTitle = '';
  app.currentAuthor = '';

  app.projects = null;
  app.matchProjects = [];
  app.numMatchprojects = 0;
  app.lastItem = 0;
  app.itemsPerScroll = 20;

  app.loading = false;
  app.loaded = false;

  app.baseURL = '.';
  app.projectsPath = 'projects';

  app.spinner = false;

  app.fullScreen = false;
  app.fullScreenEnabled = false;

  app.order = 0;
  app.orderInv = false;

  // Load 'main.json'
  $.getJSON('main.json')
          .done(function (data) {
            $.extend(app.options, data);

            app.baseURL = window.location.href;
            if (app.baseURL.charAt(app.baseURL.length - 1) !== '/') {
              var p = app.baseURL.lastIndexOf('/', 0);
              if (p > 8) {
                app.baseURL = app.baseURL.substring(0, p + 1);
              }
            }

            app.projectsPath = app.options.index.path;

            app.languages = app.options.languages;
            var nl = navigator.language ? navigator.language : app.options.defaultLanguage;
            var l = app.langIndex;
            for (var n in app.languages) {
              if (nl.indexOf(app.languages[n].id) === 0) {
                l = n;
                break;
              }
            }
            app.setLang(l, true);            
          })
          .fail(function () {
            app.title = 'ERROR';
            app.description = 'Error loading the repository data! Please try again.';
          });


  app.readBackSettings = function (reset) {
    if (reset) {
      app.fullScreen = app.back.fullScreen;
      app.order = app.back.order;
      app.orderInv = app.back.orderInv;
    } else {
      app.back = {
        fullScreen: app.fullScreen,
        order: app.order,
        orderInv: app.orderInv
      };
    }
  };

  app.readBackSettings(false);

  app.tapSettings = function () {
    app.readBackSettings(false);
    app.$.settings.open();
  };

  app.newSettings = function () {
    if (app.order !== app.back.order || app.orderInv !== app.back.orderInv) {
      console.log('order changed!');
      app.matchItems(true);
    }
  };

  app.backSettings = function () {
    app.readBackSettings(true);
  };

  app.clickOnLang = function (e) {
    e.preventDefault();
    app.setLang(e.model.index, false);
    return false;
  };

  app.setLang = function (i, forceLoad) {
    var currentLang = app.lang;
    app.lang = app.languages[i].id;
    app.langIndex = i;
    $('.curLang').removeClass('curLang');
    $('#langSel #' + app.lang).addClass('curLang');
    if (forceLoad || app.lang !== currentLang) {
      app.load();
    }
  };

  app.filterChanged = function () {
    app.matchItems(false);
  };

  // Fills the document with text according to the current language
  app.load = function () {

    app.title = app.options.title[app.lang];
    app.description = app.options.description[app.lang];
    app.labels = app.options.labels[app.lang];
    app.actLanguages = app.options.actLanguages[app.lang];
    app.actSubjects = app.options.actSubjects[app.lang];
    app.actLevels = app.options.actLevels[app.lang];

    if (app.projects === null) {
      app.spinner = true;
      $.getJSON(app.projectsPath + '/' + app.options.index.file)
              .done(function (data) {
                app.projects = app.checkProjects(data);
                app.matchItems(false);
                app.spinner = false;
                
    // Solution from: http://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
    var search = location.search.substring(1);
    var params = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    console.log(params);
    if (params.prj && app.projects[params.prj]) {
      var $prjCard = app.createCard(app.projects[params.prj]);
      if ($prjCard) {
        $prjCard.trigger('selected');
      }
    }
                
              })
              .fail(function () {
                app.spinner = false;
                $('#mainHome').append($('<h2/>').html('ERROR loading repository data!'));
              });
    } else {
      app.matchItems(false);
    }
  };

  app.checkProjects = function (projects) {

    for (var i in projects) {
      var prj = projects[i];
      if (!prj.langCodes) {
        prj.langCodes = [];
      }
      if (!prj.areaCodes) {
        prj.areaCodes = [];
      }
      if (!prj.levelCodes) {
        prj.levelCodes = [];
      }

      if (!prj.title) {
        prj.title = '';
      }
      prj.titleCmp = unidecode(prj.title).trim().toLowerCase();

      if (!prj.author) {
        prj.author = '';
      }
      prj.authorCmp = unidecode(prj.author).trim().toLowerCase();

      if (!prj.date) {
        prj.date = '00/00/00';
      }
      var d = prj.date.split('/');
      // Years beggining with '9' are 199x, otherwise are 20xx
      // Also, add a random number to avoid false equivalences when ordering
      prj.dateCmp = (d[2].charAt(0) === '9' ? '19' : '20') + d[2] + d[1] + d[0] + Math.floor(10 + Math.random() * 90);
    }

    return projects;
  };

  app.orderItems = function (projects) {
    var inv = app.orderInv ? -1 : 1;
    projects.sort(function (a, b) {
      var result = 0;
      switch (app.order) {
        case 0: // Date
          result = a.dateCmp.localeCompare(b.dateCmp) * -1;
          break;
        case 1: // Title
          result = a.titleCmp.localeCompare(b.titleCmp);
          break;
        case 2: // Author          
          result = a.authorCmp.localeCompare(b.authorCmp);
          break;
      }
      return result * inv;
    });
  };

  app.matchItems = function (reorder) {

    app.spinner = true;
    app.matchProjects = [];
    app.lastItem = 0;
    $('#mainHome').empty();

    var lang = app.actLanguages[app.currentLang].val;
    var area = app.actSubjects[app.currentSubject].val;
    var level = app.actLevels[app.currentLevel].val;
    var title = unidecode(app.currentTitle.trim()).toLowerCase();
    var author = unidecode(app.currentAuthor.trim()).toLowerCase();

    if (app.projects) {
      if (reorder) {
        app.orderItems(app.projects);
      }
      for (var i in app.projects) {
        var prj = app.projects[i];
        if ((lang === '*' || prj.langCodes.indexOf(lang) >= 0) &&
                (area === '*' || prj.areaCodes.indexOf(area) >= 0) &&
                (level === '*' || prj.levelCodes.indexOf(level) >= 0) &&
                (title === '' || prj.titleCmp.indexOf(title) >= 0) &&
                (author === '' || prj.authorCmp.indexOf(author) >= 0)) {
          app.matchProjects.push(prj);
        }
      }
    }

    app.numMatchProjects = app.matchProjects.length;
    app.fillList();
    app.spinner = false;
  };

  app.fillList = function () {

    if (app.matchProjects) {
      var $mainHome = $('#mainHome');
      if ($mainHome.length > 0) {
        app.spinner = true;
        app.loading = true;
        for (var i = 0; i < app.itemsPerScroll && app.lastItem < app.matchProjects.length; i++) {
          var prj = app.matchProjects[app.lastItem++];
          prj.loadTries = 10;
          var $prjCard = app.createCard(prj);
          $mainHome.append($prjCard);
        }
        app.loaded = true;
        app.loading = false;
        app.spinner = false;
      }
    }
  };

  app.playActivities = function (prj) {

    var player = app.$.player;

    var project = app.projectsPath + '/' + prj.path + '/' + prj.mainFile;
    app.$.bigCard.getPaperDialog().close();

    var dialog = app.$.playerDialog;
    dialog.fit();
    dialog.noCancelOnOutsideClick = false;
    dialog.open();
    player.project = project;
  };

  app.playerClosed = function () {
    app.$.player.project = null;
  };

  app.openApplet = function (prj) {
    var cmd = 'https://clic.xtec.cat/db/jclicApplet.jsp?project=' + app.baseURL + '/' + app.projectsPath + '/' + prj.path + '/' + prj.zipFile;
    window.open(cmd, 'JClicAppletWindow');
  };

  app.openInstall = function (prj) {
    var cmd = 'http://clic.xtec.cat/jnlp/jclic/install.jnlp?argument=' + app.baseURL + '/' + app.projectsPath + '/' + prj.path + '/' + prj.instFile;
    window.open(cmd, 'InstallWindow');
  };

  app.goToClicZone = function (prj) {
    window.open(prj.clicZoneURL, 'ClicZoneWindow');
  };

  app.createCard = function (prj) {

    var $prjCard = $('<prj-card/>');
    $prjCard.attr('heading', prj.title);
    $prjCard.attr('image', app.projectsPath + '/' + prj.path + '/' + prj.cover);
    $prjCard.attr('lang', app.enumList(prj.langCodes));

    var $cardContent = $('<div class="card-content"/>');
    $cardContent.append($('<div class="one-line-text"/>').append(prj.author));

    $prjCard.on('play', function () {
      app.playActivities(prj);
    });

    $prjCard.on('selected', function () {

      var bigCard = app.$.bigCard;

      if (!prj.detail) {
        var prjFile = app.projectsPath + '/' + prj.path + '/project.json';
        app.spinner = true;
        $.getJSON(prjFile)
                .done(function (data) {
                  prj.detail = data;
                  prj.detail.path = prj.path;
                  prj.detail.app = app;

                  bigCard.path = app.projectsPath + '/' + prj.path;
                  bigCard.prj = prj.detail;

                  bigCard.getPaperDialog().fit();
                  bigCard.getPaperDialog().open();
                  bigCard.getPaperDialog().noCancelOnOutsideClick = false;
                  app.spinner = false;
                })
                .fail(function () {
                  app.spinner = false;
                  console.log('Error loading ' + prjFile);
                });
        return;
      }

      if (prj.detail) {
        bigCard.path = app.options.index.path + '/' + prj.path;
        bigCard.prj = prj.detail;

        bigCard.getPaperDialog().fit();
        bigCard.getPaperDialog().open();
        bigCard.getPaperDialog().noCancelOnOutsideClick = false;
      }

      return false;
    });

    $prjCard.hover(
            function () {
              $prjCard.attr('elevation', 4);
            },
            function () {
              $prjCard.attr('elevation', 1);
            });

    $prjCard.append($cardContent);

    return $prjCard;
  };

  app.displayInstalledToast = function () {
    // Check to make sure caching is actually enabled—it won't be in the dev environment.
    if (!document.querySelector('platinum-sw-cache').disabled) {
      document.querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function () {
    if (!app.loaded && !app.loading) {
      app.fillList();
    }
    app.fullScreenEnabled = window.JClicObject.Utils.screenFullAllowed();
    
    console.log('Ready!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function () {
    // imports are loaded and elements have been registered 

    app.setLang(app.langIndex);

    app.playerOptions = {
      closeFn: function () {
        app.$.playerDialog.close();
      }
    };

    if (deployJava && deployJava.getJREs() instanceof Array) {
      app.javaDisabled = deployJava.getJREs().length < 1;
    }

    $('#mainContainer').on('scroll', function () {

      var top = $(this).scrollTop();
      var height = $(this).innerHeight();
      var length = this.scrollHeight;

      if (length - top - height <= 10) {
        app.fillList();
      }
    });

  });


  // Main area's paper-scroll-header-panel custom condensing transformation of
  // the appName in the middle-container and the bottom title in the bottom-container.
  // The appName is moved to top and shrunk on condensing. The bottom sub title
  // is shrunk to nothing on condensing.
  addEventListener('paper-header-transform', function (e) {
    var appName = document.querySelector('#mainToolbar .app-name');
    var middleContainer = document.querySelector('#mainToolbar .middle-container');
    var bottomContainer = document.querySelector('#mainToolbar .bottom-container');
    var detail = e.detail;
    var heightDiff = detail.height - detail.condensedHeight;
    var yRatio = Math.min(1, detail.y / heightDiff);
    var maxMiddleScale = 0.50;  // appName max size when condensed. The smaller the number the smaller the condensed size.
    var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1 - maxMiddleScale)) + maxMiddleScale);
    var scaleBottom = 1 - yRatio;

    // Move/translate middleContainer
    Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

    // Scale bottomContainer and bottom sub title to nothing and back
    Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

    // Scale middleContainer appName
    Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', appName);
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onDataRouteClick = function () {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function () {
    document.getElementById('mainContainer').scrollTop = 0;
  };

  // Utility functions

  // Converts an array of strings into a single string
  app.enumList = function (list, sep, lower) {
    var result = '';

    if (typeof sep !== 'string') {
      sep = ' ';
    }

    if (list) {
      for (var i = 0; i < list.length; i++) {
        result = result + (lower ? list[i].toLowerCase() : list[i]);
        if (i < list.length - 1) {
          result = result + sep;
        }
      }
    }
    return result;
  };

})(document);
