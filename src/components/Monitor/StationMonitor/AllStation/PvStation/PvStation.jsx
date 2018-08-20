
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
    sort: PropTypes.string,
    ascend: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    pvMonitorStation: PropTypes.object,
  }
  constructor(props, context) {
    
    super(props, context);
    this.TabPane = Tabs.TabPane;
    this.state = {
      key: '1',
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
    this.setState({ key: activekey })
  }
  render() {
    let { key, checked, stationType } = this.state;
    const { pvMonitorStation } = this.props;
    const { stationDataList,stationDataSummary } = pvMonitorStation; 
    console.log(pvMonitorStation);
    const normalNum=stationDataSummary.stationStatusSummary.filter(e=>{
      return e.stationStatus===400
    }).length>0?stationDataSummary.stationStatusSummary.filter(e=>{
      return e.stationStatus===400
    })[0].stationNum:'0';

    const dataInterruptionNum=stationDataSummary.stationStatusSummary.filter(e=>{
      return e.stationStatus===500
    }).length>0?stationDataSummary.stationStatusSummary.filter(e=>{
      return e.stationStatus===500
    })[0].stationNum:'0';
    
    const unconnectionNum=stationDataSummary.stationStatusSummary.filter(e=>{
      return e.stationStatus===900
    }).length>0?stationDataSummary.stationStatusSummary.filter(e=>{
      return e.stationStatus===900
    })[0].stationNum:'0';
    //let stationType=stationDataList.stationStatus.stationStatus
    const newStationDataList = stationDataList.filter(e => {
      return !checked || (checked && e.alarmNum > 0)
    }).filter(e => {
      if (stationType === 'all') {
        return true
      } else if (stationType === 'normal') {
        return e.stationStatus.stationStatus === '400'
      } else if (stationType === 'dataInterruption') {
        return e.stationStatus.stationStatus === '500'
      } else if (stationType === 'networkInterruption') {
        return e.stationStatus.stationStatus === '900'
      } else if (stationType === 'unconnection') {
        return e.stationStatus.stationStatus === '900'
      }
    })
    //console.log(newStationDataList)

    const TabPane = Tabs.TabPane;
    //TABS 筛选
    const operations = (
      <div>
        <Switch onChange={this.onHandleAlarm} />告警
    <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ marginLeft: 20 }}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="normal">通讯正常  {normalNum}<span></span></Radio.Button>
          <Radio.Button value="dataInterruption">信息中断  {dataInterruptionNum}</Radio.Button>
          {/* <Radio.Button value="networkInterruption">网络中断</Radio.Button> */}
          <Radio.Button value="unconnection">未接入  {unconnectionNum}</Radio.Button>
        </Radio.Group>
      </div>
    );
   
    const province = (
      <div>
       
         {this.props.pvMonitorStation.stationDataSummary.stationProvinceSummary.map((item,index)=>{
      return (
        <span key={index}>{item.provinceName}:{item.lightStationNum}&nbsp;&nbsp;</span>
      )
    })}
      </div>
    )

    let iconArray = [
      {400:'circle',500:'triangle',900:'roundRect'},
   

    ]
    let data = [];
    stationDataList.forEach((item, index) => {
      data.push({
        name: item.stationName,
        value: [item.longitude, item.latitude, item.stationType, item.stationStatus.stationStatus],
        symbol: [iconArray[0][item.stationStatus.stationStatus]],
        alarmNum: item.alarmNum,
        stationPower: item.stationPower,
        stationCapacity: item.stationCapacity,
        instantaneous: item.instantaneous
      })
    })
    return (
      <div className={styles.pvStation}>
       <PvStationHeader {...this.props} />

        <Tabs activeKey={key} tabBarExtraContent={key !== '3' ? operations : province} onChange={this.setkey}>
          <TabPane
            tab={
              <span>
               <i className="iconfont icon-grid"></i>
              </span>
            }
            key="1"
          >
            <PvStationItem {...this.props} stationDataList={newStationDataList} />

          </TabPane>
          <TabPane
            tab={
              <span>
                <i className="iconfont icon-table"></i>
              </span>
            }
            key="2"
          >
            <PvStationList {...this.props} stationDataList={newStationDataList} />
          </TabPane>
          <TabPane
            tab={
              <span>
               <i className="iconfont icon-map"></i>
              </span>
            }
            key="3"
          >
            <Map testId="pv_bmap_station" {...this.props} stationDataList={data} />
          </TabPane>
        </Tabs>,

      </div>
    )
  }
}
export default PvStation

 