import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Table, Modal, Form, DatePicker, Input, Button, Radio } from 'antd';
import styles from './cleanoutRecordMain.scss';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
class CleanoutRecordTable extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    match: PropTypes.object,
    stationCodes: PropTypes.array,
    onShowSideChange: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    getAddCleanPlan: PropTypes.func,
    getAddRainPlan: PropTypes.func,
    loading: PropTypes.bool,
    mainListData: PropTypes.array,
    getMainList: PropTypes.func,
    history: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      showModal: false,
      planType: 'clean',
      record: {},
    }
  }
  onChange = (e) => {
    this.setState({
      planType: e.target.value
    })
  }
  tableChange = (pagination, filter, sorter) => { // 电站list排序=>重新请求数据
    const { changeCleanoutRecordStore, getMainList, stationCodes, pageNum, pageSize, } = this.props;
    const { field, order } = sorter;
    const sortField = field ? field : '';
    const sortType = order ? (sorter.order === 'ascend' ? 0 : 1) : '';
    changeCleanoutRecordStore({ sortField: field, sortType })
    getMainList({
      stationCodes, pageNum, pageSize, sortField, sortType
    })
  }
  showDetailModal = (record) => {//跳转到单电站清洗模型详情
    this.props.changeCleanoutRecordStore({ showPage: 'single', singleStationCode: record.stationCode, mainListData: [] })
    this.props.history.push(`/analysis/cleanout/record/${record.stationCode}`);
    // this.props.history.push(`/analysis/cleanout/record/${record.stationCode}`);
  }
  showAddPlanModal = (record) => {
    this.setState({
      showModal: true,
      record: record
    })
  }
  cancelModal = () => {
    this.setState({
      showModal: false
    })
  }
  confirmModal = () => {
    const { getFieldsValue } = this.props.form;
    const { record } = this.state;
    let planValue = getFieldsValue();
    //添加计划的函数发请求
    this.props.form.validateFieldsAndScroll((error, values) => {

      if (!error) {
        if (this.state.planType === 'clean') {
          planValue.estimateStartTime = moment(planValue.cleanPlanDate[0]).format('YYYY-MM-DD')
          planValue.estimateEndTime = moment(planValue.cleanPlanDate[1]).format('YYYY-MM-DD')
          //发送添加清洗计划的函数
          this.props.getAddCleanPlan({ ...planValue, stationCode: record.stationCode })
        } else {
          //发送添加下雨记录
          planValue.estimateStartTime = moment(planValue.rainPlanDate[0]).format('YYYY-MM-DD')
          planValue.estimateEndTime = moment(planValue.rainPlanDate[1]).format('YYYY-MM-DD')
          this.props.getAddRainPlan({ ...planValue, stationCode: record.stationCode })
        }
        this.setState({
          showModal: false,
          planType: 'clean'

        })
      }
    })
  }
  render() {
    const { loading, mainListData } = this.props;
    const { record } = this.state;
    const column = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        render: (text, record, index) => {
          return (
            <span className={styles.stationName} title={record.stationName}>{record.stationName}</span>
          )
        }
      }, {
        title: '清洗计划(个)',
        dataIndex: 'cleanPlanNum',
        key: 'cleanPlanNum',
        sorter: true,
      }, {
        title: '平均清洗周期(天)',
        dataIndex: 'cleanCycle',
        key: 'cleanCycle',
        render: text => (<span>{parseInt(text) >= 0 ? `${text}` : '--'}</span>),
        sorter: true,
      }, {
        title: '累计清洗收益(万kWh)',
        dataIndex: 'cleanProfit',
        key: 'cleanProfit',
        sorter: true,
      }, {
        title: '上次清洗时间',
        dataIndex: 'cleanTime',
        key: 'cleanTime',
        sorter: true,
      }, {
        title: '添加清洗计划/降雨',
        key: 'addplan',
        render: (text, record, index) => {
          // let record2 = 'dianzhan1/qinhxi'
          return (<div>
            <div title="添加清洗计划/降雨" className="iconfont icon-addto" onClick={() => this.showAddPlanModal(record)}>

            </div>

          </div>)
        }
      }, {
        title: '查看',
        key: 'check',
        render: (text, record, index) => {
          return (record.cleanPlanNum > 0 ? <span title="查看" className="iconfont icon-plan" onClick={() => this.showDetailModal(record)}></span> : '')
        }
      }
    ];

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
    const { planType } = this.state;
    const rangeConfig = {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
      initialValue: '',
    };
    return (
      <div>
        <Table
          loading={loading}
          dataSource={mainListData.map((e, i) => ({ ...e, key: i }))}
          columns={column}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img src="/img/nodata.png" /> }}
        />
        <Modal
          title={`${record.stationName}-清洗计划/降雨`}
          visible={this.state.showModal}
          onOk={this.confirmModal}
          footer={null}
          onCancel={this.cancelModal}
          mask={false}
          centered={true}
          closable={false}
          maskClosable={false}
        >
          <div className={styles.modalStyle}>
            <div className={styles.radioStyle}>
              <RadioGroup onChange={this.onChange} value={this.state.planType}>
                <Radio value={'clean'}>清洗计划</Radio>
                <Radio value={'rain'}>降雨记录</Radio>
              </RadioGroup>
            </div>
            {planType === 'clean' ?
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="清洗公司/责任人"
                >
                  {getFieldDecorator('company', {
                    rules: [{ required: true, message: '清洗公司/责任人', whitespace: true }],
                    initialValue: '',
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
                    initialValue: '',
                    rules: [{ required: true, message: '只能输入数字', whitespace: true }, { pattern: /(^\d{0,}\.{0,1}\d$)/, message: '仅支持数字，小数点' }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Form> : <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="降雨时间"
                >
                  {getFieldDecorator('rainPlanDate', rangeConfig)(
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
      </div>
    )
  }
}
export default Form.create()(CleanoutRecordTable)
