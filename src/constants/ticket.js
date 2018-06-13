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
    case 1:
      result = "一级";
      break;
    case 2:
      result = "二级";
      break;
    case 3:
      result = "三级";
      break;
    case 4:
      result = "四级";
      break;
  }
  return result;
}