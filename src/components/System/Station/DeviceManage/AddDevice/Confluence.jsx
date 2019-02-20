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
      showAddDeviceModeModal: false,
      showAddDeviceMode: false,

    }
  }
  showAddDeviceModeModal = () => {
    this.setState({
      showAddDeviceModeModal: true
    })
  }
  cancleDeviceModeModal = () => {
    this.setState({
      showAddDeviceModeModal: false
    })
  }
  saveFormState = (record) => {
    console.log(record, "record");
    this.setState({ deviceModeCodeAdd: record.deviceModeCode, manufacturerAdd: record.manufacturer, showAddDeviceMode: true })
  }


  render() {
    const { showAddDeviceModeModal, showAddDeviceMode, deviceModeCodeAdd, manufacturerAdd } = this.state;
    const { pvDeviceModels } = this.props;
    console.log('pvDeviceModels: ', pvDeviceModels);
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.rightStyles}>
        <FormItem label="组件型号" colon={false} className={styles.formItemStyle}>
          {getFieldDecorator('componentMode')(
            <Select className={styles.modelSelect} placeholder="请选择设备型号" disabled={pvDeviceModels.length === 0} >
              {pvDeviceModels.map(e => {
                if (!e) { return null; }
                return <Option key={e.deviceModeCode} value={e.deviceModeCode}>{e.deviceModeName}</Option>
              })}
            </Select>
          )}
          <span className={styles.fontColor} onClick={this.showAddDeviceModeModal}>添加设备型号</span>
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
            <Checkbox.Group  >
              <Row>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => {
                  return (
                    <Col span={3} key={i}>
                      <div>第{e}支路</div>
                      <Checkbox value={i} key={e}></Checkbox>
                    </Col>)
                })}



              </Row>
            </Checkbox.Group>,

          )}
          <div className={styles.linestyle}>(  点击后变<span className={styles.selectRingStyle}></span>，表示接入;<span className={styles.ringStyle}></span>表示未接入 )</div>
        </FormItem>
        {showAddDeviceModeModal && <ShowAddComponentMode {...this.props} showAddDeviceModeModal={showAddDeviceModeModal} cancleDeviceModeModal={this.cancleDeviceModeModal} saveFormState={this.saveFormState} />}
      </div>
    )
  }
}
export default (Confluence)