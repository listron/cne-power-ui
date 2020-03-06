import { uniqBy, groupBy } from 'lodash';
import { menu } from '../common/menu';

export const dataFormat = (data, placeholder = '--', pointLength) => { // 数据规范展示
  if (isNaN(data) || (!data && data !== 0)) { // 数据不规范
    return placeholder;
  }
  let showData = data;
  if (pointLength > 0 || pointLength === 0) {
    showData = parseFloat(data).toFixed(pointLength);
  } else {
    showData = parseFloat(showData);
  }
  return showData;
};


export const monitordataFormat = (data, placeholder = '--', pointLength) => { // 电站监控得数据规范展示
  if (isNaN(data) || (!data && data !== 0)) { // 数据不规范
    return placeholder;
  }
  let showData = data;
  if (pointLength > 0 || pointLength === 0) {
    // showData = parseFloat(data).toFixed(pointLength);
    showData = parseFloat(data);
  }
  return showData;
};

export const unitDataFormat = (data, placeholder = '--', pointLength, unit) => { // 电站监控得数据规范展示
  if (isNaN(data) || (!data && data !== 0)) { // 数据不规范
    return placeholder;
  }
  let showData = unit === '万kWh' ? data : data * 10000;
  if (pointLength > 0 || pointLength === 0) {
    showData = parseFloat(showData).toFixed(pointLength);
  } else {
    showData = parseFloat(showData);
  }
  return showData;
};

export const dataFormats = (data, placeholder = '--', pointLenth, hideZero = false) => { // 数值处理(生成指定小数位的字符串)=>string
  let resultString = '';
  if ((!data && data !== 0) || isNaN(data)) { // 输入数据不存在或非数据。
    return placeholder;
  }
  if (!hideZero) { // 保留精度内的末尾0
    resultString = (pointLenth > 0 || pointLenth === 0) ? parseFloat(data).toFixed(pointLenth) : `${data}`;
  } else { // 需去掉末尾0
    const numData = parseFloat(data);
    const tmpResult = (pointLenth > 0 || pointLenth === 0) ? parseFloat(numData.toFixed(pointLenth)) : numData;
    resultString = `${tmpResult}`;
  }
  return resultString;
};

export const stationsByArea = (stations = []) => {
  stations.forEach(e => {
    e.title = e.stationName;
    e.key = e.stationCode;
  });
  const areaList = [];
  uniqBy(stations, 'provinceCode').forEach((e) => {
    areaList.push({ key: e.provinceCode, title: e.provinceName });
  });
  const stationsGroup = groupBy(stations, 'provinceCode');
  areaList.forEach((e) => {
    e.children = stationsGroup[e.key];
  });
  return areaList;
};

export const numWithComma = (data, placeholder = '--', joinText = ',', divisionNum = 1000, outputArr = []) => {
  // 将数字(1234567)按1000数量级转为'1,234,567'格式。
  if (isNaN(data) || (!data && data !== 0)) {
    return placeholder;
  }
  data = parseFloat(data); // 先去除可能的末尾0;
  if (data > divisionNum) {
    const intPart = parseInt(data / divisionNum, 10);
    const tmpDataParts = `${data}`.split('.');
    const tmpDemicalParts = tmpDataParts[1]; // 暂存可能存在的原始小数点位数据
    const tmpIntParts = tmpDataParts[0];
    const demicalPart = `${tmpIntParts % divisionNum}`.padStart(3, 0);
    tmpDemicalParts > 0 ? outputArr.unshift(`${demicalPart}.${tmpDemicalParts}`) : outputArr.unshift(demicalPart);
    return numWithComma(intPart, placeholder, joinText, divisionNum, outputArr);
  }
  outputArr.unshift(data);
  return outputArr.join(joinText);

};

export const getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示 针对图表的数据
  const length = data.length;
  const replaceData = [];
  for (let i = 0; i < length; i++) { replaceData.push('--'); }
  const realData = data.some(e => e || e === 0) ? data : replaceData;
  return realData;
};


