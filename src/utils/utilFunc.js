
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

export const dataFormats = (data, placeholder = '--', pointLenth, hideZero = false) => { // 数值处理(生成指定小数位的字符串)=>string
  let resultString = '';
  if ((!data && data !== 0) || isNaN(data)) { // 输入数据不存在或非数据。
    return placeholder;
  }
  if (!hideZero) { // 保留精度内的末尾0
    resultString = pointLenth > 0 ? parseFloat(data).toFixed(pointLenth) : `${data}`;
  } else { // 需去掉末尾0
    const numData = parseFloat(data);
    const tmpResult = pointLenth > 0 ? parseFloat(numData.toFixed(pointLenth)) : numData;
    resultString = `${tmpResult}`;
  }
  return resultString;
}