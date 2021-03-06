


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Select } from 'antd';
import styles from './common.scss';
import StationSelect from '@components/Common/StationSelect';
import { dataFormats } from '@utils/utilFunc';
const { Option } = Select;

class CommonSearch extends PureComponent{
  static propTypes = {
    theme: PropTypes.string,
    stations: PropTypes.array,
    topData: PropTypes.object,
    stationCode: PropTypes.number,
    deviceTypeCode: PropTypes.number,
    onStationChange: PropTypes.func,
    onTypeChange: PropTypes.func,
  }

  timeSpace = ['10分钟']

  checkStation = ([station = {}]) => {
    const { stationCode } = station;
    this.props.onStationChange({ stationCode });
  }

  checkDeviceType = (value) => {
    this.props.onTypeChange(value);
  }

  render(){
    const { topData, stationCode, deviceTypeCode, stations, theme } = this.props;
    const { dataStartTime, deviceTypes = [] } = topData;
    const { deviceCount } = deviceTypes.find(e => e.deviceTypeCode === deviceTypeCode) || {};
    return(
      <div className={`${styles.search} ${styles[theme]}`}>
        <div className={styles.station}>
          <span className={styles.text}>电站名称</span>
          <StationSelect
            value={stations.filter(e => e.stationCode === stationCode)}
            data={stations.filter(e => e.stationType === 0 && e.isConnected === 1)}
            style={{width: '200px', lineHeight: '40px'}}
            onChange={this.checkStation}
            theme={theme}
          />
        </div>
        <div className={styles.startTime}>
          <span className={styles.text}>数据起始日期 : </span>
          <span>{dataStartTime ? moment(dataStartTime).format('YYYY-MM-DD') : '--'}</span>
        </div>
        <div className={styles.space}>
          <span className={styles.text}>数据时间间隔</span>
          <span ref={(ref) => { this.timeRef = ref; }} />
          <Select
            allowClear={false}
            value="10分钟"
            getPopupContainer={() => this.timeRef}
            style={{width: '110px'}}
          >
            {this.timeSpace.map(e => (
              <Option key={e} value={e}>{e}</Option>
            ))}
          </Select>
        </div>
        <div className={styles.types}>
          <span className={styles.text}>设备类型</span>
          <span ref={(ref) => { this.typesRef = ref; }} />
          <Select
            allowClear={false}
            onChange={this.checkDeviceType}
            value={deviceTypes.length > 0 && deviceTypeCode ? deviceTypeCode : null}
            style={{width: '200px'}}
            getPopupContainer={() => this.typesRef}
          >
            {deviceTypes.map(e => (
              <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
            ))}
          </Select>
        </div>
        <div className={styles.count}>
          <span className={styles.text}>设备数量 : </span>
          <span>{dataFormats(deviceCount)}</span>
        </div>
      </div>
    );
  }
}


export default CommonSearch;
