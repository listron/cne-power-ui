
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './sideReportPage.scss';
import { Table, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

class LimitGenTable extends Component {
  static propTypes = {
    form: PropTypes.object,
    limitGenList: PropTypes.array,
    abnormalInfo: PropTypes.object,
    changeLimitList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  removeListInfo = (id) => {
    const { limitGenList, changeLimitList } = this.props;
    const newLimitGenList = limitGenList.filter(e=>id !== e.id);
    changeLimitList(newLimitGenList);
  }

  _loseColumn = () => {
    const { getFieldDecorator } = this.props.form;
    const column = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
      },{
        title: '限功率',
        dataIndex: 'limitPower',
      },{
        title: '原因说明',
        dataIndex: 'reason',
      },{
        title: '发生时间',
        dataIndex: 'startTime',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_startTime`, {
              rules: [{ required: true, message: '开始时间' }],
              initialValue: record.startTime,
            })(
              <DatePicker placeholder="开始时间" />
            )}
          </Form.Item>)
        }
      },{
        title: '结束时间',
        dataIndex: 'endTime',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_endTime`, {
              rules: [{ required: true, message: '结束时间' }],
              initialValue: record.endTime,
            })(
              <DatePicker placeholder="结束时间" />
            )}
          </Form.Item>)
        }
      },{
        title: '日损失电量',
        dataIndex: 'lostPower',
        render : (text, record) => {
          return (<Form.Item>
            {getFieldDecorator(`${record.id}_lostPower`, {
              rules: [{ required: true, message: '日损失电量' }],
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
          return text?<span onClick={()=>this.removeListInfo(id)}>删除</span>:<span></span>
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
