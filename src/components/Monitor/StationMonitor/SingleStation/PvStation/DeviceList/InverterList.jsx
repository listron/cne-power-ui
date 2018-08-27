

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Radio, Table, Progress  } from 'antd';
import CommonPagination from '../../../../../Common/CommonPagination';

const TabPane = Tabs.TabPane;
class InverterList extends Component {
  static propTypes = {
    inverterList: PropTypes.object,
    // getInverterList: PropTypes.func,
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
  getStatusColor = (value) => {
    switch(value){
      case 100:
        return '#199475';
      case 200:
        return '#999';
      case 300:
        return '#a42b2c';
      case 900:
        return '#c7ceb2';
      default:
        return '#c7ceb2';
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
        sorter: (a, b) => a.parentDeviceName.length - b.parentDeviceName.length,
      }, {
        title: '实时功率(kW)',
        dataIndex: 'devicePower',
        key: 'devicePower',
        render: (text,record) => (<div className={styles.devicePower} >
          <div>{text}</div>
          <Progress className={styles.progressPower} percent={text/record.deviceCapacity*100} showInfo={false} strokeWidth={4}  />
        </div>),
        sorter: (a, b) => a.devicePower - b.devicePower,
      }, {
        title: '装机容量(kW)',
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        render: (text,record) => (<span>{text}</span>),
        sorter: (a, b) => a.deviceCapacity - b.deviceCapacity,
      }, {
        title: '告警(个)',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        render: (text,record) => (<span>{text || 0}</span>),
        sorter: (a, b) => a.alarmNum - b.alarmNum,
      }, {
        title: '设备状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        render: (text,record) => (<span><i className={styles.statusColor} style={{backgroundColor: this.getStatusColor(record.deviceStatus)}} ></i>{this.getDeviceStatus(text)}</span>),
        sorter: (a, b) => a.deviceStatus - b.deviceStatus,
      }, 
    ];
    return columns;
  }
  
  render(){
    const { inverterList, loading } = this.props;
    const {tmpDeviceList, } = this.state;
    const deviceList = inverterList && inverterList.deviceList;
    const initDeviceList = deviceList && deviceList.map((e,i)=>({...e,key:i}));
    
    
    let endDeviceList = tmpDeviceList || initDeviceList;
    let parentDeviceCodes = endDeviceList && endDeviceList.map(e=>e.parentDeviceCode);
    
    let parentDeviceCodeSet = new Set(parentDeviceCodes);
    let tmpParentDeviceCodes = [...parentDeviceCodeSet];
    
    tmpParentDeviceCodes.forEach((value,key)=>{
      tmpParentDeviceCodes[key] = deviceList.filter(e=>value===e.parentDeviceCode);
    })
    
    const inverterListNum = deviceList && (deviceList.length || 0);
    const deviceStatus = inverterList && inverterList.deviceStatusSummary;
    const deviceStatusNums=deviceStatus && deviceStatus.map(e=>e.deviceStatusNum);
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm}  />告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        <Radio.Button value={100}>正常{deviceStatusNums && deviceStatusNums[0]}</Radio.Button>
        <Radio.Button value={300}>故障{deviceStatusNums && deviceStatusNums[2]}</Radio.Button>
        <Radio.Button value={200}>停机{deviceStatusNums && deviceStatusNums[1]}</Radio.Button>
        <Radio.Button value={900}>无通讯{deviceStatusNums && deviceStatusNums[3]}</Radio.Button>
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
            {(tmpParentDeviceCodes&&tmpParentDeviceCodes.length>0) ? tmpParentDeviceCodes.map((e,index)=>{
              return (<div key={index}>
                <div className={styles.parentDeviceName} >{e[0].parentDeviceName}</div>
                {e && e.map(item=>{
                  return (<div key={item.deviceCode} className={styles.inverterItem}>
                    <div className={styles.inverterItemIcon} ><i className="iconfont icon-nb" ></i>{item.alarmNum && <i className="iconfont icon-alarm" ></i>}</div>
                    <div className={styles.inverterItemR} >
                      <div>{item.deviceName}</div>
                      <Progress className={styles.powerProgress} strokeWidth={4} percent={item.devicePower/item.deviceCapacity*100} showInfo={false} />
                      <div className={styles.inverterItemPower}><div>{item.devicePower}KW</div><div>{item.deviceCapacity}KW</div></div>
                    </div>
                  </div>);
                })}
              </div>);
            }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>}
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
