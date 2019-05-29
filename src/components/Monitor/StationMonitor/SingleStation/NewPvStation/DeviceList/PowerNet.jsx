

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Switch, Spin } from 'antd';
import { dataFormat } from '../../../../../../utils/utilFunc';

class PowerNet extends Component {
  static propTypes = {
    powerNetList: PropTypes.array,
    getPowerNet: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
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
    this.props.getPowerNet({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }

  render() {
    const { loading } = this.props;
    // console.log('powerNetList',powerNetList)
    let powerNetList = [
      {
        "backwardActivePower": 5.6,
        "backwardReactivePower": 3.4,
        "deviceCode": "302M505M2M2",
        "deviceId": null,
        "deviceName": "协水线副表",
        "deviceTypeCode": 505,
        "deviceTypeName": "电能采集",
        "forwardActivePower": 78,
        "forwardReactivePower": null,
        "warningStatus": true
      },
      {
        "backwardActivePower": null,
        "backwardReactivePower": null,
        "deviceCode": "302M505M2M3",
        "deviceId": null,
        "deviceName": "集电线3511电度表",
        "deviceTypeCode": 505,
        "deviceTypeName": "电能采集",
        "forwardActivePower": 123.435,
        "forwardReactivePower": null,
        "warningStatus": false
      },
      {
        "backwardActivePower": null,
        "backwardReactivePower": null,
        "deviceCode": "302M505M2M4",
        "deviceId": null,
        "deviceName": "站用变3551电度表",
        "deviceTypeCode": 505,
        "deviceTypeName": "电能采集",
        "forwardActivePower": null,
        "forwardReactivePower": null,
        "warningStatus": false
      },
      {
        "backwardActivePower": null,
        "backwardReactivePower": null,
        "deviceCode": "302M505M2M5",
        "deviceId": null,
        "deviceName": "SVG3561电度表",
        "deviceTypeCode": 505,
        "deviceTypeName": "电能采集",
        "forwardActivePower": null,
        "forwardReactivePower": null,
        "warningStatus": false
      },
      {
        "backwardActivePower": null,
        "backwardReactivePower": null,
        "deviceCode": "302M505M7M1",
        "deviceId": null,
        "deviceName": "协水线主表",
        "deviceTypeCode": 505,
        "deviceTypeName": "电能采集",
        "forwardActivePower": null,
        "forwardReactivePower": null,
        "warningStatus": false
      }
    ]
    const { alarmSwitch } = this.state;
    const filteredPowerNet = powerNetList.filter(e => !alarmSwitch || e.warningStatus);
    return (
      <div className={styles.powerNet}>
        <div className={styles.top}>
          <span className={styles.iconGrid}>
            <i className="iconfont icon-grid" ></i>
          </span>
          <span className={styles.warning}>
            <Switch defaultChecked={false} onChange={this.onSwitchAlarm} />
            <span>告警</span>
          </span>
        </div>
        {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} />
          : <div className={styles.deviceList}>
            {filteredPowerNet.length > 0 ? filteredPowerNet.map(e => {
              const netInfoArr = [
                { name: '正向有功', value: dataFormat(e.forwardActivePower, '--', 2), unit: 'kWh' },
                { name: '反向有功', value: dataFormat(e.backwardActivePower, '--', 2), unit: 'kWh' },
                { name: '正向无功', value: dataFormat(e.forwardReactivePower, '--', 2), unit: 'kVarh' },
                { name: '反向无功', value: dataFormat(e.backwardReactivePower, '--', 2), unit: 'kVarh' },
              ]
              return (
                <section className={`${styles.eachDevice} ${e.warningStatus && styles.alarm}`} key={e.deviceCode}>
                  <h3 className={styles.deviceName}>
                    <span>{e.deviceName}</span>
                    {e.warningStatus && <span className="iconfont icon-alarm" />}
                  </h3>
                  <div className={styles.deviceValue}>
                    {netInfoArr.map(e => (<div key={e.name} className={styles.eachValue}>
                      <span>{e.name}</span>
                      <div>
                        <span className={styles.vlue}>{e.value}</span>
                        <span className={styles.unit}>{e.unit}</span>
                      </div>
                    </div>))}
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
