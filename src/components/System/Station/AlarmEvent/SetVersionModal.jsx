

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form, Select, Input, Icon } from 'antd';
import styles from './alarmEvent.scss';
import StationSelect from './StationSelect';
const FormItem = Form.Item;
const Option = Select.Option;

class SetVersionModal extends Component { //版本的设置
  static propTypes = {
    staticData: PropTypes.array,
    stations: PropTypes.array,
    form: PropTypes.object,
    closeModal: PropTypes.func,
    selectVersion: PropTypes.object,
    type: PropTypes.string,
    editVersion: PropTypes.func,
    deviceTypes: PropTypes.array,
    FilterConditionStations: PropTypes.func,
    changeStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      manufactors: [], // 生产厂家
      deviceModes: [], // 设备型号
    };
  }

  componentDidMount() {
    const { selectVersion, staticData } = this.props;
    const { deviceTypeCode, manufactorCode, deviceModeCode } = selectVersion;
    if (deviceTypeCode) {
      const manufactors = staticData.filter(list => list.deviceTypeCode === deviceTypeCode)[0].manufactors;
      this.setState({ manufactors });
      this.props.FilterConditionStations({ deviceTypeCode, deviceModeCode });
    }
    if (deviceModeCode) {
      const manufactors = staticData.filter(list => list.deviceTypeCode === deviceTypeCode)[0].manufactors;
      const deviceModes = manufactors.filter(list => list.manufactorCode === manufactorCode)[0].deviceModes;
      this.setState({ manufactors, deviceModes });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectVersion, staticData, applayStations } = nextProps;
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
    this.props.FilterConditionStations({ deviceTypeCode, deviceModeCode });
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
        }
        this.props.editVersion({ ...params, func: this.props.closeModal, type });
      }
    });
  }



  render() {
    const { staticData, stations, selectVersion, type, editVersionLoading, deviceTypes, applyStations = [], filterStations } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { manufactors, deviceModes } = this.state;
    const { deviceTypeCode, manufactorCode, deviceModeCode, diagModeVersionId, version = '' } = selectVersion;
    // const deviceTypes = [
    //   { deviceTypeName: '集中式逆变器', deviceTypeCode: 201 },
    //   { deviceTypeName: '组串式逆变器', deviceTypeCode: 206 },
    //   { deviceTypeName: '箱变', deviceTypeCode: 304 },
    // ];
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
                rules: [{ required: true, message: '请选择设备型号' }],
                initialValue: version || null,
              })(
                <Input style={{ width: 198 }} />
              )}
            </FormItem>
            <FormItem label="电站名称" colon={false}>
              {getFieldDecorator('stations', {
                rules: [{ required: false, message: '请选择电站' }],
                initialValue: stations.filter(e => applyStations.map(e => e.stationCode).includes(e.stationCode)),
              })(
                <StationSelect
                  data={stations.filter(e => e.stationType !== 0)}
                  multiple={true}
                  onOK={this.onStationSelected}
                  filterStations={filterStations.map(e => e.stationCode)}
                  filterSwitch={!!getFieldValue('deviceModeCode')}
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
