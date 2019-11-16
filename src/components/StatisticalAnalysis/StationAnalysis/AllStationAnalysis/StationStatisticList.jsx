import React from 'react';
import PropTypes from 'prop-types';
import styles from './stationStatisticList.scss';
import CommonPagination from '../../../Common/CommonPagination';
import { Table, Radio, Button } from 'antd';
import moment from 'moment';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';
import Path from '../../../../constants/path';
import Cookie from 'js-cookie';

class StationStatisticList extends React.Component {
  static propTypes = {
    allStationAvalibaData: PropTypes.array,
    dateType: PropTypes.string,
    sortType: PropTypes.string,
    sort: PropTypes.string,
    allStationStatisticTableData: PropTypes.array,
    getAllStationStatisticTableData: PropTypes.func,
    changeAllStationStore: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    exportAllstationTableData: PropTypes.func,
    downLoadFile: PropTypes.func,
    history: PropTypes.object,
  }

  ontableSort = (pagination, filter, sorter) => {
    const { getAllStationStatisticTableData, stationType, year, month, powerSelectYear, dateType, pageSize, pageNum } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      stationName: 'stationName',
      region: 'region',
      planGen: 'planGen',
      genValid: 'genValid',
      planGenRate: 'planGenRate',
      powerRate: 'powerRate',
      resourceValue: 'resourceValue',
      resourceRate: 'resourceRate',
      equivalentHours: 'equivalentHours',
      pr: 'pr',
      lostPower: 'lostPower',
      limitPowerHours: 'limitPowerHours',
    };
    const sort = sortInfo[field] ? sortInfo[field] : '';
    const sortType = order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '';
    const prams = {
      pageNum,
      pageSize,
      year: dateType === 'month' ? year[0] : powerSelectYear,
      stationType,
      month,
      dateType,
      sort,
      sortType,
    };
    getAllStationStatisticTableData(prams);
    this.props.changeAllStationStore({ sort, sortType });
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    const { getAllStationStatisticTableData, dateType, sortType, stationType, month, year, sort, powerSelectYear } = this.props;
    getAllStationStatisticTableData({
      year: dateType === 'month' ? year[0] : powerSelectYear,
      dateType,
      pageSize,
      sortType,
      sort,
      month,
      pageNum: currentPage,
      stationType,
    });
    this.props.changeAllStationStore({ pageNum: currentPage, pageSize });
  }

  handleTime = (e) => { // 选择月
    const changeMonth = Number(e.target.value);
    const { changeAllStationStore, getAllStationStatisticTableData, stationType, dateType, pageNum, pageSize, sortType, year, sort, powerSelectYear } = this.props;
    changeAllStationStore({ month: changeMonth, powerSelectMonth: changeMonth });
    getAllStationStatisticTableData(
      {
        year: year[0],
        dateType,
        month: changeMonth,
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType,
      }
    );
  }

  handleYearTime = (e) => { // 选择年
    const changeYear = Number(e.target.value);
    const { getAllStationStatisticTableData, dateType, pageNum, pageSize, sortType, sort, stationType, changeAllStationStore } = this.props;
    getAllStationStatisticTableData(
      {
        year: changeYear,
        dateType,
        pageNum, // 当前页
        pageSize, // 每页条数
        sortType,
        sort,
        stationType,
      }
    );
    changeAllStationStore({ powerSelectYear: changeYear });
  }

  selectYear() { // 计划完成选择年份
    const { allStationAvalibaData, dateType, powerSelectMonth, powerSelectYear } = this.props;
    if (dateType === 'year' && allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${powerSelectYear}`} buttonStyle="solid" onChange={this.handleYearTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}</Radio.Button>;
            }
            return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}</Radio.Button>;

          }
          )}
        </Radio.Group>
      );
    } else if (allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={+powerSelectMonth} buttonStyle="solid" onChange={this.handleTime}>
          {allStationAvalibaData.map((e, index) => {
            if (e.isTrue === true || +e.year === moment().month() + 1) {
              return <Radio.Button value={e.year} key={index} style={{ margin: '0 5px' }}>{e.year}月</Radio.Button>;
            }
            return <Radio.Button value={e.year} key={index} disabled style={{ margin: '0 5px' }}>{e.year}月</Radio.Button>;

          })}
        </Radio.Group>
      );
    }
  }

  selectStation = (record) => {
    const stationCode = record.stationCode;
    this.props.history.push(`/statistical/stationaccount/allstation/${stationCode}`);
    this.props.changeAllStationStore({
      showPage: 'single',
      singleStationCode: `${stationCode}`,
    });
  }

  initMonthColumn = () => { // 月table表
    const enterpriseId = Cookie.get('enterpriseId');
    const columns1 = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        className: styles.stationName,
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <a onClick={() => this.selectStation(record)}>
                <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
              </a>
            ),
          };
        },
      }, {
        title: '区域',
        dataIndex: 'region',
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.region}>{record.region}</div>
            ),
          };
        },
      }, {
        title: () => <TableColumnTitle title="月发电量" unit="万kWh" />,
        dataIndex: 'genValid',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="月计划" unit="万kWh" />,
        dataIndex: 'planGen',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="计划完成率" unit="%" />,
        dataIndex: 'planGenRate',
        sorter: true,
        render(text) { return numWithComma(text); },
        defaultSortOrder: 'ascend',
      }, {
        title: () => <TableColumnTitle title="发电量同比" unit="%" />,
        dataIndex: 'powerRate',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="辐射总量" unit="MJ/m²" />,
        dataIndex: 'resourceValue',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="资源同比" unit="%" />,
        dataIndex: 'resourceRate',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
        dataIndex: 'equivalentHours',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="PR" unit="%" />,
        dataIndex: 'pr',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="损失电量" unit="万kWh" />,
        dataIndex: 'lostPower',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="损失电量等效时" unit="h" />,
        dataIndex: 'limitPowerHours',
        sorter: true,
        render(text) { return numWithComma(text); },
      },
    ];
    const columns2 = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        className: styles.stationName,
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
            ),
          };
        },
      }, {
        title: '区域',
        dataIndex: 'region',
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.region}>{record.region}</div>
            ),
          };
        },
      }, {
        title: () => <TableColumnTitle title="月发电量" unit="万kWh" />,
        dataIndex: 'genValid',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="月计划" unit="万kWh" />,
        dataIndex: 'planGen',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="计划完成率" unit="%" />,
        dataIndex: 'planGenRate',
        sorter: true,
        render(text) { return numWithComma(text); },
        defaultSortOrder: 'ascend',
      }, {
        title: () => <TableColumnTitle title="发电量同比" unit="%" />,
        dataIndex: 'powerRate',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="辐射总量" unit="MJ/m²" />,
        dataIndex: 'resourceValue',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="资源同比" unit="%" />,
        dataIndex: 'resourceRate',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="PR" unit="%" />,
        dataIndex: 'pr',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="损失电量" unit="万kWh" />,
        dataIndex: 'lostPower',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="损失电量等效时" unit="h" />,
        dataIndex: 'limitPowerHours',
        sorter: true,
        render(text) { return numWithComma(text); },
      },
    ];
    return enterpriseId !== '451436467886592' ? columns1 : columns2;
  }
  //年table表
  initYearColumn = () => {
    const enterpriseId = Cookie.get('enterpriseId');
    const columns1 = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        className: styles.stationName,
        onFilter: (value, record) => record.stationName.indexOf(value) === 0,
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <a href={`#/statistical/stationaccount/allstation/${record.key}`} onClick={() => this.selectStation(record)}>
                <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
              </a >
            ),
          };
        },
      }, {
        title: '区域',
        dataIndex: 'region',
        sorter: true,
        render: (value, record, index) => {
          return {
            children: (
              <div className={styles.region}>{record.region}</div>
            ),
          };
        },
      }, {
        title: () => <TableColumnTitle title="年发电量" unit="万kWh" />,
        dataIndex: 'genValid',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="年计划" unit="万kWh" />,
        dataIndex: 'planGen',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="计划完成率" unit="%" />,
        dataIndex: 'planGenRate',
        sorter: true,
        render(text) { return numWithComma(text); },
        defaultSortOrder: 'ascend',
      }, {
        title: () => <TableColumnTitle title="发电量环比" unit="%" />,
        dataIndex: 'powerRate',
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="辐射总量" unit="MJ/m²" />,
        dataIndex: 'resourceValue',
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="资源环比" unit="%" />,
        dataIndex: 'resourceRate',
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
        dataIndex: 'equivalentHours',
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="PR" unit="%" />,
        dataIndex: 'pr',
        render(text) { return numWithComma(text); },
        sorter: true,
      }, {
        title: () => <TableColumnTitle title="损失电量" unit="万kWh" />,
        dataIndex: 'lostPower',
        sorter: true,
        render(text) { return numWithComma(text); },
      }, {
        title: () => <TableColumnTitle title="损失电量等效时" unit="h" />,
        dataIndex: 'limitPowerHours',
        render(text) { return numWithComma(text); },
        sorter: true,
      },
    ];
    return enterpriseId !== '' ? columns1 : columns2;
  }
  //导出table
  exportTable = () => {
    const { stationType, year, month, powerSelectYear, dateType, pageSize, pageNum, sort, sortType, downLoadFile } = this.props;
    const prams = {
      // pageNum,
      // pageSize,
      year: dateType === 'month' ? year[0] : powerSelectYear,
      stationType,
      month,
      dateType,
      sort,
      sortType,
    };
    const url = `${Path.basePaths.APIBasePath}${Path.APISubPaths.statisticalAnalysis.exportAllstationTableData}`; // 下载文件
    downLoadFile({
      url,
      method: 'post',
      params: prams,
      defineOriginName: false,

    });
  }

  render() {
    const { dateType, allStationStatisticTableData, totalNum, pageSize, pageNum, theme } = this.props;
    const columns = dateType === 'month' ? this.initMonthColumn() : this.initYearColumn();
    const dataSource = allStationStatisticTableData.map((e, i) => ({ ...e, key: i }));
    return (
      <div className={`${styles.stationStatisticList} ${styles[theme]}`}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div className={styles.gradient}>综合指标统计表</div>
            {this.selectYear()}
            <Button type="primary" className={styles.exportBtn} onClick={this.exportTable} >导出</Button>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <div>
          <Table columns={columns}
            dataSource={dataSource}
            // bordered={true}
            onChange={this.ontableSort}
            pagination={false} />
        </div>

      </div>
    );
  }
}
export default (StationStatisticList);
