import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';
import ShowAddComponentMode from './ShowAddComponentMode';
import { Input, Form, DatePicker, Select, Checkbox, Row, Col } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class Confluence extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showAddComponentMode: false,
      showAddComponent: false,
      componentModeCodeAdd: '',
      manufacturerComAdd: '',

    }
  }
  showAddComponentMode = () => {
    this.setState({
      showAddComponentMode: true
    })
  }
  cancleDeviceModeModal = () => {
    this.setState({
      showAddComponentMode: false
    })
  }
  saveFormState = (record) => {
    console.log(record, "record");
    this.setState({ componentModeCodeAdd: record.componentMode, manufacturerComAdd: record.manufacturerCom, showAddComponent: true })
  }
  render() {
    const { showAddComponentMode, showAddComponent, componentModeCodeAdd, manufacturerComAdd } = this.state;
    const { pvDeviceModels } = this.props;
    console.log('pvDeviceModels: ', pvDeviceModels);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const branchCount = getFieldValue("branchCount");
    console.log('branchCount: ', branchCount);
    let branchCountArr = [];
    for (let i = 0; i < branchCount; i++) {
       branchCountArr.push(i+1)
    }
    return (
      <div className={styles.rightStyles}>
        {showAddComponent ? <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('componentName', )(
            <span>{componentModeCodeAdd}</span>
          )} <span className={styles.fontColor} onClick={this.showAddComponentMode}>添加设备型号</span>
        </FormItem> : <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('componentMode')(
              <Select className={styles.modelSelect} placeholder="请选择组件型号" disabled={pvDeviceModels.length === 0} >
                {pvDeviceModels.map(e => {
                  if (!e) { return null; }
                  return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                })}
              </Select>
            )}
            <span className={styles.fontColor} onClick={this.showAddComponentMode}>添加设备型号</span>
          </FormItem>}
        <FormItem label="支路个数" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('branchCount', {
            rules: [
              { message: '1~20之间的整数', required: true, pattern: /^(0|1\d?|20?|[3-9])$/ },
            ]
          })(
            <Input placeholder="1~20之间的整数" />
          )}
        </FormItem>
        <FormItem label="所用支路" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('connectedBranches', {
            rules: [
              { message: '选择所用支路', required: true, },
            ]
          })(
            <Checkbox.Group>
              <Row>
                {branchCountArr.map((e, i) => {
                  return (
                    <Col span={3} key={i}>
                      <div>第{e}支路</div>
                      <Checkbox value={e} key={i}></Checkbox>
                    </Col>)
                })}
              </Row>
            </Checkbox.Group>,

          )}
          <div className={styles.linestyle}>(  点击后变<span className={styles.selectRingStyle}></span>，表示接入;<span className={styles.ringStyle}></span>表示未接入 )</div>
        </FormItem>
        {showAddComponentMode && <ShowAddComponentMode {...this.props} showAddComponentMode={showAddComponentMode} cancleDeviceModeModal={this.cancleDeviceModeModal} saveFormState={this.saveFormState} />}
      </div>
    )
  }
}
export default (Confluence)
