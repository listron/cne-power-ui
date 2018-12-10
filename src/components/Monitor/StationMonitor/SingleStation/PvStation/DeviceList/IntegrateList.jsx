

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Spin, Table, Progress  } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import { dataFormat } from '../../../../../../utils/utilFunc';
const TabPane = Tabs.TabPane;

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
        <div className={styles.deviceList}>
          {collectorList.map(e => {
            const pData = dataFormat(e.griW, '--', 2);
            const cosData = dataFormat(e.griPF, '--', 2);
            const qData = dataFormat(e.griVar, '--', 2);
            const uabData = dataFormat(e.griPPhVUab, '--', 2);
            return (
              <section className={styles.eachIntegrate} key={e.deviceCode} onClick={() => this.getIntegrateDetail(e.deviceCode)}>
                <h3 className={styles.deviceName}>
                  <span className="iconfont icon-jidian" />
                  <span className="iconfont icon-alarm" />
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
          })}
        </div>
      </div>
    )
    /*return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.inverterBlockBox} >
            {loading ? <Spin  size="large" style={{height: '100px',margin: '200px auto',width: '100%'}} /> : 
              (deviceGroupedList.length > 0 ? deviceGroupedList.map((e,index)=>{
                return (<div key={index}>
                  <div className={styles.parentDeviceName} >{e && e[0] && e[0].parentDeviceName}</div>
                  {e.map((item,i)=>{
                    const { devicePower, deviceCapacity, voltage, electricity, dispersionRatio, temp } = item;
                    const showDevicePower = transData(devicePower,2);
                    const showDeviceCapacity = transData(deviceCapacity,2);
                    const showVoltage = transData(voltage);
                    const showElectricity = transData(electricity);
                    const showTemp = transData(temp);
                    let percent, progressPercent;
                    if(!deviceCapacity || isNaN(deviceCapacity)){
                      percent = '--';
                      progressPercent = 0;
                    }else{
                      percent = transData(devicePower/deviceCapacity*100,2);
                      progressPercent = percent;
                    }
                    return (<div key={i} className={item.deviceStatus === 900 ? styles.cutOverItem : styles.inverterItem} style={{height: "121px"}}>
                      <div className={styles.inverterItemIcon} >
                        <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} >
                          <i className="iconfont icon-hl" ></i>
                        </Link>
                        <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}/?showPart=alarmList`} >
                          {(item.alarmNum && item.alarmNum>0)? <i className="iconfont icon-alarm" ></i> : <div></div>}
                        </Link>
                      </div>
                      <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} >
                        <div className={styles.inverterItemR} >
                          <div className={styles.hlBlockName}><span>{item.deviceName}</span><span>{percent}%</span></div>
                          <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                          <div className={styles.inverterItemPower}>
                            <div>{showDevicePower}kW</div>
                            <div>{showDeviceCapacity}kW</div>
                          </div>
                        </div>
                      </Link>
                      <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} className={styles.hlBlockLink} >
                        <div className={styles.hlBlockFooter} >
                          <div>电压：{showVoltage}V</div>
                          <div>电流：{showElectricity}A</div>
                          <div>离散率：{dispersionRatio || '--'}</div>
                          <div>温度：{showTemp}℃</div>
                        </div>
                      </Link>
                    </div>);
                  })}
                </div>);
              }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)
            }
          </TabPane>
        </Tabs>
      </div>
    )
    */
  }
}

export default IntegrateList;
