import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Form, Select, Icon, Modal, message } from "antd";
import styles from "./partInfoBox.scss";
import CneButton from '@components/Common/Power/CneButton';
const FormItem = Form.Item;
const Option = Select.Option;
class ShowAddPartsModeModal extends Component {
  static propTypes = {
    cancleDeviceModeModal: PropTypes.func,
    changePartInfoStore: PropTypes.func,
    addPartsModes: PropTypes.func,
    showAddPartsMode: PropTypes.bool,
    form: PropTypes.object,
    partsFactorsList: PropTypes.array,
    manufacturerValue: PropTypes.string,
    deviceCode: PropTypes.string
  };
  constructor(props, context) {
    super(props, context);
  }
  // componentWillReceiveProps(nextProps) {
  //   const { checkDeviceModeOk, addDeviceTypeData, selectStation } = nextProps;
  //   if (checkDeviceModeOk !== this.props.checkDeviceModeOk && checkDeviceModeOk === true) {
  //     this.props.form.validateFieldsAndScroll(["addDeviceModeCodeName", "addManufacturer", "deviceTypeCode"], (err, values) => {
  //       if (!err) {
  // this.props.addDeviceMode({
  //   deviceTypeCode: addDeviceTypeData.deviceTypeCode ? `${addDeviceTypeData.deviceTypeCode}` : `${values.deviceTypeCode}`,
  //   // deviceTypeCode:'202',
  //   deviceModeName: values.addDeviceModeCodeName,
  //   manufacturer: values.addManufacturer,
  // })
  // this.props.getDeviceModel({
  //   // stationCode:selectStation?selectStation[0].stationCode:null,
  //   deviceTypeCode:this.props.selectdeviceType,
  // })
  // this.props.saveFormState(values)
  //         this.props.cancleDeviceModeModal()
  //       }
  //     })
  //   }
  // }
  handleCancel = () => {
    this.props.cancleDeviceModeModal();
  };
  confirmForm = e => {
    e.preventDefault();
    const { validateFieldsAndScroll } = this.props.form;
    const { deviceCode } = this.props;
    let deviceTypeCode = deviceCode.split("M")[1];
    validateFieldsAndScroll(
      ["addPartsModeCodeName", "addManufacturer", "deviceTypeCode"],
      (err, values) => {
        if (!err) {
          this.props.changePartInfoStore({
            manufactorId: values.addManufacturer
          });
          this.props.addPartsModes({
            assetsId: "",
            manufactorId: values.addManufacturer,
            deviceModeName: values.addPartsModeCodeName,
            deviceTypeCode
          });
          this.props.cancleDeviceModeModal();
        }
      }
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      showAddPartsMode,
      manufacturerValue,
      partsFactorsList
    } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 }
    };
    return (
      <Modal
        title="新增部件型号"
        visible={showAddPartsMode}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        centered={true}
        mask={false}
        footer={null}
        closable
        maskClosable={false}
      >
        <Form className={styles.preFormStyle}>
          <FormItem label="部件厂家" colon={false} {...formItemLayout}>
            {getFieldDecorator("addManufacturer", {
              initialValue: manufacturerValue,
              rules: [{ message: "不超过30字", required: true }]
            })(
              <Select
                className={styles.modelSelect}
                placeholder="请选择生产厂家"
                disabled={!!manufacturerValue}
              >
                <Option key={"all"} value={""}>
                  请选择生产厂家
                </Option>
                {partsFactorsList.map((e, i) => {
                  if (!e) {
                    return null;
                  } else {
                    return (
                      <Option key={e.manufactorCode} value={e.manufactorId}>
                        {e.manufactorName}
                      </Option>
                    );
                  }
                })}
              </Select>
            )}
          </FormItem>
          <FormItem label="部件型号" colon={false} {...formItemLayout}>
            {getFieldDecorator("addPartsModeCodeName", {
              rules: [
                {
                  message: "设备型号不超过30字",
                  required: true,
                  type: "string",
                  max: 30
                }
              ]
            })(<Input placeholder="请输入..." />)}
          </FormItem>

          <CneButton
            onClick={this.confirmForm}
            className={styles.nextButton}
          >
            确定
          </CneButton>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(ShowAddPartsModeModal);
