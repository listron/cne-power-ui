import React, { Component } from 'react';
import { Modal, Select  } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';
const { Option } = Select;

class DeviceSelectModal extends Component {
  static propTypes = {
    stationCode: PropTypes.number, // 需传props
    deviceTypeCode: PropTypes.number,
    deviceModalShow: PropTypes.bool,
    checkedDevice: PropTypes.array,
    filterDevices: PropTypes.array,
    partitions: PropTypes.array,
    filterKey: PropTypes.array,
    multiple: PropTypes.bool,
    hideModal: PropTypes.func,
    showModal: PropTypes.func,
    handleOK: PropTypes.func,
    getDevices: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      modalDevices: [], // modal弹框中的所有设备。
      checkedDevice: props.checkedDevice, // 选中的设备。
    }
    this.partitionId = 0;
  }

  componentWillReceiveProps(nextProps) {
    const {  filterDevices  } = nextProps;
    this.setState({ modalDevices: filterDevices });
  }
  
  handleOK = () => {
    this.partitionId = 0; // 重置
    this.props.handleOK(this.state.checkedDevice);
  }

  hideModal = () => {
    this.partitionId = 0; // 重置
    this.props.hideModal();
  }

  matrixChange = partitionCode => { // 请求分区数据。
    this.partitionId++; // 记录分区特殊标识。触发后开始使用filtered数据作为设备数据源。
    const { stationCode, deviceTypeCode } = this.props;
    this.props.getDevices({ stationCode, deviceTypeCode, partitionCode }, 'filterDevices' );
  }

  checkDevice = device => { // 点击选中设备
    const { multiple } = this.props;
    const { checkedDevice } = this.state;
    if (multiple) { // 多选
      if (checkedDevice.find(e => e.deviceCode === device.deviceCode)) { // 已选中删除
        this.setState({
          checkedDevice: checkedDevice.filter(e => e.deviceCode !== device.deviceCode)
        })
      } else { // 添加选中
        checkedDevice.push(device);
        this.setState({ checkedDevice });
      }
    } else { // 单选
      this.setState({checkedDevice: [device] });
    }
  }

  clearDevice = () => { // 清除所有选中设备
    this.setState({checkedDevice: []});
  }

  cancelChecked = (deviceCode) => { // 取消单个选中设备。
    const { checkedDevice } = this.state;
    const newDevices = checkedDevice.filter(e => e.deviceCode !== deviceCode);
    this.setState({checkedDevice: newDevices});
  }

  render() {
    const { deviceModalShow, showModal, partitions } = this.props;
    const { modalDevices, checkedDevice } = this.state;
    const { deviceTypeName, deviceTypeCode } = modalDevices[0] || {};
    const partitionCode = partitions[0] && partitions[0].deviceCode;
    return (
      <div className={styles.deviceSelectModal}>
        <i className="iconfont icon-filter" onClick={showModal} />
        <Modal
          visible={deviceModalShow}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="保存"
          title="请选择"
          width={625}
          wrapClassName={styles.deviceModal}
        >
          <div className={styles.deviceContent}>
            <div className={styles.header}>
              <span>设备类型</span>
              <span className={styles.deviceType}>{deviceTypeName}</span>
              <span>所属分区</span>
              <Select
                onChange={this.matrixChange}
                placeholder="请选择"
                defaultValue={deviceTypeCode === 509 ? partitionCode : null}
                style={{ width: 112 }}
              >
                {partitions.map(e => (<Option key={e.deviceCode} value={e.deviceCode}>
                  {e.deviceName}
                </Option>))}
              </Select>
            </div>
            <div className={styles.deviceList}>
              {modalDevices.map(e => {
                const activeDevice = checkedDevice.find(info => info.deviceCode === e.deviceCode);
                return (<span
                  key={e.deviceCode}
                  onClick={()=>this.checkDevice(e)}
                  className={styles.eachDevice}
                  style={{
                    backgroundColor: activeDevice ? '#199475' : '#f1f1f1',
                    color: activeDevice ? '#fff' : '#666',
                  }}
                >{e.deviceName}</span>)
              })}
            </div>
            <div className={styles.checkedList}>
              <div className={styles.top}>
                <span>已选设备 {checkedDevice.length}个</span>
                <span className={styles.clear} onClick={this.clearDevice}>清空</span>
              </div>
              <div className={styles.checkedInfo}>
                {checkedDevice.map(e => (
                  <span key={e.deviceCode} className={styles.eachDevice}>
                    <span className={styles.name}>{e.deviceName}</span>
                    <span className={styles.cancel} onClick={() => this.cancelChecked(e.deviceCode)}>X</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
    
  }
}
export default DeviceSelectModal;