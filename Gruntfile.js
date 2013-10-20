module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use
 
    uglify: {
      files: {
        expand: true, 
        flatten: true, 
        src: 'src/js/*.js',
        dest: 'dist',
        ext: '.min.js'
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'src/css',
        src: ['*.css', '!*.min.css'],
        dest: 'dist',
        ext: '.min.css'
      }
    },

    qunit: {
        all: ['tests/*.html']
    },

    watch: {
      files: ['tests/*.js', 'tests/*.html', 'src/**'],
      tasks: ['default']
    },

    copy: {
      main: { 
        expand: true,
        cwd: 'dist',
        src: '*', 
        dest: 'tests/lib/' 
      }
    }
  });

  // load up your plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask('default', ['uglify', 'copy', 'qunit']);
  grunt.registerTask('buildAll', ['uglify', 'cssmin', 'copy', 'qunit']);
};
