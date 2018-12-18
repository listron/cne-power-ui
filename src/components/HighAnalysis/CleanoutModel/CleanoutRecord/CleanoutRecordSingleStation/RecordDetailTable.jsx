import React, { Component } from "react";
import styles from './recordDetailTable.scss';
import WarningTip from '../../../../Common/WarningTip';
import AddCleanoutRecord from './AddCleanoutRecord';
import InputLimit from '../../../../Common/InputLimit';
import moment from 'moment';
import { Table, Icon, Modal, Form, DatePicker, Input, Button, TreeSelect } from 'antd';
const FormItem = Form.Item;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const { RangePicker } = DatePicker;

class RecordDetailTable extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showWarningTip: false,
      cleanoutRecord:{},
      editCleanoutPlan:{},
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
      showEditModal: true,
      editCleanoutPlan:record,
    })
    record.cleanType===1? this.props.getCleanPlanDetail({planId:record.planId}):
    this.props.getRainPlanDetail({planId:record.planId})
  }
  deleteCleanPlan = (record) => {
    this.setState({
      recordPlanData: record,
      showWarningTip: true,
    })
  }

  showRecodePlanModal = (record, selectedStationIndex) => {
    const { onShowSideChange, changeCleanoutRecordStore, getPlanRecordList, cleanRecordTotal, cleanRecordPageSize, cleanRecordPageNum } = this.props;
    onShowSideChange({ showSidePage: 'recordPlan' })
    changeCleanoutRecordStore({ selectedStationIndex })
    getPlanRecordList({ planId: record.planId, pageNum: cleanRecordPageNum, pageSize: cleanRecordPageSize })

  }
  confirmWarningTip = () => { // 删除人工清洗计划/降雨记录的提示框确认按钮
    this.setState({
      showWarningTip: false,
    })
    //执行删除此条清洗计划
    //this.props.deleteCleanPlan({ planId: 360 })
    this.props.deleteCleanPlan({planId:this.state.recordPlanData.planId})
  }
  cancelWarningTip = () => {//删除人工清洗计划/降雨记录的提示框取消按钮
    this.setState({
      showWarningTip: false,

    })
  }
  cancelModal = () => {//取消编辑清洗计划modal
    this.setState({
      showEditModal: false
    })
  }
  confirmModal = () => {//编辑人工清洗计划/降雨记录确认按钮
    const { getFieldsValue } = this.props.form;
    const{editCleanoutPlan}=this.state;
    if(editCleanoutPlan.cleanType===1){
      let planValue = getFieldsValue(['cleanCost', 'cleanPlanDate', 'company']);
      planValue.estimateStartTime = moment(planValue.cleanPlanDate[0]).format('YYYY-MM-DD')
      planValue.estimateEndTime = moment(planValue.cleanPlanDate[1]).format('YYYY-MM-DD')
      this.props.getEditCleanPlan({...planValue,planId:editCleanoutPlan.planId})
    }else if(editCleanoutPlan.cleanType===2){
      let rainRecordValue=getFieldsValue(['rainPlanDate'])
      console.log(rainRecordValue);
      rainRecordValue.estimateStartTime = rainRecordValue&&moment(rainRecordValue.rainPlanDate[0]).format('YYYY-MM-DD')
      rainRecordValue.estimateEndTime = rainRecordValue&&moment(rainRecordValue.rainPlanDate[1]).format('YYYY-MM-DD')
      this.props.getEditRainPlan({...rainRecordValue,planId:editCleanoutPlan.planId})
    }
    this.setState({
      showEditModal: false
    })
  }
  editCleanoutPlan() {//编辑人工清洗计划/降雨记录的modal
    const{cleanPlandetail,rainPlandetail}=this.props;
    const company=cleanPlandetail&&cleanPlandetail.company,
    estimateStartTime=cleanPlandetail&&cleanPlandetail.estimateStartTime,
    estimateEndTime=cleanPlandetail&&cleanPlandetail.estimateEndTime,
    cleanCost=cleanPlandetail&&cleanPlandetail.cleanCost;
    const rainStartTime=rainPlandetail&&rainPlandetail.estimateStartTime;
    const rainEndTime=rainPlandetail&&rainPlandetail.estimateEndTime;


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
      initialValue: [moment(estimateStartTime), moment(estimateEndTime)],
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    const rainConfig = {
      initialValue: [moment(rainStartTime), moment(rainEndTime)],
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
          {this.state.editCleanoutPlan.cleanType==1?<Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="清洗公司/责任人"
            >
              {getFieldDecorator('company', {
                initialValue: company,
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
                initialValue: cleanCost,
                rules: [{ required: true, message: '只能输入数字', whitespace: true }, { pattern: /(^\d{0,}\.{0,1}\d$)/, message: '仅支持数字，小数点' }],
              })(
                <Input />
              )}
            </FormItem>
          </Form>:<Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="降雨时间"
          >
            {getFieldDecorator('rainPlanDate', rainConfig)(
              <RangePicker />
            )}
          </FormItem>
        </Form>}
          <div className={styles.handle}>
            <Button onClick={this.cancelModal} >取消</Button>
            <Button onClick={this.confirmModal} className={styles.confirmExamine} >保存</Button>
          </div>


        </div>

      </Modal>
    )
  }
  addCleanRecord = (record) => {//添加清洗记录
    this.setState({
      showAddRecordModal: true,
      cleanoutRecord: record
    })
  }

  cancelAddRecord = () => {
    this.setState({ showAddRecordModal: false })
  }
  render() {
    const { loading, detailListData } = this.props;
    const {  showWarningTip, warningTipText,  showAddRecordModal,cleanoutRecord ,editCleanoutPlan} = this.state;
    // console.log(cleanoutRecord,'cleanoutRecord');
    // console.log(editCleanoutPlan,'editCleanoutPlan');
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
        render: (text, record, index) => {
          return (
            <div>
              {text === 1 ? <img src="/img/manpower.png" /> :
                <img src="/img/rainfall.png" />}
            </div>
          )
        }

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
        dataIndex: 'cleanType',
        render: (text, record, index) => {
          return (
            text === 1 ? <div>
              <span style={{ marginRight: '8px' }} title="添加" className="iconfont icon-addto" onClick={() => this.addCleanRecord(record)}></span>
              {/*   {this.addCleanoutRecord(record)} */}
             
              <span title="查看" className="iconfont icon-viewplan" onClick={() => this.showRecodePlanModal(record, index)}></span>
            </div> : ''
          )
        }
      }, {
        title: '操作',
        key: 'editAndDelet',
        dataIndex: 'isDelete',
        render: (text, record, index) => {
          return (
            <div>
              <span style={{ marginRight: '4px' }} title="编辑" className="iconfont icon-edit" onClick={() => this.showEditModal(record)}>
              </span>
            
              {text === 0 ? <span title="删除" className="iconfont icon-del" onClick={() => this.deleteCleanPlan(record)}></span> : ''}
            </div>
          )
        }
      }

    ];
    // const data = [
    //   { planId: '337289229658112', estimateStartTime: 'dalidadali', estimateEndTime: '1', actualCleanTime: '2', recordTiem: '3', cleanType: 1, company: '4', cleanCost: '5', cleanProfit: '6', isDelete: 1 },
    //   { planId: '2', estimateStartTime: 'wulala', estimateEndTime: '6', actualCleanTime: '7', recordTiem: '8', cleanType: 2, company: '9', cleanCost: '10', cleanProfit: '11', isDelete: 0 }]
    return (
      <div>
        {showWarningTip && <WarningTip style={{ width: '240px', height: '88px', marginTop: '312px' }} onOK={this.confirmWarningTip} onCancel={this.cancelWarningTip} value={warningTipText} />}
        <Table
          loading={loading}
          dataSource={detailListData.map((e, i) => ({ ...e, key: i }))}
          columns={column}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img src="/img/nodata.png" /> }}
        />
        {showAddRecordModal ? <AddCleanoutRecord {...this.props} planId={cleanoutRecord.planId} showAddRecordModal={showAddRecordModal} cancelAddRecord={this.cancelAddRecord} getAddOrEditCleanRecord={this.props.getAddCleanRecord} /> : ''}
      
        {this.editCleanoutPlan()}

      </div>
    )
  }
}
export default Form.create()(RecordDetailTable)

 