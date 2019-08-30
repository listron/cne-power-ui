import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Modal, Select, Tooltip, Button } from 'antd';
import { getStatus, getInspectSortField } from '../../../../../constants/ticket';
import styles from './inspectTable.scss';
import CommonPagination from '../../../../Common/CommonPagination';

const confirm = Modal.confirm;
const Option = Select.Option;

class InspectTable extends Component {
  static propTypes = {
    inspectList: PropTypes.object,
    inspectStatusStatistics: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    loading: PropTypes.bool,
    status: PropTypes.string,
    selectedRowKeys: PropTypes.array,
    inspectCheckBatch: PropTypes.func,
    onChangeFilter: PropTypes.func,
    changeInspectStore: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    theme: PropTypes.string,
  }

  // static defaultProps={
  //   inspectList: Immutable.fromJS([]),
  //   pageNum: 1,
  // }

  constructor(props) {
    super(props);
    this.state = {
      currentSelectedStatus: 5,
    };
  }

  onAdd = () => {
    this.props.onChangeShowContainer({ container: 'create' });
  }

  onChangeTable = (pagination, filter, sorter) => {
    if (Object.keys(sorter).length > 0) {
      const field = getInspectSortField(sorter.field);
      const order = sorter.order === 'ascend' ? '0' : '1';
      this.props.onChangeFilter({
        sort: field + ',' + order,
      });
    }

  }

  onInspectCheck = () => {
    confirm({
      title: '确认全部验收吗？',
      onOk: () => {
        this.props.inspectCheckBatch({
          inspectId: this.props.selectedRowKeys.join(','),
        });
      },
    });
  }

  onShowDetail = (inspectId) => {
    this.props.changeInspectStore({
      inspectId,
    });
    this.props.onChangeShowContainer({ container: 'detail' });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const status = this.getSelectedRowsStatus(selectedRows);
    this.setState({
      currentSelectedStatus: status,
    });
    this.props.changeInspectStore({ selectedRowKeys });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.props.onChangeFilter({
      pageNum: currentPage,
      pageSize,
    });
  }

  onHandle = (value) => {
    if (value === 'check') {
      this.onInspectCheck();
    }
  }

  getSelectedRowsStatus(selectedRows) {
    const map = {};
    let status;
    for (var i = 0; i < selectedRows.length; i++) {
      if (!map[selectedRows[i].inspectStatus]) {
        map[selectedRows[i].inspectStatus] = 1;
      } else {
        map[selectedRows[i].inspectStatus] += 1;
      }
    }
    const values = [];
    for (var k in map) {
      values.push(map[k]);
      status = k;
    }
    if (values.length === 1) {
      return status;
    }
    return null;

  }

  cancelRowSelect = () => {
    this.props.changeInspectStore({
      selectedRowKeys: [],
    });
  }

  initColumn() {
    const columns = [{
      title: '巡检名称',
      dataIndex: 'inspectName',
      key: 'inspectName',
      sorter: true,
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    }, {
      title: '工单描述',
      dataIndex: 'deviceTypeName',
      key: 'deviceTypeName',
      render: (text, record) => {
        return <div className={styles.inspectDesc} title={text}>{text}</div>;
      },
    }, {
      title: '异常数',
      dataIndex: 'abnormalNum',
      key: 'abnormalNum',
      // sorter: true,
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
    }, {
      title: '完成时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      render: (text, record) => {
        return text ? text : '--';
      },
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'inspectStatus',
      key: 'inspectStatus',
      sorter: true,
      render: (value, record, index) => (
        <div className={styles.inspectStatus} >
          <span>{getStatus(value)}</span>
          <div className={styles.warning} >
            {record.isOvertime === '0' ? <div className={styles.overTime}>超时</div> : null}
          </div>
        </div>
      ),
    }, {
      title: '查看',
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record.inspectId); }} />
        </span>
      ),
    }];
    return columns;
  }

  renderOperation() {
    const { selectedRowKeys } = this.props;
    const { currentSelectedStatus } = this.state;
    const unselected = selectedRowKeys.length === 0;
    const rightHandler = localStorage.getItem('rightHandler');
    const checkInspectRight = rightHandler && rightHandler.split(',').includes('workExamine_inspection_check');
    if (!checkInspectRight) {
      return null;
    }
    return (
      <Select
        onChange={this.onHandle}
        value="操作"
        placeholder="操作"
        getPopupContainer={() => this.refs.wrap}
        dropdownMatchSelectWidth={false}
        dropdownClassName={styles.handleDropdown}>
        <Option value="check" disabled={unselected || currentSelectedStatus !== '3'}>
          <i className="iconfont icon-done"></i>验收</Option>
      </Select>
    );
  }


  render() {
    const { pageSize, pageNum, inspectList, selectedRowKeys, total, loading, theme } = this.props;
    const columns = this.initColumn();

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={`${styles.inspectTable} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.action}>
          <div className={styles.buttonArea}>
            <Button type="add" onClick={this.onAdd} ><i>+</i> 巡检 </Button>
            <div className={styles.operation}>
              {this.renderOperation()}
              <Tooltip overlayStyle={{ width: 220, maxWidth: 220, fontSize: '12px' }} placement="top" title="请选择同一状态下的列表项，进行操作">
                <i className="iconfont icon-help" />
              </Tooltip>
            </div>
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <Table
          rowKey={(record) => { return record.inspectId; }}
          dataSource={inspectList.toJS()}
          columns={columns}
          rowSelection={rowSelection}
          onChange={this.onChangeTable}
          // loading={loading}
          pagination={false}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        {inspectList.size > 0 && <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
          {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
        </div>}
      </div>
    );
  }
}

export default InspectTable;
