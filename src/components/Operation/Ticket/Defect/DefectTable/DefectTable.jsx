import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Modal, Select, Tooltip, Button } from 'antd';
import { getLevel, getStatus, getDefectSortField } from '../../../../../constants/ticket';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './defectTable.scss';

const confirm = Modal.confirm;
const Option = Select.Option;

class DefectTable extends Component {
  static propTypes = {
    onChangeFilter: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
    onBatchDelete: PropTypes.func,
    onBatchSend: PropTypes.func,
    onBatchReject: PropTypes.func,
    onBatchClose: PropTypes.func,
    onBatchCheck: PropTypes.func,
    defectList: PropTypes.array,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    defectStatusStatistics: PropTypes.object,
    loading: PropTypes.bool,
    status: PropTypes.string,
    selectedRowKeys: PropTypes.array,
    changeDefectStore: PropTypes.func,
    getDefectDetail: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSelectedStatus: 5,
    };
  }

  onAdd = () => { // 添加新的缺陷
    this.props.onChangeShowContainer({ container: 'create' });
  }

  onDelete = () => { // 删除
    confirm({
      title: '确认删除此缺陷',
      onOk: () => {
        this.props.onBatchDelete({
          defectId: this.props.selectedRowKeys.join(','),
        });
      },
    });
  }

  onSend = () => { // 下发
    confirm({
      title: '确认下发此缺陷',
      onOk: () => {
        this.props.onBatchSend({
          defectId: this.props.selectedRowKeys.join(','),
        });
      },
    });
  }

  onReject = () => { // 驳回此缺陷
    confirm({
      title: '确认驳回此缺陷',
      onOk: () => {
        this.props.onBatchReject({
          defectId: this.props.selectedRowKeys.join(','),
        });
      },
    });
  }

  onClose = () => { // 关闭缺陷
    confirm({
      title: '确认关闭此缺陷',
      onOk: () => {
        this.props.onBatchClose({
          defectId: this.props.selectedRowKeys.join(','),
        });
      },
    });
  }

  onOk = () => { // 验收合格
    confirm({
      title: '确认验收此缺陷为合格',
      onOk: () => {
        this.props.onBatchCheck({
          defectId: this.props.selectedRowKeys.join(','),
          checkResult: '0',
        });
      },
    });
  }

  onNotOk = () => { // 验收不合格
    confirm({
      title: '确认验收此缺陷为不合格',
      onOk: () => {
        this.props.onBatchCheck({
          defectId: this.props.selectedRowKeys.join(','),
          checkResult: '1',
        });
      },
    });
  }

  onShowDetail = (defect) => { // 查看此条缺陷的详细信息
    this.props.changeDefectStore({
      defectId: defect.defectId,
    });
    if (defect.defectStatus === '0') {
      this.props.getDefectDetail({ defectId: defect.defectId });
      this.props.onChangeShowContainer({ container: 'edit' });
    } else {
      this.props.onChangeShowContainer({ container: 'detail' });
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const status = this.getSelectedRowsStatus(selectedRows);
    this.setState({
      currentSelectedStatus: status,
    });
    this.props.changeDefectStore({ selectedRowKeys });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    this.props.onChangeFilter({
      pageNum: currentPage,
      pageSize,
    });
  }

  onHandle = (value) => {
    if (value === 'send') {
      this.onSend();
    } else if (value === 'close') {
      this.onClose();
    } else if (value === 'reject') {
      this.onReject();
    } else if (value === 'ok') {
      this.onOk();
    } else if (value === 'notOk') {
      this.onNotOk();
    } else if (value === 'delete') {
      this.onDelete();
    }
  }

  getSelectedRowsStatus = (selectedRows) => { // 获取缺陷的列表
    const map = {};
    let status;
    for (var i = 0; i < selectedRows.length; i++) {
      if (!map[selectedRows[i].defectStatus]) {
        map[selectedRows[i].defectStatus] = 1;
      } else {
        map[selectedRows[i].defectStatus] += 1;
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

  tableChange = (pagination, filter, sorter) => { // 进行排序的时候
    if (Object.keys(sorter).length !== 0) {
      const field = getDefectSortField(sorter.field);
      const order = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc ') : '';
      this.props.onChangeFilter({
        sortField: field,
        sortMethod: order,
      });
    } else {
      this.props.onChangeFilter({
        sortField: '',
        sortMethod: '',
      });
    }
  }

  cancelRowSelect = () => { // 取消选中
    this.props.changeDefectStore({
      selectedRowKeys: [],
    });
  }

  initColumn = () => { // 初始的列表头
    const columns = [{
      title: '缺陷级别',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
      render: (value, record, index) => (<span>{getLevel(value)}</span>),
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
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      key: 'defectDescribe',
      render: (text, record) => {
        return <div className={styles.defectDesc} title={text}>{text}</div>;
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
      render: (value, record, index) => (
        <div className={styles.defectStatus}>
          <span>{getStatus(value)}</span>
          <div className={styles.warning}>
            {record.isOvertime === '0' ? <div className={styles.overTime}>超时</div> : null}
            {record.isCoordination === '0' ? <div className={styles.coordinate}>协调</div> : null}
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

  renderOperation = () => { // 操作的内容
    const { selectedRowKeys } = this.props;
    const { currentSelectedStatus } = this.state;
    const unselected = selectedRowKeys.length === 0;
    const rightHandler = localStorage.getItem('rightHandler');
    const reviewDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_review');
    const checkDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_check');
    return (
      <Select
        onChange={this.onHandle}
        value="操作" placeholder="操作"
        dropdownMatchSelectWidth={false}
        getPopupContainer={() => this.refs.wrap}
        dropdownClassName={styles.handleDropdown}>
        {reviewDefectRight && <Option value="send" disabled={unselected || currentSelectedStatus !== '1'}>
          <i className="iconfont icon-release"></i>下发</Option>}
        {reviewDefectRight && <Option value="close" disabled={unselected || currentSelectedStatus !== '1'}>
          <i className="iconfont icon-stop"></i>关闭</Option>}
        {reviewDefectRight && <Option value="reject" disabled={unselected || currentSelectedStatus !== '1'}>
          <i className="iconfont icon-reject"></i>驳回</Option>}
        {checkDefectRight && <Option value="ok" disabled={unselected || currentSelectedStatus !== '3'}>
          <i className="iconfont icon-done"></i>合格</Option>}
        {checkDefectRight && <Option value="notOk" disabled={unselected || currentSelectedStatus !== '3'}>
          <i className="iconfont icon-ha"></i>不合格</Option>}
        <Option value="delete" disabled={unselected || currentSelectedStatus !== '0'}>
          <i className="iconfont icon-del"></i>删除</Option>
      </Select>
    );
  }

  render() {
    const { pageSize, pageNum, defectList, selectedRowKeys, total, loading, theme } = this.props;
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
          rowSelection={rowSelection}
          dataSource={defectList.map((e, i) => ({ ...e, key: e.defectId }))}
          columns={this.initColumn()}
          pagination={false}
          loading={loading}
          onChange={this.tableChange}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />
        {defectList.length > 0 &&
          <div className={styles.tableFooter}>
            <span className={styles.info}>当前选中<span className={styles.totalNum}>{selectedRowKeys.length}</span>项</span>
            {selectedRowKeys.length > 0 && <span className={styles.cancel} onClick={this.cancelRowSelect}>取消选中</span>}
          </div>}
      </div>
    );
  }

}

export default DefectTable;
