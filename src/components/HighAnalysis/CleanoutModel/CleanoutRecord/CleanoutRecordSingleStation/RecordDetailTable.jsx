import React, { Component } from "react";
import styles from './recordDetailTable.scss';
import WarningTip from '../../../../Common/WarningTip';
import InputLimit from '../../../../Common/InputLimit';
import moment from 'moment';
import { Table, Icon, Modal, Form, DatePicker, Input, Button ,TreeSelect} from 'antd';
const FormItem = Form.Item;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;

class RecordDetailTable extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '点击确定,可删除此条清洗计划',
      recordPlanData: {},
      showEditModal: false,
      showAddRecordModal: false,
    }
  }
  tableChange = () => {
  }

  showEditModal = (record) => {
    this.setState({
      showEditModal: true
    })
  }
  deleteCleanPlan = (record) => {
    this.setState({
      recordPlanData: record,
      showWarningTip: true,
    })
  }

  showRecodePlanModal = (record) => {
    this.props.onShowSideChange({ showSidePage: 'recordPlan' })
  }
  confirmWarningTip = (recordPlanData) => { // 提示框确认
    this.setState({
      showWarningTip: false,
    })
    //执行删除此条清洗计划
    this.props.deleteCleanPlan({ planId: 360 })
    // this.props.deleteCleanPlan({planId:recordPlanData.planId})
  }
  cancelWarningTip = () => {//取消提示框
    this.setState({
      showWarningTip: false,

    })
  }
  cancelModal = () => {//取消编辑清洗计划modal
    this.setState({
      showEditModal: false
    })
  }
  confirmModal = (record) => {//编辑计划确认按钮
    const { getFieldsValue } = this.props.form;
    let planValue = getFieldsValue(['cleanCost','cleanPlanDate','company']);
    console.log(planValue);
    //console.log(  planValue.estimateStartTime,planValue.estimateEndTime);//这里是拿到所有modal里的值{}
    //添加计划的函数发请求
    //const planId=record.planId;
    planValue.estimateStartTime = moment(planValue.cleanPlanDate[0]).format('YYYY-MM-DD')
    planValue.estimateEndTime = moment(planValue.cleanPlanDate[1]).format('YYYY-MM-DD')
    //发送添加清洗计划的函数
    //此处还要传planid
    this.props.getEditCleanPlan(planValue)
    this.setState({
      showEditModal: false
    })
  }
  editCleanoutPlan(record) {//编辑modal
    console.log(record);
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

    const rangeConfig = {
      initialValue: [moment('2018-12-10'), moment('2018-12-25')],
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    return (
      <Modal
        title={'修改'}
        visible={this.state.showEditModal}
        onOk={this.confirmModal}
        footer={null}
        onCancel={this.cancelModal}
        mask={false}
        centered={true}
        closable={false}
        maskClosable={false}
      >
        <div className={styles.modalStyle}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="清洗公司/责任人"
            >
              {getFieldDecorator('company', {
                initialValue: 'dali',
                rules: [{ required: true, message: '清洗公司/责任人', whitespace: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="计划清洗时间"
            >
              {getFieldDecorator('cleanPlanDate', rangeConfig)(
                <RangePicker />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="清洗费用"
            >
              {getFieldDecorator('cleanCost', {
                initialValue: '234234',
                rules: [{ required: true, message: '只能输入数字', whitespace: true }, { pattern: /(^\d{0,}\.{0,1}\d$)/, message: '仅支持数字，小数点' }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>
          <div className={styles.handle}>
            <Button onClick={this.cancelModal} >取消</Button>
            <Button onClick={this.confirmModal} className={styles.confirmExamine} >保存</Button>
          </div>


        </div>

      </Modal>
    )
  }
  addCleanRecord = () => {//添加清洗记录
    this.setState({ showAddRecordModal: true })
  }
  addCleanoutRecord(record) {
    console.log(record);
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
    const{stations}=this.props;//此处应该是方阵的数据，下面的不可选是由方阵的数据决定的

    const rangeConfig = {
      // initialValue: [moment('2018-12-10'), moment('2018-12-25')],
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    const tmpDeviceTypes = [1,2,3,4,5,6].map((e,i)=>{
      return {
        title : e,
        key : i.toString(),
        value : e.toString(),
      }
    });
    const treeProps = {
      treeData: tmpDeviceTypes,
      treeCheckable: true,
      filterTreeNode: false,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择设备类型',
      style: {
        width: 198,
      },
      disabled: stations.size === 0,
    };
    return (
      <Modal
        title={'电站3-清洗记录'}
        visible={this.state.showAddRecordModal}
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
                rules: [{ required: true, message: '请选择方阵'}],
              })(
                <TreeSelect {...treeProps} dropdownClassName={styles.treeDeviceTypes} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="清洗备注"
            >
              {getFieldDecorator('cleanTip', { rules: [{ required: true, message: '只能输入数字', whitespace: true }, ],
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
  cancelAddRecord=()=>{
    this.setState({ showAddRecordModal: false })
  }
  confirmAddRecord=()=>{
    this.setState({ showAddRecordModal: false })
    const { getFieldsValue } = this.props.form;
    let recordValue = getFieldsValue(['cleanDate','matrix','cleanTip']);
    console.log(recordValue);
    recordValue.estimateStartTime = moment(recordValue.cleanDate[0]).format('YYYY-MM-DD')
    recordValue.estimateEndTime = moment(recordValue.cleanDate[1]).format('YYYY-MM-DD')
    //发送添加清洗计划的函数
    //此处还要传planid
    this.props.getAddCleanRecord(recordValue)
  }

  render() {
    const { loading } = this.props;
    const { selectedRowKeys, showWarningTip, warningTipText, showSidePage } = this.state
    const column = [
      {
        title: '计划清洗时间',
        dataIndex: 'estimateStartTime',
        key: 'estimateStartTime',

        render: (text, record, index) => {
          return (
            <span className={styles.estimateStartTime} title={record.estimateStartTime}>{record.estimateStartTime}</span>
          )
        }
      }, {
        title: '实际清洗时间',
        dataIndex: 'estimateEndTime',
        key: 'estimateEndTime',

      }, {
        title: '实际清洗用时(天)',
        dataIndex: 'actualCleanTime',
        key: 'actualCleanTime',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}` : '--'}</span>),

      }, {
        title: '清洗方式',
        dataIndex: 'cleanType',
        key: 'cleanType',

      }, {
        title: '清洗公司',
        dataIndex: 'company',
        key: 'company',

      }, {
        title: '清洗费用(元)',
        dataIndex: 'cleanCost',
        key: '',

      }, {
        title: '清洗收益(万kWh)',
        dataIndex: 'cleanProfit',
        key: 'cleanProfit',
      }, {
        title: '添加/查看清洗记录(元)',
        key: 'addRecord',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ marginRight: '8px' }} title="添加" className="iconfont icon-look" onClick={(record) => this.addCleanRecord(record)}></span>
              {this.addCleanoutRecord(record)}
              <span title="查看" className="iconfont icon-look" onClick={(record) => this.showRecodePlanModal(record)}></span>
            </div>
          )
        }
      }, {
        title: '操作',
        key: 'editAndDelet',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ marginRight: '4px' }} title="编辑" className="iconfont icon-edit" onClick={(record) => this.showEditModal(record)}>
              </span>
              {this.editCleanoutPlan(record)}
              <span title="删除" className="iconfont icon-del" onClick={(record) => this.deleteCleanPlan(record)}></span>
            </div>
          )
        }
      }

    ];
    const data = [
      { estimateStartTime: 'dalidadali', estimateEndTime: '1', actualCleanTime: '2', recordTiem: '3', cleanType: '23', company: '4', cleanCost: '5', cleanProfit: '6' },
      { estimateStartTime: 'wulala', estimateEndTime: '6', actualCleanTime: '7', recordTiem: '8', cleanType: '32', company: '9', cleanCost: '10', cleanProfit: '11' }]
    return (
      <div>
        {showWarningTip && <WarningTip style={{ width: '240px', height: '88px', marginTop: '312px' }} onOK={this.confirmWarningTip} onCancel={this.cancelWarningTip} value={warningTipText} />}
        <Table
          loading={loading}
          dataSource={data.map((e, i) => ({ ...e, key: i }))}
          columns={column}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img src="/img/nodata.png" /> }}
        />
      </div>
    )
  }
}
export default Form.create()(RecordDetailTable)