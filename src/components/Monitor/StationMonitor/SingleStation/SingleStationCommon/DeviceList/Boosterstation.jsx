

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './listStyle.scss';
import { Link } from 'react-router-dom';
import { Switch, Spin  } from 'antd';
import { dataFormat } from '../../../../../../utils/utilFunc';

class Boosterstation extends Component {
  static propTypes = {
    boosterList: PropTypes.array,
    getBoosterstation: PropTypes.func,
    match: PropTypes.object,
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
    this.props.getBoosterstation({ stationCode, firstLoad });
    this.timeOutId = setTimeout(()=>{
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }
  
  render() {
    const baseLinkPath = "/hidden/monitorDevice";
    const { boosterList, deviceTypeCode, loading } = this.props;
    return (
      <div className={styles.boosterStation}>
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
          {boosterList.length > 0 ? boosterList.map(e => {
            const totalDevice = dataFormat(e.total, '--', 2);
            const boosterDetailPath = `${baseLinkPath}/${deviceTypeCode}/${e.deviceTypeCode}`
            return (
              <Link className={styles.eachDevice} to={boosterDetailPath} key={e.deviceCode}>
                <span className={styles.deviceName}>
                  {e.deviceTypeName || '--'} ( {totalDevice} ) 
                </span>
                {e.warningStatus && <span className="iconfont icon-alarm" />}
              </Link>
            )
          }) : <img src="/img/nodata.png" className={styles.emptyData} />}
        </div>}
      </div>
    )
  }
}

export default Boosterstation;
