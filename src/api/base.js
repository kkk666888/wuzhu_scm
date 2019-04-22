import axios from 'axios';
import qs from 'qs';
import loadingService from '../components/loading/loadingService.js';
import alertService from '../components/alert/alertService.js';
import common from '../utils/common.js';
import storageService from '../utils/storageService.js';

function send(requestData, option, config) {
  let thisObj = this;
  let promise = new Promise((resolve, reject) => {
    let hostUrl = process.env.NODE_URL;
    let url = thisObj.url;
    let contentType = 'application/json';
    url += '?t=' + new Date().getTime();
    let method = thisObj.method || 'post';
    let axiosOption = {
      method: method, //get,delete,head,post,put,patch
      baseURL: hostUrl,
      url: url,
      headers: { 'Content-type': contentType },
      timeout: 30000,
      withCredentials: true
    };

    if (requestData) {
      if (method === 'put' || method === 'post' || method === 'pacth') {
        axiosOption.data = JSON.stringify(requestData);
      } else {
        if (!thisObj.isRESTful) {
          axiosOption.params = requestData;
        }
      }
    }

    axiosOption = common.deepMerge(axiosOption, config);

    let loadingInstance = null;

    if (option && option.showLoading) {
      loadingInstance = loadingService.create({ loadingTxt: option.loadingTxt || 'loading...' });
      loadingInstance.show();
    }
    axios(axiosOption)
      .then(response => {
        if (loadingInstance) {
          loadingInstance.hide();
          loadingInstance.destroy();
        }
        if (response.status === 200) {
          let data = response.data;

          // 登陆失效，跳转登陆页
          if (response.data.code == '2000') {
            storageService.cookie.remove('tokenStr');
            let href = window.location.href.split('#')[0];
            alertService.error('登陆失效，请重新登陆');
            common.logonOut();
            window.location.href = `${href}#/login`;
          } else if (data.code && (data.code === '2003' || data.code === '2005')) {
            if (option && !option.handleError) {
              alertService.info('账号或密码错误');
            }
          } else if (data.code && data.code !== '00') {
            if (option && !option.handleError) {
              alertService.info(data.msg);
            }
          }
          resolve(data);
        } else {
          reject(error);
        }
      })
      .catch(error => {
        // console.log(error.message);
        if (loadingInstance) {
          loadingInstance.hide();
          loadingInstance.destroy();
        }
        alertService.error(error.message);
        reject(error);
      });
  });

  return promise;
}

const apiService = {
  init: function(obj) {
    Object.keys(obj).forEach(item => {
      obj[item].send = send;
    });

    return obj;
  }
};

export default apiService;
