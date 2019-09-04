

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import moment from 'moment';
import Footer from '../../../Common/Footer';
import FilterCondition from '../../../Common/FilterCondition/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './cleanStyle.scss';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { numWithComma } from '../../../../utils/utilFunc';

class CleanWarningMain extends Component { // 电站管理列表页
  static propTypes = {
    loading: PropTypes.bool,
    listQueryParams: PropTypes.object,
    total: PropTypes.number,
    stations: PropTypes.array,
    cleanWarningList: PropTypes.array,
    getCleanWarningList: PropTypes.func,
    getCleanWarningDetail: PropTypes.func,
    getTotalDustEffect: PropTypes.func,
    getMatrixDustEffect: PropTypes.func,
    changeCleanWarningStore: PropTypes.func,
    getWeather: PropTypes.func,
    theme: PropTypes.string,
  }

  componentDidMount() {
    const { listQueryParams, getCleanWarningList } = this.props;
    getCleanWarningList(listQueryParams); // 默认请求
  }

  selectStation = ({ stationCodes }) => { // 选择电站
    const { listQueryParams, getCleanWarningList } = this.props;
    getCleanWarningList({
      ...listQueryParams,
      stationCodes,
    });
  }

  paginationChange = ({ pageSize, currentPage }) => { // 分页器触发
    const { listQueryParams, getCleanWarningList } = this.props;
    getCleanWarningList({
      ...listQueryParams,
      pageNum: currentPage,
      pageSize,
    });
  }

  tableSort = (pagination, filters, sorter) => { // 表格排序
    const { listQueryParams, getCleanWarningList } = this.props;
    const { field, order } = sorter;
    if (!field) { // 无排序 => 恢复默认灰尘占比降序排列
      getCleanWarningList({
        ...listQueryParams,
        sortField: 'influencePercent',
        sortType: 1,
      });
    } else { // 按照指定排序规则请求列表数据
      getCleanWarningList({
        ...listQueryParams,
        sortField: field,
        sortType: order === 'descend' ? 1 : 0,
      });
    }
  }

  toWarningDetail = record => { // 请求灰尘影响详情，默认30天的全局影响，方阵影响。
    const endDay = moment().format('YYYY-MM-DD');
    const startDay = moment().subtract(30, 'day').format('YYYY-MM-DD');
    const { stationCode } = record;
    const effectParam = {
      stationCode, endDay, startDay,
    };
    this.props.getWeather({ stationCode });
    this.props.getCleanWarningDetail({ stationCode });
    this.props.getTotalDustEffect(effectParam);
    this.props.getMatrixDustEffect(effectParam);
  }

  render() {
    const { loading, stations, total, listQueryParams, cleanWarningList, theme } = this.props;
    const { pageSize, pageNum } = listQueryParams;
    return (
      <div className={`${styles.cleanWarningMain} ${styles[theme]}`}>
        <div className={styles.mainContent}>
          <FilterCondition
            stations={stations.filter(e => e.stationType === 1)}
            onChange={this.selectStation}
            option={['stationName']}
            theme={theme}
          />
          <div className={styles.wrap}>
            <div className={styles.pagination}>
              <CommonPagination
                total={total}
                pageSize={pageSize}
                currentPage={pageNum}
                onPaginationChange={this.paginationChange}
                theme={theme}
              />
            </div>
            <Table
              columns={[
                {
                  title: '电站名称',
                  dataIndex: 'stationName',
                  sorter: true,
                }, {
                  title: () => <TableColumnTitle title="灰尘影响占比" unit="%" />,
                  dataIndex: 'influencePercent',
                  render(text) { return numWithComma(text); },
                  sorter: true,
                }, {
                  title: () => <TableColumnTitle title="距离上次清洗" unit="天" />,
                  dataIndex: 'cleanDays',
                  render(text) { return numWithComma(text); },
                  sorter: true,
                }, {
                  title: '本次预警时间',
                  dataIndex: 'warningTime',
                  // sorter: true,
                }, {
                  title: '查看',
                  dataIndex: 'handle',
                  render: (text, record) => <span onClick={() => this.toWarningDetail(record)} className="iconfont icon-look" />,
                },
              ]}
              loading={loading}
              pagination={false}
              dataSource={cleanWarningList.map((e, i) => ({ ...e, key: i }))}
              onChange={this.tableSort}
              locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
            />
          </div>

        </div>
        <Footer />
      </div>
    );
  }
}

export default CleanWarningMain;
