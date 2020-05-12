import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './allDeviceCurve.scss';
import DeviceFilter from './DeviceFilter';
import WindDeviceTable from './WindDeviceTable';
import WindDeviceGraph from './WindDeviceGraph';

class AllDeviceCurve extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    deviceFullCode: PropTypes.array,
    deviceShowType: PropTypes.string,
    endTime: PropTypes.string,
    stationCode: PropTypes.number,
    changeAllDeviceStore: PropTypes.func,
    getDeviceModel: PropTypes.func,
    getAllDeviceCurveData: PropTypes.func,
    getPowerdeviceList: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }

  onChangeFilter = (value) => {
    const { stationCode, deviceFullCode, startTime, endTime, getAllDeviceCurveData, getPowerdeviceList, deviceShowType } = this.props;
    const params = { stationCode, deviceFullCode, startTime, endTime };
    if (stationCode && deviceFullCode.length > 0) {
      getAllDeviceCurveData({ ...params, ...value });
      getPowerdeviceList({ ...params, ...value });
    }
  }

  selectShowType = (type) => { // 切换图表展示类型 'graph'图 / 'list'表格
    const { changeAllDeviceStore } = this.props;
    changeAllDeviceStore({ deviceShowType: type });
    this.props.onChangeFilter();
  }

  showChart = () => {
    this.selectShowType('graph');
  }
  showList = () => {
    this.selectShowType('list');
  }

  render() {
    const { deviceShowType } = this.props;
    return (
      <div className={styles.allDeviceBox}>
        <DeviceFilter {...this.props} onChangeFilter={this.onChangeFilter} />
        <div className={styles.allDeviceContent}>
          <div className={styles.showType}>
            <div className={styles.tabIcons}>
              <Icon onClick={this.showChart} type="bar-chart" className={deviceShowType === 'graph' ? styles.active : styles.normal} />
              <Icon onClick={this.showList} type="bars" className={deviceShowType === 'list' ? styles.active : styles.normal} />
            </div>
          </div>
          {deviceShowType === 'graph' && <WindDeviceGraph {...this.props} onChangeFilter={this.onChangeFilter} />}
          {deviceShowType === 'list' && <WindDeviceTable {...this.props} onChangeFilter={this.onChangeFilter} />}
        </div>
      </div>
    );
  }
}
export default (AllDeviceCurve);
