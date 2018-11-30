# 物主后台管理系统

版本 v1.0.0

### 主要依赖模块

- [vue@2.5.2](https://cn.vuejs.org/)框架
- [element-ui@2.2.1](http://element-cn.eleme.io/#/zh-CN)UI 库
- [vue-router@3.0.1](https://router.vuejs.org/zh/)路由
- [vuex@3.0.1](https://vuex.vuejs.org/zh/)状态管理
- [axios@0.18.0](https://www.npmjs.com/package/axios)http 请求库
- [sass-loader@6.0.7](https://www.npmjs.com/package/sass-loader)css 预处理器
- [webpack@3.6.0](https://www.webpackjs.com/)构建工具

### 功能划分

采用二级目录划分
例

- 权限管理
  - 用户管理
  - 角色管理
  - 资源管理
- 供应链管理
  - 发货管理
  - 买断管理

### 代码目录

```js
+-- build/                    ---webpack conf文件目录
+-- config/                   ---环境配置文件目录
+-- node_modules/             ---npm包目录
+-- src/                      ---核心代码目录
|   +--api/                   ---http请求定义目录
|   +--assets/                ---组件资源目录css、image
|   +--components/            ---公共组件/业务组件目录
|   +--directives/            ---自定义指令
|   +--filters/               ---过滤器
|   +--router/                ---路由(按模块分目录)
|   +--store/                 ---状态管理(按模块分目录)
|   +--utils/                 ---工具方法
|   +--views                  ---业务组件目录(尽可能拆分vue、js、css)
|   |   --- ...
|   ---App.vue                ---vue主视图
|   ---main.js                ---vue入口
+-- static/                   ---静态资源(iconfont等)
---.babelrc                   ---babel转码配置文件
---.editorconfig              ---格式化配置文件(配合prettier插件)
---.gitignore                 ---git忽略配置文件
---.postcssrc.js              ---postcss插件配置文件
---index.html                 ---页面入口html
---package-lock.json          ---依赖包版本锁定文件
---package.json               ---依赖包配置文件
```

### 安装运行

##### 1.下载或克隆项目源码

##### 2.npm 安装相关包文件(建议使用淘宝镜像源)

```js
npm install
```

##### 3.启动项目

```js
npm start
```

##### 4.打包项目

根据不同环境打包，配置文件在 config/目录

测试环境

```js
npm run test
```

生产环境

```js
npm run build
```

### 其他

- 采用 eslint 检查代码、标准为'standard'
- icon 采用 material-design，也可添加 svg 等
- 接口文档建议写在 tapd 等位置统一管理
- 建议用 vscode 开发，采用.vscode 目录下工作区设置，统一格式规范等

### 更新日志

#### 2018-9-11 by hcg

- 修复生产环境图片引用路径出错问题

#### 2018-9-5 by hcg

- 添加 vuex 持久化存储，添加 file-saver 文件保存

#### 2018-8-28 by hcg

- table 组件增加获取选中行的 ids

#### 2018-8-23 by hcg

- 修改 common 日期格式化方法，添加 debounce 去抖方法

#### 2018-7-26 by hcg

- 使用 sass-resources-loader 引入 sass 全局变量 common.scss、index.scss

#### 2018-7-25 by hcg

- 设置页面 title 名称
- 修改菜单滚动条

#### 2018-07-10 by hcg

- 增加权限功能
  - 登陆
  - 权限管理

#### 2018-07-09 by hcg

- 文档编写
