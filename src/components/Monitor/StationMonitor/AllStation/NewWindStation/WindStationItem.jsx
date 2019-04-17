import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import { message, Popover } from "antd";
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../../utils/utilFunc';
import OwnProgress from '../../../../Common/OwnProgress/index';



class WindStationItem extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    realCapacityPoint: PropTypes.any,
    powerPoint: PropTypes.any,
  }
  constructor(props, context) {
    super(props, context)
  }

  getStatusName = (stuats) => {
    let name = '';
    switch (stuats) {
      case '400': name = 'normal'; break;
      case '500': name = 'interrupt'; break;
      case '900': name = 'notConnected'; break;
    }
    return name;
  }

  showTip = (currentStatus) => {
    message.destroy();
    if (currentStatus === '900') {
      message.config({ top: 225, maxCount: 1, });
      message.warning('电站未接入,无法查看详情', 2);
    }
  }

  renderPopover = (item) => {
    const stationStatus = item.stationStatus || {};
    const currentStatus = stationStatus.stationStatus;
    let needData = [
      { name: '实时功率', value: 'stationPower', point: 2, unit: 'MW' },
      { name: '平均风速', value: 'instantaneous', point: 1, unit: 'm/s' },
      { name: '出力比', value: 'capabilityRate', point: 2, unit: '%' },
      { name: '装机容量', value: 'stationCapacity', point: 2, unit: 'MW' },
      { name: '应发功率', value: 'stationPlanPower', point: 2, unit: 'MW' },
      { name: '装机台数', value: 'stationUnitCount', point: 0, unit: '台' },
      { name: '正常运行台数', value: 'normalNum', point: 0, unit: '台' },
      { name: '待机台数', value: 'standbyNum', point: 0, unit: '台' },
      { name: '停机台数', value: 'stationPower', point: 0, unit: '台' },
      { name: '维护台数', value: 'maintainNum', point: 0, unit: '台' },
      { name: '故障台数', value: 'errorNum', point: 0, unit: '台' },
      { name: '通讯中断台数', value: 'interruptNum', point: 0, unit: '台' },
      { name: '未接入台数', value: 'noAccessNum', point: 0, unit: '台' },
      { name: '告警数量', value: 'alarmNum', point: 0, unit: '个' },
    ]
    return (
      <div className={styles.popover}>
        <div className={styles.name}>{item.stationName} </div>
        <div className={currentStatus === '400' && styles.poNomal || styles.poInterrupt}>{currentStatus === '400' ? '通讯正常' : '通讯中断'}</div>
        <div className={styles.popCont}>
          {needData.map((e, index) => {
             console.log()
            return (
              <div className={styles.popColumn} key={index}>
                <div>{e.name}</div>
                <div>
                  <span className={styles.value}>{dataFormats(item[e.value], '--', e.point, true)}</span>
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
    const { stationDataList } = this.props;
    const temType = stationDataList.sort((a, b) => { return a['provinceName'].localeCompare(b['provinceName']) });
    let filteredStation = [];
    temType.forEach(e => {
      let findExactStation = false;
      filteredStation.forEach(m => {
        if (m.regionName === e.provinceName) {
          findExactStation = true;
          m.stations.push(e);
        }
      })
      if (!findExactStation) {
        filteredStation.push({
          regionName: e.provinceName,
          stations: [e]
        })
      }
    })
    return (
      <div className={styles.stationCardContainer} >
        <div ref={'popver'}></div>
        {stationDataList.length > 0 && filteredStation.map((e, key) => {
          return (
            <div key={key} className={styles.regionStation}>
              <div className={styles.regionName}>{e.regionName}</div>
              <div className={styles.staionsList}>
                {e.stations.sort((a,b)=>{return a.stationStatus.stationStatus-b.stationStatus.stationStatus}).map((item, index) => {
                  const stationStatus = item.stationStatus || {};
                  const currentStatus = stationStatus.stationStatus;
                  const percent = (item.stationPower && item.stationCapacity) ? item.stationPower / item.stationCapacity * 100 : 0;
                  return (<Popover
                    content={this.renderPopover(item)}
                    key={index}
                    placement="right"
                    overlayClassName={styles.stationCard}
                    trigger="hover"
                    getPopupContainer={() => this.refs.popver}
                  >
                    <div className={styles[this.getStatusName(currentStatus)]} onClick={() => { this.showTip(currentStatus) }}>
                      <Link to={`/monitor/singleStation/${item.stationCode}`} key={item.stationCode}>
                        <div className={styles.stationCardTitle}>
                          <div className={styles.stationName}>{item.stationName || '--'}</div>
                          {currentStatus === '500' ? <i className="iconfont icon-outage"></i> : ''}
                        </div>
                        <div className={styles.stationCardProgress}>
                          <OwnProgress percent={percent} successPercent={item.capabilityRate} />
                        </div>
                        <div className={styles.stationCardValue}>
                          <div className={styles.stationMark}>{dataFormats(item.stationPower, '--', 2, true)} MW</div>
                          <div>{dataFormats(item.stationCapacity, '--', 2, true)} MW</div>
                        </div>
                        <div className={styles.stationCardWindSpeed}>{dataFormats(item.instantaneous, '--', 2, true)}m/s</div>
                      </Link>
                      <div className={styles.stationCardEquipmentNum}>
                        <Link to={`/monitor/singleStation/${item.stationCode}`} key={index}>
                          <div>{item.stationUnitCount || '--'}台</div>
                        </Link>
                        {item.alarmNum > 0 ? <Link to={`/monitor/alarm/realtime?stationCode=${item.stationCode}`} key={item.stationCode}><div className={styles.stationWarning}>
                          <i className="iconfont icon-alarm1"></i>{item.alarmNum}</div></Link> : ''}
                      </div>
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
export default WindStationItem;
