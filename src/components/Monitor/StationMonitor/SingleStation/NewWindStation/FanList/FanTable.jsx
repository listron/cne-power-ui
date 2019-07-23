import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import styles from './fanList.scss';
import CommonPagination from '../../../../../Common/CommonPagination';
import { Table, message } from "antd";
import TableColumnTitle from '../../../../../Common/TableColumnTitle';
import { dataFormats, numWithComma } from '../../../../../../utils/utilFunc';

class WindStationList extends React.Component {
  static propTypes = {
    fanList: PropTypes.object,
    match: PropTypes.object,
    cardPointParams: PropTypes.string,
    stationCode: PropTypes.string,
    alarmSwitch: PropTypes.bool,
    currentStatus: PropTypes.number,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
    deviceList:PropTypes.array,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      sortName: 'lineName',
      descend: false,
    }
  }


  ontableSort = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend'
    })
  }

  getStatusName = (status) => {
    let result = {};
    switch (status) {
      case 400: result = { text: '运行', name: 'normalNum', icon: '' }; break;
      case 700: result = { text: '待机', name: 'standbyNum', icon: '' }; break;
      case 200: result = { text: '停机', name: 'shutdownNum', icon: 'icon-alarm' }; break;
      case 600: result = { text: '维护', name: 'maintainNum', icon: 'icon-alarm' }; break;
      case 300: result = { text: '故障', name: 'errorNum', icon: 'icon-alarm' }; break;
      case 500: result = { text: '通讯中断', name: 'interruptNum', icon: 'icon-outage' }; break;
      case 900: result = { text: '未接入', name: 'noAccessNum', icon: '' }; break;
    }
    return result;
  }


  showTip = (e) => {
    message.destroy();
    message.config({ top: 225, maxCount: 1, });
    message.warning('设备未接入,无法查看详情', 2);
  }

  powerPoint = (data, quality) => { // 根据风电站特殊的需求
    let point = 2;
    if (data > 100) point = 0;
    if (data > 0.01 && data <= 100) point = 2;
    if (data <= 0.01) point = 4;
    let showData = dataFormats(data, '--', point, true);
    if (showData !== '--') {
      const valueArr = `${showData}`.split('.');
      const intNum = valueArr[0];
      const pointNum = valueArr[1];
      return pointNum && numWithComma(intNum) + '.' + pointNum || numWithComma(intNum)
    } else {
      return showData
    }
  }

  unitFormarts = (data, quantity) => {
    if (isNaN(data) || (!data && data !== 0)) {
      return '--';
    }
    return data / quantity
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
        render: (text, record) => {
          if (record.deviceStatus === 900) {
            return <div title={text} className={styles.stationName} onClick={this.showTip}>{text}</div>
          } else {
            return (
              <Link to={`${baseLinkPath}/${stationCode}/${deviceTypeCode}/${record.deviceCode}`} className={styles.tableDeviceName} >{text}</Link>
            )
          }
        },
      }, {
        title: '所属线路',
        dataIndex: 'lineName',
        key: 'lineName',
        defaultSortOrder: "ascend",
        sorter: true,
        render: text => {
          return <div title={text} className={styles.lineName}>{text}</div>
        }
      },
      {
        title: '型号',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
        sorter: true,
        render: text => {
          return <div title={text} className={styles.deviceModeName}>{text}</div>
        }
      },
      {
        title: () => <TableColumnTitle title="装机容量" unit={'kW'} className="nonePadding" />,
        dataIndex: "deviceCapacity",
        key: 'deviceCapacity',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="实时功率" unit="kW" className="nonePadding" />,
        dataIndex: 'devicePower',
        key: 'devicePower',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="风速" unit="m/s" className="nonePadding" />,
        dataIndex: 'windSpeed',
        key: 'windSpeed',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: '出力比',
        dataIndex: 'capabilityRate',
        key: 'capabilityRate',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true)+'%',
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="发电机转速" unit="RPM" className="nonePadding" />,
        dataIndex: 'alternatorSpeed',
        key: 'alternatorSpeed',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="叶轮转速" unit="RPM" className="nonePadding" />,
        dataIndex: 'impellerSpeed',
        key: 'impellerSpeed',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="风向角" unit="°" className="nonePadding" />,
        dataIndex: 'windAngle',
        key: 'windAngle',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="偏航角度" unit="°" className="nonePadding" />,
        dataIndex: 'angleOfYaw',
        key: 'angleOfYaw',
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: () => <TableColumnTitle title="告警" unit="个" className="nonePadding" />,
        dataIndex: 'alarmNum',
        key: 'alarmNum',
        className: styles.numberStyle,
        render(value) { return numWithComma(value); },
        sorter: true,
      }, {
        title: '设备状态',
        dataIndex: 'deviceStatus',
        key: 'deviceStatus',
        render: (text, record) => (<span className={styles[this.getStatusName(text).name]}>{this.getStatusName(text).text}</span>),
        sorter: true,
      },
    ];
    return columns;
  }

  createTableSource = (data) => { // 数据源的排序，翻页
    const { sortName, descend } = this.state;
    const tableSource = data.sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['deviceName', 'lineName', 'deviceModeName'];
      const arrayNumSort = [
        "deviceCapacity",
        "devicePower",
        "windSpeed",
        "capabilityRate",
        "alternatorSpeed",
        "impellerSpeed",
        "windAngle",
        "angleOfYaw",
        "alarmNum",
        "deviceStatus",];
      if (arrayNumSort.includes(sortName)) {
        return sortType * (a[sortName] - b[sortName]);
      } else if (arraySort.includes(sortName)) {
        a[sortName] = a[sortName] ? a[sortName] : '';
        return sortType * (a[sortName].localeCompare(b[sortName]));
      }
    })
    return tableSource
  }


  render() {
    const { deviceList = [], pageSize, currentPage, onPaginationChange, alarmSwitch, currentStatus } = this.props;
    const initDeviceList = deviceList.map((e, i) => ({ ...e, key: i }));
    const filteredDeviceList = initDeviceList.filter(e => (!alarmSwitch || (alarmSwitch && e.alarmNum > 0))).filter(e => {
      return (currentStatus === 0 || e.deviceStatus === currentStatus);
    }).sort((a, b) => { return a['deviceName'].localeCompare(b['deviceName']) })
    const dataSort = this.createTableSource(filteredDeviceList);
    let startRow = (currentPage - 1) * pageSize;
    let endRow = currentPage * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist = dataSort.slice(startRow, endRow).map((e, index) => { return { key: e.stationCode, ...e } })
    const totalNum = filteredDeviceList.length;
    return (
      <div className={styles.fanTable}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} total={totalNum} onPaginationChange={onPaginationChange} />
        </div>
        <Table
          columns={this.tableColumn()}
          dataSource={datalist}
          onChange={this.ontableSort}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </div>
    )
  }
}
export default (WindStationList)

