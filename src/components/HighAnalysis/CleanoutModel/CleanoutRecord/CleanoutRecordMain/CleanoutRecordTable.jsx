import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, DatePicker, Input, Radio } from 'antd';
import styles from './cleanoutRecordMain.scss';
import moment from 'moment';
import CneTable from '@components/Common/Power/CneTable';
import { numWithComma } from '../../../../../utils/utilFunc';
import { handleRight } from '@utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;

class CleanoutRecordTable extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    match: PropTypes.object,
    form: PropTypes.object,
    stationCodes: PropTypes.array,
    onShowSideChange: PropTypes.func,
    changeCleanoutRecordStore: PropTypes.func,
    getAddCleanPlan: PropTypes.func,
    getAddRainPlan: PropTypes.func,
    loading: PropTypes.bool,
    mainListData: PropTypes.array,
    getMainList: PropTypes.func,
    history: PropTypes.object,
    sortField: PropTypes.string,
    sortType: PropTypes.number,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      showModal: false,
      planType: 'clean',
      record: {},
    };
  }

  onChange = (e) => {
    this.setState({
      planType: e.target.value,
    });
  }

  tableChange = (pagination, filter, sorter) => { // 电站list排序=>重新请求数据
    const { changeCleanoutRecordStore, getMainList, stationCodes, pageNum, pageSize, sortField, sortType } = this.props;
    const { field } = sorter || {};
    let newField = field, newSort = 1;
    if (!field || (sortField === field)) { // 点击的是正在排序的列
      newField = sortField;
      newSort = sortType === 1 ? 0 : 1; // 交换排序方式
    }
    changeCleanoutRecordStore({ sortField: newField, sortType: newSort });
    getMainList({
      stationCodes, pageNum, pageSize,
      sortField: newField,
      sortType: newSort,
    });
  }

  showDetailModal = (record) => {//跳转到单电站清洗模型详情
    this.props.changeCleanoutRecordStore({ showPage: 'single', singleStationCode: record.stationCode, mainListData: [] });
    this.props.history.push(`/analysis/cleanout/record/${record.stationCode}`);
    // this.props.history.push(`/analysis/cleanout/record/${record.stationCode}`);
  }

  showAddPlanModal = (record) => {
    this.setState({
      showModal: true,
      record: record,
    });
  }

  cancelModal = () => {
    this.setState({
      showModal: false,
    });
  }

  confirmModal = () => {
    const { getFieldsValue } = this.props.form;
    const { record } = this.state;
    const planValue = getFieldsValue();
    //添加计划的函数发请求
    this.props.form.validateFieldsAndScroll((error, values) => {

      if (!error) {
        if (this.state.planType === 'clean') {
          planValue.estimateStartTime = moment(planValue.cleanPlanDate[0]).format('YYYY-MM-DD');
          planValue.estimateEndTime = moment(planValue.cleanPlanDate[1]).format('YYYY-MM-DD');
          //发送添加清洗计划的函数
          this.props.getAddCleanPlan({ ...planValue, stationCode: record.stationCode });
        } else {
          //发送添加下雨记录
          planValue.estimateStartTime = moment(planValue.rainPlanDate[0]).format('YYYY-MM-DD');
          planValue.estimateEndTime = moment(planValue.rainPlanDate[1]).format('YYYY-MM-DD');
          this.props.getAddRainPlan({ ...planValue, stationCode: record.stationCode });
        }
        this.setState({
          showModal: false,
          planType: 'clean',

        });
      }
    });
  }

  render() {
    const { loading, mainListData, sortField, sortType } = this.props;
    const { record } = this.state;
    const planRecorOperation = handleRight('analysis_cleanModel_planRecord_operate');

    const column = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        className: styles.stationName,
        textAlign: 'left',
        sorter: true,
        render: (text, record, index) => {
          return (
            <span title={record.stationName}>{record.stationName}</span>
          );
        },
      }, {
        title: '清洗计划(个)',
        dataIndex: 'cleanPlanNum',
        textAlign: 'right',
        className: styles.cleanPlanNum,
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: '平均清洗周期(天)',
        dataIndex: 'cleanCycle',
        textAlign: 'right',
        className: styles.cleanCycle,
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: '累计清洗收益(万kWh)',
        dataIndex: 'cleanProfit',
        sorter: true,
        textAlign: 'right',
        className: styles.cleanProfit,
        render(text) { return numWithComma(text); },
      }, {
        title: '上次清洗时间',
        dataIndex: 'cleanTime',
        sorter: true,
        textAlign: 'center',
        className: styles.cleanTime,
        render: text => (<span>{(text) ? `${text}` : '--'}</span>),
      }, {
        title: '查看',
        dataIndex: 'check',
        textAlign: 'center',
        className: styles.check,
        render: (text, record, index) => {
          return (record.cleanPlanNum > 0 ? <div className={styles.iconStyles}> <span title="查看" className="iconfont icon-plan" onClick={() => this.showDetailModal(record)}></span> </div> : '');
        },
      },
    ];

    const addColum = {
      title: '添加清洗计划/降雨',
      dataIndex: 'addplan',
      textAlign: 'center',
      className: styles.addplan,
      render: (text, record, index) => {
        return (
          <div className={styles.iconStyles}>
            <div title="添加清洗计划/降雨" className="iconfont icon-addto" onClick={() => this.showAddPlanModal(record)}>
            </div>
          </div>);
      },
    };

    planRecorOperation && column.splice(-1, 0, addColum); // 若有planRecorOperation权限则添加addColum列

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
      rules: [{ type: 'array', required: true, message: '请选择计划清洗时间' }],
      initialValue: '',
    };
    const rainConfig = {
      rules: [{ type: 'array', required: true, message: '请选择降雨时间' }],
    };
    const sortMethod = sortType === 1 ? 'descend' : 'ascend';
    return (
      <React.Fragment>
        <CneTable
          loading={loading}
          dataSource={mainListData.map((e, i) => ({ ...e, key: i }))}
          columns={column}
          sortField={sortField}
          sortMethod={sortMethod}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img src="/img/nodata.png" /> }}
        />
        <span ref="wrap" />
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
          getContainer={() => this.refs.wrap}
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
                    <RangePicker getCalendarContainer={() => this.refs.wrap} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="清洗费用"
                >
                  {getFieldDecorator('cleanCost', {
                    initialValue: '',
                    rules: [{

                      message: '只能输入数字', whitespace: true,
                    }, { pattern: /(^\d{0,}$)/, message: '仅支持整数' }],
                  })(
                    <Input />
                  )}
                </FormItem>
              </Form> : <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="降雨时间"
                >
                  {getFieldDecorator('rainPlanDate', rainConfig)(
                    <RangePicker getCalendarContainer={() => this.refs.wrap} />
                  )}
                </FormItem>
              </Form>}
            <div className={styles.handle}>
              <span onClick={this.cancelModal}>取消</span>
              <CneButton
                lengthMode="short"
                onClick={this.confirmModal}
              >
                保存
              </CneButton>
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}
export default Form.create()(CleanoutRecordTable);
