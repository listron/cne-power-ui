import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import styles from './windStation.scss';
// import Map from '../Map.jsx';
import WindStationHeader from './WindStationHeader.jsx';
import WindStationItem from './WindStationItem.jsx';
import WindStationList from './WindStationList.jsx';
import { Tabs, Radio, Switch, Spin } from "antd";
import { MapChart } from './MapChart.jsx';
import OutputTenMin from '../../SingleStation/SingleStationCommon/OutputTenMin';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button

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

  componentWillMount() {
    this.props.getRealtimeData({ stationType: '0' })
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
    this.setState({ currentPage: 1, })
  }


  getStatusNum = (status) => { // 获取状态的数量
    const { stationDataSummary = {} } = this.props.windMonitorStation;
    const { stationStatusSummary = [] } = stationDataSummary;
    const statusList = stationStatusSummary.filter(e => e.stationStatus === status)
    return statusList.length > 0 && statusList[0].stationNum || 0
  }

  statusDataList = () => { // 删选数据
    let { checked, stationType } = this.state;
    const { windMonitorStation, } = this.props;
    const stationDataList = windMonitorStation.stationDataList || [];
    const newStationDataList = stationDataList.filter(e => { return !checked || (checked && e.alarmNum > 0) }).filter(e => {
      const stationStatus = e.stationStatus || {};
      if (stationType === 'all') {
        return true
      } else { return stationStatus.stationStatus === `${stationType}` }
    })
    return newStationDataList
  }

  render() {
    const { currentPage, pageSize, checked, stationType } = this.state;
    const { windMonitorStation, loading, stationShowType } = this.props;
    const { stationDataSummary = {}, stationDataList = {} } = windMonitorStation;
    const alarmNum = stationDataSummary.alarmNum || '--';
    const deviceStatus = [
      { name: '运行', value: 'normalNum' },
      { name: '待机', value: 'standbyNum' },
      { name: '停机', value: 'standbyNums' },
      { name: '维护', value: 'maintainNum' },
      { name: '故障', value: 'errorNum' },
      { name: '通讯中断', value: 'interruptNum' },
    ]
    const operations = ( // 状态筛选部分样式
      <div style={{ border: 'none' }}>
        <Switch onChange={this.onHandleAlarm} checked={checked} />  只看告警
        <Radio.Group
          defaultValue="all"
          buttonStyle="solid"
          onChange={this.onHandleStation}
          style={{ margin: "0 30px 0 15px" }}
          value={stationType}
        >
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="400">通讯正常  {this.getStatusNum(400)}</RadioButton>
          <RadioButton value="500">信息中断  {this.getStatusNum(500)}</RadioButton>
          <RadioButton value="900">未接入  {this.getStatusNum(900)}</RadioButton>
        </Radio.Group>
      </div>
    );

    return (
      <div className={styles.WindStation}>
        <WindStationHeader windMonitorStation={windMonitorStation} />
        <div className={styles.windContainer}>
          <Tabs
            className={styles.containerTabs}
            activeKey={stationShowType}
            tabBarExtraContent={operations}
            onChange={this.setkey}
            animated={false}>
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
              <MapChart stationDataList={this.statusDataList()} />
              {/* <MapChart {...this.props} stationDataList={this.mapData()} testId="wind_bmap_station" /> */}
            </TabPane>
          </Tabs>
          {stationShowType !== 'stationList' &&
            <div className={styles.windStationChart}>
              <div className={styles.tags}>
                <Link to={`javascript:void(0)`}> 查看告警 {alarmNum} </Link>
                <Link to={`javascript:void(0)`}> 统计分析  </Link>
                <Link to={`javascript:void(0)`}> 报表查询  </Link>
              </div>
              <div className={styles.deviceStatus}>
                <div className={styles.deviceStaTitle}> <span>设备状态</span> <i className="iconfont icon-more"></i> </div>
                <div className={styles.deviceStaCont}>
                  {deviceStatus.map(e => {
                    return <span key={e.value}>{e.name} {stationDataList[e.value] || '--'}</span>
                  })}
                </div>
                <div>
                  <OutputTenMin {...this.props} yXaisName={'风速(m/s)'} chartType={'wind'} yAxisUnit={'MW'} />
                </div>
              </div>
            </div>}
        </div>
      </div>
    )
  }
}


export default WindStation


