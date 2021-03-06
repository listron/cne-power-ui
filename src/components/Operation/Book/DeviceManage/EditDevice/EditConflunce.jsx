
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../deviceSide.scss';

import { Input, Form, DatePicker, Select, Checkbox, Row, Col } from 'antd';
import BrachFormItem from '../AddDevice/BrachFormItem';
const FormItem = Form.Item;
const { Option } = Select;

class EditConflunce extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showAddComponentMode: false,
      showAddComponent: false,
      componentModeCodeAdd: '',
      manufacturerComAdd: '',
      checkStyle: [],

    };
  }
  showAddComponentMode = () => {
    this.setState({
      showAddComponentMode: true,
    });
  }
  cancleDeviceModeModal = () => {
    this.setState({
      showAddComponentMode: false,
    });
  }
  saveFormState = (record) => {
    this.setState({ componentModeCodeAdd: record.componentMode, manufacturerComAdd: record.manufacturerCom, showAddComponent: true });
  }
  checkstyle = (checked) => {
    this.setState({
      checkStyle: checked,
    });
  }

  // changeBranchCount = ({ target }) => { // 支路数据改变时的逻辑 => 改变支路数据 + 渲染每个支路默认信息
  //   const { value } = target || {};
  //   if (value > 0 && !isNaN(value) && !value.includes('.')) { // value 大于零 数字
  //     const brachNum = parseInt(value.trim(), 10); // 支路数
  //     const connectedBranches = this.props.form.getFieldValue('connectedBranches') || [];
  //     const newBranchesInfo = [];
  //     for (let i = 0; i < brachNum; i++) {
  //       const eachSubNum = connectedBranches[i];
  //       newBranchesInfo.push(eachSubNum === undefined ? '1' : eachSubNum);
  //     }
  //     this.props.form.setFieldsValue({
  //       branchCount: `${brachNum}`,
  //       connectedBranches: newBranchesInfo,
  //     });
  //   }
  // }

  render() {
    const { showAddComponentMode, showAddComponent, componentModeCodeAdd, manufacturerComAdd, checkStyle } = this.state;
    const { pvDeviceModels, stationDeviceDetail } = this.props;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const detailMap = stationDeviceDetail ? stationDeviceDetail.map : {};
    const { componentCount, connectedBranches } = detailMap;
    const branchCount = (getFieldValue('branchCount') && getFieldValue('branchCount') < 21) && getFieldValue('branchCount');
    const tmpBranchValues = [];
    for(let i = 0; i < 20; i++){
      const eachValue = connectedBranches[i];
      tmpBranchValues[i] = (eachValue === undefined) ? '1' : eachValue;
    }
    return (
      <div className={styles.rightStyles}>
        <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('componentMode', { initialValue: stationDeviceDetail.map.componentMode, rules: [{ required: true, message: '请选择组件型号' }] })(
            <Select className={styles.modelSelect} placeholder="请选择组件型号" >
              <Option key={'all'} value={''}>请选择组件型号</Option>
              {pvDeviceModels.map(e => {
                if (!e) { return null; }
                return <Option key={e.deviceModeCode} value={e.deviceModeId}>{e.deviceModeName}</Option>;
              })}
            </Select>
          )}

        </FormItem>
        <FormItem label="支路个数" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('branchCount', {
            initialValue: ((componentCount || componentCount === 0) ? componentCount : ''), rules: [
              { message: '1~20之间的整数', required: true, pattern: /^(0|1\d?|20?|[3-9])$/ },
            ],
          })(
            <Input placeholder="请输入..." />
            // {/*  <span>{stationDeviceDetail.map.branchCount}</span> */}
          )}
        </FormItem>
        <FormItem label="所用支路" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('connectedBranches', {
            initialValue: tmpBranchValues,
            rules: [{
              required: true,
              validator: (rule, value, callback) => {
                const noData = !value;
                const hasEmpty = value && value.find(e => !e && e !== 0); // 支路数未填全
                const hasInvalidData = value && value.find(e => e < 0 || e > 99); // 支路数据异常
                if (noData) {
                  callback('请填写支路信息');
                } else if (hasEmpty !== undefined) { // 某个支路信息不全
                  callback('请完善支路信息');
                } else if (hasInvalidData) { // 支路数据异常
                  callback('支路数量应为0-99的整数');
                }
                callback();
              },
            }],
          })(
            <BrachFormItem branchCount={branchCount || componentCount || 0} />
          )}
        </FormItem>
      </div>
    );
  }
}
export default (EditConflunce);

