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
  参数:
  1. 必填 - 电站code值
  2. 必填 - 设备类型code值 // 1,2必填项请求，得到当前所有设备allDevices:[object];
   {
    deviceCode: "350M304M5M1",
    deviceId: "738975",
    deviceModelCode: 5,
    deviceModelName: "SF11-1100/36.75/0.3-0.3",
    deviceName: "01",
    deviceTypeCode: 304,
    deviceTypeName: "箱变",
    subDevices: null,
   }
  3. 必填 - 输出信息:this.props.onOK(selectedDevices)为得到的所有设备信息allDevices:[object]中筛选的一个或多个，this.props.onChange(form表单用若有会同时触发)

  4. 选填 - 是否多选模式: multiple, 选填，默认为单选(false)。
  5. 选填 - 组件生成时默认已选中的电站(value)(value形式与data相同[object])
  6. 选填 - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  7. 选填 - holderText: string, 可选填，当用户未选择电站时的占位提示文字。 
  8. 选填 - disabled: bool; 默认false， 传入true值时组件为禁用状态。
*/

class DeviceSelect extends Component {
  static propTypes = {
    stationCode: PropTypes.number,
    stationTypeCode: PropTypes.number,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    holderText: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onOK: PropTypes.func,
    style: PropTypes.object
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
      checkedDevices: [],
    }
  }

  componentWillReceiveProps(nextProps){
    const { stationCode, stationTypeCode } = nextProps;
    // 第一次拿到设备类型，设备型号。或两者发生变化时，调用。
    // getDevices
    // getPartition
    // getSliceDevices
  }

  componentWillUnmount(){
    // 卸载公用数据
  }

  // onOK = devices => { // 输出选中的设备数组。
  //   const { onChange,onOK } = this.props
  //   onOK && onOK(devices);
  //   onChange && onChange(devices);
  // }

  // onModalHandelOK = checkedDevices => {
  //   this.setState({
  //     deviceModalShow: false,
  //     checkedDevices
  //   })
  //   this.onOK(checkedDevices)
  // }

  // onSelect = (stationName) =>{
  //   const { data } = this.props;
  //   const checkedStations = data.filter(e=>e.stationName===stationName);
  //   const checkedStationName = checkedStations.map(e=>e.stationName);
  //   this.setState({
  //     checkedStationName,
  //     checkedStations
  //   })
  //   this.onOK(checkedStations)
  // }

  // hideStationModal = () => {
  //   this.setState({
  //     deviceModalShow: false,
  //   })
  // }

  // handleSearch = (text) => {
  //   const { data, disabledStation } = this.props;
  //   let filteredSelectedStation = data.filter(
  //     e=> !disabledStation.includes(e.stationCode) // 剔除禁选电站
  //   ).filter(
  //     e=>e.stationName.indexOf(text) >= 0
  //   );
  //   this.setState({
  //     checkedStationName:[text],
  //     filteredSelectedStation
  //   })
  // }

  // selectStation = (stations) => {//stations:选中的电站名称数组
  //   const { data, oneStyleOnly } = this.props;
  //   const checkedStations = data.filter(e=>stations.includes(e.stationName))
  //   if(oneStyleOnly){ // 只能选择一种类型电站
  //     const stationTypeSet = new Set();
  //     checkedStations.forEach(e=>{stationTypeSet.add(e.stationType)});
  //     if(stationTypeSet.size > 1){ // 选择了多种类型电站
  //       message.error('请选择同为风电或光伏的电站!')
  //       return;
  //     }
  //   }
  //   const checkedStationName = stations
  //   this.setState({
  //     stationModalShow: false,
  //     checkedStationName,
  //     checkedStations
  //   })
  //   this.onOK(checkedStations)
  // }
  
  // showStationModal = () => {
  //   !this.props.disabled && this.setState({
  //     stationModalShow: true,
  //   })
  // }

  render() {
    const { multiple, holderText, disabled } = this.props;
    const { stationModalShow, checkedDevices } = this.state;
    return (
      <div className={styles.stationSelect} style={this.props.style}>
        {multiple ? <Select
          mode="multiple"
          disabled={disabled}
          style={{ width: '100%' }}
          placeholder={holderText}
          onChange={this.selectDevice}
          value={checkedDevices}
          className={styles.stationSelectMainInput}
        >
          {data.filter(e=>!disabledStation.includes(e.stationCode)).map(e=>(
            <Option key={e.stationName}>{e.stationName}</Option>
          ))}
        </Select>:<AutoComplete
          disabled={disabled}
          style={{ width: '100%' }}
          onSearch={this.handleSearch}
          onSelect={this.onSelect}
          value={checkedStationName}
          placeholder={holderText}
        >
          {filteredSelectedStation.map((e) => (<Option key={e.stationName}>{e.stationName}</Option>))}
        </AutoComplete>}
        {/* <DeviceSelectModal 
          multiple={multiple}
          disabled={disabled}
          checkedStations={checkedStations}
          data={data} 
          handleOK={this.onModalHandelOK}
          stationModalShow={stationModalShow}
          hideStationModal={this.hideStationModal} 
          showStationModal={this.showStationModal}
        /> */}
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
  getDevices: params => dispatch({ // 获取设备列表
    type: commonAction.getDevices, 
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'devices',
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
  getSliceDevices: params => dispatch({ // 获取筛选后的设备
    type: commonAction.getSliceDevices, 
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'filterDevices',
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelect);