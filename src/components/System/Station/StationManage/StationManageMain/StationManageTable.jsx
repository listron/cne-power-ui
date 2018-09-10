

import React, { Component } from 'react';
import { Upload, Button, Icon, Table, message } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import stationManageTableColumn from './stationManageTableColumn';
import SetDepartmentModal from './SetDepartmentModal';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';


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
      departmentModal: false,
      departmentSetInfo: {},
      uploadLoading: false,
    }
  }

  onStationUpload = ({file, fileList}) => { // 添加上传电站
    this.setState({ uploadLoading: true})
    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
    if (file.status === 'done') {
      message.success(`${file.name} 文件上传成功`);
      this.setState({ uploadLoading: false})
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败!`);
      this.setState({ uploadLoading: false})
    }
  }

  onPaginationChange = ({pageSize, currentPage}) => { // 分页器操作
    const { getStationList, queryListParams } = this.props;
    getStationList({
      queryListParams,
      pageSize,
      pageNum: currentPage,
    })
  }

  onStationDelete = (record) => { // 删除部门
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

  closeDepartmentModal = (params) => { // 关闭模态框，若有参数则发起设置部门请求
    params && this.props.setStationDepartment(params);
    this.setState({
      departmentModal: false,
      departmentSetInfo: {},
    })
  }

  render(){
    const { loading, stationList, totalNum, allDepartmentData } = this.props;
    const { departmentModal, departmentSetInfo, uploadLoading } = this.state;
    const authData = Cookie.get('authData') || null;
    const column = [
      {
        title: '电站',
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
          return (<span className={styles.deleteStation} onClick={()=>this.onStationDelete(record)}>删除</span>)
        }
      }
    ];
    return (
      <div>
        <div>
          <Upload 
            action="/api/v3/management/stationimport"
            className={styles.uploadStation}
            onChange={this.onStationUpload}
            headers={{'Authorization': 'bearer ' + JSON.parse(authData)}}
            beforeUpload={this.beforeUploadStation}
          >
            <Button loading={uploadLoading}>
              <Icon type="plus" />
              <span>电站</span>
            </Button>
          </Upload>
          <Button href={'www.baidu.com'} download={'www.baidu.com'}  target="_blank"  >下载电站配置模板</Button>
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
