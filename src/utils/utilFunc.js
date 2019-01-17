
export const dataFormat = (data, placeholder = '--', pointLength) => { // 数据规范展示
  if(isNaN(data) || (!data && data !== 0)){ // 数据不规范
    return placeholder;
  }
  let showData = data;
  if(pointLength > 0 || pointLength === 0 ){
     showData = parseFloat(data).toFixed(pointLength);
  }
  return parseFloat(showData);

}


export const monitordataFormat = (data, placeholder = '--', pointLength) => { // 电站监控得数据规范展示
  if(isNaN(data) || (!data && data !== 0)){ // 数据不规范
    return placeholder;
  }
  let showData = data;
  if(pointLength > 0 || pointLength === 0 ){
    // showData = parseFloat(data).toFixed(pointLength);
    showData = parseFloat(data);
  }
  return showData
}