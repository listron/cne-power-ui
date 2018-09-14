

import React, { Component } from 'react';
import { Upload, Button, Icon, Table, message } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import stationManageTableColumn from './stationManageTableColumn';
import SetDepartmentModal from './SetDepartmentModal';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import path from '../../../../../constants/path';


class StationManageTable extends Component {
  static propTypes = {
    totalNum: PropTypes.number,
    loading: PropTypes.bool,
    queryListParams: PropTypes.object,
    allDepartmentData: PropTypes.array,
    getStationList: PropTypes.func,
    getStationDetail: PropTypes.func,
    changeStationManageStore: PropTypes.func,
    setStationDepartment: PropTypes.func,
    deleteStation: PropTypes.func,
    stationList: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
      uplaoding: false,
      departmentModal: false,
      departmentSetInfo: {},
    }
  }

  onStationUpload = ({file, fileList}) => { // 添加上传电站
    this.setState({
      uplaoding: true,
    })
    if (file.status !== 'uploading') {
      console.log(file, fileList);
      this.setState({
        uplaoding: false,
      })
    }
    if (file.status === 'done') {
      message.success(`${file.name} 文件上传成功`);
      const { getStationList, queryListParams } = this.props;
      getStationList({ ...queryListParams }); //上传成功后，重新请求列表数据
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败,请重试!`);
    }
  }

  onPaginationChange = ({pageSize, currentPage}) => { // 分页器操作
    const { getStationList, queryListParams } = this.props;
    getStationList({
      ...queryListParams,
      pageSize,
      pageNum: currentPage,
    })
  }

  onStationDelete = (record) => { // 删除电站
    this.props.deleteStation({stationCode: record.stationCode})
  }

  beforeUploadStation = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.error('只支持上传excel文件!');
    }
    return !!validFile
  }

  toStationDetail = (record,selectedStationIndex) => { // 查看详情
    this.props.getStationDetail({
      stationCode: record.stationCode,
      selectedStationIndex,
    })
  }

  tableChange = (pagination, filter, sorter) => { // 电站list排序=>重新请求数据
    const { getStationList, queryListParams } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      stationName: '1',
      area: '2',
      coverType: '3',
      connectionType: '4',
      stationCapacity: '5',
      series: '6',
      stationStatus: '7',
    };
    const orderField = sorter?sortInfo[field]:'';
    const orderCommand = order?(sorter.order==='ascend'?'1':'2'):'';
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

  closeDepartmentModal = (params) => { // 关闭模态框，若有参数则发起设置部门请求
    params && this.props.setStationDepartment(params);
    this.setState({
      departmentModal: false,
      departmentSetInfo: {},
    })
  }

  render(){
    const { loading, stationList, totalNum, allDepartmentData } = this.props;
    const { departmentModal, departmentSetInfo, uplaoding } = this.state;
    const authData = Cookie.get('authData') || null;
    const column = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        render: (text,record,index) => {
          return (
            <span className={styles.stationName} onClick={()=>this.toStationDetail(record,index)}>{record.stationName}</span>
          )
        }
      },
      ...stationManageTableColumn,
      {
        title: '部门设置',
        dataIndex: 'departmentStatus',
        key: 'departmentStatus',
        render: (text, record, index) => {
          const { stationDepartments } = record;
          if(stationDepartments && stationDepartments.length > 0){
            return (<span className={styles.seeDepartment} onClick={()=>this.showDepartmentModal(record)}>查看</span>)
          }else{
            return (<span className={styles.setDepartment} onClick={()=>this.showDepartmentModal(record)}>设置</span>)
          }
        }
      },{
        title: '操作',
        dataIndex: 'handler',
        key: 'handler',
        render: (text, record, index) => { // 电站未接入且电站未设置部门时，才能删除。
          const deletable = (!record.stationDepartments || record.stationDepartments.length === 0) && !record.isConnected;
          if(deletable){
            return <span className={styles.deleteStation} onClick={()=>this.onStationDelete(record)}>删除</span>
          }else{
            return <span className={styles.deleteDisable}>删除</span>
          }
        }
      }
    ];
    const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.system.downloadStationTemplet}`;
    return (
      <div className={styles.stationList}>
        <div className={styles.topHandler}>
          <div className={styles.leftHandler}>
            <Upload 
              action={`${path.basePaths.APIBasePath}${path.APISubPaths.system.uploadStationFile}`}
              className={styles.uploadStation}
              onChange={this.onStationUpload}
              headers={{'Authorization': 'bearer ' + JSON.parse(authData)}}
              beforeUpload={this.beforeUploadStation}
              data={(file)=>({file})}
              showUploadList={false}
            >
              <Button className={styles.plusButton} icon="plus" loading={uplaoding}>电站</Button>
            </Upload>
            <Button href={downloadHref} download={downloadHref}  target="_blank"  >下载电站配置模板</Button>
          </div>
          <CommonPagination total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        <Table 
          loading={loading}
          dataSource={ stationList.map((e, i) => ({...e, key: i})) } 
          columns={column} 
          className={styles.stationTable}
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
