import React, { Component } from 'react';
import styles from './customize.scss';
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import StationSelect from '../../../Common/StationSelect';
import CustomizeTable from './CustomizeTable';
const Option = Select.Option;
const { RangePicker, MonthPicker } = DatePicker;
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
class Customize extends Component {
  static propTypes = {
    changeCustomizeStore: PropTypes.func,
    getDetailData: PropTypes.func,
    stationCode: PropTypes.number,
    anotherStationCode: PropTypes.number,
    manufacturer: PropTypes.string,
    anotherManufacturer: PropTypes.string,
    deviceModeId: PropTypes.string,
    anotherDeviceModeId: PropTypes.string,
    deviceTypeNameLike: PropTypes.string,
    theme: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);
  }

  onTimeChange = (value) => {
    let startDate = '', endDate = '';
    const { timeStyle, startTime } = value;
    const currentYear = moment().isSame(startTime, 'year');
    if (timeStyle === 'month') {
      startDate = moment(startTime).startOf('year').format('YYYY-MM-DD');
      endDate = currentYear && moment().format('YYYY-MM-DD') || moment(startTime).endOf('year').format('YYYY-MM-DD');
    } else {
      startDate = moment(startTime).startOf('month').format('YYYY-MM-DD');
      endDate = moment(startTime).endOf('month').format('YYYY-MM-DD');
    }
    const { stationCode, anotherStationCode, manufacturer, anotherManufacturer, deviceModeId,
      anotherDeviceModeId, deviceTypeNameLike } = this.props;
    if (stationCode) {
      this.props.getDetailData({
        params: { stationCode, manufacturer, deviceModeId, startDate, endDate, deviceTypeNameLike },
        resultName: 'detailData',
      });
    }

    if (anotherStationCode) {
      this.props.getDetailData({
        params: { stationCode: anotherStationCode, manufacturer: anotherManufacturer, deviceModeId: anotherDeviceModeId, startDate, endDate, deviceTypeNameLike },
        resultName: 'anotherDetailData',
      });
    }
    this.props.changeCustomizeStore({ startDate, endDate });
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.customizeBox} ${styles[theme]}`}>
        <span ref="wrap" />
        <div className={styles.search}>
          <span>条件查询</span>
          <Select defaultValue="逆变器" style={{ width: 200, marginLeft: 15 }} getPopupContainer={() => this.refs.wrap}>
            <Option value="逆变器">逆变器</Option>
          </Select>
          <TimeSelect showYearPick={false} onChange={this.onTimeChange} timerText={''} value={{ timeStyle: 'day' }} />
        </div>
        <div className={styles.wrap}>
          <CustomizeTable {...this.props} />
        </div>
      </div>
    );
  }
}

export default Customize;
