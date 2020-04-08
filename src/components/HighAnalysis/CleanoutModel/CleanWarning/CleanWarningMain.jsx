

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Footer from '../../../Common/Footer';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';
import CommonPagination from '../../../Common/CommonPagination';
import styles from './cleanStyle.scss';
import CneTable from '@components/Common/Power/CneTable';
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
    getWeather: PropTypes.func,
    theme: PropTypes.string,
    totalStartDay: PropTypes.object,
    totalEndDay: PropTypes.object,
    matrixStartDay: PropTypes.object,
    matrixEndDay: PropTypes.object,
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
    const { field } = sorter || {};
    const { sortField, sortType } = listQueryParams;

    let newField = field, newSort = 1;
    if (!field || (sortField === field)) { // 点击的是正在排序的列
      newField = sortField;
      newSort = sortType === 1 ? 0 : 1; // 交换排序方式
    }
    getCleanWarningList({
      ...listQueryParams,
      sortField: newField,
      sortType: newSort,
    });
  }

  toWarningDetail = record => { // 请求灰尘影响详情，默认30天的全局影响，方阵影响。
    const { totalStartDay, totalEndDay, matrixStartDay, matrixEndDay } = this.props;
    const { stationCode } = record;
    const totalEffectParam = {
      stationCode, endDay: totalEndDay.format('YYYY-MM-DD'), startDay: totalStartDay.format('YYYY-MM-DD'),
    };
    const matrixEffectParam = {
      stationCode, endDay: matrixEndDay.format('YYYY-MM-DD'), startDay: matrixStartDay.format('YYYY-MM-DD'),
    };
    this.props.getWeather({ stationCode });
    this.props.getCleanWarningDetail({ stationCode });
    this.props.getTotalDustEffect(totalEffectParam);
    this.props.getMatrixDustEffect(matrixEffectParam);
  }

  render() {
    const { loading, stations, total, listQueryParams, cleanWarningList, theme } = this.props;
    const { pageSize, pageNum, sortField, sortType } = listQueryParams;
    const sortMethod = sortType === 1 ? 'descend' : 'ascend';
    return (
      <div className={`${styles.cleanWarningMain} ${styles[theme]}`}>
        <div className={styles.mainContent}>
          <FilterCondition
            theme={theme}
            onChange={this.selectStation}
            option={[
              {
                name: '电站名称',
                type: 'stationName',
                typeName: 'stationCodes',
                data: stations.filter(e => e.stationType === 1),
              },
            ]}
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
            <CneTable
              columns={[
                {
                  title: '电站名称',
                  dataIndex: 'stationName',
                  textAlign: 'left',
                  className: styles.stationName,
                  sorter: true,
                }, {
                  title: '灰尘影响占比(%)',
                  dataIndex: 'influencePercent',
                  textAlign: 'right',
                  className: styles.influencePercent,
                  render(text) { return numWithComma(text); },
                  sorter: true,
                }, {
                  title: '距离上次清洗(天)',
                  dataIndex: 'cleanDays',
                  textAlign: 'right',
                  className: styles.cleanDays,
                  render(text) { return numWithComma(text); },
                  sorter: true,
                }, {
                  title: '本次预警时间',
                  dataIndex: 'warningTime',
                  className: styles.warningTime,
                  textAlign: 'center',
                }, {
                  title: '查看',
                  dataIndex: 'handle',
                  className: styles.handle,
                  textAlign: 'center',
                  render: (text, record) => <span onClick={() => this.toWarningDetail(record)} className="iconfont icon-look" />,
                },
              ]}
              sortField={sortField}
              sortMethod={sortMethod}
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
