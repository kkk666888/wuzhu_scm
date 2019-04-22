'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  NODE_URL: '"scm"' // 代理
  // NODE_URL: '"http://10.35.40.141:8101/scm/"'
});
