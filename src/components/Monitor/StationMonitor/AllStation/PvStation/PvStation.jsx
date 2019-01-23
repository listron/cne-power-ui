
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
    stationShowType: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.string,
    realCapacityPoint: PropTypes.string,
    powerPoint: PropTypes.string,
  }
  constructor(props, context) {

    super(props, context);
    this.TabPane = Tabs.TabPane;
    this.state = {
      checked: false,
      stationType: 'all',
      currentPage: 1,
      pageSize: 10,
    }
  }

  onHandleAlarm = (checked) => {
    this.setState({
      checked,
      currentPage: 1,
    })
  }
  onHandleStation = (e) => {
    this.setState({
      stationType: e.target.value,
      currentPage: 1,
    })
  }
  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    this.setState({
      currentPage,
      pageSize
    })
  }
  setkey = (activekey) => {
    this.props.changeMonitorStationStore({ stationShowType: activekey });
  }
  statisticStatusNum = () => {
    const { pvMonitorStation } = this.props;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationStatusSummary = stationDataSummary.stationStatusSummary || [];
    //统计各状态下的电站数量
    const normalNum = stationStatusSummary.filter(e => {
      return e && e.stationStatus === 400
    }).length > 0 ? stationStatusSummary.filter(e => {
      return e && e.stationStatus === 400
    })[0].stationNum : '0';

    const dataInterruptionNum = stationStatusSummary.filter(e => {
      return e && e.stationStatus === 500
    }).length > 0 ? stationStatusSummary.filter(e => {
      return e && e.stationStatus === 500
    })[0].stationNum : '0';

    const unconnectionNum = stationStatusSummary.filter(e => {
      return e && e.stationStatus === 900
    }).length > 0 ? stationStatusSummary.filter(e => {
      return e && e.stationStatus === 900
    })[0].stationNum : '0';
    return {
      normalNum, 
      dataInterruptionNum,
      unconnectionNum
    }
  }
  statusDataList=()=>{
    let { checked, stationType } = this.state;
    const { pvMonitorStation } = this.props;
    const stationDataList = pvMonitorStation.stationDataList || [];
    const newStationDataList = stationDataList.filter(e => {
      return !checked || (checked && e.alarmNum > 0)
    }).filter(e => {
      const stationStatus = e.stationStatus || {};
      if (stationType === 'all') {
        return true
      } else if (stationType === 'normal') {
        return stationStatus.stationStatus === '400'
      } else if (stationType === 'dataInterruption') {
        return stationStatus.stationStatus === '500'
      } else if (stationType === 'unconnection') {
        return stationStatus.stationStatus === '900'
      }
    })
    return newStationDataList
  }
  mapData=()=>{
    const { pvMonitorStation, realTimePowerUnit, realCapacityUnit,realTimePowerPoint ,realCapacityPoint} = this.props;
    const stationDataList = pvMonitorStation.stationDataList || [];
    let iconArray = [
      {
        "400": ['image:///img/wind01.png', 'image:///img/wind02.png'],
        "500": 'image:///img/cutdown.png',
        "900": 'image:///img/wind04.png'
      },
      {
        "400": ['image:///img/pv01.png', 'image:///img/pv02.png'],
        "500": 'image:///img/pv03.png',
        "900": 'image:///img/pv04.png'
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
        symbolSize: stationType > 0 ? [30, 20]: [31, 36],
        alarmNum: item.alarmNum,
        stationPower: (realTimePowerUnit==='MW'?(+item.stationPower):(+item.stationPower*1000)).toFixed(realTimePowerPoint),
        stationCapacity: (realCapacityUnit==='MW'?(+item.stationCapacity):(+item.stationCapacity*1000)).toFixed(realCapacityPoint),
        instantaneous: item.instantaneous,
        stationCode: item.stationCode,
        stationStatus:stationStatus,
        realTimePowerUnit,
        realCapacityUnit
      })
    })
    return data
  }
  render() {
    const { currentPage, pageSize, } = this.state;
    const { pvMonitorStation } = this.props;
    const stationDataSummary = pvMonitorStation.stationDataSummary || {};
    const stationProvinceSummary = stationDataSummary.stationProvinceSummary || [];
    const TabPane = Tabs.TabPane;
    //状态 筛选
    const operations = (
      <div>
        <Switch onChange={this.onHandleAlarm} />告警
        <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ margin: '0 30px 0 15px' }}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="normal">通讯正常  {this.statisticStatusNum().normalNum}<span></span></Radio.Button>
          <Radio.Button value="dataInterruption">信息中断  {this.statisticStatusNum().dataInterruptionNum}</Radio.Button>
          <Radio.Button value="unconnection">未接入  {this.statisticStatusNum().unconnectionNum}</Radio.Button>
        </Radio.Group>
      </div>
    );
    //省份电站数量
    const province = (
      <div className={styles.provinceStationTotal}>
        {stationProvinceSummary.map((item, index) => {
          return (
            <div key={index} className={styles.provinceBox}>
              <span>{item.provinceName}</span>
              <span className={styles.fontColor}>{item.lightStationNum}&nbsp;&nbsp;</span>
            </div>
          )
        })}
      </div>
    )  
    return (
      <div className={styles.pvStation}>
        <PvStationHeader {...this.props} />
        <Tabs className={styles.containerTabs} activeKey={this.props.stationShowType} tabBarExtraContent={this.props.stationShowType !== 'stationMap' ? operations : province} onChange={this.setkey} animated={false}>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-grid"></i>
              </span>
            }
            key="stationBlock"
          >
            <PvStationItem {...this.props} stationDataList={this.statusDataList()} />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-table"></i>
              </span>
            }
            key="stationList"
          >
            <PvStationList 
            {...this.props} 
            currentPage={currentPage} 
            pageSize={pageSize} 
            onPaginationChange={this.onPaginationChange}
            stationDataList={this.statusDataList()} 
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-map"></i>
              </span>
            }
            key="stationMap"
          >
            <Map testId="pv_bmap_station" {...this.props} stationDataList={this.mapData()} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
export default PvStation

