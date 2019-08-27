import { uniqBy, groupBy } from 'lodash';


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
