
export const getDeviceTypeIcon = (e) => {
    switch (e) {
        case 101:
            return 'iconfont icon-windlogo';
        case 509:
            return 'iconfont icon-pvs';
        case 206:
        case 201:
            return 'iconfont icon-nb';
        case 202:
        case 207:
            return 'iconfont icon-hl';
        case 304:
            return 'iconfont icon-xb';
        case 302:
            return 'iconfont icon-jidian';
        case 301:
            return 'iconfont icon-syz';
        case 0:
            return 'iconfont icon-elecnetting';
        default:
            return;
    }
}


export const getAlarmStatus = (e) => {
    let alarmArray = null
    switch (e) {
      case 101: alarmArray = 'fanList'; break;
      case 206:
      case 201:
        alarmArray = 'inverterList'; break;
      case 202:
      case 207:
        alarmArray = 'confluenceBoxList'; break;
      case 304:
        alarmArray = 'boxTransformerList'; break;
      case 302:
        alarmArray = 'collectorList'; break;
      case 301:
        alarmArray = 'boosterList'; break;
      default:
        alarmArray = null
    }
    return alarmArray
  }



