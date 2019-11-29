import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import CommonPagination from '@components/Common/CommonPagination';
import { Table, Icon, Modal, Select, Tooltip, Button } from 'antd';
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

  constructor(props, context) {
    super(props);
  }

  onPaginationChange = ({ currentPage, pageSize }) => {
    const { listParams } = this.props;
    this.props.getDefectList({ ...listParams, pageNum: currentPage, pageSize });
  }


  tableChange = (pagination, filter, sorter) => { // 表格排序&&表格重新请求数据
    const { listParams } = this.props;
    const { order } = sorter;
    const sortMethod = order === 'ascend' ? 'asc' : 'desc';
    const sortField = this.getSortMethod[sorter.field] || 'create_time';
    this.props.getDefectList({ ...listParams, sortMethod, sortField, pageNum: 1 });
  }

  getSortMethod = {
    'defectType': 'defect_type_code',
    'stationName': 'station_name',
    'deviceName': ' device_name',
    'defectTypeName': 'defect_type_name',
    'startTime': 'create_time',
    'finishTime': 'finish_time',
    'defectStatus': 'defect_status',
  }



  // toLine = (name) => { // 驼峰转下划线
  //   return name.replace(/([A-Z])/g, '_$1').toLowerCase();
  // }


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
      key: 'defectType',
      sorter: true,
      width: 120,
      render: (text, record) => {
        return <div>{record.defectTypeCode === '0' && '其他缺陷' || '设备缺陷'}</div>;
      },
    }, {
      title: '电站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      sorter: true,
      className: styles.stationName,
      render: (text, record) => {
        return <div className={styles.stationNameText} title={text}>{text || '--'}</div>;
      },
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      className: styles.deviceName,
      sorter: true,
      render: text => {
        return <div className={styles.deviceNameText} title={text}>{text || '--'}</div>;
      },
    }, {
      title: '缺陷类型',
      dataIndex: 'defectTypeName',
      key: 'defectTypeName',
      className: styles.defectTypeName,
      sorter: true,
      render: (text, record) => {
        return <div className={styles.defectTypeNameText} title={record.defectTypeName}>{record.defectTypeName || '--'}</div>;
      },
    }, {
      title: '缺陷描述',
      dataIndex: 'defectDescribe',
      className: styles.defectDescribe,
      key: 'defectDescribe',
      render: text => {
        return <div className={styles.defectDescribeText} title={text || '--'}>{text || '--'}</div>;
      },
    }, {
      title: '发生时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 160,
      sorter: true,
      render: text => {
        return <div className={styles.startTime} title={text || '--'}>{text || '--'}</div>;
      },
    }, {
      title: '完成时间',
      dataIndex: 'finishTime',
      key: 'finishTime',
      width: 160,
      render: text => {
        return <div className={styles.finishTime} title={text || '--'}>{text || '--'}</div>;
      },
      sorter: true,
    }, {
      title: '状态',
      dataIndex: 'defectStatus',
      key: 'defectStatus',
      sorter: true,
      width: 140,
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
      width: 75,
      render: (text, record) => (
        <span>
          <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record); }} />
        </span>
      ),
    }];
    return columns;
  }

  render() {
    const { defectListData, selectedRowKeys, total, listLoading, theme, listParams } = this.props;
    const { pageSize, pageNum } = listParams;
    const rightHandler = localStorage.getItem('rightHandler');
    // const addDefectRight = rightHandler && rightHandler.split(',').includes('workExamine_defect_add');
    const addDefectRight = true;
    return (
      <div className={`${styles.defectTable} ${styles[theme]}`}>
        <span ref={'wrap'} />
        <div className={styles.action}>
          <div className={styles.buttonArea}>
            {addDefectRight && <Button className={styles.addDefect} type="add" onClick={this.addDefect} ><i>+</i> 缺陷 </Button>}
          </div>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={total} onPaginationChange={this.onPaginationChange} theme={theme} />
        </div>
        <Table
          dataSource={defectListData.map((e, i) => ({ ...e, key: e.defectId }))}
          columns={this.initColumn()}
          pagination={false}
          fixed={true}
          // bordered
          loading={listLoading}
          onChange={this.tableChange}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
          scroll={{ y: 430, scrollToFirstRowOnChange: true }}
        />
      </div>
    );
  }
}

export default DefectTabelList;
