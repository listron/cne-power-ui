
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
    axios.defaults.headers.common['Authorization'] = 'bearer ' + auth;
    return true;
  }
  return false;
}

export function isAppRender({ pathname = '', search = '' }){ // 基于权限判定渲染ui
  const authData = localStorage.getItem('authData') || '';
  const isNotLogin = Cookie.get('isNotLogin');
  const isTokenValid = Cookie.get('expireData') && moment().isBefore(new Date(Cookie.get('expireData')), 'second');
  if (authData && isNotLogin && isTokenValid) {
    return true;
  }
  const searchInfo = searchUtil(search).parse();
  const { fromOutside = '', auth = '', diagWarningId, deviceFullcode } = searchInfo || {};
  if (fromOutside === 'eam' && auth && pathname === '/monitor/diagnoseCenter' && diagWarningId && deviceFullcode) {
    // eam携带参数跳入诊断中心分析页 - 正常展示界面
    return true;
  }
  return false;
}

export function renderWithoutMenu({ pathname = '', search = '' }) { // 某些页面, 不用展示顶部及侧边menu
  // 1. 系统内自带不需菜单的页面 => pathWithoutMenu
  // 2. 外部链接入本系统内的不需菜单页面 => eam诊断中心
  const pathWithoutMenu = ['/homepage'];
  const searchInfo = searchUtil(search).parse();
  const { fromOutside = '', auth = '', diagWarningId, deviceFullcode } = searchInfo || {};
  if (pathWithoutMenu.includes(pathname)) {
    return true;
  }
  if (fromOutside === 'eam' && auth && pathname === '/monitor/diagnoseCenter' && diagWarningId && deviceFullcode) {
    return true;
  }
  return false;
}

const testUrl = 'http://localhost:8080/#/monitor/diagnoseCenter?fromOutside=eam&auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0YWRtaW4iLCJlbnRlcnByaXNlQ29kZSI6MTAxMCwidXNlckVudGVycHJpc2VTdGF0dXMiOjMsImF1dG8iOiIwIiwidXNlclN0YXR1cyI6MSwidXNlcl9uYW1lIjoidGVzdGFkbWluIiwidXNlckZ1bGxOYW1lIjoi6LaF57qn566h55CG5ZGYIiwidXNlckxvZ28iOiIvaW1nL25vcGljLnBuZyIsInVzZXJJZCI6IjQzMjk3MzYwNzE1MDA4MCIsImF1dGhvcml0aWVzIjpbImFkbWluIl0sImNsaWVudF9pZCI6ImNuZWdyb3VwIiwic2NvcGUiOlsiYWxsIiwicmVhZCIsIndyaXRlIl0sImVudGVycHJpc2VJZCI6IjMxNjYwMzQ5MzI2OTUwNCIsImV4cCI6MTkwNDI4MDMyOCwiZW50ZXJwcmlzZUxvZ28iOiJodHRwOi8vMTAuMTAuMTUuODMvYXBpL3YzL2ltYWdlcy84MTQ3M2M3NTA1YzY0M2MzOGQ0ZDdhMjBlNjFmYjE3ZC5wbmciLCJlbnRlcnByaXNlTmFtZSI6IuWNj-WQiOaWsOiDvea6kCIsImp0aSI6IjhkM2JiMjNlLTRiMmEtNGM2ZS04MTMyLTJmZTcxZGI4YWE4OCIsInVzZXJuYW1lIjoidGVzdGFkbWluIn0.VTs4TA5fLNBDl2Dz5oc0_mP5T1084fFXvoeIeWG-ToU&diagWarningId=525232985541121&deviceFullcode=350M201M2M48';
