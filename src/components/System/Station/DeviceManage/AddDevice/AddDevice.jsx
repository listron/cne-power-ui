import React, { Component } from "react";
import PropTypes from "prop-types";
import StationSelect from '../../../../Common/StationSelect';
import { Button, Input, Form, Select, DatePicker,Icon } from 'antd';
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
  cancleAddDeviceModal=()=>{
    this.setState({
      showAddDeviceModal: false
    })
  }
  render() {
    const { showWarningTip, warningTipText, showStep,showAddDeviceModal } = this.state;
    const { allStationBaseInfo, stationDeviceTypes, deviceModels, deviceTypeCode, deviceModeCode, stationCode, form } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const typeSelectDisable = stationDeviceTypes.length === 0;
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
          </FormItem>
          <Button type="primary" className={styles.nextButton}>下一步</Button>
        </Form>}
        {showStep === 'next' && <AddDeviceForm {...this.props} />}
        {showAddDeviceModal&&<ShowAddDeviceModal showAddDeviceModal={showAddDeviceModal} cancleAddDeviceModal={this.cancleAddDeviceModal} />}
      </div>
    )
  }
}
export default Form.create()(AddDevice)