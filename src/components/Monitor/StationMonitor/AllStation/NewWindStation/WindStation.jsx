import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Tabs, Radio, Switch, Spin } from "antd";
import moment from 'moment';
import PropTypes from "prop-types";
import styles from './windStation.scss';
import WindStationHeader from './WindStationHeader.jsx';
import WindStationItem from './WindStationItem.jsx';
import WindStationList from './WindStationList.jsx';
import { MapChart } from './MapChart.jsx';
import { OutputChart } from '../../WindCommon/OutputChart';
import { PowerDiagram } from '../../WindCommon/PowerDiagram';
import { SpeedScatter } from '../../WindCommon/SpeedScatter';
import { dataFormats } from '../../../../../utils/utilFunc';
const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button

class WindStation extends React.Component {
  static propTypes = {
    windMonitorStation: PropTypes.object,
    stationShowType: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    getRealMonitorData: PropTypes.func,
    loading: PropTypes.bool,
    getRealChartsData: PropTypes.func,
    getRealMonitorPower: PropTypes.func,
    stopRealCharstData: PropTypes.func,
    capabilityData: PropTypes.array,
    powerData: PropTypes.array,
    history: PropTypes.object,
    scatterData: PropTypes.object,
    scatterTime: PropTypes.number,
    capabilityDataTime: PropTypes.number,
    powerTime: PropTypes.number,
    capabilityLoading: PropTypes.bool,
    powerLoading: PropTypes.bool,
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
    const { getRealMonitorData, getRealChartsData, getRealMonitorPower } = this.props;
    getRealMonitorData({ stationType: '0' });
    const startTime = moment().subtract(24, 'hours').utc().format();
    const endTime = moment().utc().format();
    getRealChartsData({ capability: { startTime, endTime } })
    getRealMonitorPower({
      intervalTime: 0,
      startTime: moment().subtract(6, 'day').format('YYYY-MM-DD'),// 默认是6天前;
      endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
    })
  }

  componentWillUnmount() {
    const { stopRealCharstData } = this.props;
    stopRealCharstData();
    stopRealCharstData('power');
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


  powerDiagramChange = (value) => {
    const { stopRealCharstData, getRealMonitorPower } = this.props;
    const { intervalTime } = value;
    let startTime = moment().subtract(6, 'day').format('YYYY-MM-DD')// 默认是6天前;
    if (intervalTime === 1) {
      startTime = moment().subtract(5, 'month').format('YYYY-MM-DD')
    } else if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').format('YYYY-MM-DD')
    }
    let endTime = moment().subtract(1, 'day').format('YYYY-MM-DD');
    this.props.changeMonitorStationStore({ powerData: [] })
    stopRealCharstData('power');
    getRealMonitorPower({ intervalTime, startTime, endTime })
  }


  render() {
    const { currentPage, pageSize, checked, stationType } = this.state;
    const { windMonitorStation, loading, stationShowType, capabilityData, powerData, getRealMonitorPower, history, stopRealCharstData, scatterData } = this.props;
    const { capabilityDataTime, scatterTime, powerTime, capabilityLoading } = this.props;
    const { stationDataSummary = {}, stationDataList = {} } = windMonitorStation;
    const deviceStatus = [
      { name: '运行', value: 'normalNum' },
      { name: '待机', value: 'standbyNum' },
      { name: '停机', value: 'shutdownNum' },
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
          <RadioButton value="500">通讯中断  {this.getStatusNum(500)}</RadioButton>
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
              <MapChart stationDataList={this.statusDataList()} history={history} />
            </TabPane>
          </Tabs>
          {stationShowType !== 'stationList' &&
            <div className={styles.windStationChart}>
              <div className={styles.tags}>
                <Link to={{ pathname: `/monitor/alarm/realtime`, state: { stationType: '0' } }}> 查看告警 {dataFormats(stationDataSummary.alarmNum, '--')} </Link>
                <Link to={`javascript:void(0)`} className={styles.noLink}> 统计分析  </Link>
                <Link to={`/monitor/report/powerReport`} > 报表查询  </Link>
              </div>
              <div className={styles.deviceStatus}>
                <div className={styles.deviceStaTitle}> <span>设备状态</span> {/* <i className="iconfont icon-more"></i>  */}
                </div>
                <div className={styles.deviceStaCont}>
                  {deviceStatus.map(e => {
                    return <span key={e.value}>{e.name} {dataFormats(stationDataSummary[e.value], '--')}</span>
                  })}
                </div>
              </div>
              <div className={styles.chartsBox}>
                <OutputChart
                  capabilityData={capabilityData}
                  yAxisUnit={'MW'}
                  capabilityDataTime={capabilityDataTime}
                  loading={capabilityLoading}
                />
              </div>
              <div className={styles.chartsBox}>
                <PowerDiagram
                  powerData={powerData}
                  onChange={this.powerDiagramChange}
                  powerTime={powerTime}
                  loading={this.props.powerLoading} />
              </div>
              <div className={styles.chartsBox}>
                <SpeedScatter
                  scatterData={scatterData}
                  type={'allStation'}
                  scatterTime={scatterTime}
                  loading={this.props.scatterLoading || false}
                />
              </div>
            </div>}
        </div>
      </div>
    )
  }
}


export default WindStation


