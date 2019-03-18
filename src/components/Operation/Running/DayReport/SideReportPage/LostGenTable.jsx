
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Table, Form, Input, DatePicker, message } from 'antd';
import moment from 'moment';
import TableColumnTitle from '../../../../Common/TableColumnTitle';

class LostGenTable extends Component {
  static propTypes = {
    rememberRemove: PropTypes.func,
    form: PropTypes.object,
    reportDate: PropTypes.string,
    faultGenList: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    changeFaultList: PropTypes.func,
  }

  onStartChange = (recordId, startMoment) => {
    const { form } = this.props;
    const endTime = form.getFieldValue(`${recordId}_endTime`);
    this.timeEnableCheck(recordId, 'startTime', startMoment, endTime);
  }
  
  onEndChange = (recordId, endMoment) => {
    const { form } = this.props;
    const startTime = form.getFieldValue(`${recordId}_startTime`);
    this.timeEnableCheck(recordId, 'endTime', startTime, endMoment);
  }

  timeEnableCheck = (recordId, recordType, startMoment, endMoment) => { // recordType: startTime || endTime
    const { form, faultGenList, changeFaultList } = this.props;
    const enableInfo = { // 时间信息规范无误时的设置项。
      [`${recordId}_startTime`]: {
        value: startMoment,
        errors: null
      },
      [`${recordId}_endTime`]: {
        value: endMoment,
        errors: null
      }
    }
    if (!startMoment || !endMoment){ // 有时间未填写 => 允许
      form.setFields(enableInfo);
    } else if (startMoment > endMoment) { // 时间不规范 错误提示
      message.error('结束时间必须大于开始时间');
      form.setFields({
        [`${recordId}_${recordType}`]: {
          value: recordType === 'startTime' ? startMoment : endMoment,
          errors: [new Error('结束时间必须大于开始时间')]
        }
      });
      const newFaultGenList = faultGenList.map(e => {
        if (`${e.id}` === recordId) {
          e[recordType] = recordType === 'startTime' ? startMoment : endMoment;
        }
        return e;
      })
      changeFaultList(newFaultGenList);
    } else { // 时间规范 => 关闭错误
      form.setFields(enableInfo);
    }
    // return { value: recordType === 'startTime' ? startMoment : endMoment };
  }

  removeFaultInfo = (id) => {
    const { faultGenList, changeFaultList, rememberRemove } = this.props;
    const newFaultGenList = faultGenList.filter(e=>{
      rememberRemove && id === e.id && id > 0 && rememberRemove({faultId: id}); // 要删除的id需暂存
      return id !== e.id
    });
    changeFaultList(newFaultGenList);
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  _loseColumn = () => {
    const { getFieldDecorator } = this.props.form;
    const column = [
      {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        className: 'deviceTypeName',
        render: text => (
          <span title={text} >{text}</span>
        ),
      },{
        title: '设备名称',
        dataIndex: 'deviceName',
        className: 'deviceName',
        render: text => (
          <span title={text} >{text}</span>
        ),
      },{
        title: '损失电量类型',
        dataIndex: 'faultName',
        className: 'faultName',
        render: text => (
          <span title={text} >{text}</span>
        ),
      },{
        title: '原因说明',
        dataIndex: 'reason',
        className: 'reason',
        render: text => (
          <span title={text} >{text}</span>
        ),
      },{
        title: '发生时间',
        dataIndex: 'startTime',
        className: 'startTime',
        render : (text, record) => {
          const { reportDate, startTime, id } = record;
          // let tableReportDate = this.props.reportDate; // 正在处理的日报日期.
          // const allowDelete = moment(tableReportDate).isSame(moment(reportDate),'day'); // 日报日期当天添加的故障起始时间才可编辑。
          // return allowDelete?<Form.Item>
          //   {getFieldDecorator(`${id}_startTime`, {
          //     initialValue: startTime,
          //   })(
          //     <DatePicker placeholder="开始时间" style={{width: '100%'}} showTime={{format: 'HH:mm'}} format="YYYY-MM-DD HH:mm" />
          //   )}
          // </Form.Item>:<span>
          //   {moment(startTime).format('YYYY-MM-DD HH:mm')}
          // </span>
          return (
            <Form.Item>
              {getFieldDecorator(`${id}_startTime`, {
                initialValue: startTime,
              })(
                <DatePicker
                  placeholder="开始时间"
                  style={{width: '100%'}}
                  disabledDate = {this.disabledDate}
                  showTime={{format: 'HH:mm'}}
                  format="YYYY-MM-DD HH:mm"
                  onChange={(startMoment) => this.onStartChange(`${id}`, startMoment)}
                />
              )}
            </Form.Item>
          )
        }
      },{
        title: '结束时间',
        dataIndex: 'endTime',
        className: 'endTime',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_endTime`, {
              initialValue: record.endTime,
            })(
              <DatePicker
                placeholder="结束时间"
                disabledDate = {this.disabledDate}
                style={{width: '100%'}}
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD HH:mm"
                onChange={(endMoment) => this.onEndChange(`${record.id}`, endMoment)}
              />
            )}
          </Form.Item>)
        }
      },{
        title: '处理进展及问题',
        dataIndex: 'process',
        className: 'process',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_process`, {
              initialValue: record.process,
            })(
              <Input placeholder="处理进展" />
            )}
          </Form.Item>)
        }
      },{
        title: <TableColumnTitle title="日损失电量" unit="kWh" />,
        dataIndex: 'lostPower',
        className: 'lostPower',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_lostPower`, {
              initialValue: record.lostPower,
            })(
              <Input placeholder="日损失电量"  className={styles.lostPower} />
            )}
          </Form.Item>)
        }
      },{
        title: '操作',
        dataIndex: 'handle',
        className: 'handle',
        render : (text, record) => {
          const { id, reportDate, defectId } = record;
          let tableReportDate = this.props.reportDate; // 正在处理的日报日期.
          const refuseDelete = moment(tableReportDate).isSame(moment(reportDate),'day') && defectId; // 今天且关联缺陷时，不可删除。
          return refuseDelete?<span></span>:<span onClick={()=>this.removeFaultInfo(id)} className={styles.removeFaultInfo} >
            <i className="iconfont icon-del" ></i>
          </span>
        }
      }
    ]
    return column;
  }

  render(){
    const { faultGenList } = this.props;
    return (
      <Form>
        <Table 
          columns={this._loseColumn()} 
          dataSource={faultGenList.map((e,i)=>({ ...e, key: i,}))}
          pagination={false}
          className={styles.lostGenTable}
        />
      </Form>
    )
  }
}

export default Form.create({ // 上述form值变化调整对应数据并保存对应数据。
  onValuesChange: (props, changedValues, allValues) => {
    const { faultGenList, changeFaultList } = props;
    const changeArr = Object.entries(changedValues)[0] || [];
    const recordBase = changeArr[0] || '';
    if(!recordBase){
      return
    }
    const recordId = recordBase.split('_')[0];
    const recordName = recordBase.split('_')[1];
    let recordValue = changeArr[1];
    const newFaultGenList = faultGenList.map(e=>{
      if(`${e.id}` === recordId){
        e[recordName] = recordValue;
      }
      return e
    })
    changeFaultList(newFaultGenList);
  }
})(LostGenTable);
