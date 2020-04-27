import React from 'react';
import PropTypes from 'prop-types';
import CommonPagination from '@components/Common/CommonPagination';
import CneTable from '@components/Common/Power/CneTable';
import moment from 'moment';

import styles from './eam.scss';

export default class EamTable extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
    tableLoading: PropTypes.bool,
    history: PropTypes.object,
    eamTableData: PropTypes.object,
    getEamList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    workOrderType: PropTypes.string,
    changeStore: PropTypes.func,
    selectedStation: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollFlag: false,
    };
  }

  componentDidMount () {
    const eamTable = document.getElementById('eamTable');
    eamTable.addEventListener('scroll', this.bindScroll);
  }

  componentWillUnmount() { // 卸载的时候要注意
    const eamTable = document.getElementById('eamTable');
    eamTable && eamTable.removeEventListener('scroll', this.bindScroll, false);
  }

  bindScroll = () => {
    const eamTable = document.getElementById('eamTable');
    const scrollTop = eamTable.scrollTop;
    const { scrollFlag } = this.state;
    if (scrollTop > 0 && !scrollFlag) {
      this.setState({
        scrollFlag: !scrollFlag,
      });
    }
    if (scrollTop === 0) {
      this.setState({
        scrollFlag: false,
      });
    }
  };

  // 分页
  onPaginationChange = ({ currentPage, pageSize }) => {
    const { changeStore, getEamList, startTime, endTime, workOrderType, selectedStation } = this.props;
    changeStore({
      pageNum: currentPage,
      pageSize,
    });
    // 获取EAM列表
    getEamList({
      workOrderType,
      startTime,
      endTime,
      pageNum: currentPage,
      pageSize,
      stationNames: selectedStation.map(cur => cur.stationCode),
    });
  };

  // 详情
  detailsFunc = (workOrderNo) => {
    const { history } = this.props;
    workOrderNo && history.push(`/operation/eamDetails?workOrderNo=${workOrderNo}`);
  };

  render() {
    const { scrollFlag } = this.state;
    const {
      pageSize,
      pageNum,
      theme,
      tableLoading,
      eamTableData: {
        pageCount,
        dataList,
      },
    } = this.props;

    const { clientHeight, clientWidth } = document.body;

    const tableWidth = clientWidth - 228;
    // footer 60; handler: 51; search 63; padding 15; menu 40;
    const tableHeight = clientHeight - 229;
    const listColumn = [
      {
        title: '项目公司',
        dataIndex: 'companyName',
        render: (text) => (<div className={styles.projectCompany} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '电场（站）名称',
        dataIndex: 'stationName',
        render: (text) => (<div className={styles.stationName} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单编号',
        dataIndex: 'workOrderNo',
        render: (text) => (<div className={styles.workCode} onClick={() => this.detailsFunc(text)} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单描述',
        dataIndex: 'workOrderDesc',
        render: (text) => (<div className={styles.workDesc} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备编码',
        dataIndex: 'assetNum',
        render: (text) => (<div className={styles.deviceCode} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备资产名称',
        dataIndex: 'assetName',
        render: (text) => (<div className={styles.deviceName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单类型',
        dataIndex: 'workOrderType',
        render: (text) => (<div className={styles.workProcessType} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '创建人',
        dataIndex: 'createName',
        render: (text) => (<div className={styles.creatName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.creatTimeName} title={text || ''} >{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text) => (<div className={styles.statusName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工作负责人',
        dataIndex: 'operName',
        render: (text) => (<div className={styles.dutyName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '属于子工单',
        dataIndex: 'isChild',
        align: 'center',
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.childName} title={text === null ? '' : (text === '1' ? '是' : '否')} >{text === null ? '' : (text === '1' ? '是' : '否')}</div>),
      },
      {
        title: '主工单编号',
        dataIndex: 'masterWorkOrderNo',
        render: (text) => (<div className={styles.mainName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单专业',
        dataIndex: 'woprofess',
        render: (text) => (<div className={styles.workMajor} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '是否领料',
        dataIndex: 'isPick',
        align: 'center',
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.isGetName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单关闭时间',
        dataIndex: 'closeTime',
        align: 'center',
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.closeTime} title={text || ''} >{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '- -'}</div>),
      },
    ];
    return (
      <div className={styles.searchTable}>
        <div className={styles.searchPage}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={Number(pageCount)} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <div id="eamTable" style={{width: tableWidth, height: tableHeight, position: 'relative', overflow: 'auto'}}>
          <CneTable
            loading={tableLoading}
            columns={listColumn}
            className={scrollFlag ? styles.tableScrollStyles : styles.tableStyles}
            dataSource={dataList}
            rowKey={(record, index) => index || 'key'}
            pagination={false}
            locale={{ emptyText: tableLoading ? <div style={{width: 223, height: 164}} /> : <img width="223" height="164" src="/img/nodata.png" alt="" /> }}
          />
        </div>
      </div>
    );
  }
}
