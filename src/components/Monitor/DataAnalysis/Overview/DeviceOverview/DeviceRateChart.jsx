import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './device.scss';

class DeviceRateChart extends PureComponent{
  static propTypes = {
    devicesData: PropTypes.object,
  }

  state = {
    sortType: null,
  }

  componentDidMount(){

  }

  componentWillReceiveProps(){

  }

  render(){
    const { devicesData } = this.props;
    const { total, deviceData } = devicesData;
    console.log(deviceData);
    return(
      <div className={styles.deviceRate}>
        <div className={styles.total}>
          <span>{total}%</span>
          <span>设备数据完整率平均值</span>
        </div>
        <div className={styles.chart} />
        <div className={styles.sorter}>
          <Icon type="caret-up" />
          <Icon type="caret-down" />
        </div>
      </div>
    );
  }
}

export default DeviceRateChart;
