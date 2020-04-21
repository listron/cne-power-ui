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
  };

  // 分页
  onPaginationChange = () => {};

  render() {
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
    // footer 60; thead: 36, handler: 51; search 63; padding 15; menu 40;
    const tableHeight = clientHeight - 265;

    console.log(tableWidth, 'tableWidth');

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
        render: (text) => (<div className={styles.workCode} title={text || ''} >{text || '- -'}</div>),
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
        className: styles.noPaddingBox,
        render: (text) => (<div className={styles.closeTime} title={text || ''} >{text || '- -'}</div>),
      },
    ];
    return (
      <div className={styles.searchTable}>
        <div className={styles.searchPage}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={pageCount} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        {/*<div style={{width: tableWidth, overflowX: 'auto'}}>*/}
          {/*<CneTable*/}
            {/*loading={tableLoading}*/}
            {/*onChange={this.tableChange}*/}
            {/*columns={listColumn}*/}
            {/*className={styles.tableStyles}*/}
            {/*dataSource={eamListData}*/}
            {/*rowKey={(record, index) => index || 'key'}*/}
            {/*// scroll={{y: tableHeight}}*/}
            {/*pagination={false}*/}
            {/*locale={{ emptyText: tableLoading ? <div style={{width: 223, height: 164}} /> : <img width="223" height="164" src="/img/nodata.png" alt="" /> }}*/}
          {/*/>*/}
        {/*</div>*/}
        <CneTable
          loading={tableLoading}
          onChange={this.tableChange}
          columns={listColumn}
          className={styles.tableStyles}
          dataSource={eamListData}
          rowKey={(record, index) => index || 'key'}
          scroll={{y: tableHeight}}
          pagination={false}
          locale={{ emptyText: tableLoading ? <div style={{width: 223, height: 164}} /> : <img width="223" height="164" src="/img/nodata.png" alt="" /> }}
        />
      </div>
    );
  }
}
