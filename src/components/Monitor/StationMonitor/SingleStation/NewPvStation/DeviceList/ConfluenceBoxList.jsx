

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Spin, Table, Progress, Radio } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../../utils/utilFunc';
const TabPane = Tabs.TabPane;
import { throttle } from 'lodash';

class ConfluenceBoxList extends Component {
  static propTypes = {
    confluenceBoxList: PropTypes.object,
    match: PropTypes.object,
    deviceTypeCode: PropTypes.string,
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
      renderList: [],
      spliceLength: 24, // 24条数据一渲染。
      topHeight: 550, // 假设的列表上方高度
      newList: [],
    }
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
          const { deviceList = [] } = this.props.confluenceBoxList;
          if (renderList.length < deviceList.length) {
            this.initRender(true);
          }
        }
      }
    }, 1000))

  }

  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextParams = nextProps.match.params;
    const nextStation = nextParams.stationCode;
    if (nextStation !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getData(nextStation);
    }
    const { deviceList = [] } = nextProps.confluenceBoxList;
    this.changeStationData(deviceList)
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  onChangeStatus = (e) => {
    const { deviceList = [] } = this.props.confluenceBoxList;
    this.setState({
      currentStatus: e.target.value,
      currentPage: 1,
      renderList: []
    }, () => {
      this.changeStationData(deviceList)
    })
  }

  onSwitchAlarm = (e) => {
    const { deviceList = [] } = this.props.confluenceBoxList;
    this.setState({
      alarmSwitch: e,
      currentPage: 1,
      renderList: [],
    }, () => {
      this.changeStationData(deviceList)
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
    }, 60000);
  }

  getStatusName = (value) => {
    let result = [];
    switch (value) {
      case '400': result = [{ name: 'normal', text: '正常' }]; break;
      case '801': result = [{ name: 'moreThanTen', text: '离散率>10%' }]; break;
      case '802': result = [{ name: 'moreThanTwenty', text: '离散率>20%' }]; break;
      case '500': result = [{ name: 'noContact', text: '无通讯' }]; break;
      case '900': result = [{ name: 'noAccess', text: '未接入' }]; break;
      default: result = [{ name: 'normal', text: '' }]; break;
    }
    return result;
  }

  getStatusNum = (status) => { // 获取状态的数量
    const { deviceStatusSummary = [] } = this.props.confluenceBoxList;
    const deviceList = deviceStatusSummary.filter(e => `${e.deviceStatusCode}` === `${status}`)
    return deviceList.length > 0 && deviceList[0].deviceStatusNum || 0
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

  dealData = (deviceList) => { // 处理数据，筛选之后的数据
    const { currentStatus, alarmSwitch } = this.state;
    const filteredDeviceList = deviceList
      .filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0)))
      .filter(e => {
        return (currentStatus === 0 || e.deviceStatus === currentStatus);
      })
      .sort((a, b) => {
        return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
      })
    return filteredDeviceList
  }

  groupData = (deviceList = []) => { // 数据分组 用于网格
    const parentDeviceCodes = [...new Set(deviceList.map(e => e.parentDeviceCode))];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = deviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    });
    return deviceGroupedList
  }

  changeStationData = (deviceList) => { // 改变数据之后改变
    this.setState({ newList: this.dealData(deviceList) }, () => {
      this.initRender()
    })
  }

  initRender = (initLoad = false) => { //  渲染todolist 的条数
    const { renderList, spliceLength, newList } = this.state;
    const tmp = newList.slice(0, spliceLength + renderList.length);
    const updateTmp = newList.slice(0, renderList.length || spliceLength);
    this.setState({
      renderList: initLoad ? tmp : updateTmp
    });
  }


  render() {
    const { confluenceBoxList, deviceTypeCode, loading } = this.props;
    const { currentPage, pageSize, renderList } = this.state;
    const { deviceList = [] } = confluenceBoxList;
    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    const filteredDeviceList = this.dealData(deviceList);
    const deviceGroupedList = this.groupData(renderList);
    const operations = (<div className={styles.deviceRight} >
      <Switch defaultChecked={false} onChange={this.onSwitchAlarm} /> 只看告警
      <Radio.Group defaultValue={0} buttonStyle="solid" className={styles.inverterStatus} onChange={this.onChangeStatus}  >
        <Radio.Button value={0} >全部</Radio.Button>
        <Radio.Button value={400} >正常 {this.getStatusNum(400)}</Radio.Button>
        <Radio.Button value={801} >离散率>10% {this.getStatusNum(801)}</Radio.Button>
        <Radio.Button value={802} >离散率>20% {this.getStatusNum(802)}</Radio.Button>
        <Radio.Button value={500} >无通讯 {this.getStatusNum(500)}</Radio.Button>
        <Radio.Button value={900} >未接入 {this.getStatusNum(900)}</Radio.Button>
      </Radio.Group>
    </div>);
    return (
      <div className={styles.deviceList} >
        <Tabs defaultActiveKey="1" className={styles.deviceListTab} tabBarExtraContent={operations}>
          <TabPane
            tab={<span><i className="iconfont icon-grid" ></i></span>}
            key="1"
          >
            <div ref={ref => this.newPinterest = ref} className={styles.deviceListBlockBox}>
              {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
                (deviceGroupedList.length > 0 ? deviceGroupedList.map((list, index) => {
                  const { parentDeviceName, parentDeviceFullCode } = list.length > 0 && list[0];
                  const praentTypeCode = parentDeviceFullCode && parentDeviceFullCode.split('M')[1] || '';
                  return (
                    <div key={index}>
                      <div className={styles.parentDeviceName} >
                        <Link to={`/hidden/monitorDevice/${stationCode}/${praentTypeCode}/${parentDeviceFullCode}`} className={styles.underlin} >
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
                            <div key={item.deviceCode}
                              className={`${styles.singledeviceItem} ${styles[statusName]} ${alarm && styles.alarm} `}>
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
            </div>
            {(renderList.length < filteredDeviceList.length) && <Spin size="large" style={{ margin: '30px auto', width: '100%' }} className={styles.loading} />}
          </TabPane>

          <TabPane tab={<span><i className="iconfont icon-table" ></i></span>} key="2" className={styles.deviceTableBox} >
            <div>
              <div className={styles.pagination} >
                <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={filteredDeviceList.length} />
              </div>
              <Table
                dataSource={this.createTableSource(filteredDeviceList).map((e, i) => { return { ...e, key: e.deviceCode } })}
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
