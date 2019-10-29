import React, { Component } from 'react';
import { Modal, Select, Checkbox, message } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';
const { Option } = Select;

class DeviceSelectModal extends Component {
  static propTypes = {
    max: PropTypes.number,
    stationCode: PropTypes.number, // 需传props
    deviceTypeCode: PropTypes.number,
    needAllCheck: PropTypes.bool,
    deviceModalShow: PropTypes.bool,
    checkedDevice: PropTypes.array,
    filterDevices: PropTypes.array,
    disabledDevice: PropTypes.array,
    partitions: PropTypes.array,
    filterKey: PropTypes.array,
    devices: PropTypes.array,
    multiple: PropTypes.bool,
    hideModal: PropTypes.func,
    showModal: PropTypes.func,
    handleOK: PropTypes.func,
    getDevices: PropTypes.func,
    changeCommonStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      modalDevices: [], // modal弹框中的所有设备。
      checkedDevice: [...props.checkedDevice], // 选中的设备。
      checkedMatrix: null, // 默认选中的方阵
      checkAll: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { filterDevices, deviceTypeCode, filterKey, partitions } = nextProps;
    const prePartitions = this.props.partitions;
    const newState = { modalDevices: [...filterDevices] };
    if (filterKey.includes(deviceTypeCode) && (partitions.length > 0 && prePartitions.length === 0)) {
      newState.checkedMatrix = partitions[0].deviceCode;
    }
    this.setState({ ...newState });
  }

  showModal = () => {
    const { filterDevices, showModal, checkedDevice } = this.props;
    showModal();
    this.setState({
      modalDevices: filterDevices,
      checkedDevice: [...checkedDevice],
    });
  }

  handleOK = () => {
    const { devices, deviceTypeCode, filterKey, changeCommonStore } = this.props;
    if (!filterKey.includes(deviceTypeCode)) { // 非必须分区展示的设备类型,弹框内数据需重置。
      changeCommonStore({ filterDevices: devices }); //  筛选后数据还原为原始所有设备
      this.setState({ checkedMatrix: null });
    }
    this.props.handleOK(this.state.checkedDevice);
  }

  hideModal = () => {
    const { devices, deviceTypeCode, filterKey, changeCommonStore } = this.props;
    if (!filterKey.includes(deviceTypeCode)) { // 非必须分区展示的设备类型,弹框内数据需重置。
      changeCommonStore({ filterDevices: devices }); // 筛选后数据还原为原始所有设备
      this.setState({ checkedMatrix: null }); // 选中分区重置
    }
    this.props.hideModal(); // 
  }

  matrixChange = partitionCode => { // 请求分区数据。
    const { stationCode, deviceTypeCode } = this.props;
    this.setState({ checkedMatrix: partitionCode });
    this.props.getDevices({ stationCode, deviceTypeCode, partitionCode }, 'filterDevices');
  }

  checkDevice = device => { // 点击选中设备
    const { multiple, max } = this.props;
    const { checkedDevice = [], modalDevices = [] } = this.state;
    if (multiple) { // 多选
      if (checkedDevice.find(e => e.deviceCode === device.deviceCode)) { // 已选中删除
        this.setState({
          checkedDevice: checkedDevice.filter(e => e.deviceCode !== device.deviceCode),
        });
      } else { // 添加选中
        if (max > 0 && checkedDevice.length === max) {
          message.error(`所选设备不得超过${max}个`);
          return;
        }
        checkedDevice.push(device);
        this.setState({ checkedDevice });
        // 所选设备的全部
        const checkedDeviceCode = checkedDevice.map(e => e.deviceId);
        const modalDeviceCode = modalDevices.map(e => e.deviceId);
        if (modalDeviceCode.length > 0 && checkedDeviceCode.length > 0 && modalDeviceCode.length === checkedDeviceCode.length) {
          this.setState({ checkAll: true });
        }
      }
    } else { // 单选
      this.setState({ checkedDevice: [device] });
    }
  }

