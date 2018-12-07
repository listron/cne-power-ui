import React, { Component } from "react";
import { Table, Icon, Modal, Form, DatePicker, Input,Button } from 'antd';
import styles from './cleanoutRecordMain.scss';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class CleanoutRecordTable extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showModal: false
    }
  }
  tableChange = () => {

  }
  tableChange = () => {

  }
  showDetailModal = (record) => {
    this.props.history.push(`/analysis/cleanout/record/360`);
    this.props.changeCleanoutRecordStore({ showPage: 'single' })
    // this.props.history.push(`/analysis/cleanout/record/${record.stationCode}`);
  }
  showModal = (record) => {
    this.setState({
      showModal: true
    })
  }
  modalContainer(record) {
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
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    };
    return (
      <Modal
        title={record}
        visible={this.state.showModal}
        onOk={this.onOk}
        footer={null}
        onCancel={this.onCancel}
        mask={false}
        centered={true}
        closable={false}
        maskClosable={false}
      >
        <div className={styles.modalStyle}>

          <div>
            <Form onSubmit={this.handleSubmit}>
            
              <FormItem
                {...formItemLayout}
                label="清洗公司/责任人"
              >
                {getFieldDecorator('cleanCom', {
                  rules: [{ required: true, message: '清洗公司/责任人', whitespace: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="计划清洗时间"
              >
                {getFieldDecorator('range-picker', rangeConfig)(
                  <RangePicker />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="清洗费用"
              >
                {getFieldDecorator('cost', {
                  rules: [{ required: true, message: '只能输入数字', whitespace: true }, { pattern: /(^\d{0,}\.{0,1}\d$)/, message: '仅支持数字，小数点' }],
                })(
                  <Input />
                )}
              </FormItem>
              <div className={styles.handle}> 
            <Button onClick={this.cancelExamineTip} >取消</Button>
            <Button onClick={this.confirmExamineTip} className={styles.confirmExamine} >保存</Button>
          </div>
            </Form>
          </div>
        </div>

      </Modal>
    )


  }
  render() {
    const { loading } = this.props;

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
        render: text => (<span>{parseInt(text) >= 0 ? `${text}%` : '--'}</span>),
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
          let record2 = 'dianzhan1/qinhxi'
          return (<div>
            <span title="查看" className="iconfont icon-look" onClick={(record) => this.showModal(record)}>
            </span>
            {this.modalContainer(record2)}
          </div>)
        }
      }, {
        title: '查看',
        key: 'check',
        render: (text, record, index) => {
          // console.log(record);
          return (<span title="查看" className="iconfont icon-look" onClick={(record) => this.showDetailModal(record)}></span>)
        }
      }

    ];
    const data = [{ stationName: 'dalidadali', check: '1', addplan: '2', cleanTime: '3', cleanProfit: '4', cleanCycle: '5', cleanPlanNum: '6', stationCode: 360 }, { stationName: 'wulala', check: '6', addplan: '7', cleanTime: '8', cleanProfit: '9', cleanCycle: '10', cleanPlanNum: '11', stationCode: 350 }]
    return (
      <div>
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
export default Form.create()(CleanoutRecordTable)