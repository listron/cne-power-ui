
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Table, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

class LimitGenTable extends Component {
  static propTypes = {
    rememberRemove: PropTypes.func,
    form: PropTypes.object,
    limitGenList: PropTypes.array,
    stationDeviceTypes: PropTypes.array,
    changeLimitList: PropTypes.func,
    reportDate: PropTypes.string,
  }

  removeListInfo = (id) => {
    const { limitGenList, changeLimitList, rememberRemove } = this.props;
    const newLimitGenList = limitGenList.filter(e=>{
      rememberRemove && id === e.id && id > 0 && rememberRemove({limitId: id}); // 要删除的id需暂存
      return id !== e.id
    });
    changeLimitList(newLimitGenList);
  }

  _loseColumn = () => {
    const { getFieldDecorator } = this.props.form;
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
              })(
                <DatePicker placeholder="开始时间" style={{width: '100%'}} showTime={{format: 'HH:mm'}} format="YYYY-MM-DD HH:mm"  />
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
              <DatePicker placeholder="结束时间" style={{width: '100%'}} showTime={{format: 'HH:mm'}} format="YYYY-MM-DD HH:mm"   />
            )}
          </Form.Item>)
        }
      },{
        title: '日损失电量(kWh)',
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
            <i className="iconfont icon-del" ></i>
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
  onValuesChange:(props, changedValues, allValues)=>{
    const { limitGenList, changeLimitList } = props;
    const changeArr = Object.entries(changedValues)[0] || [];
    const recordBase = changeArr[0] || '';
    if(!recordBase){
      return
    }
    const recordId = recordBase.split('_')[0];
    const recordName = recordBase.split('_')[1];
    let recordValue = changeArr[1];
    const newLimitGenList = limitGenList.map(e=>{
      if(`${e.id}` === recordId){
        e[recordName] = recordValue;
      }
      return e
    })
    changeLimitList(newLimitGenList);
  }
})(LimitGenTable);
