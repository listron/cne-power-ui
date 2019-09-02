import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Button, Table, Icon } from 'antd';
import path from '../../../../constants/path';
import CommonPagination from '../../../Common/CommonPagination';
import TableColumnTitle from '../../../Common/TableColumnTitle';
import { dataFormat } from '../../../../utils/utilFunc';
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
    loading: PropTypes.bool,
    quotaInfoData: PropTypes.array,
    downLoadFile: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      exportLoading: false,
    };
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeDailyQueryStore, getQuotaList, listParam, queryParam, quotaInfoData } = this.props;
    const { startDate, endDate, stationCodes } = queryParam;
    const indexCodes = quotaInfoData.map(e => {
      return e.value;
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
      startDate,
      endDate,
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

    this.setState({
      exportLoading: true,
    });

    setTimeout(() => {
      this.setState({
        exportLoading: false,
      });
    }, 1000);

    downLoadFile({
      url,
      fileName: '指标列表',
      params: {
        pageNum,
        pageSize,
        stationCodes,
        startDate,
        endDate,
        indexCodes,
      },
    });
  }

  render(){
    const { exportLoading } = this.state;
    const { listParam, quotaListData, tableLoading, quotaInfoData } = this.props;
    const { pageNum, pageSize } = listParam;
    const { total = 0, dataList = [] } = quotaListData;

    const otherCol = quotaInfoData.map(e => ({
      title: (e.unit && e.unit !== '%') ? () => (<TableColumnTitle title={e.label} unit={e.unit} style={{ maxWidth: '100%', height: '52px' }} />) : e.label,
      dataIndex: e.name,
      className: 'numberStyle',
      render: (text) => <span title={text}>{(dataFormat(text, '--', 2))}{e.unit === '%' && `%`}</span>,
    }));

    const columns = [{
      title: '电站名称',
      width: (otherCol.length > 9) ? 140 : 0,
      dataIndex: 'stationName',
      className: 'stationName',
      fixed: (otherCol.length > 9) ? 'left' : 'false',
      render: (text) => <span title={text}>{text}</span>,
    }, {
      title: '区域',
      width: (otherCol.length > 9) ? 80 : 0,
      dataIndex: 'regionName',
      className: 'regionName',
      fixed: (otherCol.length > 9) ? 'left' : 'false',
      render: (text) => <span title={text}>{text}</span>,
    }, {
      title: '时间',
      width: (otherCol.length > 9) ? 120 : 0,
      dataIndex: 'reportDate',
      className: 'reportDate',
      fixed: (otherCol.length > 9) ? 'left' : 'false',
      render: (text) => <span title={text}>{text}</span>,
    }];

    return (
      <div className={otherCol.length > 9 ? styles.listFixed : styles.quotaList}>
        <div className={styles.pagination}>
          <Button className={dataList.length === 0 ? styles.disabledExport : styles.listExport} onClick={this.onExport} disabled={dataList.length === 0}>{exportLoading && <Icon type="loading" style={{ fontSize: 16 }} spin />}导出</Button>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={total}
            onPaginationChange={this.onPaginationChange}
          />
        </div>

        <Table
          loading={tableLoading}
          dataSource={dataList && dataList.map((e, i) => ({ ...e, key: i }))}
          columns={columns.concat(otherCol)}
          pagination={false}
          scroll={(otherCol.length > 9) ? { x: 3500 } : {x: 0}}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
      </div>
    );
  }
}

export default QuotaList;
