import React, { Component } from "react";
import { Select, Table, Modal, Button, Icon, Tooltip, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import styles from "./warnConfig.scss";
import WarningTip from '../../../../Common/WarningTip';
import WarnRule from './WarnRule';
const Option = Select.Option;
const FormItem = Form.Item;
class EditRule extends Component {
  static propTypes = {
    form: PropTypes.object,
    warnDetail: PropTypes.object,
    changeWarnStore: PropTypes.func,
    modify: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '退出后信息将无法保存'
    }
  }

  onCancelEdit = () => { //  推出按钮
    this.setState({ showWarningTip: true })
  }

  saveRule = (e) => { // 保存
    const warningCheckId=this.props.warnDetail.warningCheckId;
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const { warningCheckDesc, warnRules, warningLevel, warningEnabled } = values;
        const params = {
          // warningTypeCode: 1,
          warningCheckId,
          warningCheckDesc,
          warningRuler: warnRules[0],
          warningValue: warnRules[1],
          warningDeadZone: warnRules[2],
          warningLevel,
          warningEnabled
        }
        this.props.modify(params)
      }
    });
  }

  cancelWarningTip = () => { // 取消
    this.setState({ showWarningTip: false })
  }

  confirmWarningTip = () => { // 确定
    this.setState({ showWarningTip: false })
    this.props.changeWarnStore({ showPage: 'home' })
  }

  render() {
    const { warnDetail } = this.props;
    const { showWarningTip, warningTipText } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.editRule} >
        {showWarningTip &&
          <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.editTop}>
          <span className={styles.text}>编辑</span>
          <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
        </div>
        <div className={styles.editCont}>
          <div className={styles.editBox}>
            <div className={styles.detail}>
              <div>所属电站 <span>{warnDetail.stationName || '--'}</span></div>
              <div>设备类型 <span>{warnDetail.deviceTypeName || '--'}</span></div>
              <div>设备型号 <span>{warnDetail.deviceModeName || '--'}</span></div>
              <div>测点描述 <span>{warnDetail.devicePointDesc || '--'}</span></div>
              <div>测点单位 <span>{warnDetail.devicePointUnit || '--'}</span></div>
            </div>
            <div className={styles.detailRule}>
              <Form layout="inline" className={styles.form}>
                <FormItem label="预警描述" colon={false}>
                  {getFieldDecorator('warningCheckDesc', {
                    rules: [{
                      required: true,
                      message: '请输入预警描述(不能超过30字)',
                      max: 30
                    }],
                    initialValue: warnDetail.warningCheckDesc
                  })(
                    <Input type="text" placeholder="不能超过30字" className={styles.warnDescribe} />
                  )}
                </FormItem>
                <FormItem label="预警规则" colon={false}>
                  {getFieldDecorator('warnRules', {
                    initialValue: [warnDetail.warningRuler, warnDetail.warningValue, warnDetail.warningDeadZone], // 经度，纬度
                    rules: [
                      { required: true, message: '请输入预警规则' },
                      {
                        validator: (rule, value, callback) => {
                          const [warningRuler, warningValue, warningDeadZone] = value;
                          // (!warningRuler) && callback('请选择预警规则');
                          (!warningValue) && callback('请输入预警值');
                          (!warningDeadZone) && callback('请输入震荡区间');
                          (isNaN(warningValue) || isNaN(warningDeadZone)) && callback('经纬度需为数字');
                          warningValue && warningDeadZone && warningDeadZone >= warningValue && callback('震荡区间的值不能大于预警值');
                          callback();
                        }
                      }],
                  })(
                    <WarnRule />
                  )}
                </FormItem>
                <FormItem label="预警级别" colon={false}>
                  {getFieldDecorator('warningLevel', {
                    rules: [{ required: true, message: '请选择预警级别' }],
                    initialValue: warnDetail.warningLevel,
                  })(
                    <Select className={styles.warningLevelSelect} placeholder="请选择">
                      <Option value={1}>{'一级'}</Option>
                      <Option value={2}>{'二级'}</Option>
                      <Option value={3}>{'三级'}</Option>
                      <Option value={4}>{'四级'}</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem label="是否启用" colon={false}>
                  {getFieldDecorator('warningEnabled', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: warnDetail.warningEnabled,
                  })(
                    <Select className={styles.useSelect} placeholder="请选择" >
                      <Option value={1}>{'是'}</Option>
                      <Option value={0}>{'否'}</Option>
                    </Select>
                  )}
                </FormItem>
                <div className={styles.buttonGroup}>
                  <Button onClick={this.saveRule} className={styles.save}>保存</Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(EditRule);