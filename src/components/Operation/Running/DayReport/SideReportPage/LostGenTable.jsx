
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Table, Form, Input, DatePicker, message } from 'antd';
import moment from 'moment';
import TableColumnTitle from '../../../../Common/TableColumnTitle';

class LostGenTable extends Component {
  static propTypes = {
    rememberHandle: PropTypes.func, // 需记录交互的手动操作父组件数据函数: 记录删除id，记录编辑的时间。
    form: PropTypes.object,
    reportDate: PropTypes.string,
    faultGenList: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    changeFaultList: PropTypes.func,
  }

  removeFaultInfo = (id) => {
    const { faultGenList, changeFaultList, rememberHandle } = this.props;
    const newFaultGenList = faultGenList.filter(e => {
      rememberHandle && id === e.id && id > 0 && rememberHandle({ faultId: id }); // 要删除的id需暂存
      return id !== e.id
    });
    changeFaultList(newFaultGenList);
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  _loseColumn = () => {
    const { form, rememberHandle, faultGenList } = this.props;
    const { getFieldDecorator } = form;
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
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const endTime = form.getFieldValue(`${id}_endTime`);
                    const entTimeError = form.getFieldError(`${id}_endTime`);
                    if (rememberHandle) { // 需将底层改变映射至父组件
                      const newFaultGenList = faultGenList.map(e => {
                        if(`${e.id}` === `${id}`){
                          e.startTime = value;
                        }
                        return e
                      });
                      rememberHandle({ faultList: newFaultGenList }); // 时间变化映射到父组件。
                    }
                    if (!value) { // 开始时间必填
                      callback('请选择发生时间');
                    } else if (value && endTime) { // 同时有开始时间和结束时间
                      const timeUnable = value > endTime; // 开始时间大于结束时间 => error
                      const timeEnable = entTimeError && value <= endTime; // 结束时间报错，但开始时间更正可用
                      timeEnable && form.setFields({
                        [`${id}_endTime`]: {
                          value: endTime,
                          errors: null
                        }
                      });
                      timeUnable && message.error('结束时间必须大于开始时间');
                      timeUnable && callback('结束时间必须大于开始时间');
                    }
                    callback();
                  } 
                }],
              })(
                <DatePicker
                  placeholder="开始时间"
                  style={{width: '100%', minWidth: 'auto'}}
                  disabledDate = {this.disabledDate}
                  showTime={{format: 'HH:mm'}}
                  format="YYYY-MM-DD HH:mm"
                  allowClear={false}
                  // onChange={(startMoment) => this.onStartChange(`${id}`, startMoment)}
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
              rules: [{
                validator: (rule, value, callback) => {
                  const startTime = form.getFieldValue(`${record.id}_startTime`);
                  const startTimeError = form.getFieldError(`${record.id}_startTime`);
                  if (rememberHandle) { // 需将底层改变映射至父组件
                    const newFaultGenList = faultGenList.map(e => {
                      if(`${e.id}` === `${record.id}`){
                        e.endTime = value;
                      }
                      return e
                    });
                    rememberHandle({ faultList: newFaultGenList }); // 时间变化映射到父组件。
                  }
                  if (value && startTime) {
                    const timeUnable = startTime > value; // 开始时间 > 结束时间 => error
                    const timeEnable = startTimeError && value >= startTime; // 开始时间报错，但结束时间更正为可用
                    timeEnable && form.setFields({
                      [`${record.id}_startTime`]: {
                        value: startTime,
                        errors: null
                      }
                    });
                    timeUnable && message.error('结束时间必须大于开始时间');
                    timeUnable && callback('结束时间必须大于开始时间');
                  }
                  callback();
                } 
              }],
            })(
              <DatePicker
                placeholder="结束时间"
                disabledDate = {this.disabledDate}
                style={{width: '100%', minWidth: 'auto'}}
                showTime={{format: 'HH:mm'}}
                format="YYYY-MM-DD HH:mm"
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
        title: () => <TableColumnTitle title="日损失电量" unit="kWh" />,
        dataIndex: 'lostPower',
        className: 'lostPower',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_lostPower`, {
              initialValue: record.lostPower,
              rules:[{
                validator: (rule, value, callback) => {
                  let truelyValue = value;
                  if (truelyValue && isNaN(truelyValue)) {
                    message.error('损失电量请填写数字');
                    callback('损失电量请填写数字');
                  }
                  else if (truelyValue.indexOf(" ") >= 0) {
                    message.error('损失电量请填写数字');
                    callback('损失电量请填写数字');
                  }
                  else if (truelyValue) {
                    const demical = `${truelyValue}`.split('.')[1];
                    if (demical && demical.length > 2) {
                      message.error('损失电量不超过2位小数');
                      callback('损失电量不超过2位小数');
                    }
                  }
                  callback(); 
                }
              }],
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
    const newFaultGenList = faultGenList.map(e=>{
      if(`${e.id}` === recordId){
        const recordValue = (recordName === 'lostPower' && changeArr[1]) ? changeArr[1].trim() : changeArr[1];
        e[recordName] = recordValue;
      }
      return e
    })
    changeFaultList(newFaultGenList);
  }
})(LostGenTable);
