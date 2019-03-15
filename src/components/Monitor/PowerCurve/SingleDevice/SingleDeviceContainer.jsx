import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from './singleDevice.scss';
import WindSingleDeviceTable from './WindSingleDeviceTable';
import SingleWindDeviceCharts from './SingleWindDeviceCharts';

import { Icon, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import DeviceSelect from '../../../Common/DeviceSelect/index';




class SingleDeviceContainer extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    const { stationCode, deviceFullCode, time } = this.props.match.params;
    const { stations, deviceShowType, changeSingleDeviceStore, getSingleDeviceCurveList } = this.props;
    const startTime = time.split('~')[0];
    const endTime = time.split('~')[1];
    const params = { stationCode, deviceFullCode, startTime, endTime }
    changeSingleDeviceStore({ ...params })
    deviceShowType === 'graph' ? this.queryGraphData() : getSingleDeviceCurveList({ ...params })


  }
  componentWillReceiveProps(nextProp) {
    const { stations, deviceShowType, changeSingleDeviceStore, getSingleDeviceCurveList } = nextProp;
    // if (stations.length > 0) {
      // const { stationCode, deviceFullCode, time } = this.props.match.params;
      // const startTime = time.split('~')[0];
      // const endTime = time.split('~')[1];
      // const params = { stationCode, deviceFullCode, startTime, endTime }
      // changeSingleDeviceStore({ ...params })
      // deviceShowType === 'graph' ? this.queryGraphData() : getSingleDeviceCurveList({ ...params })

    // }

  }
  onOk = (selectdevice) => {
    
    // const deviceFullCode = selectdevice.map((e, i) => e.deviceCode);
    // this.props.changeSingleDeviceStore({
    //   deviceFullCode
    // })
    // this.onChangeFilter({ deviceFullCode })

  }
  onSwitchChange = (checked) => {
    
    this.props.changeSingleDeviceStore({ correct: checked ? 1 : 0 })
    this.onChangeFilter({ correct: checked ? 1 : 0 })


  }
  onChangeFilter = (value) => {
    const { stationCode, deviceFullCode, startTime, endTime, deviceShowType, getSingleDeviceCurveList } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    deviceShowType === 'graph' ? this.queryGraphData(value) : getSingleDeviceCurveList({ ...params, ...value })
  }
  queryGraphData = (value) => {
    const { stationCode, deviceFullCode, startTime, endTime, correct, getAllDeviceCurveData, getPowerdeviceList, deviceShowType } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    this.props.getSingleDeviceCurveData({ ...params, correct, ...value });
    this.props.getsequencechart({ ...params, ...value });
    this.props.getwinddistributionchart({ ...params, ...value });
    this.props.getpowerspeedchart({ ...params, ...value });
    this.props.getRoseChart({ ...params, ...value });
    this.props.getpitchanglespeedchart({ ...params, ...value });



  }
  selectShowType = (type) => { // 切换图表展示类型 'graph'图 / 'list'表格
    const { changeSingleDeviceStore } = this.props;
    changeSingleDeviceStore({ deviceShowType: type })
  }

  showChart = () => {
    this.selectShowType('graph');
  }

  showList = () => {
    this.selectShowType('list');
  }

  render() {
    // const { stationCode, deviceFullCode, time } = this.props.match.params;
    const { stations, deviceShowType, stationCode, deviceFullCode, startTime, endTime,airDensity  } = this.props;
    
    const stationInfo = stations.filter(e => (e.stationCode === +stationCode))[0];
    
    const pathAllDevice = `#/monitor/powercurve`;
    return (
      <div className={styles.singleDevice}>
        <div className={styles.headerStyle}>
          <div className={styles.left}>
            <div className={styles.singleInfo}>电站名称:{stationInfo && stationInfo.regionName}-{stationInfo && stationInfo.stationName}</div>
            <div className={styles.singleInfo}>设备名称:{deviceFullCode}</div>
            <div className={styles.singleInfo}>时间:{startTime}~{endTime}</div>
            {deviceShowType === 'graph' && <div className={styles.singleInfo}>增加对比设备:
            <DeviceSelect
                disabled={82 ? false : true}
                stationCode={82}
                deviceTypeCode={101}
                style={{ width: 'auto', minWidth: '198px' }}
                onOK={this.onOk}
                // multiple={true}
                deviceShowNumber={true}
                // value={[{}]}
                holderText={'请选择风机'}
              />

            </div>}
            {deviceShowType === 'list' && <div>
              <Switch onChange={this.onSwitchChange} />空气密度校验
           </div>}
          </div>
          <div className={styles.right}>
            <a href={pathAllDevice} >
              <Icon type="arrow-left" className={styles.backIcon} />
            </a>
          </div>

        </div>
        <div className={styles.showType}>
          <div className={styles.tabIcons}>
            <Icon onClick={this.showChart} type="bar-chart" className={deviceShowType === 'graph' ? styles.active : styles.normal} />
            <Icon onClick={this.showList} type="bars" className={deviceShowType === 'list' ? styles.active : styles.normal} />
          </div>
          {deviceShowType === 'list' && <Button className={styles.exportStyle}>导出</Button>}
          {deviceShowType === 'graph' && <div className={styles.rightInfo}>现场空气密度:{airDensity}kg/m³</div>}
        </div>
        {deviceShowType === 'graph' ? <SingleWindDeviceCharts {...this.props} /> : <WindSingleDeviceTable {...this.props} onChangeFilter={this.onChangeFilter} />}

      </div>

    )
  }
}
export default (SingleDeviceContainer)