
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allstation.scss";
import PropTypes from "prop-types";
import { Tabs } from 'antd';
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/WindStation/WindStation.jsx';
import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx';
//import TransitionContainer from '../../../../components/Common/TransitionContainer';

const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    getAllMonitorStation: PropTypes.func,
    getPvMonitorStation: PropTypes.func,
    getWindMonitorStation: PropTypes.func,
    loading: PropTypes.bool,
    allMonitorStation: PropTypes.object,
  }
  constructor(props) {
    super(props);
    //this.props.getAllMonitorStation({stationType:'2'})
    this.state = {
      key: '全部',
    }
  }
  componentDidMount() {  
    const autoUpdata = () => {
      clearTimeout(this.timer)
      this.props.getAllMonitorStation({ stationType: '2' })
      this.timer = setTimeout(autoUpdata, 100000)
    };
    autoUpdata();

  }


  queryTargetData = (activeKey) => {
    this.setState({
      key: activeKey,
    })
    const autoRefresh = () => {
      clearTimeout(this.timer)
      clearTimeout(this.autoTimer)
      activeKey === '全部' ? this.props.getAllMonitorStation({ stationType: '2' }) : activeKey === '风电' ? this.props.getWindMonitorStation({ stationType: '0' }) : activeKey === '光伏' ? this.props.getPvMonitorStation({ stationType: '1' }) : alert('这个按钮没有考虑呢')
      this.autoTimer = setTimeout(autoRefresh, 100000)
    }
    autoRefresh();
  }


  render() {
    //console.log(new Date());
    let { key } = this.state;
    //const { loading } = this.props;
    const { allMonitorStation } = this.props;
    const stationDataList = allMonitorStation.stationDataList || [];
    // console.log(stationDataList);
    const windDataLength = stationDataList.filter((e, i) => { return e.stationType === 0 }).length;
    const pvDataLength = stationDataList.filter((e, i) => { return e.stationType === 1 }).length;
    //  console.log(windDataLength);
    //  console.log(pvDataLength);

    return (
      <div className={styles.stationMonitor}>
        <div className={styles.stationContainer}>
          <div className="card-container">
            <Tabs type="card" activeKey={key} onChange={this.queryTargetData} >
              <TabPane tab="全部" key="全部" >
                <Allstation {...this.props} />
              </TabPane>
              {windDataLength > 0 ? <TabPane tab="风电" key="风电">
                <WindStation {...this.props} />
              </TabPane> : ''}

              {pvDataLength > 0 ? <TabPane tab="光伏" key="光伏">
                <PvStation {...this.props} />
              </TabPane> : ''}
            </Tabs>
          </div>
        </div>
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









