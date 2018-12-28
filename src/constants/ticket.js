export function getStatus(value) {
  var result = '';
  switch (value) {
    case '0':
      result = '待提交';
      break;
    case '1':
      result = '待审核';
      break;
    case '2':
      result = '执行中';
      break;
    case '3':
      result = '待验收';
      break;
    case '4':
      result = '已完成';
      break;
  }
  return result;
}

export function getLevel(value) {// 缺陷级别
  var result = '';
  switch (value) {
    case '1':
      result = 'A级';
      break;
    case '2':
      result = 'B级';
      break;
    case '3':
      result = 'C级';
      break;
    case '4':
      result = 'C级';
      break;
  }
  return result;
}

export function getHandleStatus(status) { // 缺陷状态
  var result = '';
  switch (status) {
    case '0':
      result = '已解决';
      break;
    case '1':
      result = '未解决';
      break;
    case '3':
      result = '下发';
      break;
    case '4':
      result = '驳回';
      break;
    case '5':
      result = '不合格';
      break;
    case '6':
      result = '合格';
      break;
    case '7':
      result = '关闭';
      break;
  }
  return result;
}

export function getDefectSortField(feild) { // 缺陷排序方式
  var result = '';
  switch (feild) {
    case 'defectLevel':
      result = 'defect_level';
      break;
    case 'stationName':
      result = 'station_code';
      break;
    case 'deviceName':
      result = 'device_code';
      break;
    case 'defectTypeName':
      result = 'defect_type_code';
      break;
    case 'startTime':
      result = 'create_time';
      break;
    case 'finishTime':
      result = 'over_time';
      break;
    case 'defectStatus':
      result = 'defect_status';
      break;
  }
  return result;
}

export function getInspectSortField(feild) { // 巡检排序方式
  var result = '';
  switch (feild) {
    case "inspectName":
      result = '0';
      break;
    case "stationName":
      result = '1';
      break;
    case "startTime":
      result = '2';
      break;
    case "checkTime":
      result = '3';
      break;
    case "inspectStatus":
      result = '4';
      break;
  }
  return result;
}


export function getSource(value) {// 缺陷来源
  var result = '';
  switch (value) {
    case '0':
      result = '告警';
      break;
    case '1':
      result = '手动';
      break;
    case '2':
      result = '巡检';
      break;
    case '3':
      result = '预警';
      break;
  }
  return result;
}

