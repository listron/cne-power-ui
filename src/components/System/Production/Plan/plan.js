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
