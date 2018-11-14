import { Modal, Select, Table, Popover, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './inspectRecord.scss';
import { Link } from 'react-router-dom';

const confirm = Modal.confirm;
const Option = Select.Option;

class InspectRecordTable extends Component {
  static propTypes = {
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    loading: PropTypes.bool,
    status: PropTypes.string,
    onChangeFilter: PropTypes.func,
    getInspectDetailRecord: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSelectedStatus: 5,
    }
  }

  onChangeTable = (pagination, filter, sorter) => {
    const { getInspectDetailRecord, pageNum, pageSize, inspectId, startDate, endDate, userId, inspectStatus, sortType } = this.props;
    const { field, order } = sorter;
    const sort = order ? (sorter.order === 'descend' ? 1 : 0) : '';
    // console.log(sort);
    this.props.onChangeFilter({
      sortType: sort
    });
    console.log(this.props.sortType);
    getInspectDetailRecord({
      inspectId,
      pageNum,
      pageSize,
      endDate,
      startDate,
      userId,
      sortType: sort,
      inspectStatus
    })
  }
  onShowDetail = (inspectId) => {
    this.props.onChangeFilter({
      inspectId
    });
    // this.props.onChangeShowContainer({ container: 'detail' });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { pageNum, inspectId, startDate, endDate, userId, inspectStatus, sortType } = this.props;
    this.props.onChangeFilter({
      pageNum: currentPage,
      pageSize
    });
    this.props.getInspectDetailRecord({ inspectId, pageNum: currentPage, pageSize, startDate, endDate, userId, inspectStatus, sortType })
  }


  initColumn() {
    const columns = [{
      title: '参与人名称',
      dataIndex: 'username',
      key: 'username',
    }, {
      title: '记录时间',
      dataIndex: 'recordDate',
      key: 'recordDate',
      sorter: true,
    }, {
      title: '巡检状态',
      dataIndex: 'recordStatus',
      key: 'recordStatus',
    }, {
      title: '异常设备类型',
      dataIndex: 'deviceTypeName',
      key: 'deviceTypeName',
    }, {
      title: '异常设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      render: (text, record) => {
        return text ? text : '--'
      },
    }, {
      title: '缺陷类型',
      dataIndex: 'faultTypeName',
      key: 'faultTypeName',
      render: (text, record) => {
        return text ? text : '--'
      },
    }, {
      title: '描述详情',
      dataIndex: 'recordDesc',
      key: 'recordDesc',
      render: (text, record) => {
        return text ? text : '--'
      },
    }, {
      title: '查看照片',
      render: (text, record, index) => (
      
        <Popover
          trigger="click"
          content={this.renderInspectPopover(text, record, index)}
          
        >
          <span>
            <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record.inspectId) }} />
          </span>
        </Popover>

      ),
    }];
    return columns;
  }
  renderInspectPopover(text,record,index) {
    const {phoneAddress}=text&&text.phoneAddress;
    //phoneAddress如果是多张图，返回的数据是字符串的话，先转化为数组，然后循环遍历出图片
    return (
      <div>
        <div>
        {[1,2,3].map((e,i)=>(
          <img src={text?text.phoneAddress:''} width="60px" height="60px" />
        ))}
      
        </div>
        <div>
          <Button className={styles.ticketButton}>
            <Link to={`/operation/ticket/list`}>查看工单详情</Link>
          </Button>
        </div>
      </div>
    )

  }
  render() {
    const { pageSize, pageNum, inspectList, selectedRowKeys, totalCount, loading, inspectDetailRecord } = this.props;
    // console.log(inspectDetailRecord);
    const columns = this.initColumn();
    return (
      <div className={styles.inspectTable}>
        <div className={styles.action}>
          <div></div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalCount} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table
          rowKey={(record) => { return record.inspectId }}
          dataSource={inspectDetailRecord}
          // dataSource={inspectList.toJS()}
          columns={columns}
          onChange={this.onChangeTable}
          loading={loading}
          pagination={false}
          locale={{ emptyText: <div className={styles.noData}><img src="/img/nodata.png" style={{ width: 223, height: 164 }} /></div> }}
        />

      </div>
    );
  }
}

export default InspectRecordTable;