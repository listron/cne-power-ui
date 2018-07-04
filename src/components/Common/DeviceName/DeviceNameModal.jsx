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
    // deviceTypeCode: PropTypes.number,//选中的设备类型编码
    deviceType: PropTypes.string,//选中的设备类型
    deviceCode: PropTypes.string,//选中的设备
    deviceAreaCode: PropTypes.string,//选中的分区编码
    // deviceTypeItems: PropTypes.object,//设备类型的选项
    deviceAreaItems: PropTypes.object,//电站分区选项
    deviceItems: PropTypes.object,//设备列表
    onSelectDevice: PropTypes.func,
    onCancel: PropTypes.func,
    // onChangeType: PropTypes.func,
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
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onChangeArea = this.onChangeArea.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.props.loadDeviceList(this.props.deviceAreaCode);
  }

  onSelectItem(value) {
    this.setState({
      selectedDeviceCode: value
    });
  }

  onChangeArea(value) {
    this.setState({
      selectedDeviceAreaCode: value
    });
    this.props.loadDeviceList(value);
  }

  onSave() {
    this.props.onSelectDevice(this.state.selectedDeviceCode);
    this.onCancel();
  }

  onCancel() {
    this.props.loadDeviceList('');
    this.props.onCancel();
  }

  renderItems() {
    let selectedDeviceCode = this.state.selectedDeviceCode !== '' ? this.state.selectedDeviceCode : this.props.deviceCode;
    if(this.props.deviceItems){
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
        closable={false}
        onOk={this.onSave}
        onCancel={this.onCancel}
        destroyOnClose={true}
        okText="保存"
      >
        <div className={styles.deviceNameSelect}>
          <div className={styles.header}>
            <div>
              正在查找<span style={{color:'#7ec5c2'}}>{this.props.stationName}</span>电站设备
            </div>
            <div>设备类型<span>{this.props.deviceType}</span></div>
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
                  style={{ width: 200 }}
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