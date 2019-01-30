
import moment from 'moment'; 

export const reportBasefun = (stationType = 0, powerUnit='kWh') => { // 电站日报基础配置信息填写
  // pointLength: 允许填写的小数点位数，根据电量单位判定，kWh为2位，万kWh为4位
  return [
    {
      configText: stationType > 0 ? '日斜面辐射总量' : '日平均风速',
      configName: 'resourceValue',
      pointLength: 2,
    }, {
      configText: stationType > 0 ? '逆变器年发电量' : '风电机组年发电量',
      configName: 'yearGenInverter',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: '集电线路年发电量',
      configName: 'yearGenIntegrated',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: '年上网发电量',
      configName: 'yearGenInternet',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: '年购网电量',
      configName: 'buyPower',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: stationType > 0 ? '样板逆变器容量' : '样板风机容量',
      configName: 'modelInverterCapacity',
      pointLength: 2,
    }, {
      configText: stationType > 0 ? '样板逆变器发电量' : '样板风机发电量',
      configName: 'modelInverterPowerGen',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: stationType > 0 ? '逆变器日发电量' : '风电机组日发电量',
      configName: 'genInverter',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: '集电线路日发电量',
      configName: 'genIntegrated',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: '日上网发电量',
      configName: 'genInternet',
      pointLength: powerUnit==='kWh'?2:4
    }, {
      configText: '日购网电量',
      configName: 'dailyBuyPower',
      pointLength: powerUnit === 'kWh' ? 2 : 4
    }
  ]
}

/*
  校验规则：
  1. 所有填写的，必须为数值。“请填写数字，最多保留小数点后x位”
  2. 字段不得为负数： “数值不能为负数，请重新填写”
  3. 填写的数据，必须根据配置，保留正确的小数点位数。 “请填写数字，最多保留小数点后x位”
  4. 逆变器年发电量> =集电线路>=上网电量。 “逆变器年发电量不能小于上网电量数值，请检查”
  5. 逆变器日发电量> =集电线路。。 同上。 “逆变器日发电量不能小于上网电量数值，请检查”
  6. 日发电量数据不得超出装机容量*10, “xxx日发电量已超出最高理论发电量， 请检查”
  7. 必填项必须填， “请填写xxx”
  8. 发电量不得小于昨日发电量
  接收参数
    1. genData待校验数据,
    2. reportConfig相关配置要求[0]-电量单位，[1]-必填项
    3. keyWord当前校验项,正在执行检测的某一条数据。
  返回值:  {
    result: true/校验成功，可提交， flase/校验失败，提示信息
    message: '' 校验失败的提示信息。 
  }
*/
const getConfigInfo = (reportConfig) => { // 根据配置信息获取电量单位, 必填数组。
  const unitConfig = reportConfig[0] || {};
  const requireTargetObj = reportConfig[1] || {};
  return {
    genUnit: unitConfig.power || 'kWh',
    requireArr: Object.keys(requireTargetObj),
  }
}

const elecFlowCheck = (keyWord, genData, checkedArr, stationType) => { // 逆变器电量 > 集电线路 > 上网电量
  const currentIndex = checkedArr.findIndex(e => e === keyWord);
  let checkedResult = true, message = ''; // 默认数据正确
  checkedArr.forEach( (e ,i) => {
    if (i < currentIndex && genData[e] && (genData[e] - genData[keyWord]) < 0 ) { // 序号小于校验项,值需大于校验项。若无值不需校验
      const currentText = reportBasefun(stationType).find(info => info.configName === keyWord).configText;
      const errorText = reportBasefun(stationType).find(info => info.configName === e).configText;
      checkedResult = false;
      message = `${errorText}不得小于${currentText},请检查`;
    }
    if (i > currentIndex && genData[e] && (genData[keyWord] - genData[e]) < 0 ) { // 序号大于校验项，值需小于校验项。无值不校验
      const currentText = reportBasefun(stationType).find(info => info.configName === keyWord).configText;
      const errorText = reportBasefun(stationType).find(info => info.configName === e).configText;
      checkedResult = false;
      message = `${currentText}不得小于${errorText},请检查`;
    }
  })
  return {
    result: checkedResult,
    message,
  }
}

