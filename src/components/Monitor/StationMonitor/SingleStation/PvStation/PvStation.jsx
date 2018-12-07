

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import OutputTenMin from '../SingleStationCommon/OutputTenMin';
import PowerDiagramTenMin from '../SingleStationCommon/PowerDiagramTenMin';
import CardSection from '../SingleStationCommon/CardSection';
import styles from './pvStation.scss';
import DeviceList from './DeviceList/DeviceList';
import { Tabs, Radio } from 'antd';
import { Link } from 'react-router-dom';

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
    this.state = {
      hiddenStationList: false,
    }
  }

  onSelectedDeviceType = (e) => {
    const deviceTypeCode = parseInt(e.target.value);
    this.props.changeSingleStationStore({ deviceTypeCode });
  }

  getDeviceTypeIcon = (e) => {
    switch (e) {
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
      default:
        return;
    }
  }

  hiddenStationList = () => {
    this.setState({
      hiddenStationList: true,
    });
  }

  createFlowButton = (typeCode, typeName, buttonClass, imgClass,clickable = true) => ( // 设备流程生成函数
    <RadioButton value={typeCode} className={styles[buttonClass]}  style={clickable?null:{pointerEvents:'none'}}>
      <div className={styles.deviceTypeIcon} >
        <i className={this.getDeviceTypeIcon(typeCode)} ></i>
        <img src="/img/arrowgo.png" className={styles[imgClass]} />
      </div>
      <div>{typeName}</div>
    </RadioButton>
  )


  render() {
    const clickable = [509, 201, 206, 304, 202];
    const { deviceTypeFlow, stationDeviceList, deviceTypeCode, } = this.props;
    const weatherDeviceCode = stationDeviceList && stationDeviceList.deviceCode || 0;
    const { stationCode } = this.props.match.params;
    const deviceFlowTypes = deviceTypeFlow && deviceTypeFlow.deviceFlowTypes || [];
    const isCombinedType = deviceFlowTypes.some(e=>e.deviceTypes.length > 1);
    let seriesInfo = {}, boxConfluentInfo = {}, integrateInfo = {}, deviceFlowRowTwo = [], deviceFlowRowThree = [];
    deviceFlowTypes.forEach(device => { // 抽取各设备类型信息
      const deviceTypes = device.deviceTypes || [];
      let tmpSeriesInfo = deviceTypes.find(e=>e.deviceTypeCode === 509); // 组串
      let tmpBoxConfluentInfo = deviceTypes.find(e=>e.deviceTypeCode === 304); // 汇流箱
      let tmpIntegrateInfo = deviceTypes.find(e=>e.deviceTypeCode === 302); // 集电线路
      tmpSeriesInfo && (seriesInfo = tmpSeriesInfo);
      tmpBoxConfluentInfo && (boxConfluentInfo = tmpBoxConfluentInfo);
      tmpIntegrateInfo && (integrateInfo = tmpIntegrateInfo);
      let tmpRowTwo = deviceTypes.filter(e=> (e.deviceTypeCode === 202 || e.deviceTypeCode === 206))// 汇流箱或者组串式逆变器
      let tmpRowThree = deviceTypes.filter(e=> (e.deviceTypeCode === 201 || e.deviceTypeCode === 207))// 集中式逆变器或者交流汇流箱
      tmpRowTwo.length > 0 && (deviceFlowRowTwo = tmpRowTwo);
      tmpRowThree.length > 0 && (deviceFlowRowThree = tmpRowThree);
    });
    let RowTwoButton,RowThreeButton,needClassBox; // needClassBox需要双层结构包装
    if(deviceFlowRowTwo.length <= 1 && deviceFlowRowThree.length <= 1){ // 设备顺序流程为一行。(有可能第二第三列中某设备类型完全不存在)
      const stepTwoInfo = deviceFlowRowTwo[0];
      const stepThreeInfo = deviceFlowRowThree[0];
      RowTwoButton = stepTwoInfo ? this.createFlowButton(
        stepTwoInfo.deviceTypeCode,
        stepTwoInfo.deviceTypeName,
        'deviceTypeItem',
        'arrowgo',
        clickable.includes(stepTwoInfo.deviceTypeCode)
      ): null;
      RowThreeButton = stepThreeInfo ? this.createFlowButton(
        stepThreeInfo.deviceTypeCode,
        stepThreeInfo.deviceTypeName,
        'deviceTypeItem',
        'arrowgo',
        clickable.includes(stepThreeInfo.deviceTypeCode)
      ): null;
    }else if(deviceFlowRowTwo.length === 2 && deviceFlowRowThree.length === 2){ // 两行4种设备类型顺序。
      needClassBox = true;
      const acConflu = deviceFlowRowThree.find(e=>e.deviceTypeCode === 207); // 有交流汇流箱
      const seriesInver = deviceFlowRowTwo.find(e=>e.deviceTypeCode === 206); // 有组串式逆变器
      const concentrateConflu = deviceFlowRowTwo.find(e=>e.deviceTypeCode === 202); // 有汇流箱
      const concentrateInver = deviceFlowRowThree.find(e=>e.deviceTypeCode === 201); // 有集中式逆变器
      RowTwoButton = (<div>
        {this.createFlowButton(
          concentrateConflu.deviceTypeCode,
          concentrateConflu.deviceTypeName,
          'innerItem',
          'innerArrow',
          clickable.includes(concentrateConflu.deviceTypeCode)
        )}
        {this.createFlowButton(concentrateInver.deviceTypeCode, concentrateInver.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(concentrateInver.deviceTypeCode))}
      </div>)
      RowThreeButton = (<div>
        {this.createFlowButton(seriesInver.deviceTypeCode, seriesInver.deviceTypeName, 'innerItem', 'innerArrow',clickable.includes(seriesInver.deviceTypeCode))}
        {this.createFlowButton(acConflu.deviceTypeCode, acConflu.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(acConflu.deviceTypeCode))}
      </div>)
    }else{  // 1 + 2设备类型情况
      needClassBox = true;
      const acConflu = deviceFlowRowThree.find(e=>e.deviceTypeCode === 207); // 有交流汇流箱
      const seriesInver = deviceFlowRowTwo.find(e=>e.deviceTypeCode === 206); // 有组串式逆变器
      const concentrateConflu = deviceFlowRowTwo.find(e=>e.deviceTypeCode === 202); // 有汇流箱
      const concentrateInver = deviceFlowRowThree.find(e=>e.deviceTypeCode === 201); // 有集中式逆变器

      const concentrateType = concentrateInver && concentrateConflu // 有集中光伏电站流程
      const distributeType = seriesInver && acConflu // 有分布光伏电站流程
      if(concentrateType){  // 有集中光伏电站流程-顶部为集中流程，底部为分布式居中
        RowTwoButton = (<div>
          {this.createFlowButton(concentrateConflu.deviceTypeCode, concentrateConflu.deviceTypeName, 'innerItem', 'innerArrow',clickable.includes(concentrateConflu.deviceTypeCode))}
          {this.createFlowButton(concentrateInver.deviceTypeCode, concentrateInver.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(concentrateInver.deviceTypeCode))}
        </div>)
        RowThreeButton = acConflu?this.createFlowButton(acConflu.deviceTypeCode, acConflu.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(acConflu.deviceTypeCode))
        :this.createFlowButton(seriesInver.deviceTypeCode, seriesInver.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(seriesInver.deviceTypeCode));
      }else if(distributeType){ // 有分布光伏流程-顶部为集中流程居中，底部为分布式流程
        RowTwoButton = (<div>
          {this.createFlowButton(seriesInver.deviceTypeCode, seriesInver.deviceTypeName, 'innerItem', 'innerArrow',clickable.includes(seriesInver.deviceTypeCode))}
          {this.createFlowButton(acConflu.deviceTypeCode, acConflu.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(acConflu.deviceTypeCode))}
        </div>)
        RowThreeButton = concentrateConflu?this.createFlowButton(concentrateConflu.deviceTypeCode, concentrateConflu.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(concentrateConflu.deviceTypeCode))
        :this.createFlowButton(concentrateInver.deviceTypeCode, concentrateInver.deviceTypeName, 'innerItem', 'hideArrow',clickable.includes(concentrateInver.deviceTypeCode));
      }
    }
    return (
      <div className={styles.pvStation}  >
        <PvStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} />
        <div className={styles.outputPowerDiagram}>
          <OutputTenMin {...this.props} yXaisName={'辐射(W/m²)'} stationCode={stationCode} />
          <PowerDiagramTenMin {...this.props} stationCode={stationCode}  />
        </div>
        <CardSection {...this.props} stationCode={stationCode} />
        {/* 设备类型流程图切换 */}
        <div className={styles.threadAndDevice} id="deviceType" >
          <Tabs type="card" defaultActiveKey="2" >
            {/* <TabPane tab="主线" key="1">
              <p>主线列表</p>
            </TabPane> */}
            <TabPane tab="示意图" key="2">
              <div className={styles.deviceTypeFlow}>
                <Link  to={`/hidden/monitorDevice/${stationCode}/203/${weatherDeviceCode}`}  className={styles.weatherStationLink} >
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
                    clickable.includes(seriesInfo.deviceTypeCode)
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
                    clickable.includes(boxConfluentInfo.deviceTypeCode)
                  )}
                  {integrateInfo.deviceTypeCode && this.createFlowButton(
                    integrateInfo.deviceTypeCode,
                    integrateInfo.deviceTypeName,
                    'deviceTypeItem',
                    'arrowgo',
                    clickable.includes(integrateInfo.deviceTypeCode)
                  )}
                  <RadioButton className={styles.elecnettingItem}>
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

      </div>
    )
  }
}

export default PvStation;
