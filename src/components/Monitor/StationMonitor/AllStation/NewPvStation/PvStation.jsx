
import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import Map from '../Map.jsx';
import PvStationHeader from './PvStationHeader.jsx';
import PvStationItem from './PvStationItem.jsx';
import { Tabs, Radio, Switch, Spin } from "antd";
import PvStationList from "./PvStationList";
const RadioButton = Radio.Button

class PvStation extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    stationShowType: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    loading: PropTypes.bool,
    getRealMonitorData: PropTypes.func,
  }
  constructor(props, context) {

    super(props, context);
    this.TabPane = Tabs.TabPane;
    this.state = {
      checked: false,
      stationType: 'all',
      currentPage: 1,
      pageSize: 10,
      pvStationShow: 'stationBlock',
    }
  }


  componentDidMount() {
    this.props.getRealMonitorData({ stationType: '1' })
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

  getStatusNum = (status) => { // 获取状态的数量
    const { stationDataSummary = {} } = this.props.pvMonitorStation;
    const { stationStatusSummary = [] } = stationDataSummary;
    const statusList = stationStatusSummary.filter(e => e.stationStatus === status)
    return statusList.length > 0 && statusList[0].stationNum || 0
  }

  statusDataList = () => { // 删选数据
    let { checked, stationType } = this.state;
    const { pvMonitorStation, } = this.props;
    const stationDataList = pvMonitorStation.stationDataList || [];
    const newStationDataList = stationDataList.filter(e => { return !checked || (checked && e.alarmNum > 0) }).filter(e => {
      const stationStatus = e.stationStatus || {};
      if (stationType === 'all') {
        return true
      } else { return stationStatus.stationStatus === `${stationType}` }
    })
    return newStationDataList
  }

  pvStationChange = (e) => { // 改变光伏电站展示的状态
    this.setState({ pvStationShow: e })
  }

  render() {
    const { currentPage, pageSize, stationType, checked, pvStationShow } = this.state;
    const { pvMonitorStation, loading } = this.props;
    return (
      <div className={styles.pvStation}>
        <PvStationHeader {...this.props} />
        <div className={styles.StationTitle} >
          <div className={styles.tabs}>
            <i className={`${"iconfont icon-grid iconTab"} ${pvStationShow === 'stationBlock' && styles.activeCard}`}
              onClick={() => { this.pvStationChange('stationBlock') }}> </i>
            <i className={`${"iconfont icon-table iconTab"} ${pvStationShow === 'stationList' && styles.activeCard}`} onClick={() => { this.pvStationChange('stationList') }}></i>
            <i className={`${"iconfont icon-map iconTab"} ${pvStationShow === 'stationMap' && styles.activeCard}`} onClick={() => { this.pvStationChange('stationMap') }}></i>
          </div>
          <div>
              <Switch onChange={this.onHandleAlarm} checked={checked} /> 只看告警
              <Radio.Group
                defaultValue="all"
                buttonStyle="solid"
                onChange={this.onHandleStation}
                style={{ margin: '0 30px 0 15px' }}
                value={stationType}
              >
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="400">通讯正常  {this.getStatusNum(400)}</RadioButton>
                <RadioButton value="500">通讯中断  {this.getStatusNum(500)}</RadioButton>
                <RadioButton value="900">未接入  {this.getStatusNum(900)}</RadioButton>
              </Radio.Group>
            </div>
        </div>
        <div className={styles.pvStationCont}>
          {pvStationShow === 'stationBlock' &&
            (loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              <PvStationItem {...this.props} stationDataList={this.statusDataList()} />)
          }
          {pvStationShow === 'stationList' &&
            <PvStationList
              {...this.props}
              currentPage={currentPage}
              pageSize={pageSize}
              onPaginationChange={this.onPaginationChange}
              stationDataList={this.statusDataList()}
            />
          }
        </div>
      </div>
    )
  }
}
export default PvStation

