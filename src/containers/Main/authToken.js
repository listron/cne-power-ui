
import axios from 'axios';
import searchUtil from '@utils/searchUtil';
import moment from 'moment';
import Cookie from 'js-cookie';
// 对用户权限的单独判定: authToken, expireData, 
// 对通过验证后用户显示页布局的调整;

export function hasTokenToQuery({ pathname = '', search = '' }){ // 判定是否已有基础请求凭证(token)
  const authData = localStorage.getItem('authData') || '';
  if (authData && pathname !== '/login') { // 正常已登录用户F5触发
    axios.defaults.headers.common['Authorization'] = 'bearer ' + authData;
    return true;
  }
  const searchInfo = searchUtil(search).parse();
  const { fromOutside = '', auth = '' } = searchInfo || {};
  // if (fromOutside && auth) { // 外网免登陆跳入本系统, 基于路径判定是否有凭证 => 若后续有其他页面免登陆跳入本系统, 在此处进行权限认证拓展
  if (fromOutside === 'eam' && auth) { // 当前eam系统携带taoken跳入
    localStorage.setItem('authData', auth);
    axios.defaults.headers.common['Authorization'] = 'bearer ' + auth;
    return true;
  }
  return false;
}

export function appRenderType({ pathname = '', search = '' }){ // 基于权限判定渲染ui
  const authData = localStorage.getItem('authData') || '';
  const isNotLogin = Cookie.get('isNotLogin');
  const isTokenValid = Cookie.get('expireData') && moment().isBefore(new Date(Cookie.get('expireData')), 'second');
  if (authData && isNotLogin && isTokenValid) {
    return 'authToken';
  }
  const searchInfo = searchUtil(search).parse();
  const { fromOutside = '', auth = '', diagWarningId, deviceFullcode } = searchInfo || {};
  if (fromOutside === 'eam' && auth && pathname === '/monitor/diagnoseCenter' && diagWarningId && deviceFullcode) {
    // eam携带参数跳入诊断中心分析页 - 正常展示界面
    return 'outside';
  }
  return '';
}

export function renderWithoutMenu({ pathname = '', search = '' }) { // 某些页面, 不用展示顶部及侧边menu
  // 1. 系统内自带不需菜单的页面 => pathWithoutMenu
  // 2. 外部链接入本系统内的不需菜单页面 => eam诊断中心
  const pathWithoutMenu = ['/homepage'];
  const searchInfo = searchUtil(search).parse();
  const { fromOutside = '', auth = '', diagWarningId, deviceFullcode } = searchInfo || {};
  if (pathWithoutMenu.includes(pathname)) {
    return 'authToken';
  }
  if (fromOutside === 'eam' && auth && pathname === '/monitor/diagnoseCenter' && diagWarningId && deviceFullcode) {
    return 'outside';
  }
  return '';
}
