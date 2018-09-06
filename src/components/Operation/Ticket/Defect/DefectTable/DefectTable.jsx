import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Radio, Button, Icon, Modal } from 'antd';
import {getLevel, getStatus, getDefectSortField} from '../../../../../constants/ticket';
import styles from './defectTable.scss';
import Immutable from 'immutable';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class DefectTable extends Component {
  static propTypes = {
    onChangeStatus: PropTypes.func,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    onSorter: PropTypes.func,
    onShowDetail: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    onSend: PropTypes.func,
    onReject: PropTypes.func,
    onClose: PropTypes.func,
    onCheck: PropTypes.func,
    defectList: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    defectStatusStatistics: PropTypes.object,
    loading: PropTypes.bool,
    status: PropTypes.string,
    selectedRowKeys: PropTypes.array,
    changeDefectStore: PropTypes.func,
  }

  static defaultProps = {
    defectList: Immutable.fromJS([]),
    pageNum: 1
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSelectedStatus: 5
    };
  }

  onChangeTab = (e) => {
    this.props.onChangeStatus(e.target.value);
  }

  onAdd = () => {
    this.props.onAdd();
  }

  onDelete = () => {
    confirm({
      title: '确认删除此缺陷',
      onOk: () => {
        this.props.onDelete(this.props.selectedRowKeys);
      },
    });
  }

  onSend = () => {
    confirm({
      title: '确认下发此缺陷',
      onOk: () => {
        this.props.onSend(this.props.selectedRowKeys);
      },
    });
  }

  onReject = () => {
    confirm({
      title: '确认驳回此缺陷',
      onOk: () => {
        this.props.onReject(this.props.selectedRowKeys);
      },
    });
  }

  onClose = () => {
    confirm({
      title: '确认关闭此缺陷',
      onOk: () => {
        this.props.onClose(this.props.selectedRowKeys);
      },
    });
  }

  onOk = () => {
    confirm({
      title: '确认验收此缺陷为合格',
      onOk: () => {
        this.props.onCheck(this.props.selectedRowKeys, "0");
      },
    });
  }

  onNotOk = () => {
    confirm({
      title: '确认验收此缺陷为不合格',
      onOk: () => {
        this.props.onCheck(this.props.selectedRowKeys, "1");
      },
    });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    let status = this.getSelectedRowsStatus(selectedRows);
    this.setState({
      currentSelectedStatus: status
    });
    this.props.changeDefectStore(selectedRowKeys);
  }

  onChangeTable = (pagination, filters, sorter) => {
    if(Object.keys(sorter).length !== 0) {
      let field = getDefectSortField(sorter.field);
      let order = sorter.order === 'ascend' ? '0' : '1';
      this.props.onSorter(field+',' + order);
    } else {
      this.props.onSorter('');
    }

  }

  getSelectedRowsStatus(selectedRows) {
    let map = {};
    let status;
    for(var i = 0; i < selectedRows.length; i++) {
      if(!map[selectedRows[i].defectStatus]) {
        map[selectedRows[i].defectStatus] = 1;
      } else {
        map[selectedRows[i].defectStatus] += 1;
      }
    }
    let values = [];
    for(var k in map) {
      values.push(map[k]);
      status = k;
    }
    if(values.length === 1) {
      return status;
    } else {
      return null;
    }
  }

  render() {
    let defectList = this.props.defectList;
    let defectStatusStatistics = this.props.defectStatusStatistics;
    let waitSubmitNum = defectStatusStatistics.get('submitNum');
    let waitReviewNum = defectStatusStatistics.get('examineNum');
    let inProcessNum = defectStatusStatistics.get('executeNum');
    let waitCheckNum = defectStatusStatistics.get('checkNum');

    const columns = [{
      title: '缺陷级别',
      dataIndex: 'defectLevel',
      key: 'defectLevel',
      sorter: true,
      render: (value,record,index)=> (
        <span>{getLevel(value)}</span>
      )
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
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      sorter: true,
    }, {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      sorter: true,
    }, {
      title: '处理进度',
      dataIndex: 'defectStatus',
      key: 'defectStatus',
      sorter: true,
      render: (value,record,index) => (
        <div className={styles.defectStatus}>
          <span>{getStatus(value)}</span>
          <div className={styles.warning}>
            {record.isOvertime === '0'? <span style={{color:'#c80000'}}>超时</span> : null}
            {record.isCoordination === '0'? <span style={{color:'#e78d14'}}>协调</span> : null}
          </div>
        </div>
      ),
    }, {
      title: '查看',
      render:(text, record) => (
        <span>
          <Icon type="eye-o" onClick={()=>{this.props.onShowDetail(record.defectId, record)}} />
        </span>
      )
    }];

    const pagination = {
      total: this.props.total,
      showQuickJumper: true,
      showSizeChanger: true,
      current: this.props.pageNum,
      pageSize: this.props.pageSize,
      onShowSizeChange: (current, pageSize) => {
        this.props.onChangePageSize(pageSize);
      },
      onChange: (current) => {
        this.props.onChangePage(current);
      }
    };
    const selectedRowKeys = this.props.selectedRowKeys;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
  
    return (
      <div className={styles.defectList}>
        <div className={styles.action}>
          <div>
            <RadioGroup onChange={this.onChangeTab} defaultValue="5" value={this.props.status}>
              <RadioButton value="5">全部</RadioButton>
              <RadioButton value="0">{`待提交${waitSubmitNum}`}</RadioButton>
              <RadioButton value="1">{`待审核${waitReviewNum}`}</RadioButton>
              <RadioButton value="2">{`执行中${inProcessNum}`}</RadioButton>
              <RadioButton value="3">{`待验收${waitCheckNum}`}</RadioButton>
            </RadioGroup>
          </div>
          <div className={styles.buttonArea}>
            <Button onClick={this.onAdd}>
              {/* <span className="iconfont icon-add" />  */}
              <Icon type="plus" />
              新建
            </Button>
            {
              this.state.currentSelectedStatus === '0' &&
                <div>
                  <Button onClick={this.onDelete}>删除</Button>
                </div>
            }
            {
              this.state.currentSelectedStatus === '1' &&
                <div>
                  <Button onClick={this.onSend}>下发</Button>
                  <Button onClick={this.onReject}>驳回</Button>
                  <Button onClick={this.onClose}>关闭</Button>
                </div>
            }
            {
              this.state.currentSelectedStatus === '3' &&
                <div>
                  <Button onClick={this.onOk}>合格</Button>
                  <Button onClick={this.onNotOk}>不合格</Button>
                </div>
            }
          </div>
        </div>
        <Table 
          rowKey={(record)=>{return record.defectId}} 
          rowSelection={rowSelection} 
          dataSource={defectList.toJS()} 
          columns={columns} 
          pagination={pagination} 
          loading={this.props.loading}
          onChange={this.onChangeTable}
        />
      </div>
    );
  }

}

export default DefectTable;