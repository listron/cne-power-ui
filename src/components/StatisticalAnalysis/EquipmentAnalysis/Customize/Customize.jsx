import React, { Component } from "react";
import styles from "./customize.scss";
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
import CustomizeTable from './CustomizeTable';
const Option = Select.Option;
const { RangePicker, MonthPicker } = DatePicker;

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
  }

  constructor(props, context) {
    super(props, context)
  }

  timeSelect = (date, dateString) => {
    const { stationCode, anotherStationCode, manufacturer, anotherManufacturer, deviceModeId,
      anotherDeviceModeId, deviceTypeNameLike } = this.props;
    this.props.getDetailData({
      params: { stationCode, manufacturer, deviceModeId, startDate: dateString[0], endDate: dateString[1], deviceTypeNameLike },
      resultName: 'detailData',
    })
    this.props.getDetailData({
      params: { stationCode: anotherStationCode, manufacturer: anotherManufacturer, deviceModeId: anotherDeviceModeId, startDate: dateString[0], endDate: dateString[1], deviceTypeNameLike },
      resultName: 'anotherDetailData',
    })
    this.props.changeCustomizeStore({ startDate: dateString[0], endDate: dateString[1] })
  }

  render() {
    const currentYearDay = moment().year() + '/01/01';
    return (
      <div className={styles.customizeBox}>
        <div className={styles.search}>
          <span>条件查询</span>
          <Select defaultValue="逆变器" style={{ width: 200, marginLeft: 15 }}  >
            <Option value="逆变器">逆变器</Option>
          </Select>
          {/* <RangePicker
            defaultValue={[moment(currentYearDay, 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]}
            format={'YYYY-MM-DD'}
            style={{ width: 230, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelect}
            allowClear={false}
          /> */}
          <MonthPicker
            defaultValue={moment(currentYearDay, 'YYYY-MM')}
            format={'YYYY-MM'}
            style={{ width: 230, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelect}
            allowClear={false}
          />

        </div>
        <CustomizeTable {...this.props} />
      </div>
    )
  }
}

export default Customize