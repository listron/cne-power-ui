import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select ,AutoComplete, message  } from 'antd';
import { commonAction } from '../../../containers/alphaRedux/commonAction';
import DeviceSelectModal from './DeviceSelectModal'
import styles from './style.scss';
import PropTypes from 'prop-types';
const Option = Select.Option;
/*
  设备选择组件：支持设备多选,单选. 
注意：本组件内自带container数据流，请保持数据流清晰：依据props中的电站code和typecode自请求设备列表。组件卸载时自动卸载掉所挂数据。
  父组件可传入子组件参数:
  1. 必填stationCode - 电站code值
  2. deviceTypeCode - 设备类型code值 // 1,2必填项请求，得到当前所有设备allDevices:[object];
  4. 必填value - array[object], 手动指定组件已选中的设备(value数组必须确保有deviceCode，其余任意),该值作为设备选中的唯一依据。
  3. 必填 - 输出信息:this.props.onOK(selectedDevices)为得到的所有设备信息allDevices:[object]中筛选的一个或多个，this.props.onChange(form表单用若有会同时触发)

  4. 选填 - 是否多选模式: multiple, 选填，默认为单选(false)。
  5. 选填 - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，未选设备时的占位文字。 
  7. 选填 - disabled: bool; 默认false， 传入true值时组件为禁用状态。

其余参数：组件内部自动挂载数据:
1. devices // 依据父组件stationCode, deviceTypeCode请求得的所有设备array[object];
  格式如: {
    deviceCode: "350M304M5M1",
    deviceId: "738975",
    deviceModelCode: 5,
    deviceModelName: "SF11-1100/36.75/0.3-0.3",
    deviceName: "01",
    deviceTypeCode: 304,
    deviceTypeName: "箱变",
    subDevices: null,
  }
2. partitions: // 依据父组件stationCode, deviceTypeCode请求得的方阵分区信息array[object];
  格式如: {
    deviceCode: "1" // 方阵的code
    deviceName: "1" // 方阵分区名
  }
3. filterDevices // devices数据量过大时，弹出框modal依据partition筛选请求得到的局部devices。
4. filterKey // array[stationTypeCode] 指定的哪些设备类型的展示需要分区。
*/

class DeviceSelect extends Component {
  static propTypes = {
    stationCode: PropTypes.number, // 需传props
    deviceTypeCode: PropTypes.number,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    holderText: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onOK: PropTypes.func,
    style: PropTypes.object,

    devices: PropTypes.array, // 自带props
    partitions: PropTypes.array,
    filterDevices: PropTypes.array,
    filterKey: PropTypes.array,

    getDevices: PropTypes.func, // 自带方法
    getPartition: PropTypes.func,
    getMatrixDevices: PropTypes.func,
    changeCommonStore: PropTypes.func,
  }

