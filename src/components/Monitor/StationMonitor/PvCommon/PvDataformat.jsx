import React from 'react';
import { dataFormats, numWithComma } from '../../../../utils/utilFunc';
import styles from './pvCommon.scss';

const deviceValueFormat = (data, placeholder = '--', pointLength, special = false) => {
  let point = pointLength;
  if (special) { // 特殊的设置 只针对光伏
    if (data > 1) point = 2;
    if (data <= 1) point = 4;
  }
  const showData = dataFormats(data, placeholder, point);
  if (showData !== '--') {
    const valueArr = showData.split('.');
    const intNum = valueArr[0];
    const pointNum = valueArr[1];
    return (
      <span className={styles.valueFormat}>
        <span className={styles.int} style={{ fontSize: 24 }}>{numWithComma(intNum)}</span>
        {pointNum && <span className={styles.decimal} style={{ fontSize: 18 }}>.{pointNum}</span>}
      </span>
    );
  }
  return showData;

};

const divideFormarts = (data, unit, divide) => { // 除
  if (isNaN(data) || (!data && data !== 0)) {
    return '--';
  }
  if (unit === '万kWh') {
    return data / 10000;
  }
  if (unit === 'MW') {
    return data / 1000;
  }
  if (unit === 'MJ') { // 需要除
    return data / 1000;
  }
  return data;
};

const multiplyFormarts = (data, quantity) => { // 乘
  if (isNaN(data) || (!data && data !== 0)) {
    return '--';
  }

  return data * quantity;
};

const powerPoint = (data) => { // 根据光伏电站特殊的需求
  let point = 2;
  if (data > 1) point = 2;
  if (data <= 1) point = 4;
  const showData = dataFormats(data, '--', point);
  if (showData !== '--') {
    const valueArr = `${showData}`.split('.');
    const intNum = valueArr[0];
    const pointNum = valueArr[1];
    return pointNum && numWithComma(intNum) + '.' + pointNum || numWithComma(intNum);
  }
  return showData;

};

const chartPowerPoint = (data) => { // 根据光伏电站特殊的需求
  let point = 2;
  if (data > 1) point = 2;
  if (data <= 1) point = 4;
  const showData = dataFormats(data, '--', point);
  return showData;
};

// 省中拼音转换
const provinceList = {
  '上海': 'shanghai',
  '河北': 'hebei',
  '山西': 'shanxi',
  '内蒙古': 'neimenggu',
  '辽宁': 'liaoning',
  '吉林': 'jilin',
  '黑龙江': 'heilongjiang',
  '浙江': 'zhejiang',
  '安徽': 'anhui',
  '福建': 'fujian',
  '江西': 'jiangxi',
  '山东': 'shandong',
  '河南': 'henan',
  '湖北': 'hubei',
  '湖南': 'hunan',
  '广东': 'guangdong',
  '广西': 'guangxi',
  '海南': 'hainan',
  '贵州': 'guizhou',
  '江苏': 'jiangsu',
  '云南': 'yunnan',
  '西藏': 'xizang',
  '陕西': 'shanxi1',
  '甘肃': 'gansu',
  '青海': 'qinghai',
  '宁夏': 'ningxia',
  '新疆': 'xinjiang',
  '北京': 'beijing',
  '天津': 'tianjin',
  '重庆': 'chongqing',
  '香港': 'xianggang',
  '澳门': 'aomen',
};

var provinceListArray = [
  {
    'id': 'shanghai',
    'name': '上海',
  }, {
    'id': 'hebei',
    'name': '河北',
  }, {
    'id': 'shanxi',
    'name': '山西',
  }, {
    'id': 'neimenggu',
    'name': '内蒙古',
  }, {
    'id': 'liaoning',
    'name': '辽宁',
  }, {
    'id': 'jilin',
    'name': '吉林',
  }, {
    'id': 'heilongjiang',
    'name': '黑龙江',
  }, {
    'id': 'jiangsu',
    'name': '江苏',
  }, {
    'id': 'zhejiang',
    'name': '浙江',
  }, {
    'id': 'anhui',
    'name': '安徽',
  }, {
    'id': 'fujian',
    'name': '福建',
  }, {
    'id': 'jiangxi',
    'name': '江西',
  }, {
    'id': 'shandong',
    'name': '山东',
  }, {
    'id': 'henan',
    'name': '河南',
  }, {
    'id': 'hubei',
    'name': '湖北',
  }, {
    'id': 'hunan',
    'name': '湖南',
  }, {
    'id': 'guangdong',
    'name': '广东',
  }, {
    'id': 'guangxi',
    'name': '广西',
  }, {
    'id': 'hainan',
    'name': '海南',
  }, {
    'id': 'sichuan',
    'name': '四川',
  }, {
    'id': 'guizhou',
    'name': '贵州',
  }, {
    'id': 'yunnan',
    'name': '云南',
  }, {
    'id': 'xizang',
    'name': '西藏',
  }, {
    'id': 'shanxi1',
    'name': '陕西',
  }, {
    'id': 'gansu',
    'name': '甘肃',
  }, {
    'id': 'qinghai',
    'name': '青海',
  }, {
    'id': 'ningxia',
    'name': '宁夏',
  }, {
    'id': 'xinjiang',
    'name': '新疆',
  }, {
    'id': 'beijing',
    'name': '北京',
  }, {
    'id': 'tianjin',
    'name': '天津',
  }, {
    'id': 'chongqing',
    'name': '重庆',
  }, {
    'id': 'xianggang',
    'name': '香港',
  }, {
    'id': 'aomen',
    'name': '澳门',
  }];



export { deviceValueFormat, divideFormarts, multiplyFormarts, powerPoint, provinceList, chartPowerPoint, provinceListArray };
