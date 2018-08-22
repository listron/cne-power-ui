

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Radio, Table, Progress  } from 'antd';
import CommonPagination from '../../../../../Common/CommonPagination';

const TabPane = Tabs.TabPane;
class InverterList extends Component {
  static propTypes = {
    inverterList: PropTypes.object,
    getInverterList: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  onPaginationChange = ({currentPage,pageSize}) => {//分页器
    // const { stationCode } = this.props.match.params;
    // this.props.getInverterList({ 
    // })
  }

  getDeviceStatus = (value) => {
    switch(value){
      case 100:
        return '正常';
      case 200:
        return '停机';
      case 300:
        return '故障';
      case 900:
        return '未接入';
      default:
        return '';
    }
  }
  tableColumn = () => {
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceCode',
        key: 'deviceCode',
        render: (text, record, index) => (<a href={'javascript:void(0)'} onClick={() => this.showUserDetail(record)} >{text}</a>)
      }, {
        title: '所属设备',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        render: (text,record,index) => (<span>{text}</span>),
        sorter: true,
      }, {
        title: '实时功率(kW)',
        dataIndex: 'devicePower',
        key: 'devicePower',
        render: (text,record) => (<div className={styles.devicePower} ><div>{text}</div><Progress className={styles.devicePower} percent={text/record.deviceCapacity*100} showInfo={false} /></div>),
        sorter: true,
      }, {
        title: '装机容量(kW)',
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        render: (text,record) => (<span>{text}</span>),
        sorter: true
      }, {
        title: '告警(个)',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        render: (text,record) => (<span>{text}</span>),
        sorter: true,
      }, {
        title: '设备状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        render: (text,record) => (<span>{this.getDeviceStatus(text)}</span>),
        sorter: true,
      }, 
    ];
    return columns;
  }
  
  render(){
    const { inverterList, loading } = this.props;
    console.log(inverterList);
    const deviceList = inverterList && inverterList.deviceList;
    const inverterListNum = deviceList && (deviceList.length || 0);
    const deviceStatusSummary = inverterList && inverterList.deviceStatusSummary;
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked onChange={this.onChange} />告警
      <Radio.Group defaultValue="a" buttonStyle="solid" className={styles.inverterStatus} >
        <Radio.Button value="a">全部</Radio.Button>
        <Radio.Button value="b">正常</Radio.Button>
        <Radio.Button value="c">故障</Radio.Button>
        <Radio.Button value="d">停机</Radio.Button>
        <Radio.Button value="d">无通讯</Radio.Button>
      </Radio.Group>
    </div>);
    const pagination = {
      defaultPageSize: 10,
      defaultCurrent: 1,
      showQuickJumper: true,
      total: inverterListNum,
      showSizeChanger: true,
      position: 'top',
      // simple: true,
      size: 'small',
    }
    return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1">
            {/* {inverterList && inverterList.map(e=>{
              return (<div>

              </div>);
            })} */}
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2">
            <div>
              {/* <CommonPagination total={inverterListNum} onPaginationChange={this.onPaginationChange} /> */}
              <Table 
                loading={loading}
                dataSource={deviceList && deviceList.map((e,i)=>({...e,key:i}))} 
                columns={this.tableColumn()} 
                onChange={this.tableChange}
                pagination={pagination}
              />
            </div>
            
          </TabPane>
        </Tabs>
        
      </div>
    )
  }
}

export default InverterList;