export const valueCheck = (stationInfo, genData = {}, reportConfig = [], keyWord) => { // 检测某value,onBlur调用不必检测必填
  const { stationType, stationCapacity, reportDate } = stationInfo;
  const checkingValue = genData[keyWord]; // 要校验的值。
  const genUnit = getConfigInfo(reportConfig).genUnit;
  const valueBaseInfo = reportBasefun(stationType, genUnit).find(e => e.configName === keyWord);// 获取校验项基础信息
  const { configText, pointLength } = valueBaseInfo;
  if( !checkingValue ) { //未填写 => 不校验
    return { result: true };
  }
  if (isNaN(checkingValue)) { // 规则1 数值校验
    return {
      result: false,
      message: `${configText}请填写数字，最多保留小数点后${pointLength}位`
    };
  }
  if (checkingValue < 0) { // 规则2非负校验
    return {
      result: false,
      message: `${configText}数值不能为负数，请重新填写`
    };
  }
  if (`${checkingValue}`.includes('.')) { // 规则3小数点位校验。
    const demicalLength = `${checkingValue}`.split('.')[1].trim().length;
    if (demicalLength > pointLength) {
      return {
        result: false,
        message: `${configText}请填写数字，最多保留小数点后${pointLength}位`
      };
    }
  }
  const dayValueKey = ['genInverter', 'genIntegrated', 'genInternet', 'dailyBuyPower'];
  const maxHour = stationType > 0 ? 10 : 30; // 最大满发小时。
  const maxElec = stationCapacity * 1000 * maxHour / (genUnit === 'kWh' ? 1 : 10000); // 理论最大kWh
  if (dayValueKey.includes(keyWord) && genData[keyWord] > maxElec) { // 规则6. 日发电量不超装机容量*10h, 
    return {
      result: false,
      message: `${configText}已超出最高理论发电量,请检查`
    }
  }
  const yearValueCompare = ['yearGenInverter', 'yearGenIntegrated', 'yearGenInternet'];
  const dayValueCompare = ['genInverter', 'genIntegrated', 'genInternet'];
  let valueCompareResult;
  if (yearValueCompare.includes(keyWord)) { // 规则4. 逆变器日发电量> =集电线路>=上网电量
    valueCompareResult = elecFlowCheck(keyWord, genData, yearValueCompare, stationType);
  } else if (dayValueCompare.includes(keyWord)) {
    valueCompareResult = elecFlowCheck(keyWord, genData, dayValueCompare, stationType);
  }
  if (valueCompareResult && !valueCompareResult.result) { // 未通过规则4
    return valueCompareResult;
  }
  const currentArr = ['yearGenInverter', 'yearGenIntegrated', 'yearGenInternet', 'buyPower'];
  const yesterArr = ['yesterdayyearGenInverter', 'yesterdayyearGenIntegrated', 'yesterdayyearGenInternet', 'yesterdayyearBuyPower'];
  const isStartOfYear = moment(reportDate).format('MM-DD') === '01-01';
  if (currentArr.includes(keyWord) && !isStartOfYear) { // 规则8. 发电量不得小于昨日发电量/ 1.1日不校验。
    const keyIndex = currentArr.findIndex(e => e === keyWord);
    const yesterValue = genData[yesterArr[keyIndex]];
    if (genData[keyWord] < yesterValue) {
      return {
        result: false,
        message: `${configText}不能小于昨天的数值,请检查`
      }
    }
  }
  return { result: true };
}

export const allReportCheck = (stationInfo, reportConfig = []) => { // 检测必填项+不规则数据。
  let { genUnit, requireArr } = getConfigInfo(reportConfig);
  const { stationType } = stationInfo;
  const totalInfo = reportBasefun(stationType, genUnit); // 需要依次校验的数据。
  // 1. 必填项检测.
  requireArr = requireArr.filter(e => e !== 'type'); // 去掉冗余必填项。
  const lostKey = requireArr.find(e => !stationInfo[e] && stationInfo[e] !== 0); // 必填项未填。
  if (lostKey) {
    const message = totalInfo.find(e => e.configName === lostKey).configText;
    return {
      result: false,
      message: `请填写${message}`,
    }
  }
  /* // 2. 原本2019-01-04以前需对各值合理性进行依次判断
    const totalKeyWordArr = totalInfo.map(e => e.configName);
    let wordError;
    totalKeyWordArr.find(e => { // 依次校验所有数据。 有错误数据即停。
      const eachCheckResult = valueCheck(stationInfo, stationInfo, reportConfig, e);
      if (!eachCheckResult.result) {
        wordError = eachCheckResult;
        return true ;
      }
    })
    if (wordError) {
      return wordError; 
    }
  */
  // 2019-01-04 后仅判定是否非负数值即可
  let wordError;
  totalInfo.find(e => {
    const checkedValue = stationInfo[e.configName];
    if (checkedValue && isNaN(checkedValue)) { // 非数字
      wordError = {
        result: false,
        message: `${e.configText}请填写数字`
      }
      return true;
    }else if (checkedValue < 0) {
      wordError = {
        result: false,
        message: `${e.configText}数值不能为负数，请重新填写`
      }
      return true;
    }
  })
  if (wordError) {
    return wordError;
  }
  return { result: true };
}

