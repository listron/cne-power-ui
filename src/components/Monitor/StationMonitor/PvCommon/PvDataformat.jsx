import React from 'react';
import { dataFormats, numWithComma } from '../../../../utils/utilFunc';
import styles from './pvCommon.scss';

 const DeviceValueFormat = (data, placeholder = '--', pointLength, special = false) => {
  let point = pointLength;
  if (special) { // 特殊的设置 只针对光伏
    if (data > 1) point = 2;
    if (data <= 1) point = 4;
  }
  let showData = dataFormats(data, placeholder, point, true)
  if (showData !== '--') {
    const valueArr = showData.split('.');
    const intNum = valueArr[0];
    const pointNum = valueArr[1];
    return (
      <span className={styles.valueFormat}>
        <span className={styles.int} style={{ fontSize: 24 }}>{numWithComma(intNum)}</span>
        {pointNum && <span className={styles.decimal} style={{ fontSize: 18 }}>.{pointNum}</span>}
      </span>
    )
  } else {
    return showData
  }
}

const divideFormarts = (data, unit) => { // 除
  if (isNaN(data) || (!data && data !== 0)) {
    return '--';
  }
  if (unit === "万kWh") {
    return data / 10000
  }
  return data
}

const multiplyFormarts = (data, quantity) => { // 乘
  if (isNaN(data) || (!data && data !== 0)) {
    return '--';
  }
  
  return data * quantity
}

const powerPoint = (data) => { // 根据光伏电站特殊的需求
  let point = 2;
  if (data > 1) point = 2;
  if (data <= 1) point = 4;
  let showData = dataFormats(data, '--', point, true);
  if (showData !== '--') {
    const valueArr = `${showData}`.split('.');
    const intNum = valueArr[0];
    const pointNum = valueArr[1];
    return pointNum && numWithComma(intNum) + '.' + pointNum || numWithComma(intNum)
  } else {
    return showData
  }
}

 // 省中拼音转换
 let provinceList={
   "上海":"shanghai",
   "河北":"hebei",
   "山西":"shanxi",
   "内蒙古":"neimenggu",
   "辽宁":"liaoning",
   "吉林":"jilin",
   "黑龙江":"heilongjiang",
   "浙江":"zhejiang",
   "安徽":"anhui",
   "福建":"fujian",
   "江西":"jiangxi",
   "山东":"shandong",
   "河南":"henan",
   "湖北":"hubei",
   "湖南":"hunan",
   "广东":"guangdong",
   "广西":"guangxi",
   "海南":"hainan",
   "贵州":"guizhou",
   "云南":"yunnan",
   "西藏":"xizang",
   "陕西":"shanxi1",
   "甘肃":"gansu",
   "青海":"qinghai",
   "甘肃":"gansu",
   "宁夏":"ningxia",
   "新疆":"xinjiang",
   "北京":"beijing",
   "天津":"tianjin",
   "重庆":"chongqing",
   "香港":"xianggang",
   "澳门":"aomen",
 }

 


  export {DeviceValueFormat,divideFormarts,multiplyFormarts,powerPoint,provinceList}