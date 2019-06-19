

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './pvStation.scss';
import DeviceList from './DeviceList/DeviceList';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';
import { getDeviceTypeIcon, getAlarmStatus } from '../SingleStationCommon/DeviceTypeIcon'

const { TabPane } = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class PvStation extends Component {
  static propTypes = {
    deviceTypeFlow: PropTypes.object,
    changeSingleStationStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    stationDeviceList: PropTypes.array,
    deviceTypeCode: PropTypes.number,
    stationCode: PropTypes.string,
    resetSingleStationStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }

  createFlowButton = (typeCode, typeName, buttonClass, imgClass, clickable = true, alarm = false) => ( // 设备流程生成函数
    <RadioButton value={typeCode} className={styles[buttonClass]} style={clickable ? null : { pointerEvents: 'none' }}>
      <div className={styles.deviceTypeIcon} >
        <i className={getDeviceTypeIcon(typeCode)} ></i>
        {alarm && <i className="iconfont icon-alarm alarmIcon" ></i>}
        <img src="/img/arrowgo.png" className={styles[imgClass]} />
      </div>
      <div>{typeName}</div>
    </RadioButton>
  )


  filterDeviceFlowTypes = (deviceFlowTypes) => { // 删选出交流汇流箱(业务需求)
    let newDeviceFlowTypes = [];
    deviceFlowTypes.forEach(item => {
      if (item.deviceTypes.length > 1) {
        let newArray = []
        item.deviceTypes.forEach(list => { list.deviceTypeCode !== 207 && newArray.push(list) })
        newDeviceFlowTypes.push({ deviceTypes: newArray })
      } else {
        item.deviceTypes[0].deviceTypeCode !== 207 && newDeviceFlowTypes.push(item)
      }
    })
    return newDeviceFlowTypes
  }

  render() {
    const clickable = [509, 201, 206, 304, 202, 302, 301];
    const { deviceTypeFlow, stationDeviceList, deviceTypeCode } = this.props;
    const alarmList = this.props[getAlarmStatus(deviceTypeCode)];
    let alarmStatus = alarmList ? !(alarmList instanceof Array) && alarmList.deviceList && alarmList.deviceList.some(e => e.alarmNum > 0) || (alarmList.length > 0 && alarmList.some(e => e.warningStatus)) : false
    const weatherDeviceCode = stationDeviceList && stationDeviceList.deviceCode || 0;
    const { stationCode } = this.props.match.params;
    const deviceFlowTypesArray = deviceTypeFlow && deviceTypeFlow.deviceFlowTypes || [];
    const deviceFlowTypes = this.filterDeviceFlowTypes(deviceFlowTypesArray)
    const isCombinedType = deviceFlowTypes.some(e => e.deviceTypes.length > 1);
    let seriesInfo = {}, boxConfluentInfo = {}, integrateInfo = {}, boosterInfo = {}, deviceFlowRowTwo = [], deviceFlowRowThree = [];
    deviceFlowTypes.forEach(device => { // 抽取各设备类型信息
      const deviceTypes = device.deviceTypes || [];
      let tmpSeriesInfo = deviceTypes.find(e => e.deviceTypeCode === 509); // 组串 光伏组件
      let tmpBoxConfluentInfo = deviceTypes.find(e => e.deviceTypeCode === 304); // 箱变
      let tmpIntegrateInfo = deviceTypes.find(e => e.deviceTypeCode === 302); // 集电线路
      let tmpBoosterInfo = deviceTypes.find(e => e.deviceTypeCode === 301); // 升压站
      tmpSeriesInfo && (seriesInfo = tmpSeriesInfo);
      tmpBoxConfluentInfo && (boxConfluentInfo = tmpBoxConfluentInfo);
      tmpIntegrateInfo && (integrateInfo = tmpIntegrateInfo);
      tmpBoosterInfo && (boosterInfo = tmpBoosterInfo);
      let tmpRowTwo = deviceTypes.filter(e => (e.deviceTypeCode === 202 || e.deviceTypeCode === 206))// 汇流箱或者组串式逆变器
      let tmpRowThree = deviceTypes.filter(e => (e.deviceTypeCode === 201 || e.deviceTypeCode === 207))// 集中式逆变器或者交流汇流箱
      tmpRowTwo.length > 0 && (deviceFlowRowTwo = tmpRowTwo);
      tmpRowThree.length > 0 && (deviceFlowRowThree = tmpRowThree);
    });
    let RowTwoButton, RowThreeButton, needClassBox; // needClassBox需要双层结构包装
    if (deviceFlowRowTwo.length <= 1 && deviceFlowRowThree.length <= 1) { // 设备顺序流程为一行。(有可能第二第三列中某设备类型完全不存在)
      const stepTwoInfo = deviceFlowRowTwo[0];
      const stepThreeInfo = deviceFlowRowThree[0];
      RowTwoButton = stepTwoInfo ? this.createFlowButton(
        stepTwoInfo.deviceTypeCode,
        stepTwoInfo.deviceTypeName,
        'deviceTypeItem',
        'arrowgo',
        clickable.includes(stepTwoInfo.deviceTypeCode),
        deviceTypeCode === stepTwoInfo.deviceTypeCode && alarmStatus,
      ) : null;
      RowThreeButton = stepThreeInfo ? this.createFlowButton(
        stepThreeInfo.deviceTypeCode,
        stepThreeInfo.deviceTypeName,
        'deviceTypeItem',
        'arrowgo',
        clickable.includes(stepThreeInfo.deviceTypeCode),
        deviceTypeCode === stepThreeInfo.deviceTypeCode && alarmStatus,
      ) : null;
    } else if (deviceFlowRowTwo.length === 2 && deviceFlowRowThree.length === 2) { // 两行4种设备类型顺序。
      needClassBox = true;
      const acConflu = deviceFlowRowThree.find(e => e.deviceTypeCode === 207); // 有交流汇流箱
      const seriesInver = deviceFlowRowTwo.find(e => e.deviceTypeCode === 206); // 有组串式逆变器
      const concentrateConflu = deviceFlowRowTwo.find(e => e.deviceTypeCode === 202); // 有汇流箱
      const concentrateInver = deviceFlowRowThree.find(e => e.deviceTypeCode === 201); // 有集中式逆变器
      RowTwoButton = (<div>
        {this.createFlowButton(
          concentrateConflu.deviceTypeCode,
          concentrateConflu.deviceTypeName,
          'innerItem',
          'innerArrow',
          clickable.includes(concentrateConflu.deviceTypeCode),
          deviceTypeCode === concentrateConflu.deviceTypeCode && alarmStatus,
        )}
        {this.createFlowButton(concentrateInver.deviceTypeCode, concentrateInver.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(concentrateInver.deviceTypeCode), deviceTypeCode === concentrateInver.deviceTypeCode && alarmStatus)}
      </div>)
      RowThreeButton = (<div>
        {this.createFlowButton(seriesInver.deviceTypeCode, seriesInver.deviceTypeName, 'innerItem', 'innerArrow', clickable.includes(seriesInver.deviceTypeCode), deviceTypeCode === seriesInver.deviceTypeCode && alarmStatus)}
        {this.createFlowButton(acConflu.deviceTypeCode, acConflu.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(acConflu.deviceTypeCode), deviceTypeCode === acConflu.deviceTypeCode && alarmStatus)}
      </div>)
    } else {  // 1 + 2设备类型情况
      needClassBox = true;
      const acConflu = deviceFlowRowThree.find(e => e.deviceTypeCode === 207); // 有交流汇流箱
      const seriesInver = deviceFlowRowTwo.find(e => e.deviceTypeCode === 206); // 有组串式逆变器
      const concentrateConflu = deviceFlowRowTwo.find(e => e.deviceTypeCode === 202); // 有汇流箱
      const concentrateInver = deviceFlowRowThree.find(e => e.deviceTypeCode === 201); // 有集中式逆变器

      const concentrateType = concentrateInver && concentrateConflu // 有集中光伏电站流程
      const distributeType = seriesInver && acConflu // 有分布光伏电站流程
      if (concentrateType) {  // 有集中光伏电站流程-顶部为集中流程，底部为分布式居中
        RowTwoButton = (<div>
          {this.createFlowButton(concentrateConflu.deviceTypeCode, concentrateConflu.deviceTypeName, 'innerItem', 'innerArrow', clickable.includes(concentrateConflu.deviceTypeCode), deviceTypeCode === concentrateConflu.deviceTypeCode && alarmStatus)}
          {this.createFlowButton(concentrateInver.deviceTypeCode, concentrateInver.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(concentrateInver.deviceTypeCode), deviceTypeCode === concentrateInver.deviceTypeCode && alarmStatus)}
        </div>)
        RowThreeButton = acConflu ? this.createFlowButton(acConflu.deviceTypeCode, acConflu.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(acConflu.deviceTypeCode), deviceTypeCode === acConflu.deviceTypeCode && alarmStatus)
          : this.createFlowButton(seriesInver.deviceTypeCode, seriesInver.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(seriesInver.deviceTypeCode), deviceTypeCode === seriesInver.deviceTypeCode && alarmStatus);
      } else if (distributeType) { // 有分布光伏流程-顶部为集中流程居中，底部为分布式流程
        RowTwoButton = (<div>
          {this.createFlowButton(seriesInver.deviceTypeCode, seriesInver.deviceTypeName, 'innerItem', 'innerArrow', clickable.includes(seriesInver.deviceTypeCode), deviceTypeCode === seriesInver.deviceTypeCode && alarmStatus)}
          {this.createFlowButton(acConflu.deviceTypeCode, acConflu.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(acConflu.deviceTypeCode), deviceTypeCode === acConflu.deviceTypeCode && alarmStatus)}
        </div>)
        RowThreeButton = concentrateConflu ? this.createFlowButton(concentrateConflu.deviceTypeCode, concentrateConflu.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(concentrateConflu.deviceTypeCode), deviceTypeCode === concentrateConflu.deviceTypeCode && alarmStatus)
          : this.createFlowButton(concentrateInver.deviceTypeCode, concentrateInver.deviceTypeName, 'innerItem', 'hideArrow', clickable.includes(concentrateInver.deviceTypeCode), deviceTypeCode === concentrateInver.deviceTypeCode && alarmStatus);
      }
    }
    return (
      <div className={styles.threadAndDevice} id="deviceType" >
        <Tabs type="card" defaultActiveKey="2" >
          {/* <TabPane tab="主线" key="1">
                        <p>主线列表</p>
                    </TabPane> */}
          <TabPane tab="示意图" key="2">
            <div className={styles.deviceTypeFlow}>
              <Link to={`/hidden/monitorDevice/${stationCode}/203/${weatherDeviceCode}`} className={styles.weatherStationLink} >
                <div className={isCombinedType ? styles.combinedTypeWeatherStation : styles.weatherStation}>
                  <i className="iconfont icon-weather" ></i>
                  <div className={styles.fontcolor}>气象站</div>
                </div>
              </Link>
              <RadioGroup value={deviceTypeCode} onChange={this.onSelectedDeviceType} >
                {seriesInfo.deviceTypeCode && this.createFlowButton(
                  seriesInfo.deviceTypeCode,
                  seriesInfo.deviceTypeName,
                  'deviceTypeItem',
                  'arrowgo',
                  clickable.includes(seriesInfo.deviceTypeCode),
                  deviceTypeCode === seriesInfo.deviceTypeCode && alarmStatus
                )}
                {!needClassBox && RowTwoButton}
                {!needClassBox && RowThreeButton}
                {needClassBox && <div className={styles.multipleType}>
                  {RowTwoButton}
                  {RowThreeButton}
                  <img src="/img/arrowgo.png" className={styles.rightArrow} />
                </div>}
                {boxConfluentInfo.deviceTypeCode && this.createFlowButton(
                  boxConfluentInfo.deviceTypeCode,
                  boxConfluentInfo.deviceTypeName,
                  'deviceTypeItem',
                  'arrowgo',
                  clickable.includes(boxConfluentInfo.deviceTypeCode),
                  deviceTypeCode === boxConfluentInfo.deviceTypeCode && alarmStatus
                )}
                {integrateInfo.deviceTypeCode && this.createFlowButton(
                  integrateInfo.deviceTypeCode,
                  integrateInfo.deviceTypeName,
                  'deviceTypeItem',
                  'arrowgo',
                  clickable.includes(integrateInfo.deviceTypeCode),
                  deviceTypeCode === integrateInfo.deviceTypeCode && alarmStatus
                )}
                {boosterInfo.deviceTypeCode && this.createFlowButton(
                  boosterInfo.deviceTypeCode,
                  boosterInfo.deviceTypeName,
                  'deviceTypeItem',
                  'arrowgo',
                  clickable.includes(boosterInfo.deviceTypeCode),
                  deviceTypeCode === boosterInfo.deviceTypeCode && alarmStatus
                )}
                <RadioButton value={0} className={styles.elecnettingItem}>
                  <div className={styles.deviceTypeIcon} >
                    <i className="iconfont icon-elecnetting" ></i>
                  </div>
                  <div>电网</div>
                </RadioButton>
              </RadioGroup>
            </div>
            <div className={styles.deviceList} >
              <DeviceList {...this.props} />
            </div>
          </TabPane>
        </Tabs>
      </div>

    )
  }
}

export default PvStation;
