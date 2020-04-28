import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import { Form, Select, Icon } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import styles from '../deviceSide.scss';
import AddDeviceForm from './AddDeviceForm';
import ShowAddDeviceModal from './ShowAddDeviceModal';
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;
const Option = Select.Option;
class AddDevice extends Component {
  static propTypes = {
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      showStep: 'pre',
      showAddDeviceModal: false,
      deviceTypeName: '',
      showAddDeviceName: false,
    };
  }
  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    });
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.changeDeviceManageStore({
      showPage: 'list',
    });
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  selectStation = (stations) => {
    const { getStationDeviceTypes, getDeviceList, queryParams, changeDeviceManageStore, getStationDeviceType, form } = this.props;
    this.props.changeDeviceManageStore({ addDeviceTypeData: {} });
    form.resetFields('deviceTypeCode');
    getStationDeviceType({ stationCode: stations[0].stationCode });



  }
  selectDeviceType = (value) => {
    const { getDeviceModel, getDeviceList, getConnectDevice, getPvDevice, queryParams } = this.props;
    const selectStation = this.props.form.getFieldValue('stationCode')[0];
    getDeviceModel({
      deviceTypeCode: value,
    });
    getPvDevice({
      deviceTypeCode: '509',
    });
    getConnectDevice({
      stationCode: selectStation.stationCode,
      deviceTypeCode: value,
    });

  }
  showAddDeviceModal = () => {
    this.setState({
      showAddDeviceModal: true,
    });
  }
  cancleAddDeviceModal = () => {
    this.setState({
      showAddDeviceModal: false,
    });
  }
  nextStep = () => {
    //在这请求关联设备的数据
    const selectdeviceType = this.props.form.getFieldValue('deviceTypeCode');

    this.setState({
      showStep: 'next', showAddDeviceName: false,
    });
    this.props.changeDeviceManageStore({ addSuccess: null });
    this.props.getDeviceFactors({
      deviceTypeCode: selectdeviceType,
      orderField: '1',
      orderMethod: 'desc',
    });
  }
  saveFormState = (record) => {
    this.setState({ deviceTypeName: record.addDeviceTypeCodeName, showAddDeviceName: true });
  }
  gobackPre = () => {
    this.setState({
      showStep: 'pre',
    });
    this.props.changeDeviceManageStore({ addDeviceTypeData: {} });
  }
  render() {
    const { showWarningTip, warningTipText, showStep, showAddDeviceModal, deviceTypeName, showAddDeviceName } = this.state;
    const { allStationBaseInfo, stationDevices, deviceModels, deviceTypeCode, deviceModeCode, stationCode, form, addDeviceTypeData } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const typeSelectDisable = stationDevices.length === 0;

    const selectStation = getFieldValue('stationCode');
    const selectdeviceType = getFieldValue('deviceTypeCode');
    const selectdeviceTypeName = deviceTypeName;
    const initi = addDeviceTypeData.data ? addDeviceTypeData.data : null;

    return (
      <div className={styles.addDevice}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>新增</span>
          <i className={`iconfont icon-fanhui ${styles.backIcon}`} title="返回" onClick={this.onWarningTipShow} />
        </div>
        {showStep === 'pre' && <Form className={styles.preFormStyle}>
          <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('stationCode', {
              rules: [
                { message: '请选择电站', required: true },
              ],
            })(
              <StationSelect
                data={allStationBaseInfo}
                onOK={this.selectStation}
                holderText="请选择电站"
              />
            )}
          </FormItem>

          <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('deviceTypeCode', {
              initialValue: initi,
              rules: [
                { message: '请选择设备类型', required: true },
              ],
            })(
              <Select className={styles.typeSelect} onChange={this.selectDeviceType}
                //  value={deviceTypeCode}
                placeholder="请选择设备类型"
                disabled={typeSelectDisable}>
                <Option key={null} value={null}>{'全部设备类型'}</Option>
                {stationDevices.map((e, i) => {
                  if (!e || e.deviceTypeCode === '509') { return null; }
                  return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>;

                })}
              </Select>
            )}
            <span className={styles.fontColor} onClick={selectStation ? this.showAddDeviceModal : null}>添加设备类型</span>
          </FormItem>


          {(selectdeviceType || selectdeviceTypeName) && <CneButton className={styles.nextButton} onClick={this.nextStep}>下一步</CneButton>}

        </Form>}
        {showStep === 'next' && <AddDeviceForm {...this.props} selectStation={selectStation} selectdeviceType={selectdeviceType || selectdeviceTypeName} gobackPre={this.gobackPre} />}
        {showAddDeviceModal && <ShowAddDeviceModal {...this.props} showAddDeviceModal={showAddDeviceModal} cancleAddDeviceModal={this.cancleAddDeviceModal} saveFormState={this.saveFormState} selectStation={selectStation[0].stationCode} />}
      </div>
    );
  }
}
export default Form.create()(AddDevice);
