import React from "react";
import PropTypes from "prop-types";
import styles from './fanList.scss';
import { message, Popover } from "antd";
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../../../utils/utilFunc';
import OwnProgress from '../../../../../Common/OwnProgress/index';



class FanItem extends React.Component {
  static propTypes = {
    fanList: PropTypes.object,
    match: PropTypes.object,
    cardPointParams: PropTypes.string,
    stationCode: PropTypes.string,
    deviceList: PropTypes.array,

  }
  constructor(props, context) {
    super(props, context)
  }

  getStatusName = (status) => {
    let result = {};
    switch (status) {
      case 400: result = { text: '运行', name: 'normalNum', icon: '' }; break;
      case 700: result = { text: '待机', name: 'standbyNum', icon: 'icon-await' }; break;
      case 200: result = { text: '停机', name: 'shutdownNum', icon: 'icon-suspend' }; break;
      case 600: result = { text: '维护', name: 'maintainNum', icon: 'icon-repair' }; break;
      case 300: result = { text: '故障', name: 'errorNum', icon: 'icon-alarm' }; break;
      case 500: result = { text: '通讯中断', name: 'interruptNum', icon: 'icon-outage' }; break;
      case 900: result = { text: '未接入', name: 'noAccessNum', icon: '' }; break;
    }
    return result;
  }

  getCardCont = () => {
    const { cardPointParams } = this.props;
    let result = {};
    switch (cardPointParams) {
      case 'Default': result = { text: '整机状态', value: 'normalNum', module: 'default', }; break;
      case 'NC001': result = { text: '风速', value: 'windSpeed', module: 'speed', }; break;
      case 'TM101': result = { text: '齿轮油温度', value: 'oilTemperature', module: 'temperature', }; break;
      case 'TM105': result = { text: '齿轮箱轴承温度', value: 'bearingTemperature', module: 'temperature', }; break;
      case 'GN010': result = { text: '发电机温度', value: 'alternatorTemperature', module: 'temperature', }; break;
      case 'NC005': result = { text: '机舱温度', value: 'engineRoomTemperature', module: 'temperature', }; break;
      case 'NC004': result = { text: '环境温度', value: 'ambientTemperature', module: 'temperature', }; break;
      case 'GN001': result = { text: '发动机转速', value: 'engineSpeed', module: 'rotatingSpeed', }; break;
      case 'RT001': result = { text: '叶轮转速', value: 'impellerSpeed', module: 'rotatingSpeed' }; break;
    }
    return result
  }

  default = (item) => { // 整机状态
    const currentStatus = item.deviceStatus;
    const successPercent = (item.devicePlanPower && item.deviceCapacity) ? item.devicePlanPower / item.deviceCapacity * 100 : 0;
    const percent = (item.devicePower && item.deviceCapacity) ? item.devicePower / item.deviceCapacity * 100 : 0;
    return (
      <div className={styles.inverterItemR} >
        <div className={styles.column}>
          <div>{item.deviceName}</div>
          <div>{this.getStatusName(currentStatus).text}</div>
        </div>
        <OwnProgress percent={percent} successPercent={successPercent} />
        <div className={styles.column}>
          <div> <span className={styles.changeNum}> {dataFormats(item.devicePower, '--', 2, true)}</span> kW</div>
          <div>{dataFormats(item.deviceCapacity, '--', 2, true)} kW</div>
        </div>
        <div className={styles.column}>
          <div> <span className={styles.changeNum}> {dataFormats(item.windSpeed, '--', 2, true)}</span> m/s</div>
          {item.alarmNum > 0 && <div className={styles.aralm}><i className="iconfont icon-alarm" ></i> {item.alarmNum}</div>}
        </div>
      </div>
    )
  }

  speed = (item) => { // 风速
    const percent = (item.windSpeed) ? item.windSpeed / 25 * 100 : 0;
    return (
      <div className={styles.inverterItemR} >
        <div className={styles.column}>
          <div>{item.deviceName}</div>
          <div> <span className={styles.changeNum}> {dataFormats(item.windSpeed, '--', 2, true)}</span> m/s</div>
        </div>
        <OwnProgress percent={percent} />
      </div>
    )
  }

  temperature = (item) => { // 有关温度
    const { deviceList } = this.props;
    const currentValue = item[this.getCardCont().value];
    const currentPoint = deviceList.map(e => e[this.getCardCont().value]);
    const max = Math.max.apply(null, currentPoint);
    const min = Math.min.apply(null, currentPoint);
    let percent = null;
    let fromRight = false;
    if (currentValue > 0) {
      percent = (currentValue && max) ? currentValue / max * 100 : 0;
      fromRight = false;
    } else if (currentValue < 0) {
      percent = (currentValue && min) ? currentValue / min * 100 : 0
      fromRight = true;
    } else {
      percent = 0;
      fromRight = false;
    }
    return (<div className={styles.inverterItemR} >
      <div className={styles.column}>
        <div>{item.deviceName}</div>
        <div> <span className={styles.changeNum}> {dataFormats(item[this.getCardCont().value], '--', 2, true)}</span> ℃</div>
      </div>
      <OwnProgress percent={percent} fromRight={fromRight} />
      <div className={styles.column}>
        <div></div>
        <div> <span className={styles.changeNum}> {dataFormats(item.windSpeed, '--', 2, true)}</span> m/s</div>
      </div>
    </div>)
  }

