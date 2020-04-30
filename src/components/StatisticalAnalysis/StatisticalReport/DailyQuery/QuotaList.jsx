import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CneTable from '@components/Common/Power/CneTable';
import path from '../../../../constants/path';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { dataFormat, handleRight } from '../../../../utils/utilFunc';
import CneButton from '@components/Common/Power/CneButton';
import styles from './dailyQuery.scss';

const { APIBasePath } = path.basePaths;
const { statisticalAnalysis } = path.APISubPaths;

class QuotaList extends Component {
  static propTypes = {
    listParam: PropTypes.object,
    queryParam: PropTypes.object,
    quotaListData: PropTypes.object,
    changeDailyQueryStore: PropTypes.func,
    getQuotaList: PropTypes.func,
    tableLoading: PropTypes.bool,
    exportLoading: PropTypes.bool,
    quotaInfoData: PropTypes.array,
    downLoadFile: PropTypes.func,
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeDailyQueryStore, getQuotaList, listParam, queryParam, quotaInfoData } = this.props;
    const { startDate, endDate, stationCodes } = queryParam;
    const indexCodes = quotaInfoData.map(e => {
      return e.value;
    }).filter(e => {
      return e > 1000;
    });
    const newParam = {
      ...listParam,
      pageSize,
      pageNum: currentPage,
    };
    changeDailyQueryStore({
      ...newParam,
    });
    getQuotaList({
      ...newParam,
      stationCodes,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
      indexCodes,
    });
  }

  onExport = () => { // 列表导出
    const { downLoadFile, queryParam, listParam, quotaInfoData } = this.props;
    const url = `${APIBasePath}${statisticalAnalysis.getExportQuota}`;
    const { startDate, endDate, stationCodes } = queryParam;
    const { pageNum, pageSize } = listParam;
    const indexCodes = quotaInfoData.map(e => {
      return e.value;
    });

    downLoadFile({
      url,
      fileName: '指标列表',
      loadingName: 'exportLoading',
      params: {
        pageNum,
        pageSize,
        stationCodes,
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
        indexCodes,
      },
    });
  }

  render(){
    const { listParam, quotaListData, tableLoading, quotaInfoData, exportLoading } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total = 0, dataList = [] } = quotaListData;
    const dailyOperation = handleRight('dailyQuery_export');

    const otherCol = quotaInfoData.map(e => ({
      title: (e.unit && e.unit !== '%') ? () => (<TableColumnTitle title={e.label} unit={e.unit} style={{ maxWidth: '100%', height: '52px' }} />) : e.label,
      dataIndex: e.name,
      className: 'numberStyle',
      textAlign: 'right',
      render: (text) => <span title={text}>{(dataFormat(text, '--', 2))}{e.unit === '%' && '%'}</span>,
    }));

    const columns = [{
      title: '电站名称',
      width: (otherCol.length > 9) ? 140 : 0,
      dataIndex: 'stationName',
      className: 'stationName',
      textAlign: 'left',
      fixed: (otherCol.length > 9) ? 'left' : 'false',
      render: (text) => <div className="stationNameText" title={text}>{text}</div>,
    }, {
      title: '区域',
      width: (otherCol.length > 9) ? 80 : 0,
      dataIndex: 'regionName',
      className: 'regionName',
      textAlign: 'left',
      fixed: (otherCol.length > 9) ? 'left' : 'false',
      render: (text) => <div className="regionNameText" title={text}>{text}</div>,
    }, {
      title: '时间',
      width: (otherCol.length > 9) ? 120 : 0,
      dataIndex: 'reportDate',
      textAlign: 'center',
      fixed: (otherCol.length > 9) ? 'left' : 'false',
      render: (text) => <div title={text}>{text}</div>,
    }];

    return (
      <div className={styles.quotaList}>
        <div className={styles.pagination}>
        {dailyOperation ?
          <CneButton
          className={dataList.length === 0 ? styles.disabledExport : styles.listExport}
          onClick={this.onExport}
          loading={exportLoading}
          disabled={dataList.length === 0}
          lengthMode="short"
          >导出</CneButton> : <div></div>}
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={total}
            onPaginationChange={this.onPaginationChange}
          />
        </div>

        <CneTable
          loading={tableLoading}
          dataSource={dataList && dataList.map((e, i) => ({ ...e, key: i }))}
          columns={columns.concat(otherCol)}
          pagination={false}
          scroll={(otherCol.length > 9) ? { x: 'max-content' } : {x: 0}}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default QuotaList;
