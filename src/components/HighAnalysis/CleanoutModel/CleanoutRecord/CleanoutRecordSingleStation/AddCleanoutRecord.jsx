import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputLimit from '../../../../Common/InputLimit';
import styles from './cleanoutPlanRecord.scss';
import moment from 'moment';
import { Modal, Form, DatePicker, Button, TreeSelect } from 'antd';
const FormItem = Form.Item;
const showMatrix = TreeSelect.SHOW_ALL;
const { RangePicker } = DatePicker;

class AddCleanoutRecord extends Component {
  static propTypes = {
    singleStationCode: PropTypes.string,
    getMatrix: PropTypes.func,
    cancelAddRecord: PropTypes.func,
    getAddOrEditCleanRecord: PropTypes.func,

  }
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    const { getMatrix, singleStationCode } = this.props;
    getMatrix({ stationCodes: [singleStationCode] });
  }
  cancelAddRecord = () => {
    //this.setState({ showAddRecordModal: false })
    this.props.cancelAddRecord();
    this.props.changeCleanoutRecordStore({
      cleanRecorddetail: {},
    });
  }
  confirmAddRecord = () => {
    // this.setState({ showAddRecordModal: false })

    const { getFieldsValue } = this.props.form;
    const recordValue = getFieldsValue(['cleanDate', 'matrix', 'remark']);
    console.log('recordValue: ', recordValue);
    recordValue.startTime = moment(recordValue.cleanDate[0]).format('YYYY-MM-DD');
    recordValue.endTime = moment(recordValue.cleanDate[1]).format('YYYY-MM-DD');
    const matrix = recordValue.matrix.toString();
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.props.getAddOrEditCleanRecord({//添加某清洗计划的清洗记录
          ...recordValue,
          planId: this.props.planId,
          recordId: this.props.recordId,
          stationCode: this.props.singleStationCode,
          matrix,
        });
        this.props.changeCleanoutRecordStore({
          cleanRecorddetail: {},
        });
        this.props.cancelAddRecord();
      }

    });
  }
  render() {
    const { getMatrixData, cleanRecorddetail } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { stations, showAddRecordModal, singleStationCode } = this.props;//此处应该是方阵的数据，下面的不可选是由方阵的数据决定的
    const stationItem = stations && stations.filter(e => (e.stationCode.toString() === singleStationCode))[0];
    const cleanStationName = stationItem && stationItem.stationName;
    const rangeConfig = {
      initialValue: cleanRecorddetail.startTime ? [moment(cleanRecorddetail.startTime), moment(cleanRecorddetail.endTime)] : [],
      rules: [{ type: 'array', required: true, message: '请选择清洗记录时间' }],
    };
    const tmpDeviceTypes = getMatrixData.map((e, i) => {
      return {
        title: e,
        key: i.toString(),
        value: e,
      };
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
      <React.Fragment>
        <span ref="wrap" />
        <Modal
          title={`${cleanStationName}-清洗记录`}
          visible={showAddRecordModal}
          onOk={this.confirmAddRecord}
          footer={null}
          onCancel={this.cancelAddRecord}
          mask={false}
          centered={true}
          closable={false}
          maskClosable={false}
          getContainer={() => this.refs.wrap}
        >
          <div className={styles.modalStyle}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="清洗时间"
              >
                {getFieldDecorator('cleanDate', rangeConfig)(
                  <RangePicker getCalendarContainer={() => this.refs.wrap} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="清洗方阵"
              >
                {getFieldDecorator('matrix', {
                  initialValue: cleanRecorddetail.matrix ? cleanRecorddetail.matrix.split(',') : null,
                  rules: [{ required: true, message: '请选择方阵' }],
                })(
                  <TreeSelect {...treeProps} dropdownClassName={styles.treeDeviceTypes} getPopupContainer={() => this.refs.wrap} />
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="清洗备注"
              >
                {getFieldDecorator('remark', {
                  initialValue: cleanRecorddetail.remark ? cleanRecorddetail.remark : '',
                  rules: [{ message: '请描述，不超过80个汉字', whitespace: true }],
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

      </React.Fragment>

    );




  }
}
export default Form.create()(AddCleanoutRecord);
