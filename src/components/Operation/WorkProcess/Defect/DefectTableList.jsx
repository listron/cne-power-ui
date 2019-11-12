import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import CommonPagination from '@components/Common/CommonPagination';
import { Table, Icon, Modal, Select, Tooltip, Button } from 'antd';
const confirm = Modal.confirm;
const Option = Select.Option;


class DefectTabelList extends Component {
  static propTypes = {
    theme: PropTypes.string,
  };

  constructor(props, context) {
    super(props);
    this.state = {};
  }



  componentDidMount() {

  }

  onPaginationChange = () => {

  }

  onSelectChange = () => {

  }


  initColumn = () => { // 初始的列表头
    const columns = [{
      title: '缺陷分类',
      dataIndex: 'defectTypeNames',
      key: 'defectTypeNames',
      sorter: true,
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      sorter: true,
    }, {
      title: '缺陷类型',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
      sorter: true,
      render: (text, record) => {
        return <div className={styles.overText} title={text}>{text || '--'}</div>;
      },
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
      render: (text, record) => {
        return <div className={styles.overText} title={text || '--'}>{text}</div>;
      },
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
    }, {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      render: (text, record) => { return text ? text : '--'; },
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'defectStatus',
      key: 'defectStatus',
      sorter: true,
      render: (value, record) => (
        <div className={styles.defectStatus}>
          <span>{['待提交', '待审核', '执行中', '待验收', '已完成'](value)}</span>
          <div className={styles.warning}>
            {record.isOvertime === '0' && <div className={styles.overTime}>超时</div>}
            {record.isCoordination === '0' && <div className={styles.coordinate}>协调</div>}
          </div>
        </div>
      ),
    }, {
      title: '查看',
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record); }} />
        </span>
      ),
    }];
    return columns;
  }

  render() {
    const { defectListData, selectedRowKeys, total, listLoading = false, theme, listParams } = this.props;
    const { pageSize, pageNum } = listParams;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={`${styles.defectTable} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.action}>
          <div className={styles.buttonArea}>
            <Button className={styles.addDefect} type="add" onClick={this.onAdd} ><i>+</i> 缺陷 </Button>
            {/* <div className={styles.operation}>
              {this.renderOperation()}
              <Tooltip overlayStyle={{ width: 220, maxWidth: 220, fontSize: '12px' }} placement="top" title="请选择同一状态下的列表项，进行操作">
                <i className="iconfont icon-help" />
              </Tooltip>
            </div> */}
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <Table
          rowSelection={rowSelection}
          dataSource={defectListData.map((e, i) => ({ ...e, key: e.defectId }))}
          columns={this.initColumn()}
          pagination={false}
          loading={listLoading}
          onChange={this.tableChange}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
        {defectListData.length > 0 &&
          <div className={styles.tableFooter}>
            <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
            {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
          </div>}
      </div>
    );
  }
}

export default DefectTabelList;
