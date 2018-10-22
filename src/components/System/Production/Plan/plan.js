export function getMonth(month) {
  var result = '';
  switch(month) {
    case 'January':
      result = '1';
      break;
    case 'February':
      result = '2';
      break;
    case 'March':
      result = '3';
      break;
    case 'April':
      result = '4';
      break;
    case 'May':
      result = '5';
      break;
    case 'June':
      result = '6';
      break;
    case 'July':
      result = '7';
      break;
    case 'August':
      result = '8';
      break;
    case 'September':
      result = '9';
      break;
    case 'October':
      result = '10';
      break;
    case 'November':
      result = '11';
      break;
    case 'December':
      result = '12';
      break;
  }
  return result;
}


export function getDefaultMonth(index) {
  var result = '';
  switch(index) {
    case 1:
      result = 'January';
      break;
    case 2:
      result = 'February';
      break;
    case 3:
      result = 'March';
      break;
    case 4:
      result = 'April';
      break;
    case 5:
      result = 'May';
      break;
    case 6:
      result = 'June';
      break;
    case 7:
      result = 'July';
      break;
    case 8:
      result = 'August';
      break;
    case 9:
      result = 'September';
      break;
    case 10:
      result = 'October';
      break;
    case 11:
      result = 'November';
      break;
    case 12:
      result = 'December';
      break;
  }
  return result;
}

export function getDefectSortField(feild) { // 根据排序
  var result = '';
  switch (feild) {
    case 'region':
      result = '1';
      break;
    case 'stationName':
      result = '2';
      break;
    case 'stationCapacity':
      result = '3';
      break;
    case 'planYear':
      result = '4';
      break;
    case 'planPower':
      result = '5';
      break;
  }
  return result;
}
