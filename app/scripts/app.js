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
            app.description='Error loading the repository data! Please try again.';
          });
          
  // Builds the language selector, filling it with the languages available in options.languages
  // TODO: Try to convert it in an HTML Element
  var buildLangSelector = function() {
    
    var $langSel = $('#langSel');

    $langSel.empty();

    for (var i = 0; i < app.options.languages.length; i++) {
      var $lng = $('<a href="#" class="JCRLang" title="'+app.options.langNames[i]+'">' + app.options.languages[i] + '</a>');
      if(app.options.languages[i] === app.lang){
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

  app.actLanguages=[];  
  app.currentLang = 0;
  
  app.actSubjects=[];  
  app.currentSubject = 0;
  
  app.actLevels=[];  
  app.currentLevel = 0;
  
  app.filterChanged = function() {
    console.log('Language: '+app.actLanguages[app.currentLang].val);
    console.log('Subject: '+app.actSubjects[app.currentSubject].val);
    console.log('Level: '+app.actLevels[app.currentLevel].val);
  };
  
  // Fills the document with text according to the current language
  var load = function () {
    
    app.title = app.options.title[app.lang];
    app.description = app.options.description[app.lang];
    app.langLabel = app.options.labels.languages[app.lang];
    app.searchLabel = app.options.labels.search[app.lang];
    app.actLanguages = app.options.actLanguages[app.lang];
    app.subjectLabel = app.options.labels.subjects[app.lang];
    app.actSubjects = app.options.actSubjects[app.lang];
    app.levelLabel = app.options.labels.levels[app.lang];
    app.actLevels = app.options.actLevels[app.lang];
    
    
    /*   
     this.$search.empty();
     
     this.$langSelect = $('<select name="language" class="filter"/>');
     for (var i = 0; i < this.langs.options.length; i++) {
     var l = this.langs.options[i];
     this.$langSelect.append($('<option value="' + l + '"' + (i === 0 ? ' selected' : '') + '>' + this.langs[this.lang][l] + '</option>'));
     }
     this.$search.append(this.$langSelect);
     
     this.$levelSelect = $('<select name="level" class="filter"/>');
     for (var i = 0; i < this.levels.options.length; i++) {
     var l = this.levels.options[i];
     this.$levelSelect.append($('<option value="' + l + '"' + (i === 0 ? ' selected' : '') + '>' + this.levels[this.lang][l] + '</option>'));
     }
     this.$search.append(this.$levelSelect);
     
     this.$areaSelect = $('<select name="area" class="filter"/>');
     for (var i = 0; i < this.areas.options.length; i++) {
     var l = this.areas.options[i];
     this.$areaSelect.append($('<option value="' + l + '"' + (i === 0 ? ' selected' : '') + '>' + this.areas[this.lang][l] + '</option>'));
     }
     this.$search.append(this.$areaSelect);
     
     $('.filter').on('change', function () {
     thisRepo.matchItems();
     });
     
     
     if (!this.projects) {
     $.getJSON(this.options.index.path + '/' + this.options.index.file)
     .done(function (data) {
     thisRepo.projects = data;
     thisRepo.matchItems();
     })
     .fail(function () {
     thisRepo.$prjList.append($('<h2/>').html('ERROR loading repository data!'));
     });
     } else
     this.matchItems();
     */
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

      // console.log('scroll top: ' + top + ' - height: ' + height + ' (' +  (top+height) +') - scrollHeight: ' + length + ' (' + (length-top-height) + ')');

      if (length - top - height <= 6) {
        app.search();
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

  app.search = function () {
    var $container = $('#mainHome');

    $container.append(app.generateCard('Hello', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'));
    $container.append(app.generateCard('Projecte 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.'));
    $container.append(app.generateCard('Projecte 3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea.'));
    $container.append(app.generateCard('Projecte 4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'));
    $container.append(app.generateCard('Projecte 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.'));
    $container.append(app.generateCard('Projecte 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'));
    $container.append(app.generateCard('Projecte 7', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'));
    $container.append(app.generateCard('Projecte 8', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute.'));

  };

  app.generateCard = function (title, description) {

    //var $prj = $('<project-card elevation="2" animated="true"/>');
    var $prj = $('<prj-card elevation="1" animated="true"/>');
    $prj.attr('title', title);
    $prj.attr('description', description);
    return $prj;
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
