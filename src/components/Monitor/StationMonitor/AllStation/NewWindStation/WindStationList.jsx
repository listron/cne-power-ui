import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import CommonPagination from '../../../../Common/CommonPagination';
import { Table, message } from "antd";
import TableColumnTitle from '../../../../Common/TableColumnTitle';
import { numWithComma, dataFormats } from '../../../../../utils/utilFunc';

class WindStationList extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
    pageSize: PropTypes.number,
    currentPage: PropTypes.number,
    onPaginationChange: PropTypes.func,
    windMonitorStation: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      sortName: 'stationName',
      descend: false,
    }
  }


  ontableSort = (pagination, filters, sorter) => {
    this.setState({
      sortName: sorter.field,
      descend: sorter.order === 'descend'
    })
  }

  showTip = (e) => {
    message.destroy();
    message.config({ top: 225, maxCount: 1, });
    message.warning('电站未接入,无法查看详情', 2);
  }


  powerPoint = (data,quality) => { // 根据风电站特殊的需求
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

  initColumn = () => {
    const columns = [
      {
        title: "电站名称",
        dataIndex: "stationName",
        defaultSortOrder: "ascend",
        sorter: true,
        render: (value, record) => {
          const stationStatus=record.stationStatus.stationStatus || '';
          if (stationStatus === '900') {
            return <div title={value} className={styles.stationName} onClick={this.showTip}>{value}</div>
          } else {
            return (
              <a href={`#/monitor/singleStation/${record.stationCode}`}>
                <div title={value} className={styles.stationName}>{value}</div>
              </a>
            )
          }

        }
      },
      {
        title: "区域",
        dataIndex: "regionName",
        sorter: true,
        render: (value) => <div className={styles.stationrovince}>{value}</div>
      },
      {
        title: () => <TableColumnTitle title="装机容量" unit={'MW'} className="nonePadding" />,
        dataIndex: "stationCapacity",
        sorter: true,
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true)
      },
      {
        title: () => <TableColumnTitle title="装机" unit="台" className="nonePadding" />,
        dataIndex: "stationUnitCount",
        sorter: true,
        className: styles.numberStyle,
        render: (value) => { return numWithComma(value); },
      },
      {
        title: () => <TableColumnTitle title="实时功率" unit={'MW'} className="nonePadding" />,
        dataIndex: "stationPower",
        sorter: true,
        className: styles.numberStyle,
        render: value => dataFormats(value/1000, '--', 2, true)
      },
      {
        title: () => <TableColumnTitle title="平均风速" unit="m/s" className="nonePadding" />,
        dataIndex: "instantaneous",
        className: styles.numberStyle,
        render: (value) => dataFormats(value, '--', 2, true),
        sorter: true,
      },
      {
        title: "出力比",
        dataIndex: "capabilityRate",
        sorter: true,
        className: styles.numberStyle,
        render: (value) => dataFormats(value, '--', 2, true) + '%',
      },
      {
        title: () => <TableColumnTitle title="日发电量" unit={'万kWh'} className="nonePadding" />,
        dataIndex: "dayPower",
        sorter: true,
        className: styles.numberStyle,
        render: value => this.powerPoint(this.unitFormarts(value,10000)),
      },
      {
        title: () => <TableColumnTitle title="月发电量" unit={'万kWh'} className="nonePadding" />,
        dataIndex: "monthPower",
        render: value => this.powerPoint(this.unitFormarts(value,10000)),
        sorter: true,
        className: styles.numberStyle,
      },
      {
        title: () => <TableColumnTitle title="年发电量" unit={'万kWh'} className="nonePadding" />,
        dataIndex: "yearPower",
        render: value => this.powerPoint(this.unitFormarts(value,10000)),
        sorter: true,
        className: styles.numberStyle,
      },
      {
        title: '年完成率',
        dataIndex: "yearPlanRate",
        sorter: true,
        className: styles.numberStyle,
        render: value => dataFormats(value, '--', 2, true) + '%',
      },
      {
        title: () => <TableColumnTitle title="年利用小时" unit={'h'} className="nonePadding" />,
        dataIndex: "equivalentHours",
        sorter: true,
        className: styles.numberStyle,
        render: value => this.powerPoint(value),
      },
      {
        title: () => <TableColumnTitle title="故障" unit={'台'} className="nonePadding" />,
        dataIndex: "errorNum",
        sorter: true,
        className: styles.numberStyle,
        render: value => value ? value : 0
      },
      {
        title: () => <TableColumnTitle title="维护" unit={'台'} className="nonePadding" />,
        dataIndex: "maintainNum",
        sorter: true,
        className: styles.numberStyle,
        render: value => value ? value : 0
      },
      {
        title: () => <TableColumnTitle title="通讯中断" unit={'台'} className="nonePadding" />,
        dataIndex: "interruptNum",
        sorter: true,
        className: styles.numberStyle,
        render: value => value ? value : 0
      },
    ];
    return columns
  }

  createTableSource = (data) => { // 数据源的排序，翻页
    const { sortName, descend } = this.state;
    const tableSource = data.sort((a, b) => { // 手动排序
      const sortType = descend ? -1 : 1;
      const arraySort = ['stationName', 'regionName'];
      const arrayNumSort = [
        "stationCapacity",
        "stationUnitCount",
        "stationPower",
        "instantaneous",
        "capabilityRate",
        "dayPower",
        "monthPower",
        "yearPower",
        "yearPlanRate",
        "equivalentHours",
        "errorNum",
        "maintainNum",
        "interruptNum",];
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
    const { stationDataList, pageSize, currentPage, onPaginationChange } = this.props;
    const dataSort = this.createTableSource(stationDataList);
    let startRow = (currentPage - 1) * pageSize;
    let endRow = currentPage * pageSize;
    endRow = (endRow > totalNum) ? totalNum : endRow;
    let datalist = dataSort.slice(startRow, endRow).map((e, index) => { return { key: e.stationCode, ...e } })
    const totalNum = stationDataList.length;

    return (
      <div className={styles.windStationList}>
        <div className={styles.pagination}>
          <CommonPagination pageSize={pageSize} currentPage={currentPage} total={totalNum} onPaginationChange={onPaginationChange} />
        </div>
        <Table
          columns={this.initColumn()}
          dataSource={datalist}
          onChange={this.ontableSort}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          pagination={false} />
      </div>
    )
  }
}
export default (WindStationList)

