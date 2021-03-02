// vue.config.js
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
const os = require('os');
console.log('process.argv:', process.argv);
console.log('\n\n');

function getArgvToObject() {
  let cmdArgvs = process.argv;
  let param = {};
  let key = '';
  let tmp = [];
  for (let i = 0 ; i<cmdArgvs.length; i++) {
    if (/^--[\w\d_-]+/g.test(cmdArgvs[i])){
      tmp = cmdArgvs[i].replace('--', '').split('=');
      key = tmp[0].toUpperCase();
      param[key] = tmp[1];
    }
  }
  console.log('getArgvToObject param: ', param);
  return param
}

let param = getArgvToObject();

if (!param.AIO_ENV) {
  param.AIO_ENV = 'development'
}

if ( !param.AIO_ENV || !['production', 'development'].includes(param.AIO_ENV)) {
  console.log('AIO_ENV set default: development');
  param.AIO_ENV = 'development'
}

if (!param.TARGET_PLATFORM || !['darwin', 'win32'].includes(param.TARGET_PLATFORM)) {
  console.log(`TARGET_PLATFORM set default: ${os.platform()}`);
  param.TARGET_PLATFORM = os.platform();
}

console.log('param:', param);

let vueCliConfig = {
  publicPath: './',
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
      ],
    },
    plugins: [
      new StringReplaceWebpackPlugin(),
    ]
  }
}

module.exports = vueCliConfig;