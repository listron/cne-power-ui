import React, { Component } from "react";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import { Select, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    stations: PropTypes.array,
    manufacturerList: PropTypes.array,
    devicemodeList: PropTypes.array,
    deviceData: PropTypes.array,
    getManufacturer: PropTypes.func,
    getDevicemode: PropTypes.func,
    getChartsData: PropTypes.func,
    stationCode: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    deviceTypeNameLike: PropTypes.string,
    manufacturers: PropTypes.array,
    deviceModeIds: PropTypes.array,
    changeManufacturersStore: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      selectOption: 'manufacturer',
      optionValue: [],
    }
  }

  componentDidMount() {
    const { stationCode } = this.props;
    this.props.getManufacturer({ stationCode })
    this.props.getDevicemode({ stationCode })
  }

  getDevice = (value) => { // 获取筛选之后的厂家型号
    const { stationCode, startDate, endDate, deviceTypeNameLike, manufacturers, deviceModeIds } = this.props;
    const { selectOption } = this.state;
    const manufactureParams = { stationCode, startDate, endDate, deviceTypeNameLike, manufacturers }
    const devicemodeParams = { stationCode, startDate, endDate, deviceTypeNameLike, deviceModeIds }
    selectOption === 'manufacturer' ? this.props.getChartsData({ ...manufactureParams, ...value }) : this.props.getChartsData({ ...devicemodeParams, ...value });
  }

  timeSelect = (date, dateString) => { // 切换时间
    this.getDevice({ startDate: dateString[0], endDate: dateString[1] })
  }

  disabledDate = (current) => { // 不可以选择的时间
    return current > moment().endOf('day');
  }

  stationSelected = (value) => { // 电站选择
    const stationCode = [];
    value.forEach(e => { stationCode.push(e.stationCode) })
    this.props.getManufacturer({ stationCode })
    this.props.getDevicemode({ stationCode })
    this.setState({ optionValue: [] })
    const { selectOption } = this.state;
    selectOption === 'manufacturer' ? this.getDevice({ stationCode: stationCode, manufacturers: [] }) : this.getDevice({ stationCode: stationCode, deviceModeIds: [] })
  }

  changeType = (value) => { // 改变厂家型号
    this.setState({ selectOption: value }, () => {
      value === 'manufacturer' ? this.getDevice({ manufacturers: [] }) : this.getDevice({ deviceModeIds: [] })
    })
  }


  TreeSelect = (value) => { // 选择厂家或者选择设备型号
    this.setState({ optionValue: value })
    const optionValue = value.map(e => e.value);
    const { selectOption } = this.state;
    selectOption === 'manufacturer' ? this.getDevice({ manufacturers: optionValue }) : this.getDevice({ deviceModeIds: optionValue })
  }


  render() {
    const { stations, manufacturerList, devicemodeList, deviceTypeNameLike } = this.props;
    const { selectOption, optionValue } = this.state;
    const devicemodeData = devicemodeList.length > 0 && devicemodeList.map(e => {
      return {
        title: e.deviceModeName,
        value: e.deviceModeId,
        key: e.deviceModeId,
      }
    }) || [];
    // const manufacturerData = manufacturerList.length > 0 && manufacturerList.map(e => {
    //   return {
    //     title: e.manufacturer,
    //     value: e.manufacturer,
    //     key: e.manufacturer,
    //   }
    // }) || []
    const treeProps = {
      treeData: selectOption === 'manufacturer' ? devicemodeData : [],
      treeCheckable: true,
      filterTreeNode: false,
      searchPlaceholder: null,
      isLeaf: true,
    }
    const currentYearDay = moment().year() + '/01/01';
    return (
      <div className={styles.search}>
        <div className={styles.condition}>
          <span>条件查询</span>
          <Select defaultValue={deviceTypeNameLike} style={{ width: 200, marginLeft: 15 }}  >
            <Option value="逆变器">逆变器</Option>
          </Select>
          <RangePicker
            defaultValue={[moment(currentYearDay, 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]}
            format={'YYYY-MM-DD'}
            style={{ width: 200, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelect}
            disabledDate={this.disabledDate}
          />
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            holderText={"全部电站"}
            multiple={true}
            onChange={this.stationSelected}
          />
        </div>
        <div className={styles.antherCondition}>
          <span>厂家型号</span>
          <Select defaultValue="manufacturer" style={{ width: 200, marginLeft: 15 }} onChange={this.changeType}
          >
            <Option value="manufacturer">按厂家</Option>
            <Option value="deviceMode">按型号</Option>
          </Select>
          <TreeSelect {...treeProps}
            dropdownClassName={styles.treeDeviceTypes}
            placeholder={selectOption === 'manufacturer' ? '全部厂家' : '全部型号'}
            style={{ width: 200, marginLeft: 15 }}
            onChange={this.TreeSelect}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeCheckStrictly={true}
            value={optionValue}
          />

        </div>

      </div>
    )
  }
}

export default Search