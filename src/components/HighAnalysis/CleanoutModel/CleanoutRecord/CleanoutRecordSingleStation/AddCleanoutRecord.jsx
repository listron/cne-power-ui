import React, { Component } from "react";
import PropTypes from 'prop-types';
import InputLimit from '../../../../Common/InputLimit';
import styles from './cleanoutPlanRecord.scss';
import moment from 'moment';
import {  Modal, Form, DatePicker,  Button, TreeSelect } from 'antd';
const FormItem = Form.Item;
const showMatrix = TreeSelect.showMatrix;
const { RangePicker } = DatePicker;

class AddCleanoutRecord extends Component {
  static propTypes = {
    singleStationCode: PropTypes.string,
    getMatrix:PropTypes.func,
    cancelAddRecord:PropTypes.func,
    getAddOrEditCleanRecord:PropTypes.func,

  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount(){
    const{getMatrix,singleStationCode}=this.props;
   getMatrix({stationCodes:[singleStationCode]})
  }
  cancelAddRecord = () => {
    //this.setState({ showAddRecordModal: false })
    this.props.cancelAddRecord()
  }
  confirmAddRecord = () => {
    // this.setState({ showAddRecordModal: false })
    this.props.cancelAddRecord()
    const { getFieldsValue } = this.props.form;
    console.log(getFieldsValue);
    let recordValue = getFieldsValue(['cleanDate', 'matrix', 'cleanTip']);
    recordValue.estimateStartTime = moment(recordValue.cleanDate[0]).format('YYYY-MM-DD')
    recordValue.estimateEndTime = moment(recordValue.cleanDate[1]).format('YYYY-MM-DD')
    //发送添加清洗计划的函数
    //此处还要传planid
    this.props.getAddOrEditCleanRecord({...recordValue,planId:this.props.planId})
  
  }
  render() {
    const{getMatrixData}=this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { stations,showAddRecordModal } = this.props;//此处应该是方阵的数据，下面的不可选是由方阵的数据决定的
    const rangeConfig = {
     
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    const tmpDeviceTypes = getMatrixData.map((e, i) => {
      return {
        title: e,
        key: i.toString(),
        value: e,
      }
    });
    const treeProps = {
      treeData: tmpDeviceTypes,
      treeCheckable: true,
      filterTreeNode: false,
      showCheckedStrategy: showMatrix,
      searchPlaceholder: '请选择设备类型',
      style: {
        width: 198,
      },
      disabled: stations.size === 0,
    };
    return (
        <Modal
          title={'电站3-清洗记录'}
          visible={showAddRecordModal}
          onOk={this.confirmAddRecord}
          footer={null}
          onCancel={this.cancelAddRecord}
          mask={false}
          centered={true}
          closable={false}
          maskClosable={false}
        >
          <div className={styles.modalStyle}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="清洗时间"
              >
                {getFieldDecorator('cleanDate', rangeConfig)(
                  <RangePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="清洗方阵"
              >
                {getFieldDecorator('matrix', {
                  rules: [{ required: true, message: '请选择方阵' }],
                })(
                  <TreeSelect {...treeProps} dropdownClassName={styles.treeDeviceTypes} />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="清洗备注"
              >
                {getFieldDecorator('cleanTip', {
                  rules: [{ required: true, message: '只能输入数字', whitespace: true },],
                })(
                  <InputLimit width={316} placeholder="请描述，不超过80个汉字" />
                )}
              </FormItem>
            </Form>
            <div className={styles.handle}>
              <Button onClick={this.cancelAddRecord} >取消</Button>
              <Button onClick={this.confirmAddRecord} className={styles.confirmExamine} >保存</Button>
            </div>
          </div>
        </Modal>
    )




  }
}
export default Form.create() (AddCleanoutRecord)