
import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import Map from '../Map.jsx';
import PvStationHeader from './PvStationHeader.jsx';
import PvStationItem from './PvStationItem.jsx';
import { Tabs, Radio, Switch } from "antd";
import PvStationList from "./PvStationList";
class PvStation extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    stationShowType:PropTypes.string,
    changeMonitorStationStore: PropTypes.func
  }
  constructor(props, context) {

    super(props, context);
    this.TabPane = Tabs.TabPane;
    this.state = {

      checked: false,
      stationType: 'all',
    }
  }

  onHandleAlarm = (checked) => {
    this.setState({
      checked
    })
  }
  onHandleStation = (e) => {
    this.setState({
      stationType: e.target.value
    })
  }
  setkey = (activekey) => {
 
    this.props.changeMonitorStationStore({stationShowType:activekey});
  }
  render() {
    let { key, checked, stationType } = this.state;
    const { pvMonitorStation } = this.props;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationProvinceSummary = stationDataSummary.stationProvinceSummary || [];
    const stationStatusSummary = stationDataSummary.stationStatusSummary || [];
    const normalNum=stationStatusSummary.filter(e=>{
      return e && e.stationStatus===400
    }).length>0?stationStatusSummary.filter(e=>{
      return e.stationStatus===400
    })[0].stationNum:'0';

    const dataInterruptionNum=stationStatusSummary.filter(e=>{
      return e && e.stationStatus===500
    }).length>0?stationStatusSummary.filter(e=>{
      return e && e.stationStatus===500
    })[0].stationNum:'0';
    
    const unconnectionNum=stationStatusSummary.filter(e=>{
      return e && e.stationStatus===900
    }).length>0?stationStatusSummary.filter(e=>{
      return e && e.stationStatus===900
    })[0].stationNum:'0';

    const stationDataList = pvMonitorStation.stationDataList || [];
    const newStationDataList = stationDataList.filter(e => {
      return !checked || (checked && e.alarmNum > 0)
    }).filter(e => {
      if (stationType === 'all') {
        return true
      } else if (stationType === 'normal') {
        const stationStatus = e.stationStatus || {};
        return stationStatus.stationStatus === '400'
      } else if (stationType === 'dataInterruption') {
        const stationStatus = e.stationStatus || {};
        return stationStatus.stationStatus === '500'
      } else if (stationType === 'unconnection') {
        const stationStatus = e.stationStatus || {};
        return stationStatus.stationStatus === '900'
      }
    })
    const TabPane = Tabs.TabPane;
    //TABS 筛选
    const operations = (
      <div>
        <Switch onChange={this.onHandleAlarm} />告警
    <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ margin: '0 30px' }}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="normal">通讯正常  {normalNum}<span></span></Radio.Button>
          <Radio.Button value="dataInterruption">信息中断  {dataInterruptionNum}</Radio.Button>
          <Radio.Button value="unconnection">未接入  {unconnectionNum}</Radio.Button>
        </Radio.Group>
      </div>
    );
    const province = (
      <div className={styles.provinceStationTotal}>

        {stationProvinceSummary.map((item, index) => {
          return (
            <div key={index}>
              <span>{item.provinceName}</span>
              <span className={styles.fontColor}>{item.windStationNum}&nbsp;&nbsp;</span>
            </div>
          )
        })}
      </div>
    )
    let iconArray = [
      {
        "400": ['image://./img/wind-normal.png', 'image://./img/wind-alert.png'],
        "500": 'image://./img/wind-cutdown.png',
        "900": 'image://./img/wind-unconnected.png'
      },
      {
        "400": ['image://./img/pv-normal.png', 'image://./img/pv-alert.png'],
        "500": 'image://./img/pv-cutdown.png',
        "900": 'image://./img/pv-unconnected.png'
      },
    ]
    let data = [];
    stationDataList.forEach((item, index) => {



      let stationStatusAll = item.stationStatus || {};
      let stationStatus = stationStatusAll.stationStatus || "";
      const stationType = item.stationType || "";
      const currentStationType = iconArray[item.stationType] || {};
      const currentStationStatus = currentStationType[stationStatus] || '';
      data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, stationType, stationStatus],
        symbol: stationStatus === "400" ? currentStationStatus[item.alarmNum ? 1 : 0] : currentStationStatus,
        alarmNum: item.alarmNum,
        stationPower: item.stationPower,
        stationCapacity: item.stationCapacity,
        instantaneous: item.instantaneous
      })
    })

    return (
      <div className={styles.pvStation}>
        <PvStationHeader {...this.props} />
        <Tabs className={styles.smallTabs} activeKey={this.props.stationShowType} tabBarExtraContent={key !== 'stationMap' ? operations : province} onChange={this.setkey}>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-grid"></i>
              </span>
            }
            key="stationBlock"
          >
            <PvStationItem {...this.props} stationDataList={newStationDataList} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-table"></i>
              </span>
            }
            key="stationList"
          >
            <PvStationList {...this.props} stationDataList={newStationDataList} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-map"></i>
              </span>
            }
            key="stationMap"
          >
            <Map testId="pv_bmap_station" {...this.props} stationDataList={data} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default PvStation

