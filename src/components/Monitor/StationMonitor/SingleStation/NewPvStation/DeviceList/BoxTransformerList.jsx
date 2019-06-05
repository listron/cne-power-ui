

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Spin, Table, Progress } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../../utils/utilFunc';

const TabPane = Tabs.TabPane;

class BoxTransformerList extends Component {
  static propTypes = {
    boxTransformerList: PropTypes.object,
    match: PropTypes.object,
    deviceTypeCode: PropTypes.string,
    getBoxTransformerList: PropTypes.func,
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentStatus: 0,//当前状态值
      alarmSwitch: false,
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
    this.props.getBoxTransformerList({ stationCode, firstLoad });
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
      case '200': result = [{ name: 'downtime', text: '停机' }]; break;
      case '300': result = [{ name: 'fault', text: '故障' }]; break;
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
      }, {
        title: () => <TableColumnTitle title="告警" unit="个" />,
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        render: value => numWithComma(value),
        sorter: (a, b) => a.alarmNum - b.alarmNum,
      }
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
      const arraySort = ['deviceName', 'deviceStatus'];
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



  render() {
    const { boxTransformerList, deviceTypeCode, loading } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize } = this.state;
    const { deviceList = [] } = boxTransformerList;
    const filteredDeviceList = deviceList
      .filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0)))
      .filter(e => {
        return (currentStatus === 0 || e.deviceStatus === currentStatus);
      }).sort((a, b) => {
        return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
      })// 根据筛选条件处理数据源。

    const parentDeviceCodes = [...new Set(filteredDeviceList.map(e => e.parentDeviceCode))];
    const deviceGroupedList = parentDeviceCodes.map(e => {
      const subDeviceList = filteredDeviceList.filter(item => item.parentDeviceCode === e);
      return subDeviceList.sort((a, b) => a.deviceName && a.deviceName.localeCompare(b.deviceName));
    });

    const currentTableList = this.createTableSource(filteredDeviceList); // 根据分页，排序筛选表格数据

    const operations = (
      <div className={styles.deviceRight} >
        <Switch defaultChecked={false} onChange={this.onSwitchAlarm} /> 只看告警
    </div>);

    const baseLinkPath = "/hidden/monitorDevice";
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.deviceList} >
        <Tabs defaultActiveKey="1" className={styles.deviceListTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.deviceListBlockBox} >
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              (deviceGroupedList.length > 0 ? deviceGroupedList.map((list, index) => {
                const { parentDeviceName, parentDeviceCode } = list.length > 0 && list[0];
                const praentTypeCode=parentDeviceCode.split('M')[1];
                return (<div key={index}>
                  <div className={styles.parentDeviceName} >
                    <Link to={`/hidden/monitorDevice/${stationCode}/${praentTypeCode}/${parentDeviceCode}`} className={styles.underlin} >
                      <i className={'iconfont icon-jidian'}></i>
                      {parentDeviceName}
                    </Link>
                  </div>
                  <div className={styles.singledeviceItemBox}>
                    {list.map((item, i) => {
                      const statusName = this.getStatusName(`${item.deviceStatus}`)[0].name;
                      const alarm = item.alarmNum && item.alarmNum > 0;
                      const devicePower = dataFormats(item.devicePower, '--', 2);
                      const deviceCapacity = dataFormats(item.deviceCapacity, '--', 2);
                      let progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
                      return (
                        <div key={i} className={`${styles.singledeviceItem} ${styles[statusName]} ${alarm && styles.alarm} `}>
                          <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} >
                            <div className={`${styles.statusBox}`} >
                              <div className={styles.deviceItemIcon} >
                                <i className={`iconfont icon-xb ${styles.icon}`} ></i>
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
                            <div className={styles.deviceBlockFooter}>
                              <div>Q：{dataFormats(item.reactivePower, '--', 2)} kVar</div>
                              <div>F：{dataFormats(item.powerFrequency, '--', 2)} Hz</div>
                              <div>Cos：{dataFormats(item.powerFactor, '--', 2)} </div>
                              <div>Ia:{dataFormats(item.current, '--', 2)} A</div>
                            </div>
                          </Link>
                        </div>);
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
                dataSource={currentTableList}
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

export default BoxTransformerList;
