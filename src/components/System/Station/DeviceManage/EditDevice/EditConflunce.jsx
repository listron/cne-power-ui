
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
  render() {
    const { showAddComponentMode, showAddComponent, componentModeCodeAdd, manufacturerComAdd } = this.state;
    const { pvDeviceModels,stationDeviceDetail } = this.props;
    console.log('stationDeviceDetail: ', stationDeviceDetail);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const branchCount =  stationDeviceDetail.map?stationDeviceDetail.map.connectedBranches:[];
    const branchCountArr=branchCount.map((e,i)=>{
    return e===1?i+1:null
    })
    console.log('branchCountArr: ', branchCountArr);
    
    
    return (
      <div className={styles.rightStyles}>
        <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
            {getFieldDecorator('componentMode',{ initialValue: stationDeviceDetail.componentMode,})(
              <Select className={styles.modelSelect} placeholder="请选择组件型号" disabled={pvDeviceModels.length === 0} >
                {pvDeviceModels.map(e => {
                  if (!e) { return null; }
                  return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
                })}
              </Select>
            )}
           
          </FormItem>
        <FormItem label="支路个数" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('branchCount',{ initialValue: stationDeviceDetail.branchCount,})(
          <span>{stationDeviceDetail.branchCount}</span>
          )}
        </FormItem>
        <FormItem label="所用支路" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('connectedBranches',{ initialValue: branchCountArr,} )(
            <Checkbox.Group>
              <Row>
                {(branchCount).map((e, i) => {
                  return (
                    <Col span={3} key={i}>
                      <div>第{i+1}支路</div>
                      <Checkbox value={i+1} key={i}></Checkbox>
                    </Col>)
                })}
              </Row>
              </Checkbox.Group>
          )}
          <div className={styles.linestyle}>(  点击后变<span className={styles.selectRingStyle}></span>，表示接入;<span className={styles.ringStyle}></span>表示未接入 )</div>
        </FormItem>
  
      </div>
    )
  }
}
export default (EditConflunce)
