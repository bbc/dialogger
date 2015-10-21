require.config({
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    serialize: '../bower_components/jquery-serialize-object/jquery.serialize-object',
    underscore: '../bower_components/underscore/underscore-min',
    backbone: '../bower_components/backbone/backbone-min',
    dropzone: '../bower_components/dropzone/dist/dropzone-amd-module',
    ckeditor: '../bower_components/ckeditor/ckeditor',
    semantic: '../semantic/dist/semantic.min',
    text: '../bower_components/text/text'
  },
  shim: {
    'semantic': {
      exports: 'semantic',
      deps: ['jquery']
    },
    'ckeditor': {
      exports: 'CKEDITOR',
      init: function() {
        this.CKEDITOR.disableAutoInline = true;
      }
    },
    'serialize': {
      deps: ['jquery']
    }
  }

});

require([
  'app',
], function(App){
  App.initialize();
});
