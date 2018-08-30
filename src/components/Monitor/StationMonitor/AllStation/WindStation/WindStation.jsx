import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import Map from '../Map.jsx';
import WindStationHeader from './WindStationHeader.jsx';
import WindStationItem from './WindStationItem.jsx';
import WindStationList from './WindStationList.jsx';
import { Tabs, Radio, Switch } from "antd";

class WindStation extends React.Component {
  static propTypes = {
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    windMonitorStation: PropTypes.object,
    totalNum: PropTypes.number,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: '1',
      checked: false,
      stationType: 'all',
      totalNum: 0
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
    this.setState({ key: activekey })
  }
  componentUnmount() {
    //clearTimeout(this.autoTimer)
  }


  render() {
    let { key, checked, stationType } = this.state;
    const { windMonitorStation } = this.props;

    
    const stationDataSummary = windMonitorStation.stationDataSummary || {};
    const stationProvinceSummary=stationDataSummary.stationProvinceSummary||[];
    const stationStatusSummary = stationDataSummary.stationStatusSummary || [];
    //统计各状态下的电站数量
    const normalNum = stationStatusSummary.filter(e => {
      return e.stationStatus === 400
    }).length > 0 ? stationStatusSummary.filter(e => {
      return e.stationStatus === 400
    })[0].stationNum : '0';

    const dataInterruptionNum = stationStatusSummary.filter(e => {
      return e.stationStatus === 500
    }).length > 0 ? stationStatusSummary.filter(e => {
      return e.stationStatus === 500
    })[0].stationNum : '0';
   

    const unconnectionNum = stationStatusSummary.filter(e => {
      return e.stationStatus === 900
    }).length > 0 ? stationStatusSummary.filter(e => {
      return e.stationStatus === 900
    })[0].stationNum : '0';
    //筛选不同状态下的电站列表
    const stationDataList = windMonitorStation.stationDataList || [];
    const newStationDataList = stationDataList.filter(e => {
      return !checked || (checked && e.alarmNum > 0)
    }).filter(e => {
      if (stationType === 'all') {
        return true
      } else if (stationType === 'normal') {
        return e.stationStatus.stationStatus === '400'
      } else if (stationType === 'dataInterruption') {
        return e.stationStatus.stationStatus === '500'
      } else if (stationType === 'unconnection') {
        return e.stationStatus.stationStatus === '900'
      }
    })
   


    const TabPane = Tabs.TabPane;
    //tabs筛选部分
    const operations = (
      <div style={{border:'none'}}>
        <Switch onChange={this.onHandleAlarm} />告警
    <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ margin: "0 30px" }}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="normal">通讯正常  {normalNum}<span></span></Radio.Button>
          <Radio.Button value="dataInterruption">信息中断  {dataInterruptionNum}  </Radio.Button>
          {/* <Radio.Button value="networkInterruption">网络中断</Radio.Button> */}
          <Radio.Button value="unconnection">未接入  {unconnectionNum}</Radio.Button>
        </Radio.Group>
      </div>
    );


    const province = (
      <div className={styles.provinceStationTotal}>       {stationProvinceSummary.map((item, index) => {
        return (
          <div key={index}>
          <span>{item.provinceName}:</span>
          <span className={styles.fontColor}>{item.windStationNum}&nbsp;&nbsp;</span>
          </div>
        )
      })}
      </div>
    )
    //地图数据处理

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
      let stationStatusAll = item.stationStatus || [];
      let stationStatus = stationStatusAll.stationStatus || "";  
      const stationType = item.stationType || "";
      const currentStationType=iconArray[item.stationType]||{};   
      const currentStationStatus=currentStationType[stationStatus]||'';

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
      <div className={styles.WindStation}>
        <WindStationHeader {...this.props} />
        <Tabs className={styles.smallTabs} activeKey={key} tabBarExtraContent={key !== '3' ? operations : province} onChange={this.setkey}>
          <TabPane 
            tab={
              <span>
                <i className="iconfont icon-grid"></i>
              </span>
            }
            key="1"
          >
            <WindStationItem {...this.props} stationDataList={newStationDataList} />

          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-table"></i>
              </span>
            }
            key="2"
          >
            <WindStationList {...this.props} stationDataList={newStationDataList} />

          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-map"></i>
              </span>
            }
            key="3"
          >
           <Map {...this.props} stationDataList={data} testId="wind_bmap_station" />
          </TabPane>
        </Tabs>

      </div>
    )
  }
}
export default WindStation

