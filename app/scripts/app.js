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

(function (document) {
  'use strict';

  // Grab a reference to our auto-binding template
  var app = document.querySelector('#app');

  app.options = {};

  app.lang = 'en';
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
  app.lastItem = 0;
  app.itemsPerScroll = 20;

  // Load 'main.json'
  $.getJSON('main.json')
          .done(function (data) {
            $.extend(app.options, data);
            app.lang = app.options.languages.indexOf(navigator.language) >= 0 ?
                    navigator.language : app.options.defaultLanguage;
            buildLangSelector();
            load();
            // register scroll
          })
          .fail(function () {
            app.title = 'ERROR';
            app.description = 'Error loading the repository data! Please try again.';
          });

  // Builds the language selector, filling it with the languages available in options.languages
  // TODO: Try to convert it into an HTML Element
  var buildLangSelector = function () {

    var $langSel = $('#langSel');

    $langSel.empty();

    for (var i = 0; i < app.options.languages.length; i++) {
      var $lng = $('<a href="#" class="JCRLang" title="' + app.options.langNames[i] + '">' + app.options.languages[i] + '</a>');
      if (app.options.languages[i] === app.lang) {
        $lng.addClass('curLang');
      }
      $langSel.append($lng);
    }

    // Set callback for language selectors
    $('.JCRLang').on('click', function () {
      app.lang = $(this).text();
      $('.curLang').removeClass('curLang');
      $(this).addClass('curLang');
      load();
      return false;
    });
  };


  app.filterChanged = function () {
    app.matchItems();
  };

  // Fills the document with text according to the current language
  var load = function () {

    app.title = app.options.title[app.lang];
    app.description = app.options.description[app.lang];
    app.labels = app.options.labels[app.lang];
    app.actLanguages = app.options.actLanguages[app.lang];
    app.actSubjects = app.options.actSubjects[app.lang];
    app.actLevels = app.options.actLevels[app.lang];

    if (!app.projects) {
      $.getJSON(app.options.index.path + '/' + app.options.index.file)
              .done(function (data) {
                app.projects = app.checkProjects(data);
                app.matchItems();
              })
              .fail(function () {
                $('#mainHome').append($('<h2/>').html('ERROR loading repository data!'));
              });
    } else {
      app.matchItems();
    }
  };
  
  app.checkProjects = function(projects) {
    
    for (var i in projects) {
      var prj = projects[i];
      if(!prj.langCodes){
        prj.langCodes = [];
      }
      if(!prj.areaCodes){
        prj.areaCodes = [];
      }
      if(!prj.levelCodes){
        prj.levelCodes = [];
      }
      if(!prj.title){
        prj.title = '';
      }
      if(!prj.author){
        prj.author = '';
      }      
    }
    
    return projects;
  };

  app.matchItems = function () {
    app.matchProjects = [];
    app.lastItem = 0;
    $('#mainHome').empty();

    var lang = app.actLanguages[app.currentLang].val;
    var area = app.actSubjects[app.currentSubject].val;
    var level = app.actLevels[app.currentLevel].val;
    var title = app.currentTitle.trim().toLowerCase();
    var author = app.currentAuthor.trim().toLowerCase();

    console.log('lang: ' + lang + ' area: ' + area+ ' level: ' +level + ' title: ' + title + ' author: ' + author);

    if (app.projects) {
      for (var i in app.projects) {
        var prj = app.projects[i];
        if ((lang === '*' || prj.langCodes.indexOf(lang) >= 0) &&
                (area === '*' || prj.areaCodes.indexOf(area) >= 0) &&
                (level === '*' || prj.levelCodes.indexOf(level) >= 0) &&
                (title === '' || prj.title.toLowerCase().indexOf(title) >= 0) &&
                (author === '' || prj.author.toLowerCase().indexOf(author) >= 0)) {
          app.matchProjects.push(prj);
        }
      }
    }

    app.fillList();
  };

  app.fillList = function () {
    if (app.matchProjects) {
      var $mainHome = $('#mainHome');
      for (var i = 0; i < app.itemsPerScroll && app.lastItem < app.matchProjects.length; i++) {
        var prj = app.matchProjects[app.lastItem++];
        prj.loadTries = 10;
        var $prjCard = app.createCard(prj);
        $mainHome.append($prjCard);
      }
    }
  };

  app.openInNewWindow = function (prj) {
    var cmd = app.options.index.path + '/index.html?' + prj.path + '/' + prj.mainFile;
    window.open(cmd, 'JClicPlayWindow');
  };

  app.openAppletInNewWindow = function (prj) {
    //var cmd = app.options.index.path + '/index-java.html?' + prj.path + '/' + prj.zipFile;
    var cmd = 'https://clic.xtec.cat/db/jclicApplet.jsp?project=' + window.location.href + '/' + prj.path + '/' + prj.zipFile;
    window.open(cmd, 'JClicAppletWindow');
  };


  app.createCard = function (prj) {

    var $prjCard = $('<prj-card elevation="2" animatedShadow="true"/>');
    $prjCard.attr('heading', prj.title);
    $prjCard.attr('image', app.options.index.path + '/' + prj.path + '/' + prj.cover);

    var $cardContent = $('<div class="card-content"/>');
    $cardContent.append($('<div class="one-line-text"/>').append(prj.author));

    $prjCard.on('play', function () {
      app.openInNewWindow(prj);
    });

    $prjCard.on('selected', function () {

      var bigCard = app.$.bigCard;

      if (!prj.detail) {
        var prjFile = app.options.index.path + '/' + prj.path + '/project.json';
        $.getJSON(prjFile)
                .done(function (data) {
                  prj.detail = data;
                  prj.detail.path = prj.path;
                  prj.detail.app = app;

                  bigCard.path = app.options.index.path + '/' + prj.path;
                  bigCard.prj = prj.detail;

                  bigCard.fit();
                  bigCard.toggle();
                })
                .fail(function () {
                  console.log('Error loading ' + prjFile);
                });
        return;
      }

      if (prj.detail) {
        bigCard.path = app.options.index.path + '/' + prj.path;
        bigCard.prj = prj.detail;

        bigCard.fit();
        bigCard.toggle();
      }

      return false;
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
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function () {
    // imports are loaded and elements have been registered    

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
  /*
   function enumList(list, sep, lower) {
   var result = '';
   
   if (typeof sep !== 'string'){
   sep = '|';
   }
   
   for (var i = 0; i < list.length; i++) {
   result = result + (lower ? list[i].toLowerCase() : list[i]);
   if (i < list.length - 1){
   result = result + sep;
   }
   }
   return result;
   }*/

})(document);
