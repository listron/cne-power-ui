import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import {AutoComplete, Input, Icon} from 'antd';
const Option = AutoComplete.Option;
import DeviceNameModal from './DeviceNameModal';

class DeviceName extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    stationName: PropTypes.string,//电站名称
    deviceType: PropTypes.string,//设备类型
    deviceAreaCode: PropTypes.string,//选中的设备分区编码
    value: PropTypes.string,//选中的设备编码
    deviceTypeItems: PropTypes.object,//电站类型的选项
    deviceAreaItems: PropTypes.object,//电站分区选项
    deviceItems: PropTypes.object,//设备列表
    onChange: PropTypes.func,
    loadDeviceList: PropTypes.func,
    onChangeArea: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showDeviceNameModal: false,
    };
    this.onShowDeviceNameModal = this.onShowDeviceNameModal.bind(this);
    this.onCloseDeviceNameModal = this.onCloseDeviceNameModal.bind(this);
  }

  onShowDeviceNameModal() {
    this.setState({
      showDeviceNameModal: true
    });
  }

  onCloseDeviceNameModal() {
    this.setState({
      showDeviceNameModal: false
    })
  }

  getDeviceItems() {
    return this.props.deviceItems.map((item, index) => {
      return (
        <Option key={item.get('deviceCode')} value={item.get('deviceCode')}>
          {item.get('deviceName')}
        </Option>
      )
    })
  }

  getDeviceName(code) {
    let deviceName = '';
    let index = this.props.deviceItems.findIndex((item) => {
      return item.get('deviceCode') === code
    });
    if(index !== -1) {
      deviceName = this.props.deviceItems.getIn([index, 'deviceName']);
    }
    return deviceName;
    
  }

  render() {
    let options = this.getDeviceItems();
    return (
      <div className={styles.deviceName}>
        <AutoComplete 
          style={{ width: '100%' }}
          dataSource={options}
          disabled={this.props.disabled}
          onSelect={this.props.onChange}
          value={this.getDeviceName(this.props.value)}
          filterOption={(inputValue, option) => 
          option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        >
          <Input
            disabled={this.props.disabled}
            value={this.getDeviceName(this.props.value)}
            placeholder={this.props.placeholder} 
            suffix={<Icon disabled={this.props.disabled} type="filter" onClick={this.onShowDeviceNameModal} />} />
        </AutoComplete>
        {this.state.showDeviceNameModal && <DeviceNameModal
          show={this.state.showDeviceNameModal}
          stationName={this.props.stationName}
          deviceType={this.props.deviceType}
          deviceCode={this.props.value}
          deviceAreaCode={this.props.deviceAreaCode}
          deviceAreaItems={this.props.deviceAreaItems}
          deviceItems={this.props.deviceItems}
          onSelectDevice={this.props.onChange}
          onCancel={this.onCloseDeviceNameModal}
          loadDeviceList={this.props.loadDeviceList}
          onChangeArea={this.props.onChangeArea}
        />}
      </div>
    );  
  }
}

export default DeviceName;