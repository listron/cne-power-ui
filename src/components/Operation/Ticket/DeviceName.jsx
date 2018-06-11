import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectItem from '../../Common/SelectItem';
import Immutable from 'immutable';
import {Select, Button, Modal} from 'antd';
const Option = Select.Option;
import styles from './deviceName.scss';


class DeviceName extends Component {
  static propTypes = {
    show: PropTypes.bool,//控制对话框的显示和关闭
    stationName: PropTypes.string,//电站名称
    deviceType: PropTypes.string,//选中的电站类型
    deviceArea: PropTypes.string,//选中的分区
    deviceTypeItems: PropTypes.object,//电站类型的选项
    deviceAreaItems: PropTypes.object,//电站分区选项
    deviceItems: PropTypes.object,//设备列表
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onChangeType: PropTypes.func,
    onChangeArea: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedDevice: ""
    };
    this.onSelectItem = this.onSelectItem.bind(this);
  }

  onSelectItem(value) {
    this.setState({
      selectedDevice: value
    });
  }

  renderItems() {
    return this.props.deviceItems.map((item, index) => {
      return (
        <SelectItem
          key={"device"+index}
          label={item.get("value")}
          selected={this.state.selectedDevice === item.value}
          onSelect={this.onSelectItem}
       />
      );
    });
  }

  renderTypeItems() {
    return this.props.deviceTypeItems.map((item, index) => {
      return (
        <Option key={"type"+index}>
          {item.get("value")}
        </Option>                  
      );
    });
  }

  renderAreaItems() {
    return this.props.deviceAreaItems.map((item, index) => {
      return (
        <Option key={"area"+index}>
          {item.get("value")}
        </Option>                  
      );
    });
  }

  render() {
    return (
      <Modal
        visble={this.props.show}
        closable={false}
        onOk={()=>{this.props.onSave(this.state.selectedDevice)}}
        onCancel={this.props.onCancel}
        okText="保存"
      >
        <div className={styles.deviceNameSelect}>
          <div className={styles.header}>
            <div>
              正在查找<span style={{color:"#7ec5c2"}}>{this.props.stationName}</span>电站设备
            </div>
            <div>
              设备类型
              <Select 
                onChange={(value)=>{
                  this.props.onChangeType(value)
                }}
                style={{ width: 200 }}
                value={this.props.deviceType}>
                {this.renderTypeItems()}
              </Select>
            </div>
            {this.props.deviceAreaItems && this.props.deviceAreaItems.size > 0 &&
              <div>
                所属分区
                <Select 
                  onChange={(value)=>{
                    this.props.onChangeArea(value)
                  }}
                  placeholder="请选择"
                  style={{ width: 200 }}
                  value={this.props.deviceArea}>
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

export default DeviceName;