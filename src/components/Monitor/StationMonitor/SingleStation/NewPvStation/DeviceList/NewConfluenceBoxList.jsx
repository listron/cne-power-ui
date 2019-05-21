

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Spin, Table, Progress, Radio } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormat } from '../../../../../../utils/utilFunc';
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

  getDeviceStatus = (value) => {
    switch (value) {
      case 100:
        return '正常';
      case 200:
        return '离散率>10%';
      case 300:
        return '离散率>20%';
      case 500:
        return '无通讯';
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
        return '#f5a623';
      case 300:
        return '#a42b2c';
      case 500:
        return '#999999';
      case 900:
        return '#c7ceb2';
      default:
        return '#c7ceb2';
    }
  }

  getStatus = (value) => {
    switch (value) {
      case 200:
        return 'orange';
      case 300:
        return 'red';
      default:
        return 'common';
    }
  }

  getStatusName = (value) => {
    switch (value) {
      case '100':
        return 'normal';
      case '200':
        return 'moreThanTen';
      case '300':
        return 'moreThanTwenty';
      case '500':
        return 'noContact';
      case '900':
        return 'noAccess';
      default:
        return 'normal';
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
        sorter: true,
        render: (text, record) => (<div className={record.deviceStatus === 900 ? styles.deviceCode : ""} ><Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName}  >{text}</Link></div>)
      }, {
        title: () => <TableColumnTitle title="实时功率" unit="kW" />,
        dataIndex: 'devicePower',
        key: 'devicePower',
        render: (value, record) => {
          const devicePower = value;
          const deviceCapacity = record.deviceCapacity;
          const percent = devicePower && deviceCapacity && devicePower / deviceCapacity * 100 || 0
          return {
            children: (
              <div>
                <div className={styles.devicePower}>
                  <div className={styles.progressPower}>
                    <div className={styles.deviceValue}>
                      <div>{numWithComma(record.devicePower)}</div>
                      <div>{numWithComma(record.deviceCapacity)}</div>
                    </div>
                    <Progress percent={percent} showInfo={false} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ),
            props: {
              colSpan: 2
            }
          };
        },
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="装机容量" unit="kW" />,
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        width: '140px',
        render: (value) => {
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
        render: text => (<span><i className={styles.statusColor} style={{ backgroundColor: this.getStatusColor(text) }} ></i>{this.getDeviceStatus(text)}</span>),
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
    const { confluenceBoxList, deviceTypeCode, loading } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize } = this.state;
    const { deviceList = [] } = confluenceBoxList;
    const filteredDeviceList = deviceList.filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0))).filter(e => {
      return (currentStatus === 0 || e.deviceStatus === currentStatus);
    }).sort((a, b) => {
      return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
    })  // 筛选告警和排序的数据 按照电站名称排序

    const parentDeviceCodes = [...new Set(filteredDeviceList.map(e => e.parentDeviceCode))];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = filteredDeviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    }); // 用于网格

    const currentTableList = this.createTableSource(filteredDeviceList); // 根据分页，排序筛选表格数据

    const { deviceStatusSummary = {} } = confluenceBoxList;
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm} /> 只看告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        <Radio.Button value={100} >正常 {dataFormat(deviceStatusSummary.normalNum)}</Radio.Button>
        <Radio.Button value={200} >离散率>10% {dataFormat(deviceStatusSummary.biggerThanTenNum)}</Radio.Button>
        <Radio.Button value={300} >离散率>20% {dataFormat(deviceStatusSummary.biggerThanTwentyNum)}</Radio.Button>
        <Radio.Button value={500} >无通讯 {dataFormat(deviceStatusSummary.unConnectNum)}</Radio.Button>
        <Radio.Button value={900} >未接入 {dataFormat(deviceStatusSummary.unJoinNum)}</Radio.Button>
      </Radio.Group>
    </div>);

    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.inverterList} >
        <Tabs defaultActiveKey="1" className={styles.inverterTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.inverterBlockBox} >
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              (deviceGroupedList.length > 0 ? deviceGroupedList.map((list, index) => {
                const { parentDeviceName, parentDeviceCode, parentDeviceFullCode } = list.length > 0 && list[0];
                return (
                  <div key={index}>
                    <div className={styles.parentDeviceName} >
                      <Link to={`/hidden/monitorDevice/${stationCode}/${parentDeviceCode}/${parentDeviceFullCode}`} className={styles.underlin} >
                        <i className={'iconfont icon-nb2'}></i>
                        {parentDeviceName}
                      </Link>
                    </div>
                    {list.map((item, i) => {
                      const statusName = this.getStatusName(item.deviceStatus);
                      const alarm = item.alarmNum && item.alarmNum > 0;
                      const deviceCapacity = dataFormat(item.deviceCapacity, '--', 2);
                      const devicePower = dataFormat(item.devicePower, '--', 2);
                      let progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
                      return (<div key={i} className={item.deviceStatus === 900 ? styles.cutOverItem : styles.inverterItem} style={{ height: "121px" }}>
                        <div className={`${styles.statusBox} ${styles[statusName]} ${alarm && styles[alarm]}`} >
                          <div className={styles.inverterItemIcon} >
                            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`}
                              className={styles[status]} >
                              {item.deviceStatus === 500 && <i className="iconfont icon-outage" ></i> || null}
                              <i className="iconfont icon-hl" ></i>
                            </Link>
                            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}/?showPart=alarmList`} >
                              {(item.alarmNum && item.alarmNum > 0) && <i className="iconfont icon-alarm" ></i> || null}
                            </Link>
                          </div>
                          <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} >
                            <div className={styles.inverterItemR} >
                              <div className={styles.hlBlockName}><span>{item.deviceName}</span></div>
                              <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                              <div className={styles.inverterItemPower}>
                                <div>{devicePower} kW</div>
                                <div>{deviceCapacity} kW</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} className={styles.hlBlockLink} >
                          <div className={styles.hlBlockFooter} >
                            <div>电压：{dataFormat(item.voltage, '--')} V</div>
                            <div>电流：{dataFormat(item.electricity, '--')} A</div>
                            <div className={styles[status]}>离散率：{dataFormat(item.dispersionRatio, '--', 2)} %</div>
                            <div>温度：{dataFormat(item.temp, '--')} ℃</div>
                          </div>
                        </Link>
                      </div>);
                    })}
                  </div>);
              }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)
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
        </Tabs>
      </div>
    )
  }
}

export default ConfluenceBoxList;