  rotatingSpeed = (item) => { // 有关转速的
    const { deviceList } = this.props;
    const currentValue = item[this.getCardCont().value];
    const currentPoint = deviceList.map(e => e[this.getCardCont().value]);
    const max = Math.max.apply(null, currentPoint);
    let percent = (currentValue && max) ? currentValue / max * 100 : 0;
    return (<div className={styles.inverterItemR} >
      <div className={styles.column}>
        <div>{item.deviceName}</div>
        <div> <span className={styles.changeNum}> {dataFormats(item[this.getCardCont().value], '--', 2, true)}</span> Rpm</div>
      </div>
      <OwnProgress percent={percent} />
      <div className={styles.column}>
        <div></div>
        <div> <span className={styles.changeNum}> {dataFormats(item.windSpeed, '--', 2, true)}</span> m/s</div>
      </div>
    </div>)
  }

  showTip = (currentStatus) => {
    message.destroy();
    if (currentStatus === 900) {
      message.config({ top: 225, maxCount: 1, });
      message.warning('设备未接入,无法查看详情', 2);
    }
  }

  renderPopover = (item) => {
    let needData = [
      { name: '风速', value: 'windSpeed', point: 2, unit: 'm/s' },
      { name: '实时功率', value: 'devicePower', point: 2, unit: 'kw' },
      { name: '应发功率', value: 'devicePlanPower', point: 2, unit: 'kW' },
      { name: '出力比', value: 'capabilityRate', point: 2, unit: '%' },
      { name: '容量', value: 'deviceCapacity', point: 2, unit: 'kW' },
      { name: '告警数', value: 'alarmNum', point: 0, unit: '个' },
    ]
    return (
      <div className={styles.popover}>
        <div className={styles.popTitle}>
          <div className={styles.name}>{item.deviceName} </div>
          <div className={styles[this.getStatusName(item.deviceStatus).name]}>{this.getStatusName(item.deviceStatus).text}</div>
        </div>
        <div className={styles.deviceModeName}> 型号 {item.deviceModeName}</div>
        <div className={styles.popCont}>
          {needData.map((e, index) => {
            return (
              <div className={styles.popColumn} key={index}>
                <div>{e.name}</div>
                <div>
                  <span className={styles.value}>{dataFormats(item[e.value], '--', e.point, true, e.quantity)}</span>
                  <span className={styles.unit}>{e.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    )
  }

  render() {
    const { deviceList = [], deviceTypeCode } = this.props;
    const deviceNameList=deviceList.sort((a, b) => { return a['deviceName'].localeCompare(b['deviceName']) })
    const temType = deviceNameList.sort((a, b) => { return a['parentDeviceName'].localeCompare(b['parentDeviceName']) });
    let filteredDevice = [];
    temType.forEach(e => {
      let findExactStation = false;
      filteredDevice.forEach(m => {
        if (m.parentDeviceName === e.parentDeviceName) {
          findExactStation = true;
          m.device.push(e);
        }
      })
      if (!findExactStation) {
        filteredDevice.push({
          parentDeviceName: e.parentDeviceName,
          device: [e]
        })
      }
    })

    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.stationCardContainer} >
        <div ref={'popver'}></div>
        {deviceList.length > 0 && filteredDevice.map((e, key) => {
          const deviceStatusList=e.device.sort((a, b) => { return 900 - b.deviceStatus===0 ? -1 :1 })
          return (
            <div key={key} className={styles.deviceContent}>
              <div className={styles.parentDeviceName}>{e.parentDeviceName}</div>
              <div className={styles.fanCard}>
                {deviceStatusList.map((item, index) => {
                  const currentStatus = item.deviceStatus;
                  // const currentStatus = 700;
                  return (<Popover
                    content={this.renderPopover(item)}
                    key={index}
                    placement="right"
                    overlayClassName={styles.deviceCard}
                    trigger="hover"
                    getPopupContainer={() => this.refs.popver}
                    width={1000}
                  >
                    <div className={`${styles[this.getStatusName(currentStatus).name]} ${styles.fanBlock}`} onClick={() => { this.showTip(currentStatus) }}>
                      <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}  className={styles.linkBox}>
                        <div className={styles.inverterItemIcon} >
                          <i className="iconfont icon-windlogo" ></i>
                          <i className={`${'iconfont'} ${this.getStatusName(currentStatus).icon} ${styles.deviceIcon}`}></i>
                        </div>
                        {this[this.getCardCont().module](item)}
                      </Link>
                    </div>
                  </Popover>)
                })}
              </div>
            </div>
          )
        }) || <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>
        }
      </div>
    )
  }
}
export default FanItem;
