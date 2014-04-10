'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var DummiesNewGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        //this.installDependencies();
      }
    });

    this._checkFiles();
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic DummiesNew generator.'));

    var prompts = [{
      type: 'confirm',
      name: 'Server',
      message: 'Would you like a server?',
      default: true
    },
    // {
    //   type: 'confirm',
    //   name: 'CoffeeScript',
    //   message: 'Would you like to enable CoffeeScript?',
    //   default: true
    // },
    {
     type: 'checkbox',
      name: 'dependencies',
      message: 'Choose what you want:',
      choices: [
        { value:'"jscrollpane": "latest"', name:'jscrollpane', checked: false },
        { value:'"jquery-mousewheel": "latest"', name:'jquery-mousewheel', checked: false },
        { value:'"underscore": "latest"', checked: false },
        { value:'"fancybox": "latest"', name:'fancybox', checked: false },
        { value:'"jquery-touchswipe": "latest"', name:'jquery-touchswipe', checked: false }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.Server = props.Server;

      this.dependencies = {
        tabDep: props.dependencies
      };
      done();
    }.bind(this));
  },

  app: function () {

    this._addDependencies(this.dependencies.tabDep);

    this.mkdir('css');
    this.mkdir('css/src');

    this.copy('bower_components/dummy/css/rte.css', 'css/rte.css');
    this.copy('bower_components/dummy/css/src/columns.scss', 'css/src/columns.scss');
    this.copy('bower_components/dummy/css/src/config.scss', 'css/src/config.scss');
    this.copy('bower_components/dummy/css/src/functions.scss', 'css/src/functions.scss');
    this.copy('bower_components/dummy/css/src/ie.scss', 'css/src/ie.scss');
    this.copy('bower_components/dummy/css/src/layout.scss', 'css/src/layout.scss');
    this.copy('bower_components/dummy/css/src/modules.scss', 'css/src/modules.scss');
    this.copy('bower_components/dummy/css/src/mediaqueries.scss', 'css/src/mediaqueries.scss');
    this.copy('bower_components/dummy/css/src/mixins.scss', 'css/src/mixins.scss');
    this.copy('bower_components/dummy/css/src/print.scss', 'css/src/print.scss');
    this.copy('bower_components/dummy/css/src/styles.scss', 'css/src/styles.scss');

    this.mkdir('demo');
    this.copy('bower_components/dummy/demo/index.html', 'demo/index.html');

    this.mkdir('grunt');
    this.mkdir('grunt/tasks');
    this.mkdir('grunt/tasks/options');

    this.copy('bower_components/dummy/grunt/gruntfile.coffee', 'grunt/gruntfile.coffee');
    this.copy('bower_components/dummy/grunt/.bowerrc', 'grunt/.bowerrc');
    this.copy('bower_components/dummy/grunt/tasks/options/autoprefixer.coffee', 'grunt/tasks/options/autoprefixer.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/concurrent.coffee', 'grunt/tasks/options/concurrent.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/cssmin.coffee', 'grunt/tasks/options/cssmin.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/groc.coffee', 'grunt/tasks/options/groc.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/sass.coffee', 'grunt/tasks/options/sass.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/uglify.coffee', 'grunt/tasks/options/uglify.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/watch.coffee', 'grunt/tasks/options/watch.coffee');

    this.mkdir('js');
    this.mkdir('js/components');
    this.mkdir('js/htc');

    this.copy('bower_components/dummy/js/htc/backgroundsize.min.htc', 'js/htc/backgroundsize.min.htc');
    this.copy('bower_components/dummy/js/base.js', 'js/base.js');
    this.copy('bower_components/dummy/js/base.js.map', 'js/base.js.map');
    this.copy('bower_components/dummy/js/base.min.js', 'js/base.min.js');
    this.copy('bower_components/dummy/js/main.js', 'js/main.js');
    this.copy('bower_components/dummy/js/main.js.map', 'js/main.js.map');
    this.copy('bower_components/dummy/js/main.min.js', 'js/main.min.js');

    this.copy('bower_components/dummy/index.html', 'index.html');
    this.copy('bower_components/dummy/README.md', 'README.md');
    this.copy('bower_components/dummy/.editorconfig', '.editorconfig');
    this.copy('bower_components/dummy/.gitignore', '.gitignore');

    this.mkdir('js/src');
    this.copy('bower_components/dummy/js/src/base.coffee', 'js/src/base.coffee');
    this.copy('bower_components/dummy/js/src/main.coffee', 'js/src/main.coffee');
    this.copy('bower_components/dummy/grunt/tasks/options/coffee.coffee', 'grunt/tasks/options/coffee.coffee');

    if(this.Server) this._addConnect();
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  },

  _checkFiles:function() {
    this.copy('bower_components/dummy/grunt/bower.json', 'grunt/bower.json');
    this.copy('bower_components/dummy/grunt/package.json', 'grunt/package.json');
    this.copy('bower_components/dummy/grunt/tasks/build.coffee', 'grunt/tasks/build.coffee');
    this.copy('bower_components/dummy/grunt/tasks/default.coffee', 'grunt/tasks/default.coffee');
  },

  _addConnect:function() {
    this.copy('bower_components/dummy/grunt/tasks/options/connect.coffee', 'grunt/tasks/options/connect.coffee');

    var file = this.readFileAsString('grunt/package.json');
    file = file.replace('"devDependencies": {', '"devDependencies": {\n\t"grunt-contrib-connect": "^0.7.1",');
    this.write('grunt/package.json',file);

    file = this.readFileAsString('grunt/tasks/build.coffee');
    file = file.replace("## // insert here", "'connect:default'\n#insert here");
    this.write('grunt/tasks/build.coffee',file);

    file = this.readFileAsString('grunt/tasks/default.coffee');
    file = file.replace("## // insert here", "'connect:default'\n#insert here");
    this.write('grunt/tasks/default.coffee',file);
  },

  _addDependencies: function(deps) {
    var values = "";
    for (var i = 0; i < deps.length; i++) {
        values += '\n\t'+deps[i]+',';
    };

    var file = this.readFileAsString('grunt/bower.json');
    file = file.replace('"dependencies": {', '"dependencies": {\n'+values);
    this.write('grunt/bower.json',file);
  }
});

module.exports = DummiesNewGenerator;