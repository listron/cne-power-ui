

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './deviceList.scss';
import { Tabs, Switch, Spin, Table, Progress } from 'antd';
import { Link } from 'react-router-dom';
import CommonPagination from '../../../../../Common/CommonPagination/index';
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../../utils/utilFunc';
import CneTable from '@components/Common/Power/CneTable';

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
      currentStatus: 0, //当前状态值
      alarmSwitch: false,
      pageSize: 10,
      currentPage: 1,
      sortName: '',
      descend: false,
      firstLoad: true,
      sortMethod: '', // 排序方式
      sortField: '', // 排序字段
    };
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
    });
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
    }, 60000);
  }



  getStatusName = {
    '400': { name: 'normal', text: '正常' },
    '500': { name: 'noContact', text: '中断' },
    '900': { name: 'noAccess', text: '未接入' },
  }


  tableColumn = () => {
    const baseLinkPath = '/hidden/monitorDevice';
    const { stationCode } = this.props.match.params;
    const { deviceTypeCode } = this.props;
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        sorter: true,
        textAlign: 'left',
        defaultSortOrder: 'ascend',
        className: styles.deviceName,
        render: (text, record) => {
          return (
            <div className={`${record.deviceStatus === 900 && styles.deviceCode} ${styles.deviceNameText}`}>
              <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName} title={text}>{text}</Link>
            </div>);
        },
      }, {
        title: '实时功率(kW)',
        dataIndex: 'devicePower',
        key: 'devicePower',
        textAlign: 'right',
        className: styles.devicePower,
        render: value => numWithComma(dataFormats(value, '--', 2)),
        sorter: true,
      }, {
        title: '装机容量(kw)',
        dataIndex: 'deviceCapacity',
        key: 'deviceCapacity',
        width: '140px',
        textAlign: 'right',
        className: styles.deviceCapacity,
        render: value => numWithComma(dataFormats(value, '--', 2)),
        sorter: (a, b) => a.deviceCapacity - b.deviceCapacity,
      }, {
        title: '告警(个)',
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        textAlign: 'right',
        className: styles.alarmNum,
        render: value => numWithComma(value),
        sorter: (a, b) => a.alarmNum - b.alarmNum,
      },
    ];
    return columns;
  }

  changePagination = ({ pageSize, currentPage }) => {
    this.setState({ pageSize, currentPage });
  }

  sortFieldMap = { // 表格排序字段 => api
    deviceName: 'deviceName',
    devicePower: 'devicePower',
    deviceCapacity: 'deviceCapacity',
    alarmNum: 'alarmNum',
  };

  tableSortMap = { // api存储字段 => 表格排序字段
    deviceName: 'deviceName',
    devicePower: 'devicePower',
    deviceCapacity: 'deviceCapacity',
    alarmNum: 'alarmNum',
  };

  sortMethodMap = {
    descend: 'descend',
    ascend: 'ascend',
  }

  tableChange = (pagination, filters, sorter) => {
    const { field } = sorter || {};
    const { sortField, sortMethod } = this.state;
    let newField = sortField, newSort = 'descend';
    if (!field || (sortField === this.sortFieldMap[field])) { // 点击的是正在排序的列
      newSort = sortMethod === 'descend' ? 'ascend' : 'descend'; // 交换排序方式
    } else { // 切换列
      newField = this.sortFieldMap[field];
    }
    this.setState({
      sortMethod: newSort,
      sortField: newField,
      sortName: sorter.field,
      descend: newSort === 'descend',
    });
  }

  createTableSource = (data) => {
    const { sortName, descend, currentPage, pageSize } = this.state;
    const tableSource = [...data].map((e, i) => ({
      ...e,
      key: i,
    })).sort((a, b) => { // 排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['deviceName', 'deviceStatus'];
      const arrayNumSort = ['devicePower', 'deviceCapacity', 'alarmNum'];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        // a[sortName] = a[sortName] ? a[sortName] : '';
        // return sortType * (a[sortName].length - b[sortName].length);
        a[sortName] = a[sortName] && a[sortName] || '';
        b[sortName] = b[sortName] && b[sortName] || '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    });
    return tableSource.splice((currentPage - 1) * pageSize, pageSize);
  }

  render() {
    const { boxTransformerList, deviceTypeCode, loading, theme } = this.props;
    const { currentStatus, alarmSwitch, currentPage, pageSize, sortMethod, sortField } = this.state;
    const { deviceList = [] } = boxTransformerList;
    const filteredDeviceList = deviceList
      .filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0)))
      .filter(e => {
        return (currentStatus === 0 || e.deviceStatus === currentStatus);
      }).sort((a, b) => {
        return a.parentDeviceName && a.parentDeviceName.localeCompare(b.parentDeviceName);
      });// 根据筛选条件处理数据源。

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
    const baseLinkPath = '/hidden/monitorDevice';
    const { stationCode } = this.props.match.params;
    return (
      <div className={styles.deviceList} >
        <Tabs defaultActiveKey="1" className={styles.deviceListTab} tabBarExtraContent={operations}>
          <TabPane tab={<span><i className="iconfont icon-grid" ></i></span>} key="1" className={styles.deviceListBlockBox} >
            {loading ? <Spin size="large" style={{ height: '100px', margin: '200px auto', width: '100%' }} /> :
              (deviceGroupedList.length > 0 ? deviceGroupedList.map((list, index) => {
                const { parentDeviceName, parentDeviceCode } = list.length > 0 && list[0];
                const praentTypeCode = parentDeviceCode && parentDeviceCode.split('M')[1] || '';
                return (<div key={index}>
                  <div className={styles.parentDeviceName} >
                    {parentDeviceCode && <Link to={`/hidden/monitorDevice/${stationCode}/${praentTypeCode}/${parentDeviceCode}`} className={styles.underlin} >
                      <i className={'iconfont icon-jidian'}></i>
                      {parentDeviceName}
                    </Link> || <div className={styles.underlin}>
                        <i className={'iconfont icon-jidian'}></i>
                        {parentDeviceName}
                      </div>}
                  </div>
                  <div className={styles.singledeviceItemBox}>
                    {list.map((item, i) => {
                      const statusName = item.deviceStatus && this.getStatusName[`${item.deviceStatus}`]['name'] || '';
                      const alarm = item.alarmNum && item.alarmNum > 0;
                      const devicePower = dataFormats(item.devicePower, '--', 2);
                      const deviceCapacity = dataFormats(item.deviceCapacity, '--', 2);
                      const progressPercent = deviceCapacity && devicePower && devicePower / deviceCapacity * 100 || 0;
                      return (
                        <div key={i} className={`${styles.singledeviceItem} ${styles[statusName]} ${alarm && styles.alarm} `}>
                          <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${item.deviceCode}`} >
                            <div className={`${styles.statusBox}`} >
                              <div className={styles.deviceItemIcon} >
                                {item.deviceStatus === 500 && <i className="iconfont icon-outage" /> || null}
                                <i className={`iconfont icon-xb ${styles.icon}`} ></i>
                                {(item.alarmNum && item.alarmNum > 0) && <i className="iconfont icon-alarm" /> || null}
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
                <CommonPagination pageSize={pageSize} currentPage={currentPage} onPaginationChange={this.changePagination} total={filteredDeviceList.length} theme={theme} />
              </div>
              <CneTable
                dataSource={currentTableList}
                columns={this.tableColumn()}
                onChange={this.tableChange}
                sortField={this.tableSortMap[sortField]}
                sortMethod={this.sortMethodMap[sortMethod] || false}
                className={`${styles.deviceTable} ${styles.boxTransformerTable}`}
                locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" /></div> }}
                dataError={false} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default BoxTransformerList;
