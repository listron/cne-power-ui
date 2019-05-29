

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Link } from 'react-router-dom';
import { Switch, Spin } from 'antd';
import { dataFormat } from '../../../../../../utils/utilFunc';

class Boosterstation extends Component {
  static propTypes = {
    boosterList: PropTypes.array,
    getBoosterstation: PropTypes.func,
    match: PropTypes.object,
    deviceTypeCode: PropTypes.string,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      alarmSwitch: false,
      firstLoad: true,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if (nextStation !== stationCode) {
      this.timeOutId && clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
  }

  componentWillUnmount() {
    this.timeOutId && clearTimeout(this.timeOutId);
  }

  onSwitchAlarm = (alarmSwitch) => {
    this.setState({ alarmSwitch });
  }

  getData = stationCode => {
    const { firstLoad } = this.state;
    this.props.getBoosterstation({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }

  render() {
    const baseLinkPath = "/hidden/monitorDevice";
    const { deviceTypeCode, loading, match } = this.props;
    const boosterList = [
      {
        "deviceTypeCode": "302M301",
        "deviceTypeName": "升压站",
        "total": 1,
        "warningStatus": true
      },
      {
        "deviceTypeCode": "302M306",
        "deviceTypeName": "站用变",
        "total": 1,
        "warningStatus": true
      },
      {
        "deviceTypeCode": "302M307",
        "deviceTypeName": "主进线",
        "total": 1,
        "warningStatus": false
      },
      {
        "deviceTypeCode": "302M504",
        "deviceTypeName": "SVG",
        "total": 1,
        "warningStatus": false
      },
      {
        "deviceTypeCode": "302M507",
        "deviceTypeName": "站内母线",
        "total": 1,
        "warningStatus": false
      }
    ]
    const { stationCode } = match.params;
    const { alarmSwitch } = this.state;
    const filteredBooster = boosterList.filter(e => !alarmSwitch || e.warningStatus)
    return (
      <div className={styles.pvboosterStation}>
        <div className={styles.top}>
          <span className={styles.iconGrid}>
            <i className="iconfont icon-grid" ></i>
          </span>
          <span className={styles.warning}>
            <Switch defaultChecked={false} onChange={this.onSwitchAlarm} />
            <span>只看告警</span>
          </span>
        </div>
        {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} />
          : <div className={styles.deviceList}>
            {filteredBooster.length > 0 ? filteredBooster.map(e => {
              const totalDevice = dataFormat(e.total, '--', 2);
              const boosterDetailPath = `${baseLinkPath}/${stationCode}/${deviceTypeCode}/${e.deviceTypeCode}`;
              return (
                <Link
                  className={`${styles.eachDevice} ${e.warningStatus && styles.alarm}`}
                  to={boosterDetailPath}
                  key={e.deviceTypeCode}>
                  <div className={styles.deviceName}>
                    <span> {e.deviceTypeName || '--'} ( {totalDevice} )</span>
                    {e.warningStatus && <span className="iconfont icon-alarm" />}
                  </div>
                  <div className={styles.deviceValue}>
                    <span className={styles.eachValue}>P : {dataFormat(e.griW, '--', 2)} MW</span>
                    <span className={styles.eachValue}>Cos : {dataFormat(e.griPF, '--', 2)}</span>
                    <span className={styles.eachValue}>Q : {dataFormat(e.griVar, '--', 2)} MVar</span>
                    <span className={styles.eachValue}>Uab : {dataFormat(e.griPPhVUab, '--', 2)} kV</span>
                  </div>
                </Link>
              )
            }) : <img src="/img/nodata.png" className={styles.emptyData} />}
          </div>}
      </div>
    )
  }
}

export default Boosterstation;