  clearDevice = () => { // 清除所有选中设备
    this.setState({ checkedDevice: [], checkAll: false });
  }

  cancelChecked = (deviceCode) => { // 取消单个选中设备。
    const { checkedDevice } = this.state;
    const newDevices = checkedDevice.filter(e => e.deviceCode !== deviceCode);
    this.setState({ checkedDevice: newDevices, checkAll: false });
  }

  allCheckDevice = (e) => { //全部选择
    const checked = e.target.checked;
    const { modalDevices } = this.state;
    const { max } = this.props;
    if (max > 0 && modalDevices.length >= max) {
      message.error(`所选设备不得超过${max}个`);
      return;
    }
    if (checked) {
      this.setState({ checkedDevice: modalDevices, checkAll: true });
    } else {
      this.setState({ checkedDevice: [], checkAll: false });
    }
  }

  render() {
    const { deviceModalShow, partitions, multiple, needAllCheck, max, disabledDevice } = this.props;
    const { modalDevices, checkedDevice, checkedMatrix } = this.state;
    const { deviceTypeName } = modalDevices[0] || {};
    return (
      <div className={styles.deviceSelectModal}>
        <i className="iconfont icon-filter" onClick={this.showModal} />
        <Modal
          visible={deviceModalShow}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title={`请选择${multiple && max > 0 ? ` (最多选择${max}个)` : ''}`}
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
                value={checkedMatrix}
                style={{ width: 112 }}
              >
                {partitions.map(e => (<Option key={e.deviceCode} value={e.deviceCode}>
                  {e.deviceName}
                </Option>))}
              </Select>
            </div>
            {/*  多选 需要全选字段 无分区 */}
            {multiple && needAllCheck && !checkedMatrix && <div className={styles.allCheckDevice}>
              <Checkbox onChange={this.allCheckDevice} checked={this.state.checkAll}>全选</Checkbox>
            </div>}
            <div className={styles.deviceList}>
              {modalDevices.map(e => {
                const activeDevice = checkedDevice.some(info => info.deviceCode === e.deviceCode);
                const disableCheck = disabledDevice.includes(e.deviceCode);
                return multiple ?
                  (<React.Fragment>
                    <div
                      // onClick={()=>this.checkStation(m)} 
                      key={e.deviceCode}
                      title={e.stationName}
                      style={{ 'backgroundColor': activeDevice ? '#199475' : '#f1f1f1' }}
                      className={styles.eachDevice}>
                      <Checkbox
                        style={{ color: activeDevice ? '#fff' : '#666' }}
                        onChange={() => this.checkDevice(e)}
                        checked={activeDevice}
                        disabled={disableCheck}
                      >
                        {e.deviceName}
                      </Checkbox>
                    </div>
                  </React.Fragment>) :
                  (<div
                    key={e.deviceCode}
                    onClick={disableCheck ? null : () => this.checkDevice(e)}
                    className={styles.eachDevice}
                    style={{
                      backgroundColor: activeDevice ? '#199475' : '#f1f1f1',
                      color: activeDevice ? '#fff' :
                        (disableCheck ? '#dfdfdf' : '#666'),
                      cursor: disableCheck ? 'not-allowed' : 'pointer',
                    }}
                  >{e.deviceName}</div>);
              })}
            </div>
            <div className={styles.checkedList}>
              <div className={styles.top}>
                <span>已选设备 {checkedDevice.length}个</span>
                <span className={styles.clear} onClick={this.clearDevice}>清空</span>
              </div>
              <div className={styles.checkedInfo}>
                {checkedDevice.map((e, index) => (
                  <span key={e.deviceCode + index} className={styles.eachDevice}>
                    <span className={styles.name}>{e.deviceName}</span>
                    <span className={styles.cancel} onClick={() => this.cancelChecked(e.deviceCode)}>X</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );

  }
}
export default DeviceSelectModal;
