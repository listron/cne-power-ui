
import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from '../deviceSide.scss';

import { Input, Form, DatePicker, Select, Checkbox, Row, Col } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

class EditConflunce extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showAddComponentMode: false,
      showAddComponent: false,
      componentModeCodeAdd: '',
      manufacturerComAdd: '',
      checkStyle:[],

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
    this.setState({ componentModeCodeAdd: record.componentMode, manufacturerComAdd: record.manufacturerCom, showAddComponent: true })
  }
  checkstyle=(checked)=>{
    this.setState({
      checkStyle:checked
    })
  }
  render() {
    const { showAddComponentMode, showAddComponent, componentModeCodeAdd, manufacturerComAdd,checkStyle } = this.state;
    const { pvDeviceModels, stationDeviceDetail } = this.props;

    const { getFieldDecorator, getFieldValue } = this.props.form;
    const detailMap = stationDeviceDetail ? stationDeviceDetail.map : {};
    const branchCount = detailMap ? detailMap.connectedBranches : [];
    const componentCount = getFieldValue("branchCount");
    let branchCountArr = [];
    for (let i = 0; i < componentCount; i++) {
      branchCountArr.push(i + 1)
    }
    // const branchCountArr=branchCount.map((e,i)=>{
    // return e===1?i+1:null
    // })
    let initChecked = [];
    branchCount.forEach((e, i) => {
      if (e) {
        initChecked.push(i + 1)
      
      }
    })
    return (
      <div className={styles.rightStyles}>
        <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('componentMode', { initialValue: stationDeviceDetail.map.componentMode,rules:[{required: true,message: '请选择组件型号',}] })(
            <Select className={styles.modelSelect} placeholder="请选择组件型号"  >
            <Option key={'all'} value={''}>请选择组件型号</Option>
              {pvDeviceModels.map(e => {
                if (!e) { return null; }
                return <Option key={e.deviceModeCode} value={e.deviceModeId}>{e.deviceModeName}</Option>
              })}
            </Select>
          )}

        </FormItem>
        <FormItem label="支路个数" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('branchCount', {
            initialValue: ((stationDeviceDetail.map.componentCount || +stationDeviceDetail.map.componentCount === 0) ? stationDeviceDetail.map.componentCount : ''), rules: [
              { message: '1~20之间的整数', required: true, pattern: /^(0|1\d?|20?|[3-9])$/ },
            ]
          })(
            <Input placeholder="请输入..." />
            // {/*  <span>{stationDeviceDetail.map.branchCount}</span> */}
          )}
        </FormItem>
        <FormItem label="所用支路" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('connectedBranches', { initialValue: initChecked, })(
            <Checkbox.Group className={styles.checkboxStyle} onChange={this.checkstyle} >
             
                {(branchCountArr).map((e, i) => {
                  let filterStyle=checkStyle.length>0?(checkStyle.includes(i+1)):(initChecked.includes(i+1))
                  return (
                    <div className={styles.itemStyle} key={i}>
                    <div className={filterStyle?styles.checkedTopName:styles.topName}>第{i + 1}支路</div>
                    <Checkbox className={styles.bottomSelect} value={e} key={i}></Checkbox>
                  </div>)
                })}
             
            </Checkbox.Group>
          )}
          <div className={styles.linestyle}>(  点击后变<span className={styles.selectRingStyle}></span>，表示接入;<span className={styles.ringStyle}></span>表示未接入 )</div>
        </FormItem>

      </div>
    )
  }
}
export default (EditConflunce)
// <Col span={3} key={i}>
// <div>第{i + 1}支路</div>
// <Checkbox value={e} key={i}></Checkbox>
// </Col>