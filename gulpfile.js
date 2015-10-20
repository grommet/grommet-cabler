var gulp = require('gulp');
var path = require('path');
var devGulpTasks = require('grommet/utils/gulp/gulp-tasks');

var opts = {
  base: '.',
  dist: path.resolve(__dirname, 'dist/'),
  copyAssets: [
    'src/index.html',
    {
      asset: 'src/img/**',
      dist: 'dist/img/'
    }
  ],
  scssAssets: ['src/scss/**/*.scss'],
  jsAssets: ['src/js/**/*.js'],
  mainJs: 'src/js/index.js',
  mainScss: 'src/scss/index.scss',
  sync: {
    hostname: 'grommet.us.rdlabs.hpecorp.net',
    username: 'ligo',
    remoteDestination: '/var/www/html/examples/cabler/dist'
  },
  webpack: {
    resolve: {
      //alias: { // TODO: remove, just for local dev
      //  'grommet/scss': path.resolve(__dirname, '../grommet/src/scss'),
      //  'grommet': path.resolve(__dirname, '../grommet/src/js')
      //},
      root: [
        path.resolve(__dirname, 'src/js'),
        path.resolve(__dirname, 'src/scss'),
        path.resolve(__dirname, 'node_modules')
      ]
    }
  },
  devServerPort: 9021
};

devGulpTasks(gulp, opts);
