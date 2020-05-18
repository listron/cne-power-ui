import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import WarningTip from '../../../components/Common/WarningTip';
import { handleRight } from '@utils/utilFunc';
import moment from 'moment';
import CneTable from '@components/Common/Power/CneTable';
class CaseList extends React.Component {
  static propTypes = {
    changeCasePartStore: PropTypes.func,
    getCasePartDetail: PropTypes.func,
    deleteCasePart: PropTypes.func,
    getCasePartList: PropTypes.func,
    faultDescription: PropTypes.string,
    userName: PropTypes.string,
    userId: PropTypes.number,
    questionTypeCodes: PropTypes.array,
    deviceModeList: PropTypes.array,
    stationCodes: PropTypes.array,
    tableLoading: PropTypes.bool,
    casePartTableData: PropTypes.array,
    selectedRowKeys: PropTypes.array,
    orderFiled: PropTypes.string,
    orderType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '确定要删除解决方案吗?',
      currentPoint: {},
      sortField: 'likeCount',
      sortMethod: 'descend',
    };
  }
  cancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }
  confirmWarningTip = () => {
    const { currentPoint } = this.state;
    this.setState({
      showWarningTip: false,
    });
    //发送删除测点请求
    // this.deletePointList();
    this.props.deleteCasePart({
      caseBaseIds: [currentPoint.caseBaseId],
    });

  }
  deleteCasePart = (record) => {
    this.setState({
      showWarningTip: true,
      currentPoint: record,
    });
  }

  showCaseDetail = (record) => {
    //展示详情页
    this.props.changeCasePartStore({
      showPage: 'detail',
    });
    this.props.getCasePartDetail({
      caseBaseId: record.caseBaseId,
    });
  }
  showEditPage = (record) => {
    //展示编辑页
    this.props.changeCasePartStore({
      showPage: 'edit',
    });
    this.props.getCasePartDetail({
      caseBaseId: record.caseBaseId,
    });
  }
  cancelSelect = () => {
    this.props.changeCasePartStore({
      selectedRowKeys: [],
    });
  }
  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getCasePartList, questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, pageSize, pageNum, orderFiled, orderType } = this.props;
    const queryParams = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, pageSize, pageNum };
    const { field } = sorter;
    const sortFieldMap = {
      likeCount: 'like',
      updateTime: 'updateTime',
    };
    let newField = orderFiled, newSort = 'desc';
    if(!field || orderFiled === sortFieldMap[field]) {// 点击的是正在排序的列
      newSort = orderType === 'desc' ? 'asc' : 'desc'; // 交换排序方式
    }else{
      newField = sortFieldMap[field];
    }
    this.setState({
      sortField: !field ? this.state.sortField : field,
      sortMethod: newSort === 'asc' ? 'ascend' : 'descend',
    });
    getCasePartList({
      ...queryParams,
      orderFiled: newField,
      orderType: newSort,
    });
  }
  onSelectChange = (keys, record) => {
    this.props.changeCasePartStore({
      selectedRowData: record,
      selectedRowKeys: keys,
    });
  };
  render() {
    const { tableLoading, casePartTableData, selectedRowKeys } = this.props;
    const caseHandleRight = handleRight('operation_case_operate');//操作权限
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { showWarningTip, warningTipText, sortField, sortMethod } = this.state;
    const columns = [
      {
        title: '风场',
        width: '10%',
        textAlign: 'left',
        dataIndex: 'stationNames',
        render: (text) => {
          return (
            <div className={styles.stationWidth} title={text || '--'} >{text || '--'}</div>
          );
        },
      }, {
        title: '机型',
        width: '13%',
        textAlign: 'left',
        dataIndex: 'deviceName',
        render: (text) => {
          return (
            <div className={styles.tableTypeWidth} title={text || '--'} >{text || '--'}</div>
          );
        },
      }, {
        title: '问题类别',
        width: '11%',
        textAlign: 'left',
        dataIndex: 'questionTypeCodeName',
        render: (text) => {
          return (
            <div className={styles.questionType} title={text || '--'} >{text || '--'}</div>
          );
        },
      }, {
        title: '相关故障代码',
        width: '11%',
        textAlign: 'left',
        dataIndex: 'faultCode',
        render: (text) => {
          return (
            <div className={styles.faultCode} title={text || '--'} >{text || '--'}</div>
          );
        },
      }, {
        title: '问题描述',
        width: '14.5%',
        textAlign: 'left',
        dataIndex: 'faultDescription',
        render: (text) => {
          return (
            <div className={styles.questionDes} title={text || '--'} >{text || '--'}</div>
          );
        },
      }, {
        title: '处理措施',
        width: '14.5%',
        textAlign: 'left',
        dataIndex: 'processingMethod',
        render: (text) => {
          return (
            <div className={styles.dealHandler} title={text || '--'} >{text || '--'}</div>
          );
        },
      }, {
        title: '更新时间',
        width: '7.5%',
        textAlign: 'center',
        dataIndex: 'updateTime',
        sorter: true,
        render: (text) => {
          return (
            <div title={text || '--'}>{text ? moment(text).format('YYYY-MM-DD') : '--'}</div>
          );
        },
      }, {
        title: '点赞数',
        width: '6%',
        textAlign: 'right',
        dataIndex: 'likeCount',
        sorter: true,
        render: (text) => {
          return (
            <div title={(text || text === 0) ? text : '--'} >{(text || text === 0) ? text : '--'}</div>
          );
        },
      },
      {
        title: '操作',
        width: '9%',
        textAlign: 'center',
        dataIndex: 'caozuo',
        render: (text, record) => {
          return (
            <span>
              <i className={`${styles.editPoint}  iconfont icon-look`} onClick={() => this.showCaseDetail(record)}></i>
              {caseHandleRight && <i className={`${styles.editPoint}  iconfont icon-edit`} onClick={() => this.showEditPage(record)}></i>}
              {caseHandleRight && <i className={`${styles.editPoint}  iconfont icon-del`} onClick={() => this.deleteCasePart(record)}></i>}
            </span>
          );
        },
      },
    ];
    return (
      <div className={styles.caseList}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <CneTable
          loading={tableLoading}
          sortField={sortField}
          sortMethod={sortMethod}
          rowSelection={rowSelection}
          onChange={this.tableChange}
          columns={columns}
          dataSource={casePartTableData.map((e, i) => ({ key: i, ...e }))}
          pagination={false}
        />
        <div className={styles.selectKeyText}> 当前选中<span className={styles.num}>{selectedRowKeys.length}</span> 项 <span className={styles.cancelSelect} onClick={this.cancelSelect}>{selectedRowKeys.length ? '取消选择' : ''}</span></div>
      </div>
    );
  }
}
export default (CaseList);
