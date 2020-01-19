

import React, { Component } from 'react';
import { Upload, Button, Table, message, Icon, Input } from 'antd';
import CommonPagination from '../../../../Common/CommonPagination';
import stationManageTableColumn from './stationManageTableColumn';
import SetDepartmentModal from './SetDepartmentModal';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import path from '../../../../../constants/path';
import WarningTip from '../../../../Common/WarningTip';
import CneTable from '../../../../Common/Power/CneTable/index';
import SetEventYxModal from './SetEventYxModal';
import SetEventYcModal from './SetEventYcModal';
const { Search } = Input;

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
    setStationDepartment: PropTypes.func,
    deleteStation: PropTypes.func,
    stationList: PropTypes.array,
    getDiagconfigYx: PropTypes.func,
    getDiagconfigYc: PropTypes.func,
    setDiagconfigYc: PropTypes.func,
    setDiagconfigYx: PropTypes.func,
    changeStationManageStore: PropTypes.func,
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
      eventYxModal: false,
      eventYcModal: false,
      stationCode: {}, // 选中的当前的电站
      type: 'yc', // 'yc' 遥测诊断 'data' 数据质量诊断
    };
  }


  onStationUpload = ({ file, fileList }) => { // 添加上传电站
    this.setState({
      uploading: true,
      fileList,
    });
    if (file.status !== 'uploading') {
      this.setState({
        uploading: false,
      });
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

  // onPaginationChange = ({ pageSize, currentPage }) => { // 分页器操作
  //   const { getStationList, queryListParams } = this.props;
  //   getStationList({
  //     ...queryListParams,
  //     pageSize,
  //     pageNum: currentPage,
  //   });
  // }

  onStationDelete = (record) => { // 删除电站
    this.props.deleteStation({ stationCode: record.stationCode });
  }

  beforeUploadStation = (file) => { // 上传前的校验
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
      alarmStatus: '9',
    };
    const orderField = sortInfo[field] ? sortInfo[field] : '';
    const orderCommand = order ? (sorter.order === 'ascend' ? '1' : '2') : '';
    getStationList({
      ...queryListParams,
      orderField,
      orderCommand,
    });
  }

  showDepartmentModal = (departmentSetInfo) => {
    this.setState({
      departmentModal: true,
      departmentSetInfo,
    });
  }

  closeDepartmentModal = (params) => { // 关闭模态框，若有参数则发起设置部门请求
    params && this.props.setStationDepartment(params);
    this.setState({
      departmentModal: false,
      departmentSetInfo: {},
    });
  }

  deleteEdit = (record) => {
    this.setState({
      showWarningTip: true,
      deleteInfo: record,
    });
  }

  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  confirmWarningTip = (deleteInfo) => {
    this.setState({
      showWarningTip: false,
    });
    this.onStationDelete(deleteInfo);
  }

  editStation = (record, selectedStationIndex) => { // 直接编辑电站
    this.props.getStationDetail({
      stationCode: record.stationCode,
      selectedStationIndex,
      showPage: 'edit',
    });
  }

  setYxStatus = (list) => { // 设置遥信的数据
    const { stationCode } = list;
    const { getDiagconfigYx } = this.props;
    getDiagconfigYx({ stationCode });
    this.setState({ eventYxModal: true, stationCode });
  }

  setYcStatus = (list, type) => {// 设置遥测数据和数据质量诊断
    const { stationCode, eventDataStatus, eventYcStatus } = list;
    const { getDiagconfigYc } = this.props;
    getDiagconfigYc({ type, stationCode, init: type === 'yc' ? eventYcStatus : eventDataStatus });
    this.setState({ eventYcModal: true, type });
  }

  closeEventModal = (value) => {// 关闭
    const getName = Object.keys(value)[0];
    if (getName === 'eventYxModal') {
      this.props.changeStationManageStore({ YxConfigData: [] });
    }
    if (getName === 'eventYcModal') {
      this.props.changeStationManageStore({ YcConfigData: [] });
    }
    this.setState({ ...value, stationCode: null });
  }

  initColumn = () => {
    const column = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
        className: styles.stationName,
        render: (text, record, index) => {
          return (
            <div className={styles.stationNameWrap}>
              <i className={`iconfont icon-${['windgo', 'pvs'][record.stationType]}`} />
              <span className={styles.stationNameText} onClick={() => this.toStationDetail(record, index)}>{record.stationName}</span>
            </div>
          );
        },
      },
      ...stationManageTableColumn,
      {
        title: '遥信诊断',
        dataIndex: 'eventYxStatus',
        key: 'eventYxStatus',
        className: styles.eventStatus,
        render: (text, record) => {
          const { eventYxStatus, stationType } = record;
          const title = eventYxStatus && '已设置' || '未设置';
          return (<div className={`${styles.eventStatusText} ${stationType === 0 && styles.windDisabled}`}>
            <i className={`iconfont ${eventYxStatus && 'icon-look' || 'icon-goset1'}`} title={title} onClick={() => this.setYxStatus(record)} />
          </div>);
        },
      },
      {
        title: '遥测诊断',
        dataIndex: 'eventYcStatus',
        key: 'eventYcStatus',
        className: styles.eventStatus,
        render: (text, record, index) => {
          const { eventYcStatus, stationType } = record;
          const title = eventYcStatus && '已设置' || '未设置';
          return (<div className={`${styles.eventStatusText} ${stationType === 0 && styles.windDisabled}`}>
            <i className={`iconfont ${eventYcStatus && 'icon-look' || 'icon-goset1'}`} title={title} onClick={() => this.setYcStatus(record, 'yc')} />
          </div>);
        },
      },
      {
        title: '数据质量诊断',
        dataIndex: 'eventDataStatus',
        key: 'eventDataStatus',
        className: styles.eventDataStatus,
        render: (text, record, index) => {
          const { eventDataStatus, stationType } = record;
          const title = eventDataStatus && '已设置' || '未设置';
          return (<div className={`${styles.eventStatusText} ${stationType === 0 && styles.windDisabled}`}>
            <i className={`iconfont ${eventDataStatus && 'icon-look' || 'icon-goset1'}`} title={title} onClick={() => this.setYcStatus(record, 'data')} />
          </div>);
        },
      },
      {
        title: '部门设置',
        dataIndex: 'departmentStatus',
        key: 'departmentStatus',
        className: styles.eventStatus,
        render: (text, record, index) => {
          const { stationDepartments } = record;
          if (stationDepartments && stationDepartments.length > 0) {
            return (
              <div className={styles.eventStatusText}>
                <span title="查看" className="iconfont icon-look" onClick={() => this.showDepartmentModal(record)}></span>
              </div>
            );
          }
          return (
            <div className={styles.eventStatusText}>
              <span title="去设置" className="iconfont icon-goset1" onClick={() => this.showDepartmentModal(record)}></span>
            </div>
          );
        },
      }, {
        title: '操作',
        dataIndex: 'handler',
        key: 'handler',
        className: styles.handler,
        render: (text, record, index) => { // 电站未接入且alarmStatus,departmentStatus,deviceStatus,pointStatus全部为0时，才能删除。
          const deletable = !record.alarmStatus && !record.departmentStatus && !record.pointStatus && !record.isConnected;
          return (
            <div className={styles.handlerText}>
              <i className={`iconfont icon-edit ${styles.editStation}`} onClick={() => this.editStation(record, index)} title={'编辑'} />
              {
                deletable &&
                <i className={`iconfont icon-del ${styles.deleteStation}`} onClick={() => this.deleteEdit(record, index)} title={'删除'} /> ||
                <i className={`iconfont icon-del ${styles.deleteDisable}`} title={'删除'} />
              }
            </div>
          );
        },
      },
    ];
    return column;
  }

  selectCondition = (value) => { // 查询电站
    const { getStationList, queryListParams } = this.props;
    getStationList({ ...queryListParams, keyword: value });
  }

  render() {
    const { stationListLoading, stationList, totalNum, allDepartmentData, pageNum, pageSize } = this.props;
    const { setDiagconfigYx, setDiagconfigYc, YxConfigData, YcConfigData, YxLoading, YcLoading, keyword } = this.props;
    const { departmentModal, departmentSetInfo, uploading, fileList, showWarningTip, warningTipText, deleteInfo } = this.state;
    const { eventYxModal, stationCode, eventYcModal, type } = this.state;
    const authData = localStorage.getItem('authData') || '';
    const downloadHref = `${path.basePaths.originUri}${path.APISubPaths.system.downloadStationTemplet}`;
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
                <div className={styles.icon}> {uploading && <Icon type="loading" /> || <span className={'iconfont icon-newbuilt'} />}</div>新建
              </div>
            </Upload>
            <Button href={downloadHref} download={downloadHref} target="_blank" className={styles.download}>
              <span className={'iconfont icon-download'} /> 下载模板
            </Button>
            <div className={styles.conditionSearch}>
              <Search
                placeholder="电站类型／区域／电站名称"
                enterButton={<i className={'iconfont icon-search'} />}
                onSearch={this.selectCondition}
              />
            </div>
          </div>
          <div>合计：{totalNum}</div>
          {/* <CommonPagination currentPage={pageNum} pageSize={pageSize} total={totalNum} onPaginationChange={this.onPaginationChange} /> */}
        </div>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={() => this.confirmWarningTip(deleteInfo)} value={warningTipText} />}
        <CneTable
          loading={stationListLoading}
          dataSource={stationList.map((e, i) => ({ ...e, key: i }))}
          columns={this.initColumn()}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          scroll={{ y: 720 }}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />

        {departmentModal && <SetDepartmentModal
          departmentSetInfo={departmentSetInfo}
          closeDepartmentModal={this.closeDepartmentModal}
          allDepartmentData={allDepartmentData}
        />}
        {eventYxModal && <SetEventYxModal
          closeEventModal={this.closeEventModal}
          allEventYx={YxConfigData}
          stationCode={stationCode}
          setDiagconfigYx={setDiagconfigYx}
          loading={YxLoading}
        />}
        {eventYcModal && <SetEventYcModal
          closeEventModal={this.closeEventModal}
          eventData={YcConfigData}
          type={type}
          setDiagconfigYc={setDiagconfigYc}
          loading={YcLoading}
        />}
      </div>
    );
  }
}

export default StationManageTable;
