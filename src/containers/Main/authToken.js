
import axios from 'axios';
import searchUtil from '@utils/searchUtil';
import { enterFirstPage } from '@utils/utilFunc';
import moment from 'moment';
import Cookie from 'js-cookie';
// 对用户权限的单独判定: authToken, expireData, 
// 对通过验证后用户显示页布局的调整;

export function hasTokenToQuery(history = {}){ // 判定是否已有基础请求凭证(token)
  const { pathname = '', search = '' } = history.location || {};
  const authData = localStorage.getItem('authData') || '';
  const searchInfo = searchUtil(search).parse(); // 后续免登陆 可用方案
  const { redirectPath } = searchInfo || {};
  if (authData && pathname !== '/login') { // 正常已登录用户F5触发
    axios.defaults.headers.common['Authorization'] = 'bearer ' + authData;
    if (redirectPath) {
      history.push(redirectPath);
    }
    return true;
  }
  return false;
}

export function appRedirect(history = {}){ // 登录成功后, 可以基于路径的特殊字段直接转跳指定页面
  const { search = '' } = history.location || {};
  const searchInfo = searchUtil(search).parse(); // 后续免登陆 可用方案
  const { redirectPath } = searchInfo || {};
  if (redirectPath) {
    return redirectPath;
  }
  return enterFirstPage();
}

export function appRenderType(history = {}){ // 基于权限判定渲染ui
  // const { pathname = '', search = '' } = history.location || {};
  const authData = localStorage.getItem('authData') || '';
  const isNotLogin = Cookie.get('isNotLogin');
  const isTokenValid = Cookie.get('expireData') && moment().isBefore(new Date(Cookie.get('expireData')), 'second');
  if (authData && isNotLogin && isTokenValid) {
    return 'authToken';
  }
  // encodeURIComponent
  // const searchInfo = searchUtil(search).parse(); // 后续免登陆 可用方案
  // const { fromOutside = '', auth = '', diagWarningId, deviceFullcode } = searchInfo || {};
  // if (fromOutside === 'eam' && auth && pathname === '/monitor/diagnoseCenter' && diagWarningId && deviceFullcode) {
  //   // eam携带参数跳入诊断中心分析页 - 正常展示界面
  //   return 'outside';
  // }
  return '';
}

export function renderWithoutMenu(history = {}) { // 某些页面, 不用展示顶部及侧边menu
  // 1. 系统内自带不需菜单的页面 => pathWithoutMenu
  // 2. 外部链接入本系统内的不需菜单页面 => eam诊断中心
  const { pathname = '', search = '' } = history.location || {};
  const pathWithoutMenu = ['/homepage'];
  const searchInfo = searchUtil(search).parse();
  const { fromOutside = '', diagWarningId, deviceFullcode } = searchInfo || {};
  if (pathWithoutMenu.includes(pathname)) {
    return 'authToken';
  }
  if (fromOutside === 'eam' && pathname === '/monitor/diagnoseCenter' && diagWarningId && deviceFullcode) {
    return 'outside';
  }
  return '';
}




// const testUrl = '/monitor/diagnoseCenter?redirectPath=%2Fmonitor%2FdiagnoseCenter%3FfromOutside%3Deam%26diagWarningId%3D525232985541121%26deviceFullcode%3D350M201M2M48';

