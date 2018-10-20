
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Table, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

class LostGenTable extends Component {
  static propTypes = {
    rememberRemove: PropTypes.bool,
    form: PropTypes.object,
    faultGenList: PropTypes.array,
    changeFaultList: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  removeFaultInfo = (id) => {
    const { faultGenList, changeFaultList, rememberRemove } = this.props;
    const newFaultGenList = faultGenList.filter(e=>id !== e.id).map(e=>{
      rememberRemove && (e.handleRemove = true); // 编辑时删除某条后台数据
      return e
    });
    changeFaultList(newFaultGenList);
  }

  _loseColumn = () => {
    const { getFieldDecorator } = this.props.form;
    const column = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
      },{
        title: '损失电量类型',
        dataIndex: 'faultName'
      },{
        title: '原因说明',
        dataIndex: 'reason',
      },{
        title: '发生时间',
        dataIndex: 'startTime',
        render : (text, record) => {
          console.log(record)
          return record.typeSource === 0?<span>
            {moment(record.startTime).format('YYYY-MM-DD HH:mm')}
          </span>:<Form.Item>
            {getFieldDecorator(`${record.id}_startTime`, {
              initialValue: record.startTime,
            })(
              <DatePicker placeholder="开始时间" showTime={true} format="YYYY-MM-DD HH:mm"  />
            )}
          </Form.Item>
        }
      },{
        title: '结束时间',
        dataIndex: 'endTime',
        render : (text, record) => {
          console.log(record)
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_endTime`, {
              initialValue: record.endTime,
            })(
              <DatePicker placeholder="结束时间" showTime={true} format="YYYY-MM-DD hh:mm"  />
            )}
          </Form.Item>)
        }
      },{
        title: '处理进展及问题',
        dataIndex: 'process',
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
        title: '日损失电量',
        dataIndex: 'lostPower',
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
        render : (text, record) => {
          const { id } = record;
          return text?<span onClick={()=>this.removeFaultInfo(id)} className={styles.removeFaultInfo} ><i className="iconfont icon-del" ></i></span>:<span></span>
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
  onValuesChange:(props, changedValues, allValues)=>{
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