export const base64Img2Blob = (code) => {
  if (code) {
    var parts = code.split(';base64,');
    // console.log('parts: ', parts);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  return;
};
export const downloadFile = (fileName, content) => {
  //content：是传的base64编码
  var blob = base64Img2Blob(content); //new Blob([content]);
  // console.log('blob: ', blob);
  var aLink = document.createElement('a');
  // var evt = document.createEvent('HTMLEvents');
  // evt.initEvent('click', false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true);
  aLink.download = fileName;
  aLink.href = URL.createObjectURL(blob);
  // aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  aLink.click();

};

export const handleRights = (rightNames, allRights = localStorage.getItem('rightHandler')) => { // 获取多个权限
  /**
   * 入参 keys要获取的权限 - 允许类型[str]或者{}; 入参allRights所有权限的集合, 默认为localStorage设置的,分割的字符串, 也可手动指定 / 甚至可以传入权限的字符串数组;
   * keys若传入[str]; 则返回[bool]与输入一一对应, 适用于权限获取较少的情况：const [right1, right2] = handleRights(['rightKey1', 'rightKey2'];
   * keys若传入obj, 则返回{}, 使用权限所需较大情况: const {right1, right2} = handleRights({right1: 'key1', rightKey2: 'key2'});
   * 若输入格式不满足要求, 默认返回[] (不管何种方式解析, 均非true);
   */
  let rightTotalArr = allRights;
  if (typeof allRights === 'string') {
    rightTotalArr = allRights.split(',');
  }

  if (typeof rightNames === 'object' && rightNames instanceof Array) { // 传入数组
    return rightNames.map(e => handleRight(e, rightTotalArr));
  } else if (typeof rightNames === 'object') { // 对象
    const rightkeyNames = Object.keys(rightNames); // 要获取的权限关键字;
    const rightResult = {};
    rightkeyNames.forEach(e => {
      rightResult[e] = handleRight(e, rightTotalArr);
    });
    return rightResult;
  }
  console.error('所获取权限入参必须是 字符串数组 或对象!');
  return [];
};

export const handleRight = (rightName, allRights = localStorage.getItem('rightHandler')) => { // 获取单个权限
  /**
   * 入参 key要获取的权限 - 允许类型str 入参allRights所有权限的集合, 默认为localStorage设置的,分割的字符串, 也可手动指定 / 甚至可以传入权限的字符串数组;
   * 返回是否有该权限
   */
  let rightTotalArr = allRights;
  if (typeof allRights === 'string') {
    rightTotalArr = allRights.split(',');
  }

  if (typeof rightName === 'string') {
    return rightTotalArr.includes(rightName);
  }
  return false;
};

export const chartsInterval = (valueArr, num) => {
  if (num && +num > 0) {
    const arr = valueArr.filter((e) => {
      return +e > 0;
    });
    const maxValue = Math.max(...new Set(arr));
    //通过判断，当最大值小于10的时候，ceil=10，
    //当最大值大于100的时候ceil=100,
    //10-100之间网上去整十，例如最大值34，ceil=40
    const ceil = (maxValue / 100 < 0.1) ? 10 : (maxValue / 100 > 1) ? 100 : Math.ceil((maxValue / 100)) * 10;
    const max = (Math.ceil(maxValue / ceil) * ceil);
    const interval = max / num;

    return { max, interval };
  }
  return { max: null, interval: 0 };
};

export const enterFirstPage = () => { //根据产品定的优先级，根据配置权限，动态跳转到优先级-
  const rightMenu = localStorage.getItem('rightMenu');
  if(rightMenu == null){
    return '/homepage';
  }
  //console.log(typeof(rightMenu));
  if(rightMenu.indexOf(',') != -1){
    if(rightMenu.split(',').includes('homepage')){
      return '/homepage';
    }else if(rightMenu.split(',').includes('monitor')){
      return gotoSubMenu('/monitor');
    }else if(rightMenu.split(',').includes('operation')){
      return gotoSubMenu('/operation');
    }else if(rightMenu.split(',').includes('statistics')){
      return gotoSubMenu('/statistical');
    }else if(rightMenu.split(',').includes('analysis')){
      return gotoSubMenu('/analysis');
    }else if(rightMenu.split(',').includes('reportManage')){
      return gotoSubMenu('/report');
    }else if(rightMenu.split(',').includes('system')){
      return gotoSubMenu('/system');
    }
    }else if(rightMenu.indexOf(',') == -1){
      if(rightMenu == 'homepage'){
        return '/homepage';
      }else if(rightMenu == 'monitor'){
        return gotoSubMenu('/monitor');
      }else if(rightMenu == 'operation'){
        return gotoSubMenu('/operation');
      }else if(rightMenu == 'statistics'){
        return gotoSubMenu('/statistical');
      }else if(rightMenu == 'analysis'){
        return gotoSubMenu('/analysis');
      }else if(rightMenu == 'reportManage'){
        return gotoSubMenu('/report');
      }else if(rightMenu == 'system'){
        return gotoSubMenu('/system');
      }
    }
    return '/homepage';
};

export const enterDefaultPage = () =>{ //根据产品定的优先级，根据配置权限，动态跳转到优先级-
  const rightMenu = localStorage.getItem('rightMenu');
  //console.log(rightMenu);
  if(rightMenu == null){
    return '/homepage';
  }
  if(rightMenu.indexOf(',') != -1){
    if(rightMenu.split(',').includes('monitor')){
      return gotoSubMenu('/monitor');
    }else if(rightMenu.split(',').includes('operation')){
      return gotoSubMenu('/operation');
    }else if(rightMenu.split(',').includes('statistics')){
      return gotoSubMenu('/statistical');
    }else if(rightMenu.split(',').includes('analysis')){
      return gotoSubMenu('/analysis');
    }else if(rightMenu.split(',').includes('reportManage')){
      return gotoSubMenu('/report');
    }else if(rightMenu.split(',').includes('system')){
      return gotoSubMenu('/system');
    }
  }else if(rightMenu.indexOf(',') == -1){
    if(rightMenu == 'monitor'){
      return gotoSubMenu('/monitor');
    }else if(rightMenu == 'operation'){
      return gotoSubMenu('/operation');
    }else if(rightMenu == 'statistics'){
      return gotoSubMenu('/statistical');
    }else if(rightMenu == 'analysis'){
      return gotoSubMenu('/analysis');
    }else if(rightMenu == 'reportManage'){
      return gotoSubMenu('/report');
    }else if(rightMenu == 'system'){
      return gotoSubMenu('/system');
    }
  }
  return '/homepage';

};

export const findDefaultPath = (menuArray) => {
  const rightMenu = localStorage.getItem('rightMenu') || '';
  const rightArr = rightMenu.split(',');
  const getDefaultPath = menuArray.find(e => e.defaultPath && rightArr.includes(e.rightKey));
  if (getDefaultPath) {
    return getDefaultPath.path;
  }
  for (let i = 0; i < menuArray.length; i += 1) {
    const subMenuArray = menuArray[i].children;
    if (subMenuArray && subMenuArray.length > 0) {
      const getSubDefaultPath = findDefaultPath(subMenuArray);
      if (getSubDefaultPath) {
        return getSubDefaultPath;
      }
    }
  }

};

export const gotoSubMenu = (key) => {
  const params = menu.find(e => e.path === key);
  //console.log(menu);
  //console.log(params);
  let defaultPath = '/';
  if(params){
    if (params.defaultPath) {
      defaultPath = params.path;
    } else if (params.children && params.children.length > 0) {
      defaultPath = findDefaultPath(params.children);
    }
  }
  //console.log(defaultPath);
  return defaultPath;
};


