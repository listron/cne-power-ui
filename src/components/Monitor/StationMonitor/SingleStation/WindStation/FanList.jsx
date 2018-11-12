

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './windStation.scss';
import { Tabs, Switch, Radio, Table, Progress, Spin } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../Common/CommonPagination/index';
import Map from '../../AllStation/Map';

const TabPane = Tabs.TabPane;

class FanList extends React.Component {
  static propTypes = {
    fanList: PropTypes.object,
    match: PropTypes.object,
    getFanList: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentStatus: 0,//状态：正常/故障/停机
      alarmSwitch: false, // 是否告警
      pageSize: 10,
      currentPage: 1,
      sortName: '',
      descend: false,
      firstLoad: true,
    }
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if (nextStation !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
  }

  componentWillUnmount() {
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
  getData = (stationCode) => {// 获取数据
    const { getFanList } = this.props;
    const { firstLoad } = this.state;
    getFanList({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }
  getDeviceStatus = (value) => { //查看状态
    switch (value) {
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
    switch (value) {
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
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName} >{text}</Link>
          </div>
        )
      }, {
        title: '所属设备',
        dataIndex: 'parentDeviceName',
        key: 'parentDeviceName',
        render: (text, record, index) => (<span>{text || '--'}</span>),
        sorter: (a, b) => a.deviceName.length - b.deviceName.length,
      },
      {
        title: '风速(m/s)',
        dataIndex: 'windSpeed',
        key: 'windSpeed',
        render: (text, record, index) => (<span>{text || '--'}</span>),
        sorter: (a, b) => a.windSpeed - b.windSpeed,
      },
      {
        title: '偏航角度(°)',
        dataIndex: 'angleOfYaw',
        key: 'angleOfYaw',
        render: (text, record, index) => (<span>{text || '--'}</span>),
        sorter: (a, b) => a.angleOfYaw - b.angleOfYaw,
      },
      {
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
        render: (text, record) => (<span>{text || 0}</span>),
        sorter: (a, b) => a.alarmNum - b.alarmNum,
      }, {
        title: '设备状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        render: (text, record) => (<span><i className={styles.statusColor} style={{ backgroundColor: this.getStatusColor(record.deviceStatus) }} ></i>{this.getDeviceStatus(text)}</span>),
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
      descend: sorter.order === 'descend'
    })
  }
  createTableSource = (data) => {
    const { sortName, descend, currentPage, pageSize } = this.state;
    const tableSource = [...data].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['parentDeviceName', 'deviceStatus'];
      const arrayNumSort = ['devicePower', 'deviceCapacity', 'alarmNum',];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].length - b[sortName].length);
      }
    })
    return tableSource.splice((currentPage - 1) * pageSize, pageSize);
  }

  dealList = (deviceGroupedList, deviceTypeCode) => {
    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return deviceGroupedList.map((list, index) => {
      return (
        <div key={index}>
          <div className={styles.parentDeviceName} >
            {list && list[0] && list[0].parentDeviceName}
          </div>
          {list.map((item, i) => {
            const { devicePower, deviceCapacity, windSpeed, angleOfYaw } = item;
            const showDevicePower = this.transData(devicePower, 2);
            const showDeviceCapacity = this.transData(deviceCapacity, 2);
            let progressPercent;
            if (!deviceCapacity || isNaN(deviceCapacity)) {
              progressPercent = 0;
            } else {
              progressPercent = this.transData(devicePower / deviceCapacity * 100);
            }
            return (
              <div key={i} className={item.deviceStatus === 900 ? styles.cutOverItem : styles.inverterItem} >
                <div className={styles.inverterItemIcon} >
                  <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}  >
                    <i className="iconfont icon-windlogo" ></i>
                  </Link>
                  <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}/?showPart=alarmList`}  >
                    {(item.alarmNum && item.alarmNum > 0) ? <i className="iconfont icon-alarm" ></i> : <div></div>}
                  </Link>
                </div>
                <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}  >
                  <div className={styles.inverterItemR} >
                    <div>{item.deviceName}</div>
                    <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                    <div className={styles.inverterItemPower}>
                      <div>
                        <span className={styles.showDevicePower}>{showDevicePower}kW</span>
                        <span>{showDeviceCapacity}kW</span>
                      </div>
                      <div>
                        <span>{windSpeed}m/s</span>
                        <span className={styles.angle}><i className="iconfont icon-acb" ></i>{angleOfYaw || '--'}°</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>);
          })}
        </div>);
    })
  }

  transData = (value, pointLength) => { // 数据转换。为什么要进行一个数据转化
    let tmpValue = parseFloat(value);
    let tmpBackData;
    if (tmpValue || tmpValue === 0) {
      tmpBackData = (pointLength || pointLength === 0) ? tmpValue.toFixed(pointLength) : tmpValue;
    } else {
      tmpBackData = '--'
    }
    return tmpBackData;
  }


  mapData = (deviceList) => { // 地图
    let iconArray = [
      {
        "400": ['image:///img/wind-normal.png', 'image:///img/wind-alert.png'],
        "500": 'image:///img/wind-cutdown.png',
        "900": 'image:///img/wind-unconnected.png'
      },
      {
        "400": ['image:///img/solar01.png', 'image:///img/pv-alert.png'],
        "500": 'image:///img/pv-cutdown.png',
        "900": 'image:///img/pv-unconnected.png'
      },

    ]
    let data = [];
    deviceList.forEach((item, index) => {
      let deviceStatus = `${item.deviceStatus}` || "";
      const stationType = item.stationType || '0';
      const currentStationType = iconArray[stationType] || {};
      const currentStationStatus = currentStationType[deviceStatus] || '';
      data.push({
        name: item.deviceName,
        value: [item.longitude, item.latitude, stationType, deviceStatus],
        symbol: deviceStatus === "400" ? currentStationStatus[item.alarmNum ? 1 : 0] : currentStationStatus,
        alarmNum: item.alarmNum,
        stationPower: item.devicePower,
        stationCapacity: item.deviceCapacity,
        instantaneous: item.windSpeed,
        stationCode: item.deviceCode,
        angleOfYaw: item.angleOfYaw
      })
    })
    return data;
  }

  render() {
    const { fanList, loading, deviceTypeCode } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize } = this.state;
    // 初始化数据
    const initDeviceList = fanList.deviceList && fanList.deviceList.map((e, i) => ({ ...e, key: i })) || [];

    // 根据筛选条件处理数据源。
    const filteredDeviceList = initDeviceList.filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0))).filter(e => {
      return (currentStatus === 0 || e.deviceStatus === currentStatus);
    })

    const sortedParentList = filteredDeviceList.sort((a, b) => {
      return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
    })

    // 设置所属电站设备
    const parentDeviceCodeSet = new Set(sortedParentList.map(e => e.parentDeviceCode));
    const parentDeviceCodes = [...parentDeviceCodeSet];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = filteredDeviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    });

    const currentTableList = this.createTableSource(filteredDeviceList); // 根据分页，排序筛选表格数据

    // 筛选按钮
    const deviceStatus = fanList.deviceStatusSummary || [];
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm} /> 告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        {deviceStatus.map(e =>
          (<Radio.Button key={e.deviceStatusCode} value={e.deviceStatusCode}>{e.deviceStatusName} {e.deviceStatusNum}</Radio.Button>)
        )}
      </Radio.Group>
    </div>);



    return (
      <div className={styles.fanList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.inverterBlockBox} >
            {
              loading && <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} />
              || (deviceGroupedList.length > 0 ? this.dealList(deviceGroupedList, deviceTypeCode) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)
            }
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
          <TabPane tab={<span> <i className="iconfont icon-map"></i></span>} key="stationMap" className={styles.inverterMapBox} >
            <Map testId="wind_bmap_station" {...this.props} stationDataList={this.mapData(filteredDeviceList)} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default FanList;
