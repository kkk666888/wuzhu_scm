'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  NODE_URL: '""',//默认为供应链系统地址
  portalUrl:'"https://wuzhutes.woozhu.cn/portal"',//门户系统-泉涌
  coreUrl: '"http://10.35.40.224:9093"', //核心系统地址
});
