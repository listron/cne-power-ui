
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Table, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { message } from 'antd';

class LimitGenTable extends Component {
  static propTypes = {
    rememberHandle: PropTypes.func, // 需记录交互的手动操作父组件数据函数: 记录删除id，记录编辑的时间。
    form: PropTypes.object,
    limitGenList: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    changeLimitList: PropTypes.func,
    reportDate: PropTypes.string,
  }

  removeListInfo = (id) => {
    const { limitGenList, changeLimitList, rememberHandle } = this.props;
    const newLimitGenList = limitGenList.filter(e=>{
      rememberHandle && id === e.id && id > 0 && rememberHandle({ limitId: id }); // 要删除的id需暂存
      return id !== e.id
    });
    changeLimitList(newLimitGenList);
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  _loseColumn = () => {
    const { form, limitGenList, rememberHandle } = this.props;
    const { getFieldDecorator } = form;
    const column = [
      {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        className: 'deviceTypeName',
        render: text => (
          <span title={text}>{text}</span>
        ),
      },{
        title: '设备名称',
        dataIndex: 'deviceName',
        className: 'deviceName',
        render: text => (
          <span title={text}>{text}</span>
        ),
      },{
        title: '限功率(%)',
        dataIndex: 'limitPower',
        className: 'limitPower',
        render: text => (
          <span title={text}>{text}</span>
        ),
      },{
        title: '原因说明',
        dataIndex: 'reason',
        className: 'reason',
        render: text => (
          <span title={text}>{text}</span>
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
          //     <DatePicker placeholder="开始时间" style={{width: '100%'}} showTime={{format: 'HH:mm'}} format="YYYY-MM-DD HH:mm"  />
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
                      const newLimitGenList = limitGenList.map(e => {
                        if(`${e.id}` === `${id}`){
                          e.startTime = value;
                        }
                        return e
                      });
                      rememberHandle({ limitList: newLimitGenList }); // 时间变化映射到父组件。
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
                  allowClear={false}
                  disabledDate = {this.disabledDate}
                  style={{width: '100%', minWidth: 'auto'}}
                  showTime={{format: 'HH:mm'}}
                  format="YYYY-MM-DD HH:mm"
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
                  if (rememberHandle) {
                    const newLimitGenList = limitGenList.map(e => {
                      if(`${e.id}` === `${record.id}`){
                        e.endTime = value;
                      }
                      return e
                    });
                    rememberHandle({ limitList: newLimitGenList }); // 时间变化映射到父组件。
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
                style={{width: '100%', minWidth: 'auto'}}
                showTime={{format: 'HH:mm'}}
                disabledDate = {this.disabledDate}
                format="YYYY-MM-DD HH:mm"
              />
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
          const { id } = record;
          return (<span onClick={()=>this.removeListInfo(id)} className={styles.removeFaultInfo}>
            <i className="iconfont icon-del"></i>
          </span>)
        }
      }
    ]
    return column;
  }

  render(){
    const { limitGenList } = this.props;
    return (
      <Form>
        <Table 
          columns={this._loseColumn()} 
          dataSource={limitGenList.map((e,i)=>({ ...e, key: i,}))}
          pagination={false}
          className={styles.lostGenTable}
        />
      </Form>
    )
  }
}

export default Form.create({ // 上述form值变化调整对应数据并保存对应数据。
  onValuesChange: (props, changedValues, allValues) => {
    const { limitGenList, changeLimitList } = props;
    const changeArr = Object.entries(changedValues)[0] || [];
    const recordBase = changeArr[0] || '';
    if(!recordBase){
      return
    }
    const recordId = recordBase.split('_')[0];
    const recordName = recordBase.split('_')[1];
    const newLimitGenList = limitGenList.map(e=>{
      if(`${e.id}` === recordId){
        const recordValue = (recordName === 'lostPower' && changeArr[1]) ? changeArr[1].trim() : changeArr[1];
        e[recordName] = recordValue;
      }
      return e
    })
    changeLimitList(newLimitGenList);
  }
})(LimitGenTable);
