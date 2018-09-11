import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeviceItem from './DeviceItem';
import {Select, Modal} from 'antd';
const Option = Select.Option;
import styles from './style.scss';


class DeviceNameModal extends Component {
  static propTypes = {
    show: PropTypes.bool,//控制对话框的显示和关闭
    stationName: PropTypes.string,//电站名称
    deviceType: PropTypes.string,//选中的设备类型
    deviceCode: PropTypes.string,//选中的设备
    deviceAreaCode: PropTypes.string,
    deviceAreaItems: PropTypes.object,//电站分区选项
    deviceItems: PropTypes.object,//设备列表
    onSelectDevice: PropTypes.func,
    onCancel: PropTypes.func,
    onChangeArea: PropTypes.func,
    loadDeviceList: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedDeviceCode: '',
      selectedDeviceAreaCode: ''
    };
  }

  componentDidMount() {
    this.props.loadDeviceList(this.props.deviceAreaCode);
  }

  onSelectItem = (value) => {
    this.setState({
      selectedDeviceCode: value
    });
  }

  onChangeArea = (value) => {
    this.setState({
      selectedDeviceAreaCode: value
    });
    this.props.loadDeviceList(value);
  }

  onSave = () => {
    this.props.onSelectDevice(this.state.selectedDeviceCode);
    this.onCancel();
  }

  onCancel = () => {
    this.props.loadDeviceList('');
    this.props.onCancel();
  }

  renderItems() {
    let selectedDeviceCode = this.state.selectedDeviceCode !== '' ? this.state.selectedDeviceCode : this.props.deviceCode;
    return this.props.deviceItems.map((item, index) => {
      return (
        <DeviceItem
          key={'device'+index}
          item={item}
          selected={selectedDeviceCode === item.get('deviceCode')}
          onSelect={this.onSelectItem}
       />
      );
    });
    
  }

  // renderTypeItems() {
  //   return this.props.deviceTypeItems.map((item, index) => {
  //     return (
  //       <Option key={item.get('deviceTypeCode')} value={item.get('deviceTypeCode')}>
  //         {item.get('deviceTypeName')}
  //       </Option>                  
  //     );
  //   });
  // }

  renderAreaItems() {
    return this.props.deviceAreaItems.map((item, index) => {
      return (
        <Option key={item.get('deviceCode')} value={item.get('deviceCode')}>
          {item.get('deviceName')}
        </Option>                  
      );
    });
  }

  render() {
    return (
      <Modal
        visible={this.props.show}
        title="请选择"
        onOk={this.onSave}
        onCancel={this.onCancel}
        destroyOnClose={true}
        width={635}
        okText="保存"
      >
        <div className={styles.deviceNameSelect}>
          <div className={styles.header}>
            <div>设备类型<span className={styles.deviceType}>{this.props.deviceType}</span></div>
            {/* <div>
              设备类型
              <Select
                onChange={(value)=>{
                  this.props.onChangeType(value)
                }}
                style={{ width: 200 }}
                value={this.props.deviceTypeCode}>
                {this.renderTypeItems()}
              </Select>
            </div> */}
            {this.props.deviceAreaItems && this.props.deviceAreaItems.size > 0 &&
              <div>
                所属分区
                <Select 
                  onChange={(value)=>{
                    this.onChangeArea(value)
                  }}
                  placeholder="请选择"
                  style={{ width: 112, marginLeft: 8 }}
                  value={this.state.selectedDeviceAreaCode !== '' ? this.state.selectedDeviceAreaCode : this.props.deviceAreaCode}>
                  {this.renderAreaItems()}
                </Select>
              </div>
            }
          </div>
          <div className={styles.content}>
            {this.renderItems()}
          </div>
        </div>
      </Modal>
    );
  }

}

export default DeviceNameModal;