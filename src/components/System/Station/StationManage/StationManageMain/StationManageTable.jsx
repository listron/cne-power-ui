

import React, { Component } from 'react';
import { Upload, Button, Table, message, Icon } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import stationManageTableColumn from './stationManageTableColumn';
import SetDepartmentModal from './SetDepartmentModal';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import path from '../../../../../constants/path';
import WarningTip from '../../../../Common/WarningTip';
import CneTable from '../../../../Common/Power/CneTable/index';

// to do 可优化项：所有弹框的确认函数，可以使用一个回调函数作为参数进行函数式编程，只需将弹框的文字及下方按钮ui指定。
// 动态确认/取消后，改回调重置为null。可减少诸多记录状态的变量，利用一个交互函数进行覆盖处理。

class StationManageTable extends Component {
  static propTypes = {
    stationListLoading: PropTypes.bool,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    queryListParams: PropTypes.object,
    allDepartmentData: PropTypes.array,
    getStations: PropTypes.func,
    getStationList: PropTypes.func,
    getStationDetail: PropTypes.func,
    changeStationManageStore: PropTypes.func,
    setStationDepartment: PropTypes.func,
    deleteStation: PropTypes.func,
    stationList: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      departmentModal: false,
      departmentSetInfo: {},
      fileList: [],
      showWarningTip: false,
      warningTipText: '确定要删除?',
      deleteInfo: {},
    }
  }


  onStationUpload = ({ file, fileList }) => { // 添加上传电站
    this.setState({
      uploading: true,
      fileList,
    })
    if (file.status !== 'uploading') {
      console.log(file, fileList);
      this.setState({
        uploading: false,
      })
    }
    if (file.status === 'done' && file.response && file.response.code === '10000') {
      message.success(`${file.name} 文件上传成功`);
      this.setState({ fileList: [] });
      const { getStationList, queryListParams, getStations } = this.props;
      getStationList({ ...queryListParams }); //上传成功后，重新请求列表数据
      getStations && getStations(); // 重新请求数据流程中的电站列表。
    } else if (file.status === 'done' && (!file.response || file.response.code !== '10000')) {
      message.error(`${file.name} 文件上传失败: ${file.response.message},请重试!`);
    } else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败,请重试!`);
    }
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
    const { getStationList, queryListParams } = this.props;
    getStationList({
      ...queryListParams,
      pageSize,
      pageNum: currentPage,
    })
  }

  onStationDelete = (record) => { // 删除电站
    this.props.deleteStation({ stationCode: record.stationCode })
  }

  beforeUploadStation = (file) => { // 上传前的校验
    console.log(file.type);
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.error('只支持上传excel文件!');
    }
    return !!validFile;
  }

  toStationDetail = (record, selectedStationIndex) => { // 查看详情
    this.props.getStationDetail({
      stationCode: record.stationCode,
      selectedStationIndex,
    });
  }

  tableChange = (pagination, filter, sorter) => { // 电站list排序=>重新请求数据
    const { getStationList, queryListParams } = this.props;
    const { field, order } = sorter;
    const sortInfo = {
      stationName: '1',
      // area: '2',
      regionName: '2',
      coverType: '3',
      connectionType: '4',
      stationCapacity: '5',
      // series: '6',
      stationUnitCount: '6',
      // stationStatus: '7',
      isConnected: '7',
      pointStatus: '8',
      alarmStatus: '9'
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    //const orderField = field ? sortInfo[field] : '';
    //const orderField = field ? field : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? '1' : '2') : '';
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

  deleteEdit = (record) => {
    this.setState({
      showWarningTip: true,
      deleteInfo: record,
    })
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    })
  }

  confirmWarningTip = (deleteInfo) => {
    this.setState({
      showWarningTip: false,
    })
    this.onStationDelete(deleteInfo)
  }

  editStation = (record, selectedStationIndex) => { // 直接编辑电站
    this.props.getStationDetail({
      stationCode: record.stationCode,
      selectedStationIndex,
      showPage: 'edit',
    })
  }

  render() {
    const { stationListLoading, stationList, totalNum, allDepartmentData, pageNum, pageSize } = this.props;
    const { departmentModal, departmentSetInfo, uploading, fileList, showWarningTip, warningTipText, deleteInfo } = this.state;
    const authData = localStorage.getItem('authData') || '';
    const column = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        render: (text, record, index) => {
          return (
            <span className={styles.stationName} onClick={() => this.toStationDetail(record, index)}>{record.stationName}</span>
          )
        }
      },
      ...stationManageTableColumn,
      {
        title: '部门设置',
        dataIndex: 'departmentStatus',
        key: 'departmentStatus',
        className: 'departmentSetting',
        render: (text, record, index) => {
          const { stationDepartments } = record;
          if (stationDepartments && stationDepartments.length > 0) {
            return (<span title="查看" className="iconfont icon-look" onClick={() => this.showDepartmentModal(record)}></span>)
          }
          return (<span title="去设置" className="iconfont icon-goset" onClick={() => this.showDepartmentModal(record)}></span>)
        }
      }, {
        title: '操作',
        dataIndex: 'handler',
        key: 'handler',
        render: (text, record, index) => { // 电站未接入且alarmStatus,departmentStatus,deviceStatus,pointStatus全部为0时，才能删除。
          const deletable = !record.alarmStatus && !record.departmentStatus && !record.pointStatus && !record.isConnected;
          if (deletable) {
            return (<span>
              <i className={`${styles.editStation} iconfont icon-edit`} onClick={() => this.editStation(record, index)} />
              <span className={styles.deleteStation} onClick={() => this.deleteEdit(record)}>删除</span>
            </span>);
          }
          return (<span>
            <i className={`${styles.editStation} iconfont icon-edit`} onClick={() => this.editStation(record, index)} />
            <span className={styles.deleteDisable}>删除</span>
          </span>);
        }
      }
    ];
    const downloadHref = `${path.basePaths.originUri}${path.APISubPaths.system.downloadStationTemplet}`;
    console.log('uploading', uploading);
    return (
      <div className={styles.stationList}>
        <div className={styles.topHandler}>
          <div className={styles.leftHandler}>
            <Upload
              action={`${path.basePaths.APIBasePath}${path.APISubPaths.system.uploadStationFile}`}
              className={styles.uploadStation}
              onChange={this.onStationUpload}
              headers={{ 'Authorization': 'bearer ' + authData }}
              beforeUpload={this.beforeUploadStation}
              data={(file) => ({ file })}
              showUploadList={false}
              fileList={fileList}
            >
              <div className={styles.addButton} >
                <div className={styles.icon}> {uploading && <Icon type="loading" /> || <span className={'iconfont icon-newbuilt'} />}</div>电站
              </div>
            </Upload>
            <Button href={downloadHref} download={downloadHref} target="_blank"  >
              <span className={'iconfont icon-newbuilt'} /> 下载电站配置模板
            </Button>
          </div>
          <CommonPagination currentPage={pageNum} pageSize={pageSize} total={totalNum} onPaginationChange={this.onPaginationChange} />
        </div>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={() => this.confirmWarningTip(deleteInfo)} value={warningTipText} />}
        <CneTable
          loading={stationListLoading}
          dataSource={stationList.map((e, i) => ({ ...e, key: i }))}
          columns={column}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
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
