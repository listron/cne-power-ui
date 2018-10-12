
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Form, Input, DatePicker } from 'antd';
import moment from 'moment';

class LostAddForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    faultGenList: PropTypes.array,
    changeFaultList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  // {
  //   title: '设备名称',
  //   dataIndex: 'deviceName',
  // },{
  //   title: '损失电量类型',
  //   dataIndex: 'faultName',
  // },{
  //   title: '原因说明',
  //   dataIndex: 'reason',
  // },{
  //   title: '发生时间',
  //   dataIndex: 'startTime',
  // },{
  //   title: '结束时间',
  //   dataIndex: 'endTime',
  // },{
  //   title: '处理进展及问题',
  //   dataIndex: 'process',
  // },{
  //   title: '日损失电量',
  //   dataIndex: 'lostPower',
  // },{
  //   title: '操作',
  //   dataIndex: 'handle',
  // }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className={styles.lostAddForm} >
        <Form.Item label="设备名称">
          {getFieldDecorator('deviceName', {
            rules: [{ required: true, message: '设备名称' }],
          })(
            <Input placeholder="设备名称" />
          )}
        </Form.Item>
        <Form.Item label="发生时间">
          {getFieldDecorator('startTime', {
            rules: [{ required: true, message: '开始时间' }],
          })(
            <DatePicker placeholder="开始时间" />
          )}
        </Form.Item>
        <Form.Item label="结束时间">
          {getFieldDecorator('endTime', {
            rules: [{ required: true, message: '结束时间' }],
          })(
            <DatePicker placeholder="结束时间" />
          )}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(LostAddForm);
