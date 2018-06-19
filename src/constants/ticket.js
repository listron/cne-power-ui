export function getStatus(value) {
  var result = "";
  switch(value) {
    case "0":
      result = "待提交";
      break;
    case "1":
      result = "待审核";
      break;
    case "2":
      result = "执行中";
      break;
    case "3":
      result = "待验收";
      break;
    case "4":
      result = "已完成";
      break;
  }
  return result;
}

export function getLevel(value) {
  var result = "";
  switch(value) {
    case "1":
      result = "一级";
      break;
    case "2":
      result = "二级";
      break;
    case "3":
      result = "三级";
      break;
    case "4":
      result = "四级";
      break;
  }
  return result;
}

export function getHandleStatus(status) {
  var result = "";
  switch(status) {
    case "0":
      result = "已解决";
      break;
    case "1":
      result = "未解决";
      break;
    case "3":
      result = "下发";
      break;
    case "4":
      result = "驳回";
      break;
    case "5":
      result = "不合格";
      break;
    case "6":
      result = "合格";
      break;
    case "7":
      result = "已关闭";
      break;
  }
  return result;
}

export function getDefectSortField(feild) {
  var result = "";
  switch(feild) {
    case "defectLevel":
      result = "0";
      break;
    case "stationName":
      result = "1";
      break;
    case "deviceName":
      result = "2";
      break;
    case "defectTypeName":
      result = "3";
      break;
    case "startTime":
      result = "4";
      break;
    case "finishTime":
      result = "6";
      break;
    case "defectStatus":
      result = "7";
      break;
  }
  return result;
}