import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import { message, Select } from "antd";
import { Link } from 'react-router-dom';
import { dataFormats } from '../../../../../utils/utilFunc';
import { divideFormarts, multiplyFormarts, powerPoint } from '../../PvCommon/PvDataformat';
import OutputTenMin from './OutputTenMin';
const Option = Select.Option;
import { Masonry } from 'react-virtualized';

class Test extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pvCapabilitydiagramsData: PropTypes.array,
    monitorPvUnit: PropTypes.object,
    areaChecked: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      sortStatusName: 'sort',
      ascend: true,
      selectStation: null,
    }

  }

  showTip = (currentStatus) => {
    message.destroy();
    if (currentStatus === '900') {
      message.config({ top: 225, maxCount: 1, });
      message.warning('电站未接入,无法查看详情', 2);
    }
  }

  conditionChange = (value) => {
    this.setState({ selectStation: value })
  }

  sortStatus = (value) => {
    const { sortStatusName, ascend } = this.state;
    let currentAscend = true;
    if (sortStatusName === value) {
      currentAscend = !ascend
    }
    this.setState({
      sortStatusName: value,
      ascend: currentAscend
    })
  }



  dealData = (stationDataList) => { // 处理数据
    const { sortStatusName, ascend } = this.state;
    const { areaChecked } = this.props;
    const sortType = ascend ? 1 : -1;
    let filteredStation = [];
    if (stationDataList.length > 0) {
      const newStationsList = stationDataList.sort((a, b) => {
        return sortType * (a[sortStatusName] - b[sortStatusName]);
      });
      if (areaChecked) {
        const temType = newStationsList.sort((a, b) => { return a['provinceName'].localeCompare(b['provinceName']) });
        temType.forEach(e => {
          let findExactStation = false;
          filteredStation.forEach(m => {
            if (m.regionName === e.regionName) {
              findExactStation = true;
              m.stations.push(e);
            }
          })
          if (!findExactStation) {
            filteredStation.push({
              regionName: e.regionName,
              stations: [e]
            })
          }
        });
      } else {
        filteredStation.push({
          stations: newStationsList
        })
      }

    }
    return filteredStation
  }


  render() {
    const { stationDataList, monitorPvUnit, pvCapabilitydiagramsData } = this.props;
    const { powerUnit, realCapacityUnit, realTimePowerUnit } = monitorPvUnit;
    const { sortStatusName, ascend, selectStation } = this.state;
    const sortName = [
      { text: '默认排序', id: 'sort' },
      { text: '日利用小时 ', id: 'equivalentHours' },
      { text: '告警事件', id: 'alarmNum' },
      { text: '低效逆变器', id: 'lowEfficiencyInverterNum' },
      { text: '异常支路数 ', id: 'anomalousBranchNum' },
      { text: '日发电量', id: 'dayPower' },
      { text: '瞬时辐射', id: 'instantaneous' },
      { text: '实时功率', id: 'stationPower' },
    ];
    const getStatusName = {
      '400': 'normal',
      '500': 'interrupt',
      '900': 'notConnected',
    };
    const filterStationList = selectStation ? stationDataList.filter(e => e.stationCode === selectStation) : stationDataList
    const filteredStation = this.dealData(filterStationList);
    return (
      <div className={styles.stationCardContainer}>
        <div ref={'selectBody'}></div>
        <div className={styles.filterCondition}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择电站"
            optionFilterProp="children"
            onChange={this.conditionChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            getPopupContainer={() => this.refs.selectBody}
          // value={selectStation}
          >
            <Option value={''} key={''}>{'全部电站'}</Option>
            {stationDataList.map(list => {
              return <Option key={list.stationCode} value={list.stationCode}>{list.stationName}</Option>
            })}
          </Select>
          <div className={styles.sortCondition}>
            {sortName.map(list => {
              return (<div onClick={() => { this.sortStatus(list.id) }} key={list.id} className={`${styles.sortStatus}
                ${sortStatusName === list.id && styles['activeSortStatus']}`}>
                {list.text}
                {sortStatusName === list.id && ascend && <i className={`iconfont icon-back ${styles.ascend}`}></i>}
                {sortStatusName === list.id && !ascend && <i className={`iconfont icon-back ${styles.descend}`}></i>}
              </div>)
            })}
          </div>
        </div>
        <div className={styles.staionsListBox}>
          {stationDataList.length > 0 && filteredStation.map((list, key) => {
            const stationStatusList = list.stations.sort((a, b) => {
              return 900 - b.stationStatus === 0 ? -1 : 1
            })
            return (<div className={styles.regionList} key={key}>
              <div className={styles.regionName}>{list.regionName}</div>
              <div className={styles.staionsList}>
                {stationStatusList.map((item, index) => {
                  const currentStatus = item.stationStatus;
                  const stationPower = divideFormarts(item.stationPower, realTimePowerUnit);
                  const stationCapacity = realCapacityUnit === 'MW' ? item.stationCapacity : multiplyFormarts(item.stationCapacity, 1000);
                  const instantaneous = item.instantaneous;
                  const dayPower = divideFormarts(item.dayPower, powerUnit);
                  const equivalentHours = item.equivalentHours;
                  const filterChartData = pvCapabilitydiagramsData.filter(e => e.stationCode === item.stationCode);
                  const alarm = item.alarmNum > 0;
                  const invertType = item.lowEffType === 1 ? '201' : '206'
                  return (
                    <div className={`${styles[getStatusName[`${currentStatus}`]]} ${styles.staionCard}  ${alarm && styles.alarm}`} onClick={() => { this.showTip(currentStatus) }} key={item.stationCode} >
                      <Link to={`/monitor/singleStation/${item.stationCode}`} className={styles.linkBox}>
                        <div className={styles.stationTop}>
                          <div className={styles.stationName} title={item.stationName}> {item.stationName}</div>
                          <div className={styles.staionCapacity}>
                            <div>
                              <span className={styles.changeNum}>
                                <i className={'iconfont icon-da'}></i> {stationCapacity}</span> {realCapacityUnit}
                            </div>
                            <div className={styles.stationUnitCount}>
                              <span className={styles.changeNum}>{item.stationUnitCount}</span> 台
                            </div>
                            {`${currentStatus}` === '500' && <i className="iconfont icon-outage" />}
                            {item.alarmNum > 0 && <i className="iconfont icon-alarm" />}
                          </div>
                        </div>
                        <div className={styles.staionCenter}>
                          <div className={styles.staionCenterLeft}>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 实时功率</span>
                              <div> <span className={styles.changeNum}> {dataFormats(stationPower, '--', 2, true)}</span> {realTimePowerUnit} </div>
                            </div>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 瞬时辐射</span>
                              <div> <span className={styles.changeNum}> {dataFormats(instantaneous, '--', 2, true)}</span> W/m² </div>
                            </div>
                          </div>
                          <div className={styles.staionCenterRight}>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 日发电量</span>
                              <div> <span className={styles.changeNum}> {powerPoint(dayPower)}</span> {powerUnit} </div>
                            </div>
                            <div className={styles.column}>
                              <span className={styles.dataName}> 日利用小时</span>
                              <div> <span className={styles.changeNum}> {dataFormats(equivalentHours, '--', 2, true)}</span> h </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className={styles.chart}>
                        <OutputTenMin {...this.props}
                          yXaisName={'辐射(W/m²)'}
                          stationCode={item.stationCode}
                          yAxisUnit={realTimePowerUnit}
                          capabilityData={filterChartData.length > 0 && filterChartData[0].chartData || []} />
                      </div>
                      <div className={styles.bottom}>
                        <Link to={`/monitor/singleStation/${item.stationCode}?showPart=${'509'}`} className={styles.dataColumn}>
                          异常支路数  <span className={styles[`${item.anomalousBranchNum > 0 ? 'red' : 'grey'}`]}> {dataFormats(item.anomalousBranchNum, '--', 0)}</span>
                        </Link>
                        <Link to={`/monitor/singleStation/${item.stationCode}?showPart=${invertType}`} className={styles.dataColumn}>
                          低效逆变器  <span className={styles[`${item.lowEfficiencyInverterNum > 0 ? 'red' : 'grey'}`]}> {dataFormats(item.lowEfficiencyInverterNum, '--', 0)}</span>
                        </Link>
                        <Link to={`/monitor/alarm/realtime?stationCode=${item.stationCode}`} className={styles.dataColumn}>
                          <div>
                            告警  <span className={styles[`${item.alarmNum > 0 ? 'red' : 'grey'}`]}> {dataFormats(item.alarmNum, '--', 0)}</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>)

          }) || <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div>
          }
        </div>
      </div>
    )
  }
}
export default (Test)