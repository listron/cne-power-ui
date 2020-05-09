import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import CommonPagination from '@components/Common/CommonPagination';
import { Table, Icon, Modal, Select, Tooltip, Button } from 'antd';
import moment from 'moment';
import { handleRight } from '@utils/utilFunc';
import CneTable from '../../../Common/Power/CneTable';
import CneButton from '../../../Common/Power/CneButton/';

const Option = Select.Option;



class DefectTabelList extends Component {
  static propTypes = {
    theme: PropTypes.string,
    listParams: PropTypes.object,
    getDefectList: PropTypes.func,
    history: PropTypes.object,
    defectListData: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    total: PropTypes.number,
    listLoading: PropTypes.bool,
  };

  getSortMethod = {
    'defectType': 'defect_type_code',
    'stationName': 'station_name',
    'deviceName': ' device_name',
    'defectTypeName': 'defect_type_name',
    'startTime': 'create_time',
    'finishTime': 'finish_time',
    'defectStatus': 'defect_status',
  }

  changeGetSortField = {
    'defect_type_code': 'defectType',
    'station_name': 'stationName',
    'device_name': 'deviceName',
    'defect_type_name': 'defectTypeName',
    'create_time': 'startTime',
    'finish_time': 'finishTime',
    'defect_status': 'defectStatus',
  }

  constructor(props, context) {
    super(props);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { listParams } = this.props;
    this.props.getDefectList({ ...listParams, pageNum: currentPage, pageSize });
  }


  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { listParams } = this.props;
    const { order, field } = sorter;
    const { sortField, sortMethod } = listParams;

    let newSortField = sortField, newSortMethod = 'asc';
    if (!field || this.getSortMethod[field] === newSortField) {
      newSortMethod = sortMethod === 'desc' ? 'asc' : 'desc';
    } else {
      newSortField = this.getSortMethod[field];
    }
    this.props.getDefectList({ ...listParams, sortMethod: newSortMethod, sortField: newSortField, pageNum: 1 });
  }

  onShowDetail = (record) => { // 展示详情
    const { defectId } = record;
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=defectDetail&defectId=${defectId}`);
  }

  addDefect = () => { // 添加缺陷
    const { history } = this.props;
    const { pathname } = history.location;
    history.push(`${pathname}?page=defectDetail`);
  }


  initColumn = () => { // 初始的列表头
    const columns = [{
      title: '缺陷分类',
      dataIndex: 'defectType',
      sorter: true,
      width: '10%',
      textAlign: 'left',
      render: (text, record) => <div>{record.defectTypeCode === '0' && '其他缺陷' || '设备缺陷'}</div>,
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      sorter: true,
      textAlign: 'left',
      width: '10%',
      render: (text, record) => <div className={styles.stationNameText} title={text}>{text || '--'}</div>,
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      sorter: true,
      width: '10%',
      textAlign: 'left',
      render: text => <div className={styles.deviceNameText} title={text}>{text || '--'}</div>,
    }, {
      title: '缺陷类型',
      dataIndex: 'defectTypeName',
      textAlign: 'left',
      width: '12%',
      sorter: true,
      render: (text, record) => <div className={styles.defectTypeNameText} title={record.defectTypeName}>{record.defectTypeCode !== '0' && record.defectTypeName || '--'}</div>,
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      textAlign: 'left',
      width: '18%',
      render: text => <div className={styles.defectDescribeText} title={text || '--'}>{text || '--'}</div>,
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      sorter: true,
      textAlign: 'center',
      width: '12%',
      render: text => {
        return <div className={styles.startTime} title={text || '--'}>{text && moment(text).format('YYYY-MM-DD HH:mm') || '--'}</div>;
      },
    }, {
      title: '完成时间',
      dataIndex: 'finishTime',
      textAlign: 'center',
      width: '12%',
      render: text => {
        return <div className={styles.finishTime} title={text || '--'}>{text && moment(text).format('YYYY-MM-DD HH:mm') || '--'}</div>;
      },
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'defectStatus',
      sorter: true,
      width: '10%',
      textAlign: 'left',
      render: (value, record) => (
        <div className={styles.defectStatus}>
          <span>{['待提交', '待审核', '执行中', '待验收', '已完成'][value]}</span>
          <div className={styles.warning}>
            {record.isOvertime === '0' && <div className={styles.overTime}>超时</div>}
            {record.isCoordination === '0' && <div className={styles.coordinate}>协调</div>}
          </div>
        </div>
      ),
    }, {
      title: '查看',
      textAlign: 'center',
      width: '7%',
      render: (text, record) => <i className={`iconfont icon-look ${styles.look}`} onClick={() => { this.onShowDetail(record); }} />,
    }];
    return columns;
  }

  render() {
    const { defectListData, selectedRowKeys, total, listLoading, theme, listParams } = this.props;
    const { pageSize, pageNum, sortMethod, sortField } = listParams;
    const addRight = handleRight('workExamine_defect_add');
    return (
      <div className={`${styles.defectTable} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.action}>
          <div className={styles.buttonArea}>
            {addRight && <CneButton iconname="icon-newbuilt" lengthMode='short' onClick={this.addDefect}> 消缺 </CneButton>}
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <CneTable
          dataSource={defectListData.map((e, i) => ({ ...e, key: e.defectId }))}
          columns={this.initColumn()}
          pagination={false}
          fixed={true}
          loading={listLoading}
          onChange={this.tableChange}
          // scroll={{ y: 430, scrollToFirstRowOnChange: true }}
          sortMethod={{ 'asc': 'ascend', 'desc': 'descend' }[sortMethod]}
          sortField={this.changeGetSortField[sortField]}
        />
      </div>
    );
  }
}

export default DefectTabelList;
