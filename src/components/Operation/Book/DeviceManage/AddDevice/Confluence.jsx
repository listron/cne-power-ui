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
      checkStyle:[]
    }
  }
  showAddComponentMode = () => {
    this.props.changeDeviceManageStore({ checkDeviceModeOk: null })
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
    this.setState({ componentModeCodeAdd: record.addComponentMode, manufacturerComAdd: record.addmanufacturerCom, showAddComponent: true })
  }
  checkstyle=(checked)=>{
    this.setState({
      checkStyle:checked
    })
  }

  render() {
    const { showAddComponentMode, showAddComponent, componentModeCodeAdd, manufacturerComAdd,checkStyle } = this.state;
    console.log('checkStyle: ', checkStyle);
 
    const { pvDeviceModels, addPvDeviceModeData } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const branchCount = getFieldValue("branchCount");
    let branchCountArr = [];
    for (let i = 0; i < branchCount; i++) {
      branchCountArr.push(i + 1)
    }

    const initComponentMode = addPvDeviceModeData.data ? +addPvDeviceModeData.data : null;
    const filterComponentModeId = pvDeviceModels.filter((e, i) => (e.deviceModeCode === initComponentMode))[0];
    const initValue = filterComponentModeId ? filterComponentModeId.deviceModeId : null;
    return (
      <div className={styles.rightStyles}>
        <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('componentMode', {
            initialValue: initValue,
            rules:[{required: true,message: '请选择组件型号',}]
          })(
            <Select className={styles.modelSelect} placeholder="请选择组件型号" disabled={pvDeviceModels.length === 0} >
             <Option key={'all'} value={''}>请选择组件型号</Option>
              {pvDeviceModels.map(e => {
                if (!e) { return null; }
                return <Option key={e.deviceModeCode} value={e.deviceModeId}>{e.deviceModeName}</Option>
              })}
            </Select>
          )}
          <span className={styles.fontColor} onClick={this.showAddComponentMode}>添加组件型号</span>
        </FormItem>
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
            <Checkbox.Group className={styles.checkboxStyle} onChange={this.checkstyle}>
            
              {branchCountArr.map((e, i) => {
                return (
                  <div className={styles.itemStyle} key={i}>
                    <div className={checkStyle.includes(e)?styles.checkedTopName:styles.topName}>第{e}支路</div>
                    <Checkbox className={styles.bottomSelect} value={e}  key={i}></Checkbox>
                  </div>
                )
              })}
           
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
//  {/* <Col span={3} key={i}>
//                       <div>第{e}支路</div>
//                       <Checkbox value={e} key={i}></Checkbox>
//                     </Col> */}
