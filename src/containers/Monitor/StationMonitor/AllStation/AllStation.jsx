
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './allstation.scss';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { allStationAction } from './allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
import WindStation from '../../../../components/Monitor/StationMonitor/AllStation/NewWindStation/WindStation.jsx';
import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/NewPvStation/PvStation.jsx';
import Footer from '../../../../components/Common/Footer';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Cookie from 'js-cookie';
class AllStation extends Component {
  static propTypes = {
    changeMonitorStationStore: PropTypes.func,
    stopRealMonitorData: PropTypes.func,
    getRealMonitorData: PropTypes.func,
    stationTypeCount: PropTypes.string,
    stationType: PropTypes.string,
    stopRealCharstData: PropTypes.func,
    changeMonitorstationStore: PropTypes.func,
    stations: PropTypes.array,
    regionName: PropTypes.string,
    getPvRealData: PropTypes.func,
    getPvChartsData: PropTypes.func,
    getPvRealChartsData: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showRegion: false,
    };
  }

  componentWillUnmount() {
    this.props.changeMonitorStationStore({
      stationShowType: 'stationBlock',
    });
    this.props.stopRealMonitorData();
    this.props.stopRealCharstData();
    this.props.stopRealCharstData('power');
  }

  queryTargetData = (activeKey) => { //切换电站
    const { changeMonitorStationStore, stopRealMonitorData, getRealMonitorData } = this.props;
    changeMonitorStationStore({ stationShowType: 'stationBlock', stationType: activeKey });
    stopRealMonitorData();
  }

  showRegionSelect = () => {
    this.setState({ showRegion: true });
  }

  hideRegionSelect = () => {
    this.setState({ showRegion: false });
  }

  regionChange = (value) => {
    let curName = '';
    if (!value) {
      curName = '全部区域';
    } else {
      curName = value;
    }
    this.props.changeMonitorStationStore({ regionName: curName });
    this.setState({ showRegion: false });
    this.props.stopRealMonitorData();
    this.props.getPvRealData({ regionName: curName });
    this.props.getPvChartsData({ regionName: curName });
    this.props.getPvRealChartsData({ regionName: curName });
  }


  render() {
    const { stationTypeCount, stationType, stations, regionName, theme } = this.props;
    const regionArr = Array.from(new Set(stations.filter(e => e.stationType === 1).map(e => e.regionName)));
    const { showRegion } = this.state;
    return (
      <div className={`${styles.stationMonitor} ${styles[theme]}`}>
        <CommonBreadcrumb breadData={[{ name: '电站监控' }]} theme={theme} style={{ paddingLeft: '38px' }} />
        <div className={styles.stationContainer}>
          {stationTypeCount === 'multiple' &&
            <div className={styles.allStationTitle}>
              <p className={`${stationType === '2' && styles.activeStation} `} onClick={() => { this.queryTargetData('2'); }}>全部</p>
              <p className={`${stationType === '0' && styles.activeStation} `} onClick={() => { this.queryTargetData('0'); }}>风电</p>
              <p className={`${stationType === '1' && styles.activeStation} `} onClick={() => { this.queryTargetData('1'); }}>光伏</p>
            </div>
          }
          {(stationType === '1' || stationTypeCount === 'pv') &&
            <div className={styles.allArea} onClick={this.showRegionSelect}>
              {regionName} <i className={'iconfont icon-content'}></i>
            </div>}
          {stationTypeCount === 'multiple' && stationType === '2' && <Allstation {...this.props} />}
          {stationTypeCount === 'multiple' && stationType === '0' && <WindStation {...this.props} />}
          {stationTypeCount === 'multiple' && stationType === '1' && <PvStation {...this.props} />}
          {stationTypeCount === 'wind' && <WindStation {...this.props} />}
          {stationTypeCount === 'pv' && <PvStation {...this.props} />}
          {stationTypeCount === 'none' && <div className={styles.noData}> </div>}
          {
            showRegion &&
            <div className={styles.regionSelect}>
              <div className={styles.regionSelectTop}>
                {'全部区域'} <i className={'iconfont icon-content'}></i>
              </div>
              <div className={styles.regionSelectCont}>
                <div onClick={() => { this.regionChange(''); }} className={`${styles.normal} ${regionName === '全部区域' && styles.active} `}> {'全部区域'}</div>
                {regionArr.map(e => {
                  return (<div
                    onClick={() => { this.regionChange(e); }}
                    key={e}
                    className={`${styles.normal} ${e === regionName && styles.active} `}> {e}</div>);
                })}
              </div>

            </div>
          }
        </div>
        <Footer theme={this.props.theme} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.monitor.stationMonitor.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
    stationTypeCount: state.common.get('stationTypeCount'),
    monitorPvUnit: state.common.toJS().monitorPvUnit,
  });
};

const mapDispatchToProps = (dispatch) => ({
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.changeMonitorstationStore, payload }),
  resetMonitorData: payload => dispatch({ type: allStationAction.resetMonitorData, payload }),
  getRealMonitorData: payload => dispatch({ type: allStationAction.getRealMonitorData, payload }),
  stopRealMonitorData: payload => dispatch({ type: allStationAction.stopRealMonitorData, payload }),
  getRealChartsData: payload => dispatch({ type: allStationAction.getRealChartsData, payload }),
  stopRealCharstData: payload => dispatch({ type: allStationAction.stopRealCharstData, payload }),
  getRealMonitorPower: payload => dispatch({ type: allStationAction.getRealMonitorPower, payload }),
  getPvChartsData: payload => dispatch({ type: allStationAction.getPvChartsData, payload }),
  getPvRealData: payload => dispatch({ type: allStationAction.getPvRealData, payload }),
  getPvCapabilitydiagrams: payload => dispatch({ type: allStationAction.getPvCapabilitydiagrams, payload }),
  getPvRealChartsData: payload => dispatch({ type: allStationAction.getPvRealChartsData, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AllStation);









