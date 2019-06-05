
import React from "react";
import PropTypes from "prop-types";
import styles from './pvStation.scss';
import Map from '../Map.jsx';
import PvStationHeader from './PvStationHeader.jsx';
import PvStationItem from './PvStationItem.jsx';
import { Tabs, Radio, Switch, Spin } from "antd";
import PvStationList from "./PvStationList";
import TransitionContainer from '../../../../Common/TransitionContainer';
import DetailCharts from './DetailCharts/DetailCharts';
import PvMapChart from './PvMapChart';
const RadioButton = Radio.Button;

class PvStation extends React.Component {
  static propTypes = {
    pvMonitorStation: PropTypes.object,
    stationShowType: PropTypes.string,
    changeMonitorStationStore: PropTypes.func,
    loading: PropTypes.bool,
    getPvRealData: PropTypes.func,
    getPvChartsData: PropTypes.func,
    monitorPvUnit: PropTypes.object,
    regionName: PropTypes.string,
    stations: PropTypes.array,
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
      detailVisible: false,
      areaChecked: false
    }
  }


  componentDidMount() {
    const { regionName } = this.props;
    this.props.getPvRealData({ regionName })
    this.props.getPvChartsData({ regionName })
  }

  componentDidUpdate() {

  }

  onHandleAlarm = (checked) => {
    this.setState({
      checked,
      currentPage: 1,
    })
  }

  onHandleArea = (checked) => { // 按区域分组显示
    this.setState({
      areaChecked: checked
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
    const statusList = stationStatusSummary.filter(e => e.stationStatus === +status)
    return statusList.length > 0 && statusList[0].stationNum || 0
  }

  statusDataList = () => { // 删选数据
    let { checked, stationType } = this.state;
    const { pvMonitorStation, } = this.props;
    const { stationDataList = [] } = pvMonitorStation;
    const newStationDataList = stationDataList.filter(e => { return !checked || (checked && e.alarmNum > 0) }).filter(e => {
      if (stationType === 'all') {
        return true
      } else {
        return e.stationStatus === +stationType
      }
    })
    return newStationDataList
  }

  pvStationChange = (e) => { // 改变光伏电站展示的状态
    this.setState({ pvStationShow: e, detailVisible: false })
  }

  detailShow = () => { // 查看详情
    this.setState({ detailVisible: true })
  }

  detailHide = (value) => { // 关闭详情
    this.setState(value)
  }

  render() {
    const { currentPage, pageSize, stationType, checked, pvStationShow, detailVisible, areaChecked } = this.state;
    const { pvMonitorStation, loading, monitorPvUnit } = this.props;
    const { stationDataSummary = {} } = pvMonitorStation;
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
            {pvStationShow === 'stationBlock' &&
              <React.Fragment>
                <Switch onChange={this.onHandleArea} checked={areaChecked} /> 按区域分组显示
              </React.Fragment>}
            <Switch onChange={this.onHandleAlarm} checked={checked} style={{ marginLeft: 12 }} /> 只看告警
              <Radio.Group
              defaultValue="all"
              buttonStyle="solid"
              onChange={this.onHandleStation}
              style={{ margin: '0 30px 0 15px' }}
              value={stationType}
            >
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="400">通讯正常  {this.getStatusNum('400')}</RadioButton>
              <RadioButton value="500">通讯中断  {this.getStatusNum('500')}</RadioButton>
              <RadioButton value="900">未接入  {this.getStatusNum('900')}</RadioButton>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.pvContainer}>
          <div className={styles.pvStationCont}>
            {pvStationShow === 'stationBlock' &&
              (loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
                <PvStationItem {...this.props} stationDataList={this.statusDataList()} areaChecked={areaChecked} />)
            }
            {pvStationShow === 'stationList' &&
              <PvStationList
                {...this.props}
                stationDataList={this.statusDataList()}
                currentPage={currentPage}
                pageSize={pageSize}
                monitorPvUnit={monitorPvUnit}
                onPaginationChange={this.onPaginationChange}
              />
            }
            {
              pvStationShow === 'stationBlock' &&
              <div onClick={this.detailShow} className={styles.detailShow}>
                <i className={`iconfont icon-go2 ${styles.show}`}></i>
                <span className={styles.detailShowfont}>查看电站概况</span>
              </div>
            }
            {pvStationShow === 'stationMap' &&
              <PvMapChart
                stationDataList={this.statusDataList()}
                history={history}
                monitorPvUnit={monitorPvUnit}
                stations={this.props.stations}
              />}
          </div>
          <TransitionContainer
            show={detailVisible}
            timeout={500}
            effect="side"
          >
            <DetailCharts
              stationDataSummary={stationDataSummary}
              detailChange={this.detailHide}
              {...this.props}
              detailVisible={detailVisible}
            />
          </TransitionContainer>
        </div>

      </div>
    )
  }
}
export default PvStation

