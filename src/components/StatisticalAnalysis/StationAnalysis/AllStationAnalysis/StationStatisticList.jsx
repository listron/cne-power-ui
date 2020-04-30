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
import CneTable from '../../../Common/Power/CneTable';
import CneButton from '../../../Common/Power/CneButton';

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
    const { getAllStationStatisticTableData, stationType, year, month, powerSelectYear, dateType, pageSize, pageNum, sort, sortType } = this.props;
    const { field } = sorter;
    let newSort = sort, newSortType = 'asc';
    if (!field || sort === field) {
      newSortType = sortType === 'asc' ? 'desc' : 'asc';
    } else {
      newSort = field;
    }
    const prams = {
      pageNum,
      pageSize,
      year: dateType === 'month' ? year[0] : powerSelectYear,
      stationType,
      month,
      dateType,
      sort: newSort,
      sortType: newSortType,
    };
    getAllStationStatisticTableData(prams);
    this.props.changeAllStationStore({ sort: newSort, sortType: newSortType });
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
    getAllStationStatisticTableData({
      year: year[0],
      dateType,
      month: changeMonth,
      pageNum: 1, // 当前页
      pageSize: 10, // 每页条数
      sortType,
      sort,
      stationType,
    });
  }

  handleYearTime = (e) => { // 选择年
    const changeYear = Number(e.target.value);
    const { getAllStationStatisticTableData, dateType, pageNum, pageSize, sortType, sort, stationType, changeAllStationStore } = this.props;
    getAllStationStatisticTableData({
      year: changeYear,
      dateType,
      pageNum: 1, // 当前页
      pageSize: 10, // 每页条数
      sortType,
      sort,
      stationType,
    });
    changeAllStationStore({ powerSelectYear: changeYear });
  }

  selectYear() { // 计划完成选择年份
    const { allStationAvalibaData, dateType, powerSelectMonth, powerSelectYear } = this.props;
    if (dateType === 'year' && allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={`${powerSelectYear}`} onChange={this.handleYearTime}>
          {allStationAvalibaData.map((e, index) => {
            return <Radio.Button value={e.year} key={index} className={`${!e.isTrue && styles.disabled} ${styles.selectButton}`}>{e.year}</Radio.Button>;
          })}
        </Radio.Group>
      );
    } else if (allStationAvalibaData.length > 0) {
      return (
        <Radio.Group value={+powerSelectMonth} onChange={this.handleTime}>
          {allStationAvalibaData.map((e, index) => {
            const flag = e.isTrue === true || +e.year === moment().month() + 1;
            return <Radio.Button value={e.year} key={index} className={`${!flag && styles.disabled} ${styles.selectButton}`}>{e.year}月</Radio.Button>;
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
    const baseColumn = [{
      title: '电站名称',
      dataIndex: 'stationName',
      textAlign: 'left',
      width: '10%',
      onFilter: (value, record) => record.stationName.indexOf(value) === 0,
      sorter: true,
      render: (value, record) => {
        return (
          <a href={`#/statistical/stationaccount/allstation/${record.key}`} onClick={() => this.selectStation(record)}>
            <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
          </a >);
      },
    }, {
      title: '区域',
      dataIndex: 'region',
      sorter: true,
      textAlign: 'left',
      width: '8%',
      render: (value, record, index) => <div className={styles.region}>{record.region}</div>,
    }, {
      title: () => <TableColumnTitle title="月发电量" unit="万kWh" />,
      dataIndex: 'genValid',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="月计划" unit="万kWh" />,
      dataIndex: 'planGen',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="计划完成率" unit="%" />,
      dataIndex: 'planGenRate',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
      defaultSortOrder: 'ascend',
    }, {
      title: () => <TableColumnTitle title="发电量同比" unit="%" />,
      dataIndex: 'powerRate',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="辐射总量" unit="MJ/m²" />,
      dataIndex: 'resourceValue',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="资源同比" unit="%" />,
      dataIndex: 'resourceRate',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }];
    const lastBaseColumn = [{
      title: () => <TableColumnTitle title="PR" unit="%" />,
      dataIndex: 'pr',
      sorter: true,
      textAlign: 'right',
      width: '6%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="损失电量" unit="万kWh" />,
      dataIndex: 'lostPower',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="损失电量等效时" unit="h" />,
      dataIndex: 'limitPowerHours',
      sorter: true,
      textAlign: 'right',
      width: '10%',
      render(text) { return numWithComma(text); },
    }];
    const equivalentHours = {
      title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
      dataIndex: 'equivalentHours',
      sorter: true,
      textAlign: 'right',
      width: '10%',
      render(text) { return numWithComma(text); },
    };
    return enterpriseId !== '451436467886592' ? [...baseColumn, equivalentHours, ...lastBaseColumn] : [...baseColumn, ...lastBaseColumn];
  }
  //年table表
  initYearColumn = () => {
    const enterpriseId = Cookie.get('enterpriseId');
    const baseColumn = [{
      title: '电站名称',
      dataIndex: 'stationName',
      className: styles.stationName,
      textAlign: 'left',
      width: '10%',
      onFilter: (value, record) => record.stationName.indexOf(value) === 0,
      sorter: true,
      render: (value, record) => {
        return (
          <a href={`#/statistical/stationaccount/allstation/${record.key}`} onClick={() => this.selectStation(record)}>
            <div title={record.stationName} className={styles.stationName}>{record.stationName}</div>
          </a >);
      },
    }, {
      title: '区域',
      dataIndex: 'region',
      sorter: true,
      textAlign: 'left',
      width: '8%',
      render: (value, record, index) => <div className={styles.region}>{record.region}</div>,
    }, {
      title: () => <TableColumnTitle title="年发电量" unit="万kWh" />,
      dataIndex: 'genValid',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="年计划" unit="万kWh" />,
      dataIndex: 'planGen',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="计划完成率" unit="%" />,
      dataIndex: 'planGenRate',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
      defaultSortOrder: 'ascend',
    }, {
      title: () => <TableColumnTitle title="发电量环比" unit="%" />,
      dataIndex: 'powerRate',
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
      sorter: true,
    }, {
      title: () => <TableColumnTitle title="辐射总量" unit="MJ/m²" />,
      dataIndex: 'resourceValue',
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
      sorter: true,
    }, {
      title: () => <TableColumnTitle title="资源环比" unit="%" />,
      dataIndex: 'resourceRate',
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
      sorter: true,
    }];
    const LastBaseColumn = [{
      title: () => <TableColumnTitle title="PR" unit="%" />,
      dataIndex: 'pr',
      textAlign: 'right',
      width: '6%',
      render(text) { return numWithComma(text); },
      sorter: true,
    }, {
      title: () => <TableColumnTitle title="损失电量" unit="万kWh" />,
      dataIndex: 'lostPower',
      sorter: true,
      textAlign: 'right',
      width: '8%',
      render(text) { return numWithComma(text); },
    }, {
      title: () => <TableColumnTitle title="损失电量等效时" unit="h" />,
      dataIndex: 'limitPowerHours',
      textAlign: 'right',
      width: '10%',
      render(text) { return numWithComma(text); },
      sorter: true,
    }];
    const equivalentHours = { // 因为普洛斯项目暂时需要将等效小时数去掉
      title: () => <TableColumnTitle title="等效利用小时数" unit="h" />,
      dataIndex: 'equivalentHours',
      textAlign: 'right',
      width: '10%',
      render(text) { return numWithComma(text); },
      sorter: true,
    };
    return enterpriseId !== '451436467886592' ? [...baseColumn, equivalentHours, ...LastBaseColumn] : [...baseColumn, ...LastBaseColumn];
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
    const { dateType, allStationStatisticTableData, totalNum, pageSize, pageNum, theme, sort, sortType } = this.props;
    const columns = dateType === 'month' ? this.initMonthColumn() : this.initYearColumn();
    const dataSource = allStationStatisticTableData.map((e, i) => ({ ...e, key: i }));
    return (
      <div className={`${styles.stationStatisticList} ${styles[theme]}`}>
        <div className={styles.stationStatisticFilter}>
          <div className={styles.leftTime}>
            <div className={styles.gradient}>综合指标统计表</div>
            {this.selectYear()}
            <CneButton onClick={this.exportTable} className={styles.exportBtn}>导出</CneButton>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <div>
          <CneTable columns={columns}
            dataSource={dataSource}
            // bordered={true}
            onChange={this.ontableSort}
            pagination={false}
            sortMethod={{ 'desc': 'descend', 'asc': 'ascend' }[sortType]}
            sortField={sort}
          />
        </div>

      </div>
    );
  }
}
export default (StationStatisticList);
