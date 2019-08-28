import React, { Component } from 'react';
import { Select, Form, Modal, Cascader } from 'antd';
import PropTypes from 'prop-types';
import styles from './realTimeWarning.scss';
import InputLimit from '../../../Common/InputLimit';
import WarningTip from '../../../Common/WarningTip';
const FormItem = Form.Item;
const Option = Select.Option;


class TransferWarningModal extends Component {
  static propTypes = {
    form: PropTypes.object,
    onTransferAlarm: PropTypes.func,
    defectTypes: PropTypes.array,
    selectedTransfer: PropTypes.array,
    onCancel: PropTypes.func,
    getLostGenType: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      showWarningTip: false,
      warningTipText: '',
    };
  }

  componentDidMount() {
    // 现在只是单电站转工单 如果是批量转工单,不需要查询stationType, deviceTypeCode，或者变成数组 
    const { selectedTransfer } = this.props;
    const stationType = Array.from(new Set(selectedTransfer.map(e => e.stationType)));
    const deviceTypeCode = Array.from((selectedTransfer.map(e => e.deviceTypeCode)));
    this.props.getLostGenType({
      objectType: 1,
      stationType: stationType.length > 0 && `${stationType[0]}` || null,
      deviceTypeCode: deviceTypeCode.length > 0 && deviceTypeCode[0] || null,
    });
  }

  onSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          showWarningTip: true,
          warningTipText: '确定是否要转工单',
        });
      }
    });
  }

  onTransferAlarm = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const warningLogId = this.props.selectedTransfer.map(e => e.warningLogId);
      if (!err) {
        this.props.onTransferAlarm({
          ...values,
          defectTypeCode: values.defectTypeCode[1],
          warningLogId: warningLogId,
        });
        this.props.onCancel();
      }
    });
    this.setState({ showWarningTip: false });
  }

  onCancelWarningTip = () => {//信息提示栏隐藏
    this.setState({
      showWarningTip: false,
    });
  }

  render() {
    const { defectTypes, theme } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { showWarningTip, warningTipText } = this.state;
    const tmpGenTypes = [];
    defectTypes.forEach(e => e && e.list && e.list.length > 0 && tmpGenTypes.push(...e.list));
    const groupedLostGenTypes = [];
    tmpGenTypes.map(ele => {
      if (ele && ele.list && ele.list.length > 0) {
        const innerArr = { children: [] };
        innerArr.label = ele.name;
        innerArr.value = ele.id;
        ele.list.forEach(innerInfo => {
          innerArr.children.push({
            label: innerInfo.name,
            value: innerInfo.id,
          });
        });
        groupedLostGenTypes.push(innerArr);
      }
    });
    return (
      <Form>
        {showWarningTip && <WarningTip
          hiddenCancel={false}
          onCancel={this.onCancelWarningTip}
          theme={theme}
          style={{ marginTop: '300px', width: '210px', height: '88px' }}
          onOK={this.onTransferAlarm} value={warningTipText} />}
        <span ref={'modal'} />
        <Modal title="转缺陷工单"
          className={styles.transferModal}
          style={{ minHeight: 450 }}
          bodyStyle={{ display: 'flex', flex: 1, flexDirection: 'column', padding: 24 }}
          width={625}
          visible={true}
          okText="保存"
          onOk={this.onSubmit}
          getContainer={() => this.refs.modal}
          onCancel={this.props.onCancel}>
          <FormItem className={styles.formItem} label="缺陷类型">
            {getFieldDecorator('defectTypeCode', {
              rules: [{
                required: true,
                message: '请选择缺陷类型',
              }],
            })(
              <Cascader
                disabled={groupedLostGenTypes.length === 0}
                style={{ width: 200 }}
                options={groupedLostGenTypes}
                expandTrigger="hover"
                placeholder="请选择"
                getPopupContainer={() => this.refs.modal}
              />
            )}
          </FormItem>
          <FormItem className={styles.formItem} label="缺陷描述">
            {getFieldDecorator('defectDescribe', {
              rules: [{
                required: true,
                message: '请输入缺陷描述',
              }],
            })(
              <InputLimit style={{ marginLeft: -80, marginTop: 4 }} placeholder="请输入不超过80字的缺陷描述..." />
            )}
          </FormItem>
          {/* <div className={styles.instructionText}>注意：保存后，多条告警将转为多个消缺工单。</div> */}
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(TransferWarningModal);
