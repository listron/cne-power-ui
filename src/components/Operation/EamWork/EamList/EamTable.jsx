import React from 'react';
import PropTypes from 'prop-types';
import CommonPagination from '@components/Common/CommonPagination';
import CneTable from '@components/Common/Power/CneTable';

import styles from './eam.scss';

export default class EamTable extends React.Component {
  static propTypes = {
    eamListData: PropTypes.array,
    theme: PropTypes.string,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    pageCount: PropTypes.number,
    tableLoading: PropTypes.bool,
    history: PropTypes.object,
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
  onPaginationChange = () => {};

  // 详情
  detailsFunc = (code) => {
    const { history } = this.props;
    code && history.push('/operation/eamDetails');
  };

  render() {
    const { scrollFlag } = this.state;
    const {
      eamListData,
      pageSize,
      pageNum,
      pageCount,
      theme,
      tableLoading,
    } = this.props;

    const { clientHeight, clientWidth } = document.body;

    const tableWidth = clientWidth - 228;
    // footer 60; handler: 51; search 63; padding 15; menu 40;
    const tableHeight = clientHeight - 229;
    const listColumn = [
      {
        title: '项目公司',
        dataIndex: '1',
        render: (text) => (<div className={styles.projectCompany} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '电场（站）名称',
        dataIndex: '2',
        render: (text) => (<div className={styles.stationName} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单编号',
        dataIndex: '3',
        render: (text) => (<div className={styles.workCode} onClick={() => this.detailsFunc(text)} title={text || ''} >{text || '- -'}</div>),
      }, {
        title: '工单描述',
        dataIndex: '4',
        render: (text) => (<div className={styles.workDesc} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备编码',
        dataIndex: '5',
        render: (text) => (<div className={styles.deviceCode} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '设备资产名称',
        dataIndex: '6',
        render: (text) => (<div className={styles.deviceName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单类型',
        dataIndex: '7',
        render: (text) => (<div className={styles.workProcessType} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '创建人',
        dataIndex: '8',
        render: (text) => (<div className={styles.creatName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '创建时间',
        dataIndex: '9',
        align: 'center',
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.creatTimeName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '状态',
        dataIndex: '10',
        render: (text) => (<div className={styles.statusName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工作负责人',
        dataIndex: '11',
        render: (text) => (<div className={styles.dutyName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '属于子工单',
        dataIndex: '12',
        render: (text) => (<div className={styles.childName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '主工单编号',
        dataIndex: '13',
        render: (text) => (<div className={styles.mainName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单专业',
        dataIndex: '14',
        render: (text) => (<div className={styles.workMajor} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '是否领料',
        dataIndex: '15',
        align: 'center',
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.isGetName} title={text || ''} >{text || '- -'}</div>),
      },
      {
        title: '工单关闭时间',
        dataIndex: '16',
        align: 'center',
        width: 150,
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.closeTime} title={text || ''} >{text || '- -'}</div>),
      },
    ];
    return (
      <div className={styles.searchTable}>
        <div className={styles.searchPage}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={pageCount} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <div id="eamTable" style={{width: tableWidth, height: tableHeight, position: 'relative', overflow: 'auto'}}>
          <CneTable
            loading={tableLoading}
            columns={listColumn}
            className={scrollFlag ? styles.tableScrollStyles : styles.tableStyles}
            dataSource={eamListData}
            rowKey={(record, index) => index || 'key'}
            pagination={false}
            locale={{ emptyText: tableLoading ? <div style={{width: 223, height: 164}} /> : <img width="223" height="164" src="/img/nodata.png" alt="" /> }}
          />
        </div>
      </div>
    );
  }
}
