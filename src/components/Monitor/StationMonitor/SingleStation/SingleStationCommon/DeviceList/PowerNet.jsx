

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './listStyle.scss';
import { Switch, Spin  } from 'antd';
import { dataFormat } from '../../../../../../utils/utilFunc';

class PowerNet extends Component {
  static propTypes = {
    powerNetList: PropTypes.array,
    getPowerNet: PropTypes.func,
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
    this.props.getPowerNet({ stationCode, firstLoad });
    this.timeOutId = setTimeout(()=>{
      if(firstLoad){
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }
  
  render() {
    const { powerNetList, loading } = this.props;
    const { alarmSwitch } = this.state;
    const filteredPowerNet = powerNetList.filter(e => !alarmSwitch || e.warningStatus);
    return (
      <div className={styles.powerNet}>
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
          {filteredPowerNet.length > 0 ? filteredPowerNet.map(e => {
            const netInfoArr = [
              { name: '正向有功 ( kWh )', value: dataFormat(e.forwardActivePower, '--', 2) },
              { name: '反向有功 ( kWh )', value: dataFormat(e.backwardActivePower, '--', 2) },
              { name: '正向无功 ( kWh )', value: dataFormat(e.forwardReactivePower, '--', 2) },
              { name: '反向无功 ( kWh )', value: dataFormat(e.backwardReactivePower, '--', 2) },
            ]
            return (
              <section className={styles.eachDevice} key={e.deviceCode}>
                <h3 className={styles.deviceName}>
                  <span>{e.deviceName}</span>
                  {e.warningStatus && <span className="iconfont icon-alarm" />}
                </h3>
                <div className={styles.deviceValue}>
                  {netInfoArr.map(e => (<span key={e.name} className={styles.eachValue}>
                    <span>{e.name}</span>
                    <span>{e.value}</span>
                  </span>))}
                </div>
              </section>
            )
          }) : <img src="/img/nodata.png" className={styles.emptyData} />}
        </div>}
      </div>
    )
  }
}

export default PowerNet;
