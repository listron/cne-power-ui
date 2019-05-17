import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import Map from '../Map.jsx';
import WindStationHeader from './WindStationHeader.jsx';
import WindStationItem from './WindStationItem.jsx';
import WindStationList from './WindStationList.jsx';
import { Tabs, Radio, Switch,Spin } from "antd";

class WindStation extends React.Component {
  static propTypes = {
    windMonitorStation: PropTypes.object,
    stationShowType: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    realTimePowerUnit: PropTypes.string,
    realCapacityUnit: PropTypes.string,
    powerUnit: PropTypes.string,
    realTimePowerPoint: PropTypes.any,
    realCapacityPoint: PropTypes.any,
    powerPoint: PropTypes.any,
    getRealtimeData: PropTypes.func,
    loading: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      checked: false,
      stationType: 'all',
      totalNum: 0,
      currentPage: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    this.props.getRealMonitorData({ stationType: '0' })
  }

  componentWillUnmount() {
    // console.log(222)
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
    this.setState({ stationType: 'all', currentPage: 1, })
  }

  statisticStatusNum = () => {
    const { windMonitorStation } = this.props;
    const stationDataSummary = windMonitorStation.stationDataSummary || {};
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
  statusDataList = () => {
    let { checked, stationType } = this.state;
    const { windMonitorStation, } = this.props;
    const stationDataList = windMonitorStation.stationDataList || [];
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
  mapData = () => {
    const { windMonitorStation, realTimePowerUnit, realCapacityUnit, realTimePowerPoint, realCapacityPoint } = this.props;
    const stationDataList = windMonitorStation.stationDataList || [];
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
        symbolSize: stationType > 0 ? [30, 20] : [31, 36],
        alarmNum: item.alarmNum,
        stationPower: (realTimePowerUnit === 'MW' ? (+item.stationPower) : (+item.stationPower * 1000)).toFixed(realTimePowerPoint),
        stationCapacity: (realCapacityUnit === 'MW' ? (+item.stationCapacity) : (+item.stationCapacity * 1000)).toFixed(realCapacityPoint),
        instantaneous: item.instantaneous,
        stationCode: item.stationCode,
        stationStatus: stationStatus,
        realTimePowerUnit,
        realCapacityUnit
      })
    })
    return data

  }

  render() {
    const { currentPage, pageSize, checked, stationType } = this.state;
    const { windMonitorStation,loading } = this.props;
    const stationDataSummary = windMonitorStation.stationDataSummary || {};
    const stationProvinceSummary = stationDataSummary.stationProvinceSummary || [];
    const TabPane = Tabs.TabPane;
    const operations = ( // 状态筛选部分样式
      <div style={{ border: 'none' }}>
        <Switch onChange={this.onHandleAlarm} checked={checked} />告警
        <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ margin: "0 30px 0 15px" }}
          value={stationType}
        >
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="normal">通讯正常  {this.statisticStatusNum().normalNum}<span></span></Radio.Button>
          <Radio.Button value="dataInterruption">信息中断  {this.statisticStatusNum().dataInterruptionNum}  </Radio.Button>
          <Radio.Button value="unconnection">未接入  {this.statisticStatusNum().unconnectionNum}</Radio.Button>
        </Radio.Group>
      </div>
    );
    //省份汇总
    const province = (
      <div className={styles.provinceStationTotal}>
        {stationProvinceSummary.map((item, index) => {
          return (
            <div key={index} className={styles.provinceBox}>
              <span>{item.provinceName}</span>
              <span className={styles.fontColor}>{item.windStationNum}&nbsp;&nbsp;</span>
            </div>
          )
        })}
      </div>
    )

    return (
      <div className={styles.WindStation}>
        <WindStationHeader {...this.props} />
        <Tabs className={styles.containerTabs}
          activeKey={this.props.stationShowType}
          tabBarExtraContent={this.props.stationShowType !== 'stationMap' ? operations : province}
          onChange={this.setkey} animated={false}>
          <TabPane tab={<span> <i className="iconfont icon-grid"></i></span>} key="stationBlock" >
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              <WindStationItem {...this.props} stationDataList={this.statusDataList()} />}

          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table"></i></span>} key="stationList" >
            <WindStationList
              {...this.props}
              stationDataList={this.statusDataList()}
              currentPage={currentPage}
              pageSize={pageSize}
              onPaginationChange={this.onPaginationChange}
            />
          </TabPane>
          <TabPane tab={<span> <i className="iconfont icon-map"></i>  </span>} key="stationMap"  >
            <Map {...this.props} stationDataList={this.mapData()} testId="wind_bmap_station" />
          </TabPane>
        </Tabs>

      </div>
    )
  }
}
export default WindStation


