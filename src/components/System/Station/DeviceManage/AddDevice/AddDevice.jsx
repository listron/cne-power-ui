import React, { Component } from "react";
import PropTypes from "prop-types";
import StationSelect from '../../../../Common/StationSelect';
import { Button, Input, Form, Select, DatePicker, Icon } from 'antd';
import WarningTip from '../../../../../components/Common/WarningTip';
import styles from '../deviceSide.scss';
import AddDeviceForm from './AddDeviceForm';
import ShowAddDeviceModal from './ShowAddDeviceModal';
const FormItem = Form.Item;
const Option = Select.Option;

class AddDevice extends Component {
  static propTypes = {
    changeDeviceManageStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息无法保存!',
      showStep: 'pre',
      showAddDeviceModal: false,
      deviceTypeName: '',
      showAddDeviceType:false,
    }
  }

  onWarningTipShow = () => {
    this.setState({
      showWarningTip: true,
    })
  }
  confirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
    this.props.changeDeviceManageStore({
      showPage: 'list',
    });

  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }
  selectStation = (stations) => {
    const { getStationDeviceTypes, getDeviceList, queryParams, changeDeviceManageStore } = this.props;
    getStationDeviceTypes({
      stationCodes: stations[0].stationCode,
    });
    changeDeviceManageStore({
      deviceModels: []
    })
  }
  selectDeviceType = (value) => {
    const { getDeviceModel, getDeviceList, queryParams, stationCode } = this.props;
    getDeviceModel({
      stationCode,
      deviceTypeCode: value,
    });

  }
  showAddDeviceModal = () => {
    this.setState({
      showAddDeviceModal: true
    })
  }
  cancleAddDeviceModal = () => {
    this.setState({
      showAddDeviceModal: false
    })
  }
  nextStep = () => {
    this.setState({
      showStep: 'next'
    })
  }
  saveFormState = (record) => {
    console.log("record",record)
    this.setState({ deviceTypeName: record.deviceTypeName,showAddDeviceType:true })
  }
  render() {
    const { showWarningTip, warningTipText, showStep, showAddDeviceModal, deviceTypeName ,showAddDeviceType} = this.state;
    console.log('showAddDeviceType: ', showAddDeviceType);
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode, form } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const typeSelectDisable = stationDeviceTypes.length === 0;
    const selectStation = getFieldValue('stationCode')
    const selectdeviceType = getFieldValue('deviceTypeCode')
    const selectdeviceTypeName = deviceTypeName
    console.log('selectdeviceTypeName: ', selectdeviceTypeName);

    return (
      <div className={styles.addDevice}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>新增</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onWarningTipShow} />
        </div>
        {showStep === 'pre' && <Form className={styles.preFormStyle}>
          <FormItem label="电站名称" colon={false} className={styles.formItemStyle} >
            {getFieldDecorator('stationCode', {
              rules: [
                { message: '请选择电站', required: true, },
              ]
            })(
              <StationSelect
                data={allStationBaseInfo}
                onOK={this.selectStation}
                holderText="请选择电站"
              // value={allStationBaseInfo.filter(e => e.stationCode === stationCode)}
              />
            )}
          </FormItem>
          {showAddDeviceType ?
            <FormItem label="设备类型" colon={false} className={styles.formItemStyle}>
              {getFieldDecorator('deviceTypeName', {
                rules: [
                  { message: '设备名称不超过30字', required: true, type: 'string', max: 30 },
                ]
              })(
               <span>{selectdeviceTypeName}</span>
              )}
            </FormItem> :
            <FormItem label="设备类型" colon={false} className={styles.formItemStyle} >
              {getFieldDecorator('deviceTypeCode', {
                rules: [
                  { message: '请选择设备类型', required: true, },
                ]
              })(
                <Select className={styles.typeSelect} onChange={this.selectDeviceType}
                  //  value={deviceTypeCode}
                  placeholder="请选择设备类型"
                  disabled={typeSelectDisable}>
                  <Option key={null} value={null}>{'全部设备类型'}</Option>
                  {stationDeviceTypes.map(e => {
                    if (!e) { return null; }
                    return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                  })}
                </Select>
              )}
              <span className={styles.fontColor} onClick={this.showAddDeviceModal}>添加设备类型</span>
            </FormItem>}

          {(selectdeviceType || selectdeviceTypeName) && <Button type="primary" className={styles.nextButton} onClick={this.nextStep}>下一步</Button>}
        </Form>}
        {showStep === 'next' && <AddDeviceForm {...this.props} selectStation={selectStation} selectdeviceType={selectdeviceType||selectdeviceTypeName} />}
        {showAddDeviceModal && <ShowAddDeviceModal {...this.props} showAddDeviceModal={showAddDeviceModal} cancleAddDeviceModal={this.cancleAddDeviceModal} saveFormState={this.saveFormState} />}
      </div>
    )
  }
}
export default Form.create()(AddDevice)