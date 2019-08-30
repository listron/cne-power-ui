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
  return showData
}


export const monitordataFormat = (data, placeholder = '--', pointLength) => { // 电站监控得数据规范展示
  if (isNaN(data) || (!data && data !== 0)) { // 数据不规范
    return placeholder;
  }
  let showData = data;
  if (pointLength > 0 || pointLength === 0) {
    // showData = parseFloat(data).toFixed(pointLength);
    showData = parseFloat(data);
  }
  return showData
}

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
  return showData
}

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
}

export const stationsByArea = (stations = []) => {
  stations.forEach(e => {
    e.title = e.stationName;
    e.key = e.stationCode
  })
  let areaList = [];
  uniqBy(stations, 'provinceCode').forEach((e) => {
    areaList.push({ key: e.provinceCode, title: e.provinceName })
  })
  let stationsGroup = groupBy(stations, 'provinceCode')
  areaList.forEach((e) => {
    e.children = stationsGroup[e.key]
  })
  return areaList
}

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
  } else {
    outputArr.unshift(data);
    return outputArr.join(joinText);
  }
};

export const getDefaultData = (data) => { // 替换数据，当没有数据的时候，用'--'显示 针对图表的数据
  const length = data.length;
  let replaceData = [];
  for (let i = 0; i < length; i++) { replaceData.push('--') }
  let realData = data.some(e => e || e === 0) ? data : replaceData;
  return realData;
}
