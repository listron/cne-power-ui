import React, { Component } from 'react';
import path from '../../../../constants/path';
import styles from './dataExport.scss';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'antd';
import WarningTip from './WarningTip/index';
import CommonPagination from '../../../Common/CommonPagination';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

class DataExportList extends Component{
  static propTypes = {
    tableLoading: PropTypes.bool,
    listParam: PropTypes.object,
    partDataExport: PropTypes.object,
    getDataExportList: PropTypes.func,
    queryParams: PropTypes.object,
    downLoadFile: PropTypes.func,
    changeDataExportStore: PropTypes.func,
    status: PropTypes.num,
    devicePointCodes: PropTypes.array,
    duration: PropTypes.string,
    dataTypes: PropTypes.array,
    getDataExport: PropTypes.func,
    getAgainDataExport: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      pointModal: false,
      showWarningTip: false,
      warningTipText: '数据生成需要一段时间，成功后，需要回到本页面点击下载到本地',
      inputEdited: false,
      dataTypeLength:'',
    }
  }

  componentDidMount(){
    const { getDataExportList, listParam } = this.props;
    getDataExportList(listParam);
  }

  onPaginationChange = ({ pageSize, currentPage }) => { // 分页器
    const { changeDataExportStore, getDataExportList, listParam } = this.props;
    const newParam = {
      ...listParam,
      pageSize,
      pageNum: currentPage,
    }
    changeDataExportStore({
      ...newParam
    })
    getDataExportList({
      ...newParam
    })
  }

  onExport = () => {
    
  }

  onRenewal = (record, index) => { // 重新生成任务
    const { inputEdited } = this.state;
    const { getAgainDataExport, getDataExportList, listParam } = this.props;

    if(!inputEdited){
      this.setState({
        showWarningTip: true,
      })
    }

    getAgainDataExport({
      taskId: record.taskId
    })

    getDataExportList(listParam);
  }

  confirmWarningTip = () => { // 确定
    const { getDataExport, queryParams } = this.props;
    this.setState({
      showWarningTip: false
    })

    getDataExport({
      queryParams
    })
  }

  cancelWarningTip = () => { // 取消
    this.setState({
      showWarningTip: false
    })
  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    const { tableLoading, listParam, partDataExport } = this.props;
    const { pageNum, pageSize } = listParam;
    const { totalCount = 0, dataList = [] } = partDataExport;

    const columns = [
      {
        title: '电站名称',
        dataIndex: 'stationName',
        className: 'stationName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '设备类型',
        dataIndex: 'deviceTypeName',
        className: 'deviceTypeName',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '设备个数',
        dataIndex: 'deviceCount',
        className: 'deviceCount',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '测点数',
        dataIndex: 'devicePointCount',
        className: 'devicePointCount',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '时间段',
        dataIndex: 'duration',
        className: 'duration',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '时间间隔',
        dataIndex: 'timeInterval',
        className: 'timeInterval',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '数据类型',
        dataIndex: 'dataTypes',
        className: 'dataTypes',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '操作时间',
        dataIndex: 'operationTime',
        className: 'operationTime',
        render: (text) => <span title={text}>{text}</span>
      },{
        title: '状态',
        dataIndex: 'status',
        className: 'status',
        render: (text) => (
          <span>
            {(text === 1) && <span title={text}>生成中</span>}
            {(text === 2) && <span title={text}>已生成</span>}
            {(text === 3) && <span title={text}>失败</span>}
          </span>
        )
      },{
        title: '操作',
        dataIndex: 'downloadAddress',
        className: 'downloadAddress',
        render: (text, record, index) => (
            <span>
              {record.status === 1 && <span></span>}
              {record.status === 2 && <span className={styles.exportBtn} onClick={()=>this.onExport(record, index)}>下载到本地</span>}
              {record.status === 3 && <span className={styles.renewal} onClick={()=>this.onRenewal(record, index)}>重新生成任务</span>}
            </span>
          )
        },
    ]

    return(
      <div className={styles.dataExportList}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <div className={styles.pagination}>
          <CommonPagination
            currentPage={pageNum}
            pageSize={pageSize}
            total={parseInt(totalCount)}
            onPaginationChange={this.onPaginationChange}
          />
        </div>
        <Table 
         loading={tableLoading}
         dataSource={dataList.map((e, i) => ({...e, key: i}))}
         columns={columns}
         pagination={false}
         locale={{emptyText:<img width="223" height="164" src="/img/nodata.png" />}}
        />
      </div>
    )
  }
}

export default DataExportList;