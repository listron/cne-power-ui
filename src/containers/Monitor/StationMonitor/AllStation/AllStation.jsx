
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
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';


const TabPane = Tabs.TabPane;
class AllStation extends Component {
  static propTypes = {
    getMonitorStation: PropTypes.func,
    loading: PropTypes.bool,
    allMonitorStation: PropTypes.object,
    windMonitorStation: PropTypes.object,
    pvMonitorStation: PropTypes.object,
    stationTypes: PropTypes.string,
    stationTypeTabs:PropTypes.string,
    changeMonitorStationStore: PropTypes.func
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getMonitorStation({ stationType: '2', getStationTypes: true });
    this.stationInterval = setInterval(()=>this.props.getMonitorStation({ stationType: '2' }), 10000);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.stationTypes !== this.props.stationTypes && nextProps.stationTypes !== '2') {
      this.autoUpdate(nextProps.stationTypes);
    }
  }

  componentWillUnmount() {
    clearInterval(this.stationInterval);
    //this.props.getMonitorStation({stationType:0})
    this.props.changeMonitorStationStore({
      stationTypes: null,
      stationShowType:'stationBlock',
      pvMonitorStation:{},
      windMonitorStation:{},
    });
  }

  autoUpdate = (stationTypes) => {
    this.queryStationData(stationTypes);
  }
  queryStationData = (stationType) => {
    clearInterval(this.stationInterval);
    this.props.getMonitorStation({ stationType:stationType });
    this.stationInterval = setInterval(()=>this.props.getMonitorStation({ stationType:stationType }), 10000);
  }
  queryTargetData = (activeKey) => {
    this.props.changeMonitorStationStore({stationTypeTabs:activeKey,stationShowType:'stationBlock'});
    this.queryStationData(activeKey);
  }
  render() {
    const { stationTypes } = this.props;
    const breadCrumbData = {
      breadData:[
      //   {
      //   link: true,
      //   name: deviceDetail.stationName || '',
      //   path: `/monitor/singleStation/${stationCode}`,
      // },
      {
        name: '电站监控',
      }
    ],
      //iconName: 'iconfont icon-weather'
    };
    return (
      <div className={styles.stationMonitor}>
      <CommonBreadcrumb  {...breadCrumbData} style={{marginLeft: '38px'}} />
        <div className={styles.stationContainer}>         
        {stationTypes === '2' ?
          <Tabs type="card" activeKey={this.props.stationTypeTabs} onChange={this.queryTargetData} tabBarGutter={0} >
            <TabPane tab="全部" key="2" ><Allstation {...this.props} /></TabPane>
            <TabPane tab="风电" key="0"><WindStation {...this.props} /></TabPane>
            <TabPane tab="光伏" key="1"><PvStation {...this.props} /></TabPane>
          </Tabs>:  
          (stationTypes === '0'? <WindStation {...this.props} /> : <PvStation {...this.props} />)
        }        
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
  getMonitorStation: payload => dispatch({ type: allStationAction.GET_MONITORSTATION_SAGA, payload }),
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, payload }),
})
export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









