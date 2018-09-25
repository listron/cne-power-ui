

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
    deviceTypeCode: PropTypes.number,
    getInverterList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      currentStatus: 0,//状态：正常/故障/停机
      alarmSwitch: false, // 是否告警
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

  onChangeStatus = (e) => { // 切换状态
    this.setState({
      currentStatus: e.target.value,
      currentPage: 1,
    })
  }
  onSwitchAlarm = (e) => { // 切换告警
    this.setState({
      alarmSwitch: e,
      currentPage: 1,
    });
  }
  getData = (stationCode) => {
    const { deviceTypeCode, getInverterList } = this.props;
    getInverterList({ stationCode, deviceTypeCode });
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
        return '#666';
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
    const { sortName, descend, currentPage, pageSize } = this.state;
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
    // const { inverterList } = this.props;
    // const initDeviceList = inverterList.deviceList || [];
    // const totalNum = initDeviceList.length || 0;
    // const maxPage = Math.ceil(totalNum / pageSize);
    // if(totalNum === 0){ // 总数为0时，展示0页
    //   currentPage = 0;
    // }else if(maxPage < currentPage){ // 当前页已超出
    //   currentPage = maxPage;
    // }
    return tableSource.splice((currentPage-1)*pageSize,pageSize);
  }
  render(){
    const { inverterList, deviceTypeCode, } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize  } = this.state;
    const initDeviceList = inverterList.deviceList && inverterList.deviceList.map((e,i)=>({...e,key:i})) || []; // 初始化数据
    const filteredDeviceList = initDeviceList.filter(e=>(!alarmSwitch || (alarmSwitch && e.alarmNum > 0))).filter(e=>{
      return (currentStatus === 0 || e.deviceStatus === currentStatus);
    }) // 根据筛选条件处理数据源。
    const parentDeviceCodeSet = new Set(filteredDeviceList.map(e=>e.parentDeviceCode));
    const parentDeviceCodes = [...parentDeviceCodeSet].sort((a,b) => {
      return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName)
    });
    const deviceGroupedList = parentDeviceCodes.map(e=>{
      const subDeviceList = filteredDeviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a,b)=>a.deviceName && a.deviceName.localeCompare(b.deviceName));
    });
    const currentTableList = this.createTableSource(filteredDeviceList); // 根据分页，排序筛选表格数据
    const deviceStatus = inverterList.deviceStatusSummary || [];
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm}  /> 告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        {deviceStatus.map(e=>
          (<Radio.Button key={e.deviceStatusCode} value={e.deviceStatusCode}>{e.deviceStatusName} {e.deviceStatusNum}</Radio.Button>)
        )}
      </Radio.Group>
    </div>);
    
    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    
    return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.inverterBlockBox} >
            {deviceGroupedList.length>0 ? deviceGroupedList.map((e,index)=>{
              return (<div key={index}>
                <div className={styles.parentDeviceName} >{e && e[0] && e[0].parentDeviceName}</div>
                {e.map((item,i)=>{
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
                <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={filteredDeviceList.length} />
              </div>
              <Table 
                dataSource={currentTableList} 
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
