
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allstation.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/WindStation/WindStation.jsx';
import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx';
import Footer from '../../../../components/Common/Footer';

const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    getAllMonitorStation: PropTypes.func,
    getPvMonitorStation: PropTypes.func,
    getWindMonitorStation: PropTypes.func,
    loading: PropTypes.bool,
    allMonitorStation: PropTypes.object,
    stationTypes: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      key: '全部',
    }
  }
  componentDidMount() {
    this.props.getAllMonitorStation({ stationType: '2' })
    setTimeout(this.getNum, 10000)
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    console.log('unmout')
  }
  getNum = () => {
    if (this.props.stationTypes === 'all') {
      this.queryAllStationData();
    } else if (this.props.stationTypes === 'wind') {
      this.queryWindStationData();
    } else if (this.props.stationTypes === 'pv') {
      this.queryPvStationData();
    }
  }

  //获取数据
  queryAllStationData = () => {
    clearTimeout(this.timer)
    this.props.getAllMonitorStation({ stationType: '2' })
    const autoUpdata = () => {
      clearTimeout(this.timer)
      this.props.getAllMonitorStation({ stationType: '2' })
      this.timer = setTimeout(autoUpdata, 10000)
    };
    autoUpdata();
  }
  queryWindStationData = () => {
    clearTimeout(this.timer)
    this.props.getWindMonitorStation({ stationType: '0', stationTypes: this.props.stationTypes })
    const autoUpdata = () => {
      clearTimeout(this.timer)
      this.props.getWindMonitorStation({ stationType: '0', stationTypes: this.props.stationTypes })
      this.timer = setTimeout(autoUpdata, 10000)
    };
    autoUpdata();
  }
  queryPvStationData = () => {
    clearTimeout(this.timer)
    this.props.getPvMonitorStation({ stationType: '1', stationTypes: this.props.stationTypes })
    const autoUpdata = () => {
      clearTimeout(this.timer)
      this.props.getPvMonitorStation({ stationType: '1', stationTypes: this.props.stationTypes })
      this.timer = setTimeout(autoUpdata, 10000)
    };
    autoUpdata();
  }


  queryTargetData = (activeKey) => {
    this.setState({
      key: activeKey,
    })
    clearTimeout(this.timer)
    activeKey === '全部' ? this.queryAllStationData() : activeKey === '风电' ? this.queryWindStationData() : activeKey === '光伏' ? this.queryPvStationData() : alert('这个按钮没有考虑呢')
  }
  render() {
    let { key } = this.state;
    const { allMonitorStation, stationTypes } = this.props;
    const stationDataList = allMonitorStation.stationDataList || [];
    const windDataLength = stationDataList.filter((e, i) => { return e.stationType === "0" }).length;
    const pvDataLength = stationDataList.filter((e, i) => { return e.stationType === "1" }).length;

    return (
      <div className={styles.stationMonitor}>

        <div className={styles.stationContainer}>
          <div className={styles.cardContainer}>
            <Tabs type="card" activeKey={key} onChange={this.queryTargetData} tabBarGutter={0} >
              {stationTypes === 'all' ? <TabPane tab="全部" key="全部" >
                <Allstation {...this.props} />
              </TabPane> : ''}
              {windDataLength > 0 ? <TabPane tab="风电" key="风电">
                <WindStation {...this.props} />
              </TabPane> : ''}
              {pvDataLength > 0 ? <TabPane tab="光伏" key="光伏">
                <PvStation {...this.props} />
              </TabPane> : ''}
            </Tabs>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => ({
  ...state.monitor.stationMonitor.toJS()
})
const mapDispatchToProps = (dispatch) => ({
  getAllMonitorStation: payload => dispatch({ type: allStationAction.GET_ALL_MONITORSTATION_SAGA, payload }),
  getWindMonitorStation: payload => dispatch({ type: allStationAction.GET_WIND_MONITORSTATION_SAGA, payload }),
  getPvMonitorStation: payload => dispatch({ type: allStationAction.GET_PV_MONITORSTATION_SAGA, payload }),
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









