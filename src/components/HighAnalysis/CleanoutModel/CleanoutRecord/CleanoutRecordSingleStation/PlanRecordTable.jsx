import React, { Component } from "react";
import AddCleanoutRecord from './AddCleanoutRecord';
import styles from './PlanRecordTable.scss';
import WarningTip from '../../../../Common/WarningTip';
import InputLimit from '../../../../Common/InputLimit';
import moment from 'moment';
import { Table, Icon, Modal, Form, DatePicker, Input, Button, TreeSelect } from 'antd';
const FormItem = Form.Item;
const matrix = TreeSelect.matrix;
const { RangePicker } = DatePicker;
class PlanRecordTable extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      warningTipText: '点击确定,可删除此条清洗计划',
      recordPlanData: {},
      showEditModal: false,
    }
  }
  tableChange = () => {
  }
  showDeletModal = (record) => {
    this.setState({
      recordPlanData: record,
      showWarningTip: true,
    })
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
  showEditRecoord = (record) => {
    this.setState({ showEditModal: true, })
  }
  // editRecord(record){//编辑清洗记录的modal
  //   const formItemLayout = {
  //     labelCol: {
  //       xs: { span: 24 },
  //       sm: { span: 8 },
  //     },
  //     wrapperCol: {
  //       xs: { span: 24 },
  //       sm: { span: 16 },
  //     },
  //   };
  //   const { getFieldDecorator } = this.props.form;
  //   const{stations}=this.props;//此处应该是方阵的数据，下面的不可选是由方阵的数据决定的

  //   const rangeConfig = {
  //     //  initialValue: [moment('2019-12-10'), moment('2019-12-25')],
  //     rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  //   };
  //   const tmpDeviceTypes = [1,2,3,4,5,6].map((e,i)=>{
  //     return {
  //       title : e,
  //       key : i.toString(),
  //       value : e.toString(),
  //     }
  //   });
  //   const treeProps = {
  //     treeData: tmpDeviceTypes,
  //     treeCheckable: true,
  //     filterTreeNode: false,
  //     showCheckedStrategy: matrix,
  //     searchPlaceholder: '请选择设备类型',
  //     style: {
  //       width: 198,
  //     },
  //     disabled: stations.size === 0,
  //   };
  //   return (
  //     <Modal
  //       title={'电站3-清洗记录'}
  //       visible={this.state.showEditModal}
  //       onOk={this.confirmAddRecord}
  //       footer={null}
  //       onCancel={this.cancelAddRecord}
  //       mask={false}
  //       centered={true}
  //       closable={false}
  //       maskClosable={false}
  //     >
  //       <div className={styles.modalStyle}>
  //         <Form onSubmit={this.handleSubmit}>
  //           <FormItem
  //             {...formItemLayout}
  //             label="清洗时间"
  //           >
  //             {getFieldDecorator('cleanDate', rangeConfig)(
  //               <RangePicker />
  //             )}
  //           </FormItem>
  //           <FormItem
  //             {...formItemLayout}
  //             label="清洗方阵"
  //           >
  //             {getFieldDecorator('matrix', {
  //               // initialValue: ['1','2'],
  //               rules: [{ required: true, message: '请选择方阵'}],
  //             })(
  //               <TreeSelect {...treeProps} dropdownClassName={styles.treeDeviceTypes} />
  //             )}
  //           </FormItem>

  //           <FormItem
  //             {...formItemLayout}
  //             label="清洗备注"
  //           >
  //             {getFieldDecorator('cleanTip', { 
  //             // initialValue: 'woshidali', 
  //             rules: [{ required: true, message: '只能输入数字', whitespace: true }, ],
  //             })(
  //               <InputLimit width={316} placeholder="请描述，不超过80个汉字" />
  //             )}
  //           </FormItem>
  //         </Form>
  //         <div className={styles.handle}>
  //           <Button onClick={this.cancelAddRecord} >取消</Button>
  //           <Button onClick={this.confirmAddRecord} className={styles.confirmExamine} >保存</Button>
  //         </div>


  //       </div>

  //     </Modal>
  //   )
  // }

  // confirmAddRecord=()=>{
  //   this.setState({ showEditModal: false })
  //   const { getFieldsValue } = this.props.form;
  //   let recordValue = getFieldsValue(['cleanDate','matrix','cleanTip']);
  //   recordValue.estimateStartTime = moment(recordValue.cleanDate[0]).format('YYYY-MM-DD')
  //   recordValue.estimateEndTime = moment(recordValue.cleanDate[1]).format('YYYY-MM-DD')
  //   //发送添加清洗计划的函数
  //   //此处还要传planid
  //   this.props.editCleanRecord(recordValue)
  // }
  cancelAddRecord = () => {
    this.setState({ showEditModal: false })
  }
  render() {
  
    const{planId,cleanRecordListData,loading}=this.props;
    const { showWarningTip, warningTipText, showEditModal } = this.state
    const column = [
      {
        title: '清洗时间',
        dataIndex: 'cleanTime',
        key: 'cleanTime',

        render: (text, record, index) => {
          return (
            <span className={styles.cleanTime} title={record.cleanTime}>{record.cleanTime}</span>
          )
        }
      }, {
        title: '方阵',
        dataIndex: 'matrix',
        key: 'matrix',

      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}` : '--'}</span>),

      }, {
        title: 'pr',
        dataIndex: 'pr',
        key: 'pr',

      }, {
        title: '操作',
        key: 'check',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ marginRight: '4px' }} title="编辑" className="iconfont icon-edit" onClick={(record) => this.showEditRecoord(record)}></span>
              {/*    {this.editRecord(record)} */}
              {showEditModal ? <AddCleanoutRecord {...this.props} showAddRecordModal={showEditModal} cancelAddRecord={this.cancelAddRecord} getAddOrEditCleanRecord={this.props.editCleanRecord} /> : ''}
              <span title="删除" className="iconfont icon-del" onClick={(record) => this.showDeletModal(record)}></span>
            </div>
          )
        }
      }
    ];
    const data = [
      { cleanTime: 'dalidadali', matrix: '1', remark: '2', pr: '3', },
      { cleanTime: 'wulala', matrix: '6', remark: '7', pr: '8', }]
    return (
     
      <div>
        {showWarningTip && <WarningTip style={{ width: '240px', marginTop: '312px' }} onOK={this.confirmWarningTip} onCancel={this.cancelWarningTip} value={warningTipText} />}
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
export default Form.create()(PlanRecordTable)