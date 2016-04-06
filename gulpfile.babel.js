import gulp from 'gulp';
import { argv } from 'yargs';
import path from 'path';
import grommetToolbox, { getOptions } from 'grommet-toolbox';

gulp.task('set-webpack-alias', function () {
  const options = getOptions();
  if (options.alias && argv.useAlias) {
    console.log('Using local alias.');
    options.webpack.resolve.alias = options.alias;
  }
});

gulp.task('start-backend', function() {
  nodemon({
    script: path.resolve(__dirname, 'server/server')
  });
});

grommetToolbox(gulp);
