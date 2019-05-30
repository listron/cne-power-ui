

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Radio, Table, Progress, Spin } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../../utils/utilFunc';

const TabPane = Tabs.TabPane;
class InverterList extends Component {
  static propTypes = {
    inverterList: PropTypes.object,
    match: PropTypes.object,
    deviceTypeCode: PropTypes.string,
    getInverterList: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentStatus: 0,//状态：正常/故障/停机
      alarmSwitch: false, // 是否告警
      lowSwitch: false,// 低效
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

  onSwitchLow = (e) => { // 切换低效
    this.setState({
      lowSwitch: e,
      currentPage: 1,
    });
  }
  getData = (stationCode) => {
    const { deviceTypeCode, getInverterList } = this.props;
    const { firstLoad } = this.state;
    getInverterList({ stationCode, deviceTypeCode, firstLoad });
    this.timeOutId = setTimeout(() => {
      if (firstLoad) {
        this.setState({ firstLoad: false });
      }
      this.getData(stationCode);
    }, 10000);
  }


  getStatusBox = (alarmNum, isLowEfficiency) => {
    let backgroundColor = 'transparent', color = '#666';
    alarmNum >= 0 && `${isLowEfficiency}` === '1' && (backgroundColor = '#fefad2') && (color = '#e08031');
    alarmNum > 0 && `${isLowEfficiency}` === '0' && (backgroundColor = '#ff8e9c') && (color = '#a42b2c');
    return { backgroundColor, color };
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
        render: (text, record, index) => (
          <div className={record.deviceStatus === 900 ? styles.deviceCode : ""} >
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName} >{text}</Link>
          </div>
        )
      },
      {
        title: () => <TableColumnTitle title="日发电量" unit="kWh" />,
        dataIndex: 'dayPower',
        key: 'dayPower',
        render: value => numWithComma(value),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="转换效率" unit="%" />,
        dataIndex: 'transferRate',
        key: 'transferRate',
        render: value => numWithComma(value),
        sorter: true,
      },
      {
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
      }, {
        title: () => <TableColumnTitle title="告警" unit="个" />,
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        render: value => numWithComma(value),
        sorter: (a, b) => a.alarmNum - b.alarmNum,
      }, {
        title: '设备状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        sorter: (a, b) => a.deviceStatus - b.deviceStatus,
        render: (value, record) => {
          const nowList = this.inverterStatus[`${value}`]
          return (<span style={{ color: nowList.color }}>{nowList.statusName}</span>)
        }
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

  createTableSource = (data = []) => {
    const { sortName, descend, currentPage, pageSize } = this.state;
    const tableSource = data.map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['parentDeviceName', 'deviceName'];
      const arrayNumSort = ['devicePower', 'deviceStatus', 'deviceCapacity', 'alarmNum', 'transferRate', 'dayPower'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].length - b[sortName].length);
      }
    })
    return tableSource.splice((currentPage - 1) * pageSize, pageSize);
  }

  inverterStatus = { // 逆变器各种设备状态
    '401': { color: '#a42b2c', statusName: '限电', name: 'limit' }, // 限电
    '201': { color: '#199475', statusName: '正常停机', name: 'stop' }, // 正常停机
    '202': { color: '#199475', statusName: '计划停机', name: 'plan' }, // 计划停机
    '203': { color: '#a42b2c', statusName: '故障停机', name: 'fault' }, // 故障停机
    '400': { color: '#199475', statusName: '正常', name: 'normal' }, // 正常
    '500': { color: '#a42b2c', statusName: '无通讯', name: 'break' }, // 无通讯
    '900': { color: '#999', statusName: '未接入', name: 'unconnect' } // 未接入
  }

  seriesStatus = { // 支路设备状态
    '801': '#f9b600', // 偏低
    '802': '#3e97d1', // 偏高
    '803': '#a42b2c', // 异常
    '400': '#ceebe0', // 正常
    '500': '#f1f1f1', // 无通讯
    '900': '#f1f1f1', // 未接入
  }

  confluenceStatus = { // 汇流箱设备状态
    '400': '#ceebe0', // 正常
    '500': '#f1f1f1', // 无通讯
    '900': '#f1f1f1', // 未接入
    '801': '#fefad2', // 离散率>=10%数
    '802': '#ffce7f', // 离散率>=20%数
  }

  statusTips = { // 状态提示
    '206': [
      { 'status': '400', 'text': '支路正常' },
      { 'status': '803', 'text': '支路异常' },
      { 'status': '802', 'text': '支路偏大' },
      { 'status': '801', 'text': '支路偏小' },
    ],
    "201": [
      { 'status': '400', 'text': '汇流箱正常' },
      { 'status': '802', 'text': '汇流箱离散率>20%' },
      { 'status': '801', 'text': '汇流箱离散率>10%' },
      { 'status': '500', 'text': '汇流箱无通讯' },
    ]
  }

  render() {
    const { inverterList,deviceTypeCode, loading } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize, lowSwitch } = this.state;
    const initDeviceList = inverterList.deviceList && inverterList.deviceList.map((e, i) => ({ ...e, key: i })) || []; // 初始化数据
    const filteredDeviceList = initDeviceList
      .filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0)))
      .filter(e => (!lowSwitch || (`${e.isLowEfficiency}` === '1')))
      .filter(e => {
        return (currentStatus === 0 || e.deviceStatus === currentStatus);
      }) // 根据筛选条件处理数据源。

    const sortedParentList = filteredDeviceList.sort((a, b) => {
      return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
    })

    const parentDeviceCodeSet = new Set(sortedParentList.map(e => e.parentDeviceCode));
    const parentDeviceCodes = [...parentDeviceCodeSet];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = filteredDeviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    });

    const currentTableList = this.createTableSource(filteredDeviceList); // 根据分页，排序筛选表格数据
    const deviceStatus = inverterList.deviceStatusSummary || [];
    const operations = (<div className={styles.inverterRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchLow} /> 只看低效逆变器
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm} style={{ marginLeft: 8 }} /> 只看告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        {deviceStatus.map(e =>
          (<Radio.Button key={e.deviceStatusCode} value={e.deviceStatusCode}>{e.deviceStatusName} {e.deviceStatusNum}</Radio.Button>)
        )}
      </Radio.Group>
    </div>);

    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.invertDeviceList} >
        <Tabs defaultActiveKey="1" className={styles.deviceListTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.deviceListBlockBox} >
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              <div>
                <div className={styles.statusTipsWrap}>
                  {this.statusTips[deviceTypeCode].map((e,i) => {
                    return (
                      <div className={styles.statusTips} key={i}>
                        <span
                          className={deviceTypeCode === '201' ? styles.rect : styles.round}
                          style={{ backgroundColor: deviceTypeCode === '201' ? this.seriesStatus[e.status] : this.confluenceStatus[e.status] }}
                        />
                         {e.text}
                      </div>
                    )
                  })}
                </div>
                {(deviceGroupedList.length > 0 ? deviceGroupedList.map((list, index) => {
                  const { parentDeviceName, parentDeviceCode } = list.length > 0 && list[0];
                  return (<div key={index}>
                    <div className={styles.parentDeviceName} >
                      <Link to={`/hidden/monitorDevice/${stationCode}/${deviceTypeCode}/${parentDeviceCode}`} className={styles.underlin} >
                        <i className={'iconfont icon-xb'}></i>
                        {parentDeviceName}
                      </Link>
                    </div>
                    <div className={styles.singledeviceItemBox}>
                      {list.map((item, i) => {
                        const { branchState = [], deviceStatus, deviceCapacity, devicePower, deviceCode = '' } = item;
                        const deviceTypeCode = deviceCode.split('M')[1];
                        let progressPercent = devicePower / deviceCapacity * 100 || 0;
                        const unconnect = `${deviceStatus}` === '900';
                        const statusBoxStyle = this.getStatusBox(item.alarmNum, item.isLowEfficiency);
                        const shadowStyle = `${this.inverterStatus[`${deviceStatus}`].name || ''}Shadow`;
                        return (
                          <div key={i} className={`${styles.singledeviceItem} ${unconnect ? styles.unconnect : ''} ${styles[shadowStyle]}`}>
                            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`}>
                              <div className={`${styles.statusBox}`} style={{ backgroundColor: statusBoxStyle.backgroundColor }}>
                                <div className={styles.deviceItemIcon}>
                                  <i className={`iconfont icon-nb ${styles.icon}`} />
                                  {item.alarmNum > 0 && <i className="iconfont icon-alarm" />}
                                </div>
                                <div className={styles.deviceItemR}>
                                  <div className={styles.deviceBlockName}>
                                    <span style={{ color: statusBoxStyle.color }}>{item.deviceName}</span>
                                    <span>{dataFormats(item.transferRate, '--', 2, true)}%</span>
                                  </div>
                                  <Progress className={styles.powerProgress} strokeWidth={3} percent={progressPercent} showInfo={false} />
                                  <div className={styles.deviceItemPower}>
                                    <div className={styles.realDevicePower}>{dataFormats(devicePower, '--', 2)} kW</div>
                                    <div>{dataFormats(deviceCapacity, '--', 2)} kW</div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.deviceBlockFooter} >
                                <div className={styles.eachInfo}>
                                  <div>日发电量</div>
                                  <div className={styles.value}>{dataFormats(item.dayPower, '--', 2)} kWh</div>
                                </div>
                                <div className={styles.eachInfo}>
                                  <div>日利用小时</div>
                                  <div className={styles.value}>{dataFormats(item.equipmentHours, '--', 2)} h</div>
                                </div>
                              </div>
                              <div className={styles.allStatus}>
                                <div className={styles.branchStatus}>{branchState && branchState.map((e, i) => (
                                  <span
                                    key={i}
                                    className={deviceTypeCode === '201' ? styles.rect : styles.round}
                                    style={{ backgroundColor: deviceTypeCode === '201' ? this.seriesStatus[e] : this.confluenceStatus[e] }}
                                  />
                                ))}</div>
                                <div style={{ color: this.inverterStatus[`${deviceStatus}`].color }}>{this.inverterStatus[`${deviceStatus}`].statusName}</div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>);
                }) : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)}
              </div>
            }
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2" className={styles.deviceTableBox} >
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
