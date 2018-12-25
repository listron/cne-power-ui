import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeviceItem from './DeviceItem';
import { Select, Modal } from 'antd';
const Option = Select.Option;
import styles from './style.scss';


class DeviceNameModal extends Component {
  static propTypes = {
    show: PropTypes.bool,//控制对话框的显示和关闭
    deviceType: PropTypes.string,//选中的设备类型
    deviceCode: PropTypes.string,//选中的设备
    deviceAreaCode: PropTypes.string,
    deviceAreaItems: PropTypes.object,//电站分区选项
    deviceItems: PropTypes.object,//设备列表
    onSelectDevice: PropTypes.func,
    onCancel: PropTypes.func,
    onChangeArea: PropTypes.func,
    loadDeviceList: PropTypes.func,
    firstPartitionCode: PropTypes.string,
    deviceTypeCode:PropTypes.string,
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
    this.props.onChangeArea(value);
  }

  onSave = () => { // 点击保存
    this.props.onSelectDevice(this.state.selectedDeviceCode);
    this.onCancel();
  }

  onCancel = () => { // 点击取消
    this.props.loadDeviceList('');
    this.props.onCancel();
  }

  renderItems() {
    let selectedDeviceCode = this.state.selectedDeviceCode !== '' ? this.state.selectedDeviceCode : this.props.deviceCode;
    return this.props.deviceItems.map((item, index) => {
      return (
        <DeviceItem
          key={'device' + index}
          item={item}
          selected={selectedDeviceCode === item.deviceCode}
          onSelect={this.onSelectItem}
        />
      );
    });
  }

  renderAreaItems() {
    let { deviceAreaItems } = this.props;
    return deviceAreaItems.map((item, index) => {
      return (
        <Option key={item.deviceCode} value={item.deviceCode}>
          {item.deviceName}
        </Option>
      );
    });
  }

  render() {
    let { firstPartitionCode, deviceTypeCode ,show,deviceType,deviceAreaItems} = this.props;
    return (
      <Modal
        visible={show}
        title="请选择"
        onOk={this.onSave}
        onCancel={this.onCancel}
        destroyOnClose={true}
        width={635}
        okText="保存"
      >
        <div className={styles.deviceNameSelect}>
          <div className={styles.header}>
            <div>设备类型<span className={styles.deviceType}>{deviceType}</span></div>
            {deviceAreaItems && deviceAreaItems.length > 0 &&
              <div>
                所属分区
                <Select
                  onChange={(value) => {
                    this.onChangeArea(value)
                  }}
                  placeholder="请选择"
                  style={{ width: 112, marginLeft: 8 }}
                  defaultValue={deviceTypeCode===509?firstPartitionCode:null}
                >
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