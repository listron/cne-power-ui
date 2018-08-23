

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
    loading: PropTypes.bool,
  }

  constructor(props){
    super(props);
    this.state = {
      tmpDeviceList : props.inverterList && props.inverterList.deviceList && props.inverterList.deviceList.map((e,i)=>({...e,key:i})),//暂存的逆变器列表
      currentStatus: 0,//当前状态值
      alarmSwitch: false,
    }
  }

  onPaginationChange = ({currentPage,pageSize}) => {//分页器
    // const { stationCode } = this.props.match.params;
    // this.props.getInverterList({ 
    // })
  }

  
  onChangeStatus = (e) => {
    console.log(e);
    const statusValue = e.target.value;
    const { inverterList } = this.props; 
    const { alarmSwitch } = this.state; 
    const deviceList = inverterList && inverterList.deviceList && inverterList.deviceList.map((e,i)=>({...e,key:i}));
    let selectedList = [];
    if(alarmSwitch){
      selectedList = statusValue===0 ? deviceList : deviceList.filter(e=>e.deviceStatus===statusValue&&e.alarmNum!==null);
    }else{
      selectedList = statusValue===0 ? deviceList : deviceList.filter(e=>e.deviceStatus===statusValue);
    }
    this.setState({
      tmpDeviceList: selectedList,
      currentStatus: statusValue,
    })
  }
  onSwitchAlarm = (e) => {
    const { inverterList } = this.props; 
    const { currentStatus } = this.state; 
    const deviceList = inverterList && inverterList.deviceList && inverterList.deviceList.map((e,i)=>({...e,key:i}));
    console.log(deviceList);
    let selectedList = [];
    selectedList = e ? deviceList.filter(e=>e.deviceStatus===currentStatus&&e.alarmNum!==null) : deviceList;
    this.setState({
      tmpDeviceList: selectedList,
      alarmSwitch: e,
    });
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
    const {tmpDeviceList, } = this.state;
    const deviceList = inverterList && inverterList.deviceList;
    const initDeviceList = deviceList && deviceList.map((e,i)=>({...e,key:i}));
    
    console.log(initDeviceList);
    let endDeviceList = tmpDeviceList || initDeviceList;
    let parentDeviceCodes = endDeviceList && endDeviceList.map(e=>e.parentDeviceCode);
    console.log(parentDeviceCodes);
    let parentDeviceCodeSet = new Set(parentDeviceCodes);
    let tmpParentDeviceCodes = [...parentDeviceCodeSet];
    console.log(tmpParentDeviceCodes);
    tmpParentDeviceCodes.forEach((value,key)=>{
      console.log(value+''+ key);
      tmpParentDeviceCodes[key] = deviceList.filter(e=>value===e.parentDeviceCode);
    })
    console.log(tmpParentDeviceCodes);
    const inverterListNum = deviceList && (deviceList.length || 0);
    const deviceStatus = inverterList && inverterList.deviceStatusSummary;
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm}  />告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        <Radio.Button value={100}>正常{deviceStatus && deviceStatus.deviceStatusNum}</Radio.Button>
        <Radio.Button value={300}>故障{deviceStatus && deviceStatus.deviceStatusNum}</Radio.Button>
        <Radio.Button value={200}>停机{deviceStatus && deviceStatus.deviceStatusNum}</Radio.Button>
        <Radio.Button value={900}>无通讯{deviceStatus && deviceStatus.deviceStatusNum}</Radio.Button>
      </Radio.Group>
    </div>);
    const pagination = {
      defaultPageSize: 10,
      defaultCurrent: 1,
      showQuickJumper: true,
      total: inverterListNum,
      showSizeChanger: true,
      position: 'top',
      size: 'small',
    }
    return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.inverterBlockBox} >
            {tmpParentDeviceCodes && tmpParentDeviceCodes.map((e,index)=>{
              return (<div key={index}>
                <div className={styles.parentDeviceName} >{e[0].parentDeviceName}</div>
                {e && e.map(item=>{
                  return (<div key={item.deviceCode} className={styles.inverterItem}>
                    <div className={styles.inverterItemIcon} ><i className="iconfont icon-nb" ></i></div>
                    <div className={styles.inverterItemR} >
                      <div>{item.deviceName}</div>
                      <Progress className={styles.powerProgress} strokeWidth={4} percent={item.devicePower/item.deviceCapacity*100} showInfo={false} />
                      <div className={styles.inverterItemPower}><div>{item.devicePower}</div><div>{item.deviceCapacity}</div></div>
                    </div>
                  </div>);
                })}
              </div>);
            })}
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2">
            <div>
              {/* <CommonPagination total={inverterListNum} onPaginationChange={this.onPaginationChange} /> */}
              <Table 
                loading={loading}
                dataSource={tmpDeviceList || initDeviceList} 
                columns={this.tableColumn()} 
                onChange={this.tableChange}
                pagination={pagination}
                className={styles.inverterTable}
              />
            </div>
            
          </TabPane>
        </Tabs>
        
      </div>
    )
  }
}

export default InverterList;
