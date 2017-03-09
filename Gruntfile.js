module.exports = function(grunt) {

    grunt.initConfig({
        
        concat: {
            dist: {
                src: ['js/board.js', 'js/scores.js'],
                dest: 'dist/2048.js',
            }
        },

        uglify: {
            dist: {
                options: {
                    mangle: true
                },
                files: {
                    'dist/2048.js': ['dist/2048.js']
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    'dist/style.css': ['css/style.css']
                }
            }
        },

        clean: {
            dist: {
                src: ['dist']
            }
        },

        usemin: {
            html: 'dist/index.html'
        },

        copy: {
            index: {
                files: [
                    {
                        expand: true, 
                        src: ['index.html'], 
                        dest: 'dist', 
                        filter: 'isFile'
                    },
                ],
            },
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');

    // build dist folder
    grunt.registerTask('default', ['clean:dist', 'concat', 'uglify', 'cssmin', 'copy:index', 'usemin']);

};