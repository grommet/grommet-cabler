import path from 'path';

export default {
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
  devServerPort: 9021,
  scsslint: true,
  sync: {
    hostname: 'grommet.us.rdlabs.hpecorp.net',
    username: 'ligo',
    remoteDestination: '/var/www/html/examples/cabler/dist'
  },
  alias: {
    'grommet/scss': path.resolve(__dirname, '../grommet/src/scss'),
    'grommet': path.resolve(__dirname, '../grommet/src/js')
  }
};
