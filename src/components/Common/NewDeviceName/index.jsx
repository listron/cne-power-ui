import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import { AutoComplete, Input } from 'antd';
import Immutable from 'immutable';
const Option = AutoComplete.Option;
import DeviceNameModal from './DeviceNameModal';

class DeviceName extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    allSeries: PropTypes.object,
    placeholder: PropTypes.string,
    stationName: PropTypes.string,//电站名称
    deviceType: PropTypes.string,//设备类型
    deviceTypeCode: PropTypes.number, // 设备类型编码
    deviceAreaCode: PropTypes.string,//选中的设备分区编码
    value: PropTypes.string,//选中的设备编码
    deviceAreaItems: PropTypes.object,//电站分区选项
    deviceItems: PropTypes.object,//设备列表
    onChange: PropTypes.func,
    loadDeviceList: PropTypes.func,
    onChangeArea: PropTypes.func,
    firstPartitionCode: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showDeviceNameModal: false,
      checkedStationName: '', // 选中的设备
      filteredSelectedStation:[],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, deviceItems } = nextProps;
    if (value && deviceItems) {
      const selectedDevice = deviceItems.find(e => e.deviceCode === value);
      this.setState({
        checkedStationName: selectedDevice ? selectedDevice.deviceName : '',
        filteredSelectedStation: deviceItems,
      })
    } else if (!value) {
      this.setState({
        checkedStationName: '',
        filteredSelectedStation: deviceItems || [],
      })
    }
  }

  onShowDeviceNameModal = () => { // 展示设备选择框
    if (!this.props.disabled) {
      this.setState({
        showDeviceNameModal: true
      });
    }
  }

  onCloseDeviceNameModal = () => { // 关闭设备选择器
    this.setState({ showDeviceNameModal: false })
  }

  getDeviceItems() { // 设备input下拉框数据
    const { allSeries, deviceTypeCode } = this.props;
    let { filteredSelectedStation } = this.state;
    filteredSelectedStation = filteredSelectedStation;
    const allSeriesArray =allSeries;
    if (deviceTypeCode === 509 && allSeriesArray.length > 20) { // 组串=>根据allSeries展示
      return allSeriesArray.slice(0, 20).map((item, index) => (
        <Option key={item.deviceCode} value={item.deviceCode}>
          {item.deviceName}
        </Option>)).concat([
          <Option disabled key="all" className="show-all">
            点击图标查看所有设备
        </Option>,
        ])
    } else if (deviceTypeCode === 509 && allSeriesArray.length <= 20) { // 所有组串不足20项
      return allSeriesArray.map((item, index) => (
        <Option key={item.deviceCode} value={item.deviceCode}>
          {item.deviceName}
        </Option>
      ))
    } else if (filteredSelectedStation.length > 20) { // 其他设备且超过20项
      return filteredSelectedStation.slice(0, 20).map((item, index) => (
        <Option key={item.deviceCode} value={item.deviceCode}>
          {item.deviceName}
        </Option>)).concat([
          <Option disabled key="all" className="show-all">
            点击图标查看所有设备
        </Option>,
        ])
    } else { // 其他设备，且不足20项
      return filteredSelectedStation.map((item, index) => (
        <Option key={item.deviceCode} value={item.deviceCode}>
          {item.deviceName}
        </Option>
      ))
    }
  }

  handleSearch = (text) => {
    const { deviceItems, } = this.props;
    let filteredSelectedStation = deviceItems.filter(e => {
      const eachDeviceName = e && e.get('deviceName');
      const deviceShowText = eachDeviceName ? eachDeviceName.toLowerCase() : '';
      const modelText = text ? text.toLowerCase() : '';
      return deviceShowText.includes(modelText)
    });
    this.setState({
      checkedStationName: text,
      filteredSelectedStation
    })
  }

  handleSelect = (value) => {
    const { deviceItems, onChange } = this.props;
    const checkedStationName = deviceItems.find(e => e.deviceCode === value).deviceName;
    this.setState({ checkedStationName });
    onChange(value);
  }

  render() {
    let options = this.getDeviceItems();
    const { checkedStationName,showDeviceNameModal } = this.state;
    const {stationName,deviceType,value,deviceAreaItems, deviceItems,onChange, loadDeviceList,onChangeArea,deviceTypeCode,firstPartitionCode,deviceAreaCode,disabled}=this.props;
    return (
      <div className={styles.deviceName}>
        <AutoComplete
          style={{ width: '100%' }}
          dataSource={options}
          disabled={disabled}
          onSelect={onChange}
          onSearch={this.handleSearch}
          value={checkedStationName}
          placeholder="请输入关键字查询"
        >
          <Input suffix={<i className="iconfont icon-filter" onClick={this.onShowDeviceNameModal} />} />
        </AutoComplete>
        {showDeviceNameModal && <DeviceNameModal
          show={this.state.showDeviceNameModal}
          stationName={stationName}
          deviceType={deviceType}
          deviceCode={value}
          deviceAreaCode={deviceAreaCode}
          deviceAreaItems={deviceAreaItems}
          deviceItems={deviceItems}
          onSelectDevice={onChange}
          onCancel={this.onCloseDeviceNameModal}
          loadDeviceList={loadDeviceList}
          onChangeArea={onChangeArea}
          deviceTypeCode={deviceTypeCode}
          firstPartitionCode={firstPartitionCode}
        />}
      </div>
    );
  }
}

export default DeviceName;