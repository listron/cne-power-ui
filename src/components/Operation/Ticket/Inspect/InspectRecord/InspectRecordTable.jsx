import { Modal, Select, Table } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { getInspectSortField, getStatus } from '../../../../../constants/ticket';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './inspectRecord.scss';

const confirm = Modal.confirm;
const Option = Select.Option;

class InspectRecordTable extends Component {
  static propTypes = {
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
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSelectedStatus: 5,
    }
  }

  onAdd = () => {
    this.props.onChangeShowContainer({ container: 'create' });
  }

  onChangeTable = (pagination, filter, sorter) => {
    if (Object.keys(sorter).length > 0) {
      const field = getInspectSortField(sorter.field);
      const order = sorter.order === 'ascend' ? '0' : '1';
      this.props.onChangeFilter({
        sort: field + ',' + order
      });
    }

  }

  onInspectCheck = () => {
    confirm({
      title: '确认全部验收吗？',
      onOk: () => {
        this.props.inspectCheckBatch({
          inspectId: this.props.selectedRowKeys.join(',')
        });
      },
    });
  }

  onShowDetail = (inspectId) => {
    this.props.changeInspectStore({
      inspectId
    });
    this.props.onChangeShowContainer({ container: 'detail' });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let status = this.getSelectedRowsStatus(selectedRows);
    this.setState({
      currentSelectedStatus: status
    });
    this.props.changeInspectStore({ selectedRowKeys });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.props.onChangeFilter({
      pageNum: currentPage,
      pageSize
    });
  }

  onHandle = (value) => {
    if (value === 'check') {
      this.onInspectCheck();
    }
  }

  getSelectedRowsStatus(selectedRows) {
    let map = {};
    let status;
    for (var i = 0; i < selectedRows.length; i++) {
      if (!map[selectedRows[i].inspectStatus]) {
        map[selectedRows[i].inspectStatus] = 1;
      } else {
        map[selectedRows[i].inspectStatus] += 1;
      }
    }
    let values = [];
    for (var k in map) {
      values.push(map[k]);
      status = k;
    }
    if (values.length === 1) {
      return status;
    } else {
      return null;
    }
  }

  cancelRowSelect = () => {
    this.props.changeInspectStore({
      selectedRowKeys: []
    });
  }

  initColumn() {
    const columns = [{
      title: '参与人名称',
      dataIndex: 'inspectName',
      key: 'inspectName',
      sorter: true,
    }, {
      title: '记录时间',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
    },  {
      title: '巡检状态',
      dataIndex: 'abnormalNum',
      key: 'abnormalNum',
      // sorter: true,
    }, {
      title: '异常设备类型',
      dataIndex: 'startTime',
      key: 'startTime',
      // sorter: true,
    }, {
      title: '异常设备名称',
      dataIndex: 'checkTime',
      key: 'checkTime',
      render: (text, record) => {
        return text ? text : '--'
      },
      // sorter: true,
    },{
      title: '缺陷类型',
      dataIndex: '1',
      key: '1',
      render: (text, record) => {
        return text ? text : '--'
      },
      // sorter: true,
    },{
      title: '缺陷描述',
      dataIndex: '22',
      key: '22',
      render: (text, record) => {
        return text ? text : '--'
      },
      // sorter: true,
    },  {
      title: '查看照片',
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record.inspectId) }} />
        </span>
      ),
    }];
    return columns;
  }

  renderOperation() {
    const { selectedRowKeys } = this.props;
    const { currentSelectedStatus } = this.state;
    const unselected = true;
    // const unselected = selectedRowKeys.length===0;
    const rightHandler = localStorage.getItem('rightHandler');
    const checkInspectRight = rightHandler && rightHandler.split(',').includes('workExamine_inspection_check');
    if (!checkInspectRight) {
      return null;
    }
    return (
      <Select onChange={this.onHandle} value="操作" placeholder="操作" dropdownMatchSelectWidth={false} dropdownClassName={styles.handleDropdown}>
        <Option value="check" disabled={unselected || currentSelectedStatus !== '3'}>
          <i className="iconfont icon-done"></i>验收</Option>
      </Select>
    );
  }


  render() {
    const { pageSize, pageNum, inspectList, selectedRowKeys, total, loading } = this.props;
    const columns = this.initColumn();

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div className={styles.inspectTable}>
        <div className={styles.action}>
       <div></div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          rowKey={(record) => { return record.inspectId }}
          dataSource={[]}
          // dataSource={inspectList.toJS()}
          columns={columns}
          //rowSelection={rowSelection}
          onChange={this.onChangeTable}
          loading={loading}
          pagination={false}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        <div className={styles.tableFooter}>
          <span className={styles.info}>当前选中<span className={styles.totalNum}>{0}</span>项</span>
          <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>
        </div>
      </div>
    );
  }
}

export default InspectRecordTable;