

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './listStyle.scss';
import { Switch, Spin  } from 'antd';
import { dataFormat } from '../../../../../../utils/utilFunc';

class IntegrateList extends Component {
  static propTypes = {
    collectorList: PropTypes.array,
    getCollectorLine: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    deviceTypeCode: PropTypes.number,
    loading: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      alarmSwitch: false,
      firstLoad : true,
    }
  }

  componentDidMount(){
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if( nextStation !== stationCode ){
      this.timeOutId && clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
  }

  componentWillUnmount(){
    this.timeOutId && clearTimeout(this.timeOutId);
  }

  onSwitchAlarm = (alarmSwitch) => {
    this.setState({ alarmSwitch });
  }

  getData = stationCode => {
    const { firstLoad } = this.state;
    this.props.getCollectorLine({ stationCode, firstLoad });
    this.timeOutId = setTimeout(()=>{
      if(firstLoad){
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }

  getIntegrateDetail = deviceCode => {
    const baseLinkPath = "/hidden/monitorDevice";
    const { deviceTypeCode, match } = this.props;
    const { stationCode } = match.params;
    // this.props.history.push(`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`)
    console.log(`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`);
  }
  
  render() {
    const { collectorList, deviceTypeCode, loading } = this.props;
    return (
      <div className={styles.integrateList}>
        <div className={styles.top}>
          <span className={styles.iconGrid}>
            <i className="iconfont icon-grid" ></i>
          </span>
          <span className={styles.warning}>
            <Switch defaultChecked={false} onChange={this.onSwitchAlarm}  /> 
            <span>告警</span>
          </span>
        </div>
        {loading ? <Spin  size="large" style={{height: '100px',margin: '200px auto',width: '100%'}} /> 
        : <div className={styles.deviceList}>
          {collectorList.length > 0 ? collectorList.map(e => {
            const pData = dataFormat(e.griW, '--', 2);
            const cosData = dataFormat(e.griPF, '--', 2);
            const qData = dataFormat(e.griVar, '--', 2);
            const uabData = dataFormat(e.griPPhVUab, '--', 2);
            return (
              <section className={styles.eachIntegrate} key={e.deviceCode} onClick={() => this.getIntegrateDetail(e.deviceCode)}>
                <h3 className={styles.deviceName}>
                  <span className="iconfont icon-jidian" />
                  {e.warningStatus && <span className="iconfont icon-alarm" />}
                  <span>{e.deviceName}</span>
                </h3>
                <div className={styles.deviceValue}>
                  <span className={styles.eachValue}>P : {pData}MW</span>
                  <span className={styles.eachValue}>Cos : {cosData}</span>
                  <span className={styles.eachValue}>Q : {qData}MVar</span>
                  <span className={styles.eachValue}>Uab : {uabData}kV</span>
                </div>
              </section>
            )
          }) : <img src="/img/nodata.png" className={styles.emptyData} />}
        </div>}
      </div>
    )
  }
}

export default IntegrateList;
