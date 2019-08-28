import React, { Component } from 'react';
import styles from './manufacturers.scss';
import PropTypes from 'prop-types';
import { Select, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import StationSelect from '../../../Common/StationSelect';
const Option = Select.Option;
const { RangePicker, MonthPicker } = DatePicker;

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
    theme: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectOption: 'manufacturer',
      optionValue: [],
    };
  }

  componentDidMount() {
    const { stationCode, deviceTypeNameLike } = this.props;
    this.props.getManufacturer({ stationCode, deviceTypeNameLike });
    this.props.getDevicemode({ stationCode, deviceTypeNameLike });
  }

  getDevice = (value) => { // 获取筛选之后的厂家型号
    const { stationCode, startDate, endDate, deviceTypeNameLike, manufacturers, deviceModeIds } = this.props;
    const { selectOption } = this.state;
    const manufactureParams = { stationCode, startDate, endDate, deviceTypeNameLike, manufacturers };
    const devicemodeParams = { stationCode, startDate, endDate, deviceTypeNameLike, deviceModeIds };
    selectOption === 'manufacturer' ? this.props.getChartsData({ ...manufactureParams, ...value }) : this.props.getChartsData({ ...devicemodeParams, ...value });
  }


  getTreeProps = () => { // 获取厂家型号的详细数据
    const { devicemodeList, manufacturerList } = this.props;
    const { selectOption } = this.state;
    const devicemodeData = devicemodeList.length > 0 && devicemodeList.map(e => {
      if (e) {
        return {
          title: e.deviceModeName,
          value: e.deviceModeId,
          key: e.deviceModeId,
        };
      }
    }) || [];
    const manufacturerData = manufacturerList.length > 0 && manufacturerList.map(e => {
      return {
        title: e.manufacturer,
        value: e.manufacturer,
        key: e.manufacturer,
      };
    }) || [];
    const treeData = selectOption === 'manufacturer' ? manufacturerData : devicemodeData;
    const treeProps = {
      treeData: treeData,
      treeCheckable: true,
      filterTreeNode: false,
      searchPlaceholder: null,
      isLeaf: true,
    };
    return treeProps;
  }

  timeSelect = (date, dateString) => { // 切换时间
    const startDate = moment(dateString).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(dateString).endOf('month').format('YYYY-MM-DD');
    this.getDevice({ startDate, endDate });
  }

  disabledDate = (current) => { // 不可以选择的时间
    return current > moment().endOf('day');
  }

  stationSelected = (value) => { // 电站选择
    const stationCode = [];
    const { deviceTypeNameLike } = this.props;
    value.forEach(e => { stationCode.push(e.stationCode); });
    this.props.getManufacturer({ stationCode, deviceTypeNameLike });
    this.props.getDevicemode({ stationCode, deviceTypeNameLike });
    this.setState({ optionValue: [] });
    const { selectOption } = this.state;
    selectOption === 'manufacturer' ? this.getDevice({ stationCode: stationCode, manufacturers: [] }) : this.getDevice({ stationCode: stationCode, deviceModeIds: [] });
  }

  changeType = (value) => { // 改变厂家型号
    this.setState({ selectOption: value, optionValue: [] }, () => {
      value === 'manufacturer' ? this.getDevice({ manufacturers: [] }) : this.getDevice({ deviceModeIds: [] });
    });
    this.props.changeManufacturersStore({ selectOption: value });
  }


  TreeSelect = (value) => { // 选择厂家或者选择设备型号
    this.setState({ optionValue: value });
    const optionValue = value.map(e => e.value);
    const { selectOption } = this.state;
    selectOption === 'manufacturer' ? this.getDevice({ manufacturers: optionValue }) : this.getDevice({ deviceModeIds: optionValue });
  }


  render() {
    const { stations, deviceTypeNameLike, theme } = this.props;
    const { selectOption, optionValue } = this.state;
    const currentYearDay = moment().year() + '/01/01';
    const treeProps = this.getTreeProps();
    return (
      <div className={styles.search}>
        <div ref={'searchBox'} className={styles.searchBox} />
        <div className={styles.condition}>
          <span>条件查询</span>
          <Select defaultValue={deviceTypeNameLike} style={{ width: 200, marginLeft: 15 }}
            getPopupContainer={() => this.refs.searchBox}
          >
            <Option value="逆变器">逆变器</Option>
          </Select>
          <MonthPicker
            defaultValue={moment(moment(), 'YYYY-MM')}
            format={'YYYY-MM'}
            style={{ width: 230, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelect}
            disabledDate={this.disabledDate}
            allowClear={false}
            getCalendarContainer={() => this.refs.searchBox}
          />
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            holderText={'全部电站'}
            multiple={true}
            onChange={this.stationSelected}
            theme={theme}
          />
        </div>
        <div className={styles.antherCondition}>
          <span>厂家型号</span>
          <Select defaultValue="manufacturer" style={{ width: 200, marginLeft: 15 }} onChange={this.changeType}
            getPopupContainer={() => this.refs.searchBox}
          >
            <Option value="manufacturer">按厂家</Option>
            <Option value="deviceMode">按型号</Option>
          </Select>
          <TreeSelect
            {...treeProps}
            dropdownClassName={styles.treeDeviceTypes}
            placeholder={selectOption === 'manufacturer' ? '全部厂家' : '全部型号'}
            style={{ width: 225, marginLeft: 15 }}
            onChange={this.TreeSelect}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeCheckStrictly={true}
            value={optionValue}
            getPopupContainer={() => this.refs.searchBox}
          />
        </div>
      </div>
    );
  }
}

export default Search;
