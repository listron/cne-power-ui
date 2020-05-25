

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Select, Input, Icon, AutoComplete } from 'antd';
import styles from './alarmEvent.scss';
import StationSelect from './StationSelect';
const FormItem = Form.Item;
const Option = Select.Option;

class SetVersionModal extends Component { //版本的设置
  static propTypes = {
    editVersionLoading: PropTypes.bool,
    staticData: PropTypes.array,
    stations: PropTypes.array,
    form: PropTypes.object,
    closeModal: PropTypes.func,
    selectVersion: PropTypes.object,
    type: PropTypes.string,
    editVersion: PropTypes.func,
    deviceTypes: PropTypes.array,
    filterConditionStations: PropTypes.func,
    changeStore: PropTypes.func,
    applyStations: PropTypes.array,
    filterStations: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      manufactors: [], // 生产厂家
      deviceModes: [], // 设备型号
      selectedModeCode: null, // 选中的设备型号
    };
  }

  componentDidMount() {
    const { selectVersion, staticData } = this.props;
    const { deviceTypeCode, manufactorCode, deviceModeCode } = selectVersion;
    if (deviceTypeCode) {
      const manufactors = staticData.filter(list => list.deviceTypeCode === deviceTypeCode)[0].manufactors;
      this.setState({ manufactors });
      this.props.filterConditionStations({ deviceTypeCode, deviceModeCode });
    }
    if (deviceModeCode) {
      const manufactors = staticData.filter(list => list.deviceTypeCode === deviceTypeCode)[0].manufactors;
      const deviceModes = manufactors.filter(list => list.manufactorCode === manufactorCode)[0].deviceModes;
      this.setState({ manufactors, deviceModes });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectVersion, staticData } = nextProps;
    const { deviceTypeCode, manufactorCode, deviceModeCode } = selectVersion;
    const prevSelectVersion = this.props.selectVersion || {};
    if (deviceModeCode !== prevSelectVersion.deviceModeCode || deviceTypeCode !== prevSelectVersion.deviceTypeCode) {
      const manufactors = staticData.filter(list => list.deviceTypeCode === deviceTypeCode)[0].manufactors;
      const deviceModes = manufactors.filter(list => list.manufactorCode === manufactorCode)[0].deviceModes;
      this.setState({ manufactors, deviceModes });
    }
  }

  onChangeDeviceType = (value) => { // 选择设备类型
    const { staticData } = this.props;
    const manufactors = staticData.filter(list => list.deviceTypeCode === value)[0].manufactors;
    this.setState({ manufactors, deviceModes: [] });
    this.props.form.setFieldsValue({ deviceTypeCode: value, manufactorCode: null, deviceModeCode: null });
    this.props.changeStore({ filterStations: [] }); //清空选中设备型号的电站
  }

  onChangeManufactor = (value) => { // 选择生产厂家
    const { manufactors } = this.state;
    const deviceModes = manufactors.filter(list => list.manufactorCode === value)[0].deviceModes;
    this.setState({ deviceModes });
    this.props.form.setFieldsValue({ deviceModeCode: null });
    this.props.changeStore({ filterStations: [] }); //清空选中设备型号的电站
  }

  onChangeDeviceModes = (value) => {
    const deviceTypeCode = this.props.form.getFieldValue('deviceTypeCode');
    const deviceModeCode = value;
    this.setState({ selectedModeCode: value });
    this.props.filterConditionStations({ deviceTypeCode, deviceModeCode });
  }

  cancelSetting = () => {
    this.props.closeModal(false);
  }

  confirmSetting = () => { // 确定
    const { form, type, selectVersion } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { deviceTypeCode, manufactorCode, deviceModeCode, version, stations } = values;
        const initStations = stations.map(e => ({ stationCode: e.stationCode, stationName: e.stationName }));
        let params = { deviceTypeCode, deviceModeCode, version, stations: initStations, extraInfo: { deviceTypeCode, manufactorCode, deviceModeCode } };
        if (type === 'edit') {
          params = {
            diagModeVersionId: selectVersion.diagModeVersionId, version, stations: initStations,
            extraInfo: { deviceTypeCode, manufactorCode, deviceModeCode, diagModeVersionId: selectVersion.diagModeVersionId },
          };
        } else { // 新增时候, 若version是从已有列表中选中的，需要额外传输对应的diagModeVersionId 生成copy版本
          const { deviceModes, selectedModeCode } = this.state;
          const modeInfo = deviceModes.find(e => e.deviceModeCode === selectedModeCode) || {};
          const versionList = modeInfo.versions || [];
          const copyVersionInfo = versionList.find(e => e.version === version);
          copyVersionInfo && (params.diagModeVersionId = copyVersionInfo.diagModeVersionId);
        }
        this.props.editVersion({ ...params, func: this.props.closeModal, type });
      }
    });
  }

  render() {
    const { stations, selectVersion, type, editVersionLoading, deviceTypes, applyStations = [], filterStations } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { manufactors, deviceModes, selectedModeCode } = this.state;
    const { deviceTypeCode, manufactorCode, deviceModeCode, version = '' } = selectVersion || {};
    let spareVersionList = []; // 编辑模式，不会出现可选软件版本替换copy情况;
    if (type !== 'edit') { // 新增时, 可能进行直接复制版本, 需要输出可选软件版本;
      const modeInfo = deviceModes.find(e => {
        // 直接点击 '添加软件版本' 按钮时: selectedModeCode必存在后更新;
        // 在树形结构设备型号+进行添加时, selectedModeCode初始不存在, 自动读取selectVersion.deviceModeCode
        if (selectedModeCode) {
          return e.deviceModeCode === selectedModeCode;
        }
        return e.deviceModeCode === deviceModeCode;
      }) || {}; // 可供选择的软件版本
      spareVersionList = modeInfo.versions || [];
    }
    console.log(selectVersion)
    return (
      <Modal
        title={<span>{type === 'edit' ? '编辑' : '添加'}</span>}
        visible={true}
        onCancel={this.cancelSetting}
        wrapClassName={styles.versionModal}
        width={625}
        footer={<div className={styles.footer}>
          <div onClick={this.cancelSetting} className={styles.cancel}>取 消</div>
          <Button onClick={this.confirmSetting} className={styles.confirm}>
            <div className={styles.buttonCont}>
              {editVersionLoading && <Icon type="loading" style={{ fontSize: 18 }} spin />} 确 定
            </div>
          </Button>
        </div>}
      >
        <div className={styles.addVersionWrap}>
          <Form className={styles.addVersionForm}>
            <FormItem label="设备类型" colon={false}>
              {getFieldDecorator('deviceTypeCode', {
                rules: [{ required: true, message: '请选择设备类型' }],
                initialValue: deviceTypeCode,
              })(
                <Select
                  style={{ width: 198 }}
                  placeholder="请选择"
                  disabled={type === 'edit'}
                  onChange={this.onChangeDeviceType}>
                  {deviceTypes.map(e => (
                    <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="生产厂家" colon={false}>
              {getFieldDecorator('manufactorCode', {
                rules: [{ required: true, message: '请选择生产厂家' }],
                initialValue: manufactorCode,
              })(
                <Select
                  style={{ width: 198 }}
                  placeholder="请选择"
                  disabled={manufactors.length === 0 || type === 'edit'}
                  onChange={this.onChangeManufactor}>
                  {manufactors.map(e => (
                    <Option key={e.manufactorCode} value={e.manufactorCode}>{e.manufactorName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="设备型号" colon={false}>
              {getFieldDecorator('deviceModeCode', {
                rules: [{ required: true, message: '请选择设备型号' }],
                initialValue: deviceModeCode || null,
              })(
                <Select
                  style={{ width: 198 }}
                  placeholder="设备型号"
                  disabled={deviceModes.length === 0 || type === 'edit'}
                  onChange={this.onChangeDeviceModes}
                >
                  {deviceModes.map(e => (
                    <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="软件版本" colon={false}>
              {getFieldDecorator('version', {
                rules: [{ required: true, message: '请选择软件版本' }],
                initialValue: version || null,
              })(
                <AutoComplete
                  dataSource={spareVersionList.map(e => e.version)}
                  className={styles.autoVersionComplete}
                  style={{ width: 198 }}
                />
              )}
            </FormItem>
            <FormItem label="电站名称" colon={false}>
              {getFieldDecorator('stations', {
                rules: [{ required: true, message: '请选择电站' }],
                initialValue: stations.filter(e => applyStations.map(e => e.stationCode).includes(e.stationCode)),
              })(
                <StationSelect
                  data={stations.filter(e => e.stationType !== 0)}
                  multiple={true}
                  onOK={this.onStationSelected}
                  filterStations={filterStations.map(e => e.stationCode)}
                  disabled={!getFieldValue('deviceModeCode')}
                />
              )}
            </FormItem>
          </Form>

        </div>

      </Modal>
    );
  }
}

export default Form.create()(SetVersionModal);