  static defaultProps = {
    multiple: false,
    holderText: '输入关键字快速查询',
    disabled: false,
    value: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      deviceModalShow: false,
      checkedDevice: props.value, // 存储当前选中设备。
      autoCompleteDevice: [], // 自动搜索框的提示内容
      autoCompleteText: '', // 自动补全框展示内容
    }
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode, deviceTypeCode, filterKey } = nextProps;
    const checkedDevice = nextProps.value;
    const { getDevices, getPartition, getMatrixDevices, value } = this.props;
    const preStation = this.props.stationCode;
    const preDeviceType = this.props.deviceTypeCode;
    if (this.compareValue(checkedDevice, value)) { // value发生变化。
      this.setState({ 
        checkedDevice,
        autoCompleteText: checkedDevice[0] && checkedDevice[0].deviceName || ''
      });
    }
    if (stationCode && deviceTypeCode && (stationCode !== preStation || deviceTypeCode !== preDeviceType)) { // 请求设备。
      if ( filterKey.includes(deviceTypeCode)) { // 需要直接根据分区直接请求处理数据
        getMatrixDevices({ stationCode, deviceTypeCode });  // 分区数据
      } else { // 直接获取所有数据。
        getDevices({ stationCode, deviceTypeCode }, 'devices');
        getDevices({ stationCode, deviceTypeCode }, 'filterDevices');
        getPartition({ stationCode, deviceTypeCode });
      }
    }
  }

  componentWillUnmount(){ // 卸载公用数据中的设备数据。
    const { changeCommonStore } = this.props;
    changeCommonStore({
      devices: [],
      partitions: [],
      filterDevices: [],
    })
  }

  onOK = devices => { // 输出选中的设备数组。
    const { onChange,onOK } = this.props
    onOK && onOK(devices);
    onChange && onChange(devices);
  }

  onModalHandelOK = checkedDevices => { // 保存弹框中选中的设备
    this.setState({
      deviceModalShow: false,
    })
    this.onOK(checkedDevices)
  }

  onSelect = deviceCode => { // 自动完成框单选中。
    const { devices } = this.props;
    const checkedDevices = devices.filter(e => e.deviceCode === deviceCode);
    this.onOK(checkedDevices)
  }

  handleSearch = autoCompleteText => { // 自动完成框接收到搜索变化。
    const { devices } = this.props;
    const autoCompleteDevice = devices.filter(e => e.deviceName.indexOf(autoCompleteText) >= 0);
    this.setState({
      autoCompleteDevice,
      autoCompleteText
    });
  }

  selectDevice = checkedDevices => { // 设备多选下拉框
    const { devices } = this.props;
    const outputDevices = devices.filter(e => checkedDevices.includes(e.deviceCode))
    this.onOK(outputDevices)
  }

  hideModal = () => {
    this.setState({ deviceModalShow: false })
  }

  showModal = () => {
    const { stationCode, deviceTypeCode } = this.props;
    stationCode && deviceTypeCode && this.setState({ deviceModalShow: true });
  }

  compareValue = (value, preValue) => { // 比较value数组。返回值true/得到新value需重置, false/不需重置时表示
    if (value.length !== preValue.length) {
      return true
    } else if (value.length === preValue.length) {
      return preValue.find(e => value.every(curDevice => curDevice.deviceCode !== e.deviceCode)) // 找到一个不同设备。
    }
  }

  render() {
    const { multiple, holderText, disabled, style, devices } = this.props;
    const { deviceModalShow, autoCompleteDevice, checkedDevice, autoCompleteText } = this.state;
    const checkedDeviceCodes = checkedDevice.map(e => e.deviceCode);
    return (
      <div className={styles.deviceSelect} style={style}>
        {multiple ? <Select
          mode="multiple"
          disabled={disabled}
          style={{ width: '100%' }}
          placeholder={holderText}
          onChange={this.selectDevice}
          value={checkedDeviceCodes}
          className={styles.stationSelectMainInput}
        >
          {devices.map((e, i) => (
            <Option key={e.deviceCode} style={{display: (i > 19 ? 'none': 'block')}}>{e.deviceName}</Option>
          ))}
          {devices.length > 20 && <Option disabled key="showAll" className={styles.showAll}>点击图标查看所有设备</Option>}
        </Select>:<AutoComplete
          disabled={disabled}
          style={{ width: '100%' }}
          onSearch={this.handleSearch}
          onSelect={this.onSelect}
          value={autoCompleteText}
          placeholder={holderText}
        >
          {autoCompleteDevice.map((e, i) => (
            <Option key={e.deviceCode} style={{display: (i > 19 ? 'none': 'block')}}>{e.deviceName}</Option>
          ))}
          {autoCompleteDevice.length > 20 && <Option disabled key="showAll" className={styles.showAll}>点击图标查看所有设备</Option>}
        </AutoComplete>}
        <DeviceSelectModal
          {...this.props}
          checkedDevice={checkedDevice}
          handleOK={this.onModalHandelOK}
          deviceModalShow={deviceModalShow}
          hideModal={this.hideModal}
          showModal={this.showModal}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  devices: state.common.get('devices').toJS(),
  partitions: state.common.get('partitions').toJS(),
  filterDevices: state.common.get('filterDevices').toJS(),
  filterKey: state.common.get('filterKey').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeCommonStore: payload => dispatch({type: commonAction.CHANGE_COMMON_STORE, payload }),
  getDevices: (params, resultName) => dispatch({ // 获取设备列表
    type: commonAction.getDevices, 
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName, // : 'devices',
    }
  }),
  getPartition: params => dispatch({ // 获取分区信息
    type: commonAction.getPartition, 
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'partitions',
    }
  }),
  getMatrixDevices: params => dispatch({ // 获取筛选后的设备
    type: commonAction.getMatrixDevices, 
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelect);