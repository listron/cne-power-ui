

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Radio, Table, Progress, Spin, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../../utils/utilFunc';
import { throttle } from 'lodash';

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
      currentStatus: 0, //状态：正常/故障/停机
      alarmSwitch: false, // 是否告警
      lowSwitch: false, // 低效
      pageSize: 10,
      currentPage: 1,
      sortName: 'deviceName',
      descend: false,
      firstLoad: true,
      renderList: [],
      spliceLength: 36, // 18条数据一渲染。
      topHeight: 430, // 假设的列表上方高度
      newList: [],
    };
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.getData(stationCode);
    const main = document.getElementById('main');
    main.addEventListener('scroll', throttle(() => {
      if (this.newPinterest) {
        const { renderList, topHeight } = this.state;
        const clientH = document.documentElement.clientHeight; // 客户端高度
        const scrollTop = main.scrollTop; // 卷曲出去的高度
        const tableHeight = this.newPinterest.clientHeight; // 表格现在的高度。
        const resHeight = tableHeight + topHeight - scrollTop - clientH;
        if (resHeight < 50) { //表格内容
          const { deviceList = [] } = this.props.inverterList;
          if (renderList.length < deviceList.length) {
            this.initRender(true);
          }
        }
      }
    }, 1000));
  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if (nextStation !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
    const { deviceList = [] } = nextProps.inverterList;
    this.changeStationData(deviceList);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  onChangeStatus = (e) => { // 切换状态
    const { deviceList = [] } = this.props.inverterList;
    this.setState({
      currentStatus: e.target.value,
      currentPage: 1,
      renderList: [],
    }, () => this.changeStationData(deviceList));
  }

  onSwitchAlarm = (e) => { // 切换告警
    const { deviceList = [] } = this.props.inverterList;
    this.setState({
      alarmSwitch: e,
      currentPage: 1,
      renderList: [],
    }, () => this.changeStationData(deviceList));
  }

  onSwitchLow = (e) => { // 切换低效
    const { deviceList = [] } = this.props.inverterList;
    this.setState({
      lowSwitch: e,
      currentPage: 1,
      renderList: [],
    }, () => this.changeStationData(deviceList));
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
    }, 60000);
  }


  tableColumn = () => {
    const baseLinkPath = '/hidden/monitorDevice';
    const { stationCode } = this.props.match.params;
    const { deviceTypeCode, theme } = this.props;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        defaultSortOrder: 'ascend',
        render: (text, record, index) => (
          <div className={record.deviceStatus === 900 ? styles.deviceCode : styles.normalCode} >
            <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName} >{text}</Link>
          </div>
        ),
      },
      {
        title: () => <TableColumnTitle title="日发电量" unit="kWh" />,
        dataIndex: 'dayPower',
        key: 'dayPower',
        render: value => numWithComma(value),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="日等效时" unit="h" />,
        dataIndex: 'equipmentHours',
        key: 'equipmentHours',
        render: (value, record, index) => {
          return (
            <div className={styles.equipmentHours}>
              <span>{dataFormats(value, '--', 2)}</span>
              {record.equipmentHoursValidation &&
                <span className={styles.tooltipName}>
                  <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={'不含未填写计划发电量的电站'}>
                    <i className="iconfont icon-help"></i>
                  </Tooltip>
                </span>}
            </div>
          );
        },
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="转换效率" unit="%" />,
        dataIndex: 'transferRate',
        key: 'transferRate',
        render: (value, record, index) => {
          return (
            <div className={styles.transferRate}>
              <span>{dataFormats(value, '--', 2)}</span>
              {record.transferRateValidation &&
                <span className={styles.tooltipName}>
                  <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={'不含未填写计划发电量的电站'}>
                    <i className="iconfont icon-help"></i>
                  </Tooltip>
                </span>}
            </div>
          );
        },
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
          const nowList = this.inverterStatus[theme][`${value}`];
          return (<span style={{ color: nowList.color }}>{nowList.statusName}</span>);
        },
      },
    ];
    return columns;
  }

  changePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage });
  }

  tableChange = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend',
    });
  }

  createTableSource = (data = []) => {
    const { sortName, descend, currentPage, pageSize } = this.state;
    const tableSource = data.map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['parentDeviceName', 'deviceName'];
      const arrayNumSort = ['devicePower', 'deviceStatus', 'deviceCapacity', 'alarmNum', 'transferRate', 'dayPower', 'equipmentHours'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].length - b[sortName].length);
      }
    });
    return tableSource.splice((currentPage - 1) * pageSize, pageSize);
  }

  inverterStatus = { // 逆变器各种设备状态
    light: {
      '401': { color: '#a42b2c', statusName: '限电', name: 'limit' }, // 限电
      '201': { color: '#199475', statusName: '正常停机', name: 'stop' }, // 正常停机
      '202': { color: '#199475', statusName: '计划停机', name: 'plan' }, // 计划停机
      '203': { color: '#a42b2c', statusName: '故障停机', name: 'fault' }, // 故障停机
      '400': { color: '#199475', statusName: '正常', name: 'normal' }, // 正常
      '500': { color: '#a42b2c', statusName: '无通讯', name: 'break' }, // 无通讯
      '900': { color: '#999', statusName: '未接入', name: 'unconnect' }, // 未接入
    },
    dark: {
      '401': { color: '#fd6e8f', statusName: '限电', name: 'limit' }, // 限电
      '201': { color: '#00baff', statusName: '正常停机', name: 'stop' }, // 正常停机
      '202': { color: '#00baff', statusName: '计划停机', name: 'plan' }, // 计划停机
      '203': { color: '#fd6e8f', statusName: '故障停机', name: 'fault' }, // 故障停机
      '400': { color: '#00baff', statusName: '正常', name: 'normal' }, // 正常
      '500': { color: '#fd6e8f', statusName: '无通讯', name: 'break' }, // 无通讯
      '900': { color: '#bbcef7', statusName: '未接入', name: 'unconnect' }, // 未接入
    },
  }

  seriesStatus = { // 支路设备状态
    light: {
      '801': '#f9b600', // 偏低
      '802': '#3e97d1', // 偏高
      '803': '#a42b2c', // 异常
      '400': '#ceebe0', // 正常
      '500': '#f1f1f1', // 无通讯
      '900': '#f1f1f1', // 未接入
    },
    dark: {
      '801': '#f8b14e', // 偏低
      '802': '#4d5fe2', // 偏高
      '803': '#fd6e8f', // 异常
      '400': '#00baff', // 正常
      '500': '#405080', // 无通讯
      '900': '#405080', // 未接入
    },
  }

  confluenceStatus = { // 汇流箱设备状态
    light: {
      '400': '#ceebe0', // 正常
      '500': '#dfdfdf', // 无通讯
      '900': '#f1f1f1', // 未接入
      '801': '#f9b600', // 离散率>=10%数
      '802': '#a42b2c', // 离散率>=20%数
    },
    dark: {
      '400': '#00baff', // 正常
      '500': '#f8b14e', // 无通讯
      '900': '#181a4e', // 未接入
      '801': '#5522e4', // 离散率>=10%数
      '802': '#5f2370', // 离散率>=20%数
    },
  }

  statusTips = { // 状态提示
    '206': [
      { 'status': '400', 'text': '支路正常' },
      { 'status': '803', 'text': '支路异常' },
      { 'status': '802', 'text': '支路偏大' },
      { 'status': '801', 'text': '支路偏小' },
    ],
    '201': [
      { 'status': '400', 'text': '汇流箱正常' },
      { 'status': '802', 'text': '汇流箱离散率>20%' },
      { 'status': '801', 'text': '汇流箱离散率>10%' },
      { 'status': '500', 'text': '汇流箱无通讯' },
    ],
  }

  dealData = (deviceList) => { // 处理数据，筛选之后的数据
    const { currentStatus, alarmSwitch, lowSwitch } = this.state;
    const filteredDeviceList = deviceList
      .filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0)))
      .filter(e => (!lowSwitch || (`${e.isLowEfficiency}` === '1')))
      .filter(e => {
        return (currentStatus === 0 || e.deviceStatus === currentStatus);
      })
      .sort((a, b) => {
        return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
      });
    return filteredDeviceList;
  }

  groupData = (deviceList = []) => { // 数据分组 用于网格
    const parentDeviceCodes = [...new Set(deviceList.map(e => e.parentDeviceCode))];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = deviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList;
      // return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    });
    return deviceGroupedList;
  }

  changeStationData = (deviceList) => { // 改变数据之后改变
    this.setState({ newList: this.dealData(deviceList) }, () => {
      this.initRender();
    });
  }

  initRender = (initLoad = false) => { //  渲染todolist 的条数
    const { renderList, spliceLength, newList } = this.state;
    const tmp = newList.slice(0, spliceLength + renderList.length);
    const updateTmp = newList.slice(0, renderList.length || spliceLength);
    this.setState({
      renderList: initLoad ? tmp : updateTmp,
    });
  }

  render() {
    const { deviceTypeCode, inverterList, loading, theme } = this.props;
    const { currentPage, pageSize, renderList } = this.state;
    const baseLinkPath = '/hidden/monitorDevice';
    const { stationCode } = this.props.match.params;
    const { deviceList = [], deviceStatusSummary = [] } = inverterList;
    const filteredDeviceList = this.dealData(deviceList);
    const deviceGroupedList = this.groupData(renderList);
    const operations = (<div className={styles.inverterRight} >
      {/* <Switch defaultChecked={false} onChange={this.onSwitchLow} /> 只看低效逆变器 */}
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm} style={{ marginLeft: 8 }} /> 只看告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus} >
        <Radio.Button value={0} >全部</Radio.Button>
        {deviceStatusSummary.map(e =>
          (<Radio.Button key={e.deviceStatusCode} value={e.deviceStatusCode}>{e.deviceStatusName} {e.deviceStatusNum}</Radio.Button>)
        )}
      </Radio.Group>
    </div>);
    return (
      <div className={styles.invertDeviceList} >
        <Tabs defaultActiveKey="1" className={styles.deviceListTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" >
            <div className={styles.deviceListBlockBox} ref={ref => { this.newPinterest = ref; }}>
              {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
                <div>
                  <div className={styles.statusTipsWrap}>
                    {this.statusTips[deviceTypeCode].map((e, i) => {
                      return (
                        <div className={styles.statusTips} key={i}>
                          <span
                            className={deviceTypeCode === '201' ? styles.rect : styles.round}
                            style={{ background: deviceTypeCode === '206' ? this.seriesStatus[theme][e.status] : this.confluenceStatus[theme][e.status] }}
                          />
                          {e.text}
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.listWrap}>
                    {(deviceGroupedList.length > 0 ?
                      <React.Fragment>
                        {deviceGroupedList.map((list, index) => {
                          const { parentDeviceName, parentDeviceCode } = list.length > 0 && list[0];
                          const praentTypeCode = parentDeviceCode && parentDeviceCode.split('M')[1] || '';
                          return (
                            <div key={index}>
                              <div className={styles.parentDeviceName} >
                                <Link to={`/hidden/monitorDevice/${stationCode}/${praentTypeCode}/${parentDeviceCode}`} className={styles.underlin} >
                                  <i className={'iconfont icon-xb'}></i>
                                  {parentDeviceName}
                                </Link>
                              </div>
                              <div className={styles.singledeviceItemBox}>
                                {list.map((item, i) => {
                                  const { branchState = [], deviceStatus, deviceCapacity, devicePower, deviceCode = '' } = item;
                                  const deviceTypeCode = deviceCode.split('M')[1];
                                  const progressPercent = devicePower / deviceCapacity * 100 || 0;
                                  const unconnect = `${deviceStatus}` === '900';
                                  // const statusBoxStyle = item.isLowEfficiency > 0 ? 'lowEfficiency' : item.alarmNum > 0 && 'alarm';
                                  const statusBoxStyle = item.alarmNum > 0 && 'alarm' || '';
                                  return (
                                    <div key={i} className={`${styles.singledeviceItem} 
                                    ${styles[statusBoxStyle]}  ${unconnect && styles.noAccess}`}>
                                      <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${deviceCode}`}>
                                        <div className={`${styles.statusBox}`}>
                                          <div className={styles.deviceItemIcon}>
                                            <i className={`iconfont icon-nb ${styles.icon}`} />
                                            {item.alarmNum > 0 && <i className="iconfont icon-alarm" />}
                                          </div>
                                          <div className={styles.deviceItemR}>
                                            <div className={styles.deviceBlockName}>
                                              <span style={{ color: statusBoxStyle.color }} className={styles.deviceName} title={item.deviceName}>{item.deviceName}</span>
                                              <span className={styles.transferRate}>
                                                <span>{dataFormats(item.transferRate, '--', 2, true)}%</span>
                                                {item.transferRateValidation &&
                                                  <span className={styles.tooltipName}>
                                                    <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={item.transferRateValidation}>
                                                      <i className="iconfont icon-help"></i>
                                                    </Tooltip>
                                                  </span>}
                                              </span>
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
                                            <div>日等效时</div>
                                            <div className={styles.value}>
                                              <span>{dataFormats(item.equipmentHours, '--', 2)} h</span>
                                              {item.equipmentHoursValidation &&
                                                <span className={styles.tooltipName}>
                                                  <Tooltip placement="bottom" overlayStyle={{ maxWidth: 500, fontSize: '12px' }} title={item.equipmentHoursValidation}>
                                                    <i className="iconfont icon-help"></i>
                                                  </Tooltip>
                                                </span>}
                                            </div>
                                          </div>
                                        </div>
                                        <div className={styles.allStatus}>
                                          <div className={styles.branchStatus}>{branchState && branchState.map((e, i) => (
                                            <span
                                              key={i}
                                              className={deviceTypeCode === '201' ? styles.rect : styles.round}
                                              style={{ backgroundColor: deviceTypeCode === '206' ? this.seriesStatus[theme][e] : this.confluenceStatus[theme][e] }}
                                            />
                                          ))}</div>
                                          <div style={{ color: deviceStatus && this.inverterStatus[theme][`${deviceStatus}`].color || '' }}>{deviceStatus && this.inverterStatus[theme][`${deviceStatus}`].statusName || ''}</div>
                                        </div>
                                      </Link>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>);
                        })}
                        {deviceGroupedList.length > 0 && (renderList.length < filteredDeviceList.length) && <Spin size="large" style={{ margin: '30px auto', width: '100%' }} className={styles.loading} />}
                      </React.Fragment>
                      : <div className={styles.nodata} ><img src="/img/nodata.png" /></div>)}
                  </div>
                </div>
              }
            </div>
          </TabPane>
          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2" className={styles.deviceTableBox} >
            <div>
              <div className={styles.pagination} >
                <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={filteredDeviceList.length}
                  theme={theme} />
              </div>
              <Table
                // dataSource={this.createTableSource(filteredDeviceList)}
                dataSource={this.createTableSource(renderList)}
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
    );
  }
}

export default InverterList;
