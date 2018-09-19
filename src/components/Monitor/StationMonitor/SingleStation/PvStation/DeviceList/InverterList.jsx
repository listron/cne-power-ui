

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Radio, Table, Progress  } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';

const TabPane = Tabs.TabPane;
class InverterList extends Component {
  static propTypes = {
    inverterList: PropTypes.object,
    match: PropTypes.object,
    loading: PropTypes.bool,
    deviceTypeCode: PropTypes.number,
    getInverterList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      tmpDeviceList : props.inverterList && props.inverterList.deviceList && props.inverterList.deviceList.map((e,i)=>({...e,key:i})),//暂存的逆变器列表
      currentStatus: 0,//当前状态值
      alarmSwitch: false,
      pageSize: 10, 
      currentPage: 1,
      sortName: '',
      descend : false,
    }
  }
  
  componentDidMount(){
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps){
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if( nextStation !== stationCode ){
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timeOutId);
  }

  onChangeStatus = (e) => {
    const statusValue = e.target.value;
    const { inverterList } = this.props; 
    const { alarmSwitch } = this.state;
    const deviceList = inverterList && inverterList.deviceList && inverterList.deviceList.map((e,i)=>({...e,key:i}));

    let selectedList = [];
    if(alarmSwitch){
      selectedList = statusValue===0 ? deviceList : deviceList.filter(e=>e.deviceStatus === statusValue && e.alarmNum!==null);
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
  getData = (stationCode) => {
    this.props.getInverterList({stationCode});
    this.timeOutId = setTimeout(()=>{
      this.getData(stationCode);
    }, 10000);
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
    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    const { deviceTypeCode, } = this.props;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: (text, record, index) => (
          <div className={record.deviceStatus === 900 ? styles.deviceCode : ""} >
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`}  className={styles.tableDeviceName} >{text}</Link>
          </div>
        )
      }, {
        title: '所属设备',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        render: (text,record,index) => (<span>{text}</span>),
        sorter: (a, b) => a.deviceName.length - b.deviceName.length,
      }, {
        title: '实时功率(kW)',
        dataIndex: 'devicePower',
        key: 'devicePower',
        render: (value, record, index) => {
          return {
            children: (
              <div>
                <div className={styles.devicePower}>
                  <div className={styles.progressPower}>
                    <div className={styles.deviceValue}>
                      <div>{record.devicePower}</div>
                      <div>{record.deviceCapacity}</div>
                    </div>
                    <Progress percent={record.devicePower / record.deviceCapacity * 100} showInfo={false} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ),
            props: {
              colSpan: 2
            }
          };
        },
        sorter: (a, b) => a.devicePower - b.devicePower,
      }, {
        title: '装机容量(kW)',
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        width: '140px',
        render: (value, columns, index) => {
          const obj = {
            children: null,
            props: {
              colSpan: 0
            }
          };
          return obj;
        },
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
  compareName = (a,b) => {
    return a['deviceName'].localeCompare(b['deviceName']);
  }
  compareParentName = (a,b) => {
    if(a[0] && b[0] && a[0]['parentDeviceName'] && a[1]['parentDeviceName']){
      return a[0]['parentDeviceName'].localeCompare(b[0]['parentDeviceName']);
    }
  }
  changePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage })
  }
  tableChange = (pagination, filters, sorter) => {
    this.setState({ 
      sortName: sorter.field,
      descend : sorter.order === 'descend'
    })
  }
  createTableSource = (data) => {
    const { sortName, descend } = this.state;
    const tableSource = [...data].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['parentDeviceName','deviceStatus'];
      const arrayNumSort = ['devicePower', 'deviceCapacity', 'alarmNum',];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].length - b[sortName].length);
      }
    })
    return tableSource;
  }
  render(){
    const { inverterList, loading, deviceTypeCode, } = this.props;
    const {tmpDeviceList,currentPage, pageSize } = this.state;
    const deviceList = inverterList && inverterList.deviceList;
    const initDeviceList = deviceList && deviceList.map((e,i)=>({...e,key:i}));
    
    
    let endDeviceList = tmpDeviceList || initDeviceList;
    let parentDeviceCodes = endDeviceList && endDeviceList.map(e=>e.parentDeviceCode);
    
    const currentDeviceList = endDeviceList && this.createTableSource(endDeviceList).splice((currentPage-1)*pageSize,pageSize);

    let parentDeviceCodeSet = new Set(parentDeviceCodes);
    let tmpParentDeviceCodes = [...parentDeviceCodeSet];
    
    tmpParentDeviceCodes.forEach((value,key)=>{
      tmpParentDeviceCodes[key] = deviceList.filter(e=>value===e.parentDeviceCode);
    })
    
    const inverterListNum = deviceList && (deviceList.length || 0);
    const deviceStatus = inverterList && inverterList.deviceStatusSummary;
    const deviceStatusNums=deviceStatus && deviceStatus.map(e=>e.deviceStatusNum);
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm}  /> 告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        <Radio.Button value={100}>正常 {deviceStatusNums && deviceStatusNums[0]}</Radio.Button>
        <Radio.Button value={300}>故障 {deviceStatusNums && deviceStatusNums[2]}</Radio.Button>
        <Radio.Button value={200}>停机 {deviceStatusNums && deviceStatusNums[1]}</Radio.Button>
        <Radio.Button value={900}>未接入 {deviceStatusNums && deviceStatusNums[3]}</Radio.Button>
      </Radio.Group>
    </div>);
    
    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    
    return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.inverterBlockBox} >
            {(tmpParentDeviceCodes&&tmpParentDeviceCodes.length>0) ? tmpParentDeviceCodes.sort(this.compareParentName).map((e,index)=>{
              return (<div key={index}>
                <div className={styles.parentDeviceName} >{e && e[0] && e[0].parentDeviceName}</div>
                {e && e.sort(this.compareName).map((item,i)=>{
                  return (<div key={i} className={item.deviceStatus === 900 ? styles.cutOverItem : styles.inverterItem} >
                    <div className={styles.inverterItemIcon} >
                      <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}  >
                        <i className="iconfont icon-nb" ></i>
                      </Link>
                      <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}/?showPart=alarmList`}  >
                        {(item.alarmNum && item.alarmNum>0)? <i className="iconfont icon-alarm" ></i> : <div></div>}
                      </Link>
                    </div>
                    <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}  >
                      <div className={styles.inverterItemR} >
                        <div>{item.deviceName}</div>
                        <Progress className={styles.powerProgress} strokeWidth={3} percent={item.devicePower/item.deviceCapacity*100} showInfo={false} />
                        <div className={styles.inverterItemPower}>
                          <div>{item.devicePower ? parseFloat(item.devicePower).toFixed(2) : '--'}kW</div>
                          <div>{item.deviceCapacity ? parseFloat(item.deviceCapacity).toFixed(2) : '--'}kW</div>
                        </div>
                      </div>
                    </Link>
                  </div>);
                })}
              </div>);
            }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>}
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2" className={styles.inverterTableBox} >
            <div>
              <div className={styles.pagination} >
                <CommonPagination onPaginationChange={this.changePagination} total={inverterListNum} />
              </div>
              <Table 
                loading={loading}
                dataSource={currentDeviceList} 
                columns={this.tableColumn()} 
                onChange={this.tableChange}
                pagination={false}
                className={styles.inverterTable}
                locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" /></div> }}
              />
            </div>
            
          </TabPane>
        </Tabs>
        
      </div>
    )
  }
}

export default InverterList;
