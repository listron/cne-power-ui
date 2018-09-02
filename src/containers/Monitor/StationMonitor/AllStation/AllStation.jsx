
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
    this.queryAllStationData();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.stationTypes !== this.props.stationTypes && nextProps.stationTypes !== 'all') {
      this.autoUpdate(nextProps.stationTypes);
    }
    if(nextProps.stationTypes === 'wind') {
      this.setState({
        key: '风电'
      });
    } else if(nextProps.stationTypes === 'pv') {
      this.setState({
        key: '光伏'
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.allInterval);
    clearInterval(this.windInterval);
    clearInterval(this.pvInterval);
  }

  autoUpdate = (stationTypes) => {
    if (stationTypes === 'wind') {//只有风
      this.queryWindStationData();
    } else if (stationTypes === 'pv') {//只有光
      this.queryPvStationData();
    }
  }

  //获取数据
  queryAllStationData = () => {
    clearInterval(this.windInterval);
    clearInterval(this.pvInterval);
    this.props.getAllMonitorStation({ stationType: '2' });
    this.allInterval = setInterval(()=>this.props.getAllMonitorStation({ stationType: '2' }), 10000);
  }

  queryWindStationData = () => {
    clearInterval(this.allInterval);
    clearInterval(this.pvInterval);
    this.props.getWindMonitorStation({ stationType: '0' });
    this.windInterval = setInterval(()=>this.props.getWindMonitorStation({ stationType: '0' }), 10000);
  }
  queryPvStationData = () => {
    clearInterval(this.allInterval);
    clearInterval(this.windInterval);
    this.props.getPvMonitorStation({ stationType: '1' });
    this.pvInterval = setInterval(()=>this.props.getPvMonitorStation({ stationType: '1' }), 10000);
  }


  queryTargetData = (activeKey) => {
    this.setState({
      key: activeKey,
    });
    if(activeKey === '全部') {
      this.queryAllStationData();
    } else if(activeKey === '风电') {
      this.queryWindStationData();
    } else if(activeKey === '光伏') {
      this.queryPvStationData();
    }
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









