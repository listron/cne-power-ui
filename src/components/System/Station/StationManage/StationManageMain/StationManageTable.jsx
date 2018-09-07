

import React, { Component } from 'react';
import { Input, Button, Icon, Table } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import stationManageTableColumn from './stationManageTableColumn';
import SetDepartmentModal from './SetDepartmentModal';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';


class StationManageTable extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    loading: PropTypes.bool,
    queryListParams: PropTypes.object,
    allDepartmentData: PropTypes.array,
    getStationList: PropTypes.func,
    changeStationManageStore: PropTypes.func,
    stationList: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      departmentModal: false,
      departmentSetInfo: {},
    }
  }

  onStationAdd = () => { // 添加上传电站
    console.log('add 电站')
  }

  onPaginationChange = ({pageSize, currentPage}) => { // 分页器操作
    const { getStationList, queryListParams } = this.props;
    getStationList({
      queryListParams,
      pageSize,
      pageNum: currentPage,
    })
  }

  toStationDetail = (record) => {
    console.log(record);
    this.props.changeStationManageStore({
      showPage: 'detail',
    })
  }

  downloadTemplet = () => {  // 下载电站配置模板
    console.log('down load templet')
  }

  tableChange = (pagination, filter, sorter) => { // 部门排序
    const { getStationList, queryListParams } = this.props;
    const sortName = sorter.field;
    // orderField: '', // 排序字段 1：电站名称; 2:区域 ;3:覆盖类型;4:并网类型;5：装机容量;6:发点单元数;7：电站接入
    const sortInfo = {
      stationName: '1',
      area: '2',
      coverType: '3',
      connectionType: '4',
      stationCapacity: '5',
      series: '6',
      stationStatus: '7',
    };
    const orderField = sortInfo[sortName];
    const orderCommand = sorter.order==='ascend'?'asc':'desc';
    getStationList({
      ...queryListParams,
      orderField,
      orderCommand,
    })
  }

  showDepartmentModal = (departmentSetInfo) => {
    this.setState({
      departmentModal: true,
      departmentSetInfo,
    })
  }

  closeDepartmentModal = (departmentData) => {
    if(departmentData){
      console.log(departmentData);
    }
    this.setState({
      departmentModal: false,
      departmentSetInfo: {},
    })
  }

  hideDepartmentModal = () => {
    this.setState({
      departmentModal: false,
      departmentSetInfo: {},
    })
  }

  render(){
    const { loading, stationList, totalNum, allDepartmentData } = this.props;
    const { departmentModal, departmentSetInfo } = this.state;
    const column = [
      {
        title: '电站',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        render: (text,record) => {
          return (
            <span className={styles.stationName} onClick={()=>this.toStationDetail(record)}>{record.stationName}</span>
          )
        }
      },
      ...stationManageTableColumn,
      {
        title: '部门设置',
        dataIndex: 'departmentStatus',
        key: 'departmentStatus',
        render: (text, record, index) => {
          const { departmentStatus } = record;
          if(departmentStatus){
            return (<span className={styles.setDepartment} onClick={()=>this.showDepartmentModal(record)}>查看</span>)
          }else{
            return (<span className={styles.setDepartment} onClick={()=>this.showDepartmentModal(record)}>设置</span>)
          }
        }
      },{
        title: '操作',
        dataIndex: 'handler',
        key: 'handler',
        render: (text, record, index) => {
          return (<span className={styles.deleteStation}>删除</span>)
        }
      }
    ];
    return (
      <div>
        <div>
          <Button onClick={this.onStationAdd}>
            <Icon type="plus" />
            <span>电站</span>
          </Button>
          <Button onClick={this.downloadTemplet}>下载电站配置模板</Button>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          dataSource={ stationList.map((e, i) => ({...e, key: i})) } 
          columns={column} 
          onChange={this.tableChange}
          pagination={false}
          locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
        {departmentModal && <SetDepartmentModal
          departmentSetInfo={departmentSetInfo}
          closeDepartmentModal={this.closeDepartmentModal}
          allDepartmentData={allDepartmentData}
        />}
      </div>
    )
  }
}

export default StationManageTable;
