

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Spin, Table, Progress, Radio } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../../utils/utilFunc';
const TabPane = Tabs.TabPane;

class ConfluenceBoxList extends Component {
  static propTypes = {
    confluenceBoxList: PropTypes.object,
    match: PropTypes.object,
    deviceTypeCode: PropTypes.number,
    getConfluenceBoxList: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentStatus: 0,//当前状态值
      alarmSwitch: false,
      pageSize: 10,
      currentPage: 1,
      sortName: 'deviceName',
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

  onChangeStatus = (e) => {
    this.setState({
      currentStatus: e.target.value,
      currentPage: 1,
    })
  }

  onSwitchAlarm = (e) => {
    this.setState({
      alarmSwitch: e,
      currentPage: 1,
    });
  }

  getData = (stationCode) => {
    const { firstLoad } = this.state;
    this.props.getConfluenceBoxList({ stationCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }

  getStatusName = (value) => {
    let result = [];
    switch (value) {
      case '100': result = [{ name: 'normal', text: '正常' }]; break;
      case '200': result = [{ name: 'moreThanTen', text: '离散率>10%' }]; break;
      case '300': result = [{ name: 'moreThanTwenty', text: '离散率>20%' }]; break;
      case '500': result = [{ name: 'noContact', text: '无通讯' }]; break;
      case '900': result = [{ name: 'noAccess', text: '未接入' }]; break;
      default: result = [{ name: 'normal', text: '' }]; break;
    }
    return result;
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
        sorter: true,
        defaultSortOrder: "ascend",
        render: (text, record) => {
          return (
            <div className={`${record.deviceStatus}` === '900' && styles.deviceCode || ''} >
              <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName}  >{text}</Link>
            </div>)
        }
      }, {
        title: () => <TableColumnTitle title="实时功率" unit="kW" />,
        dataIndex: 'devicePower',
        key: 'devicePower',
        render: value => numWithComma(value),
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="装机容量" unit="kW" />,
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        width: '140px',
        render: value => numWithComma(value),
        sorter: (a, b) => a.deviceCapacity - b.deviceCapacity,
      },
      {
        title: () => <TableColumnTitle title="电压" unit="V" />,
        dataIndex: 'voltage',
        key: 'voltage',
        render: value => numWithComma(value),
        sorter: (a, b) => a.voltage - b.voltage,
      }, {
        title: () => <TableColumnTitle title="电流" unit="A" />,
        dataIndex: 'electricity',
        key: 'electricity',
        render: value => numWithComma(value),
        sorter: (a, b) => a.electricity - b.electricity,
      }, {
        title: () => <TableColumnTitle title="离散率" unit="%" />,
        dataIndex: 'dispersionRatio',
        key: 'dispersionRatio',
        render: value => value && value + '%' || '--',
        sorter: (a, b) => a.dispersionRatio - b.dispersionRatio,
      }, {
        title: () => <TableColumnTitle title="温度" unit="℃" />,
        dataIndex: 'temp',
        key: 'temp',
        render: value => numWithComma(value),
        sorter: (a, b) => a.temp - b.temp,
      }, {
        title: '设备状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        render: value => <span className={styles[this.getStatusName(`${value}`)[0].name]}>{this.getStatusName(`${value}`)[0].text}</span>,
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

  createTableSource = (data = []) => { // 排序
    const { sortName, descend, currentPage, pageSize } = this.state;
    const tableSource = data.sort((a, b) => { // 排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['deviceName'];
      const arrayNumSort = ['devicePower', 'deviceCapacity', 'electricity', 'voltage', 'dispersionRatio', 'temp', 'deviceStatus'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    })
    return tableSource.splice((currentPage - 1) * pageSize, pageSize);
  }


  render() {
    const { deviceTypeCode, loading } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize } = this.state;
    let confluenceBoxList = {
      deviceList: [
        {
          "alarmNum": 2,
          "deviceCapacity": 89.1000,
          "deviceCode": "394M202M6M2",
          "deviceFullcode": "394M202M6M2",
          "deviceId": 987932,
          "deviceModeCode": 6,
          "deviceName": "HL01-02",
          "devicePower": 63.5315,
          "deviceStatus": 100,
          "deviceTypeCode": 202,
          "dispersionRatio": "0.80",
          "electricity": 104.15,
          "isConnected": 1,
          "parentDeviceCode": 987891,
          "parentDeviceName": "NB01-A",
          "stationCode": 394,
          "temp": 56.0,
          "voltage": 610.0
        },
        {
          "alarmNum": 2,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M3",
          "deviceFullcode": "394M202M6M3",
          "deviceId": 987933,
          "deviceModeCode": 6,
          "deviceName": "HL01-03",
          "devicePower": 69.3181,
          "deviceStatus": 200,
          "deviceTypeCode": 202,
          "dispersionRatio": "0.90",
          "electricity": 114.01,
          "isConnected": 1,
          "parentDeviceCode": 987891,
          "parentDeviceName": "NB01-A",
          "stationCode": 394,
          "temp": 55.0,
          "voltage": 608.0
        },
        {
          "alarmNum": 2,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M4",
          "deviceFullcode": "394M202M6M4",
          "deviceId": 987934,
          "deviceModeCode": 6,
          "deviceName": "HL01-04",
          "devicePower": 69.7405,
          "deviceStatus": 300,
          "deviceTypeCode": 202,
          "dispersionRatio": "1.19",
          "electricity": 116.06,
          "isConnected": 1,
          "parentDeviceCode": 987891,
          "parentDeviceName": "NB01-A",
          "stationCode": 394,
          "temp": 49.0,
          "voltage": 600.9
        },
        {
          "alarmNum": 2,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M5",
          "deviceFullcode": "394M202M6M5",
          "deviceId": 987935,
          "deviceModeCode": 6,
          "deviceName": "HL01-05",
          "devicePower": 68.9370,
          "deviceStatus": 500,
          "deviceTypeCode": 202,
          "dispersionRatio": "0.98",
          "electricity": 115.26,
          "isConnected": 1,
          "parentDeviceCode": 987891,
          "parentDeviceName": "NB01-A",
          "stationCode": 394,
          "temp": 54.0,
          "voltage": 598.1
        },
        {
          "alarmNum": 2,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M6",
          "deviceFullcode": "394M202M6M6",
          "deviceId": 987936,
          "deviceModeCode": 6,
          "deviceName": "HL01-06",
          "devicePower": 69.0274,
          "deviceStatus": 900,
          "deviceTypeCode": 202,
          "dispersionRatio": "0.69",
          "electricity": 115.18,
          "isConnected": 1,
          "parentDeviceCode": 987891,
          "parentDeviceName": "NB01-A",
          "stationCode": 394,
          "temp": 56.0,
          "voltage": 599.3
        },
        {
          "alarmNum": 0,
          "deviceCapacity": 83.1600,
          "deviceCode": "394M202M6M7",
          "deviceFullcode": "394M202M6M7",
          "deviceId": 987937,
          "deviceModeCode": 6,
          "deviceName": "HL01-07",
          "devicePower": 61.6498,
          "deviceStatus": 100,
          "deviceTypeCode": 202,
          "dispersionRatio": "1.45",
          "electricity": 101.85,
          "isConnected": 1,
          "parentDeviceCode": 987892,
          "parentDeviceName": "NB01-B",
          "stationCode": 394,
          "temp": 48.0,
          "voltage": 605.3
        },
        {
          "alarmNum": 0,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M8",
          "deviceFullcode": "394M202M6M8",
          "deviceId": 987938,
          "deviceModeCode": 6,
          "deviceName": "HL01-08",
          "devicePower": 69.2075,
          "deviceStatus": 200,
          "deviceTypeCode": 202,
          "dispersionRatio": "1.26",
          "electricity": 115.02,
          "isConnected": 1,
          "parentDeviceCode": 987892,
          "parentDeviceName": "NB01-B",
          "stationCode": 394,
          "temp": 54.0,
          "voltage": 601.7
        },
        {
          "alarmNum": 0,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M9",
          "deviceFullcode": "394M202M6M9",
          "deviceId": 987939,
          "deviceModeCode": 6,
          "deviceName": "HL01-09",
          "devicePower": 69.3494,
          "deviceStatus": 300,
          "deviceTypeCode": 202,
          "dispersionRatio": "0.63",
          "electricity": 115.16,
          "isConnected": 1,
          "parentDeviceCode": 987892,
          "parentDeviceName": "NB01-B",
          "stationCode": 394,
          "temp": 55.0,
          "voltage": 602.2
        },
        {
          "alarmNum": 0,
          "deviceCapacity": 89.1000,
          "deviceCode": "394M202M6M10",
          "deviceFullcode": "394M202M6M10",
          "deviceId": 987940,
          "deviceModeCode": 6,
          "deviceName": "HL01-10",
          "devicePower": 64.4069,
          "deviceStatus": 500,
          "deviceTypeCode": 202,
          "dispersionRatio": "1.03",
          "electricity": 106.74,
          "isConnected": 1,
          "parentDeviceCode": 987892,
          "parentDeviceName": "NB01-B",
          "stationCode": 394,
          "temp": 54.0,
          "voltage": 603.4
        },
        {
          "alarmNum": 0,
          "deviceCapacity": 95.0400,
          "deviceCode": "394M202M6M11",
          "deviceFullcode": "394M202M6M11",
          "deviceId": 987941,
          "deviceModeCode": 6,
          "deviceName": "HL01-11",
          "devicePower": 70.0097,
          "deviceStatus": 900,
          "deviceTypeCode": 202,
          "dispersionRatio": "0.95",
          "electricity": 114.77,
          "isConnected": 1,
          "parentDeviceCode": 987892,
          "parentDeviceName": "NB01-B",
          "stationCode": 394,
          "temp": 56.0,
          "voltage": 610.0
        },
      ],
      deviceStatusSummary: {
        "biggerThanTwentyNum": 2,
        "normalNum": 2,
        "biggerThanTenNum": 2,
        "unJoinNum": 2,
        "unConnectNum": 2
      }
    }
    const { deviceList = [] } = confluenceBoxList;
    const filteredDeviceList = deviceList
      .filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0)))
      .filter(e => {
        return (currentStatus === 0 || e.deviceStatus === currentStatus);
      })
      .sort((a, b) => {
        return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
      })  // 筛选告警和排序的数据 按照电站名称排序

    const parentDeviceCodes = [...new Set(filteredDeviceList.map(e => e.parentDeviceCode))];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = filteredDeviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    }); // 用于网格

    const currentTableList = this.createTableSource(filteredDeviceList); // 根据分页，排序筛选表格数据

    const { deviceStatusSummary = {} } = confluenceBoxList;
    const operations = (<div className={styles.deviceRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm} /> 只看告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        <Radio.Button value={100} >正常 {dataFormats(deviceStatusSummary.normalNum)}</Radio.Button>
        <Radio.Button value={200} >离散率>10% {dataFormats(deviceStatusSummary.biggerThanTenNum)}</Radio.Button>
        <Radio.Button value={300} >离散率>20% {dataFormats(deviceStatusSummary.biggerThanTwentyNum)}</Radio.Button>
        <Radio.Button value={500} >无通讯 {dataFormats(deviceStatusSummary.unConnectNum)}</Radio.Button>
        <Radio.Button value={900} >未接入 {dataFormats(deviceStatusSummary.unJoinNum)}</Radio.Button>
      </Radio.Group>
    </div>);

    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.deviceList} >
        <Tabs defaultActiveKey="1" className={styles.deviceListTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.deviceListBlockBox} >
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              (deviceGroupedList.length > 0 ? deviceGroupedList.map((list, index) => {
                const { parentDeviceName, parentDeviceCode, parentDeviceFullCode } = list.length > 0 && list[0];
                return (
                  <div key={index}>
                    <div className={styles.parentDeviceName} >
                      <Link to={`/hidden/monitorDevice/${stationCode}/${parentDeviceCode}/${parentDeviceFullCode}`} className={styles.underlin} >
                        <i className={'iconfont icon-hl'}></i>
                        {parentDeviceName}
                      </Link>
                    </div>
                    <div className={styles.singledeviceItemBox}>
                      {list.map((item, i) => {
                        const statusName = this.getStatusName(`${item.deviceStatus}`)[0].name;
                        const deviceStatus = item.deviceStatus;
                        const alarm = item.alarmNum && item.alarmNum > 0;
                        const deviceCapacity = dataFormats(item.deviceCapacity, '--', 2);
                        const devicePower = dataFormats(item.devicePower, '--', 2);
                        let progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
                        return (
                          <div key={i} className={`${styles.singledeviceItem} ${styles[statusName]} ${alarm && styles.alarm} `}>
                            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}>
                              <div className={`${styles.statusBox}`} >
                                <div className={styles.deviceItemIcon} >
                                  {deviceStatus === 500 && <i className="iconfont icon-outage" ></i> || null}
                                  <i className={`iconfont icon-hl ${styles.icon}`} ></i>
                                  {(item.alarmNum && item.alarmNum > 0) && <i className="iconfont icon-alarm" ></i> || null}
                                </div>
                                <div className={styles.deviceItemR} >
                                  <div className={styles.deviceBlockName}><span>{item.deviceName}</span></div>
                                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                                  <div className={styles.deviceItemPower}>
                                    <div className={styles.realDevicePower}>{devicePower} kW</div>
                                    <div>{deviceCapacity} kW</div>
                                  </div>
                                </div>
                              </div>

                              <div className={styles.deviceBlockFooter} >
                                <div>电压：{dataFormats(item.voltage, '--', 2)} V</div>
                                <div>电流：{dataFormats(item.electricity, '--', 2)} A</div>
                                <div className={styles.dispersionRatio}>离散率：{dataFormats(item.dispersionRatio, '--', 2)} %</div>
                                <div>温度：{dataFormats(item.temp, '--', 2)} ℃</div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>

                  </div>);
              }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)
            }
          </TabPane>

          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2" className={styles.deviceTableBox} >
            <div>
              <div className={styles.pagination} >
                <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={filteredDeviceList.length} />
              </div>
              <Table
                dataSource={currentTableList.map((e, i) => { return { ...e, key: i } })}
                columns={this.tableColumn()}
                onChange={this.tableChange}
                pagination={false}
                className={styles.deviceTable}
                locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" /></div> }}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>

    )
  }
}

export default ConfluenceBoxList;
