require.config({
  paths: {
    jquery: '../bower_components/jquery/dist/jquery',
    underscore: '../bower_components/underscore/underscore-min',
    backbone: '../bower_components/backbone/backbone-min',
    dropzone: '../bower_components/dropzone/dist/dropzone-amd-module',
    ckeditor: '../bower_components/ckeditor/ckeditor',
    'ckeditor-jquery': '../bower_components/ckeditor/adapters/jquery',
    semantic: '../semantic/dist/semantic.min',
    text: '../bower_components/text/text'
  },
  shim: {
    'semantic': {
      exports: 'semantic',
      deps: ['jquery']
    },
    'ckeditor-jquery': {
      deps: ['jquery', 'ckeditor']
    }
  }

});

require([
  'app',
], function(App){
  App.initialize();
});
