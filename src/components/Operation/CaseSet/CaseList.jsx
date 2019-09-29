import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import { Table } from 'antd';
import WarningTip from '../../../components/Common/WarningTip';
import Cookie from 'js-cookie';
import moment from 'moment';
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
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '确定要删除解决方案吗?',
      currentPoint: {},
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
    const { getCasePartList, questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, pageSize, pageNum } = this.props;
    const queryParams = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId, pageSize, pageNum };
    const { field, order } = sorter;
    const orderFiled = field === 'likeCount' ? 'like' : field;
    getCasePartList({
      ...queryParams,
      orderFiled: orderFiled,
      orderType: order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : null,
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
    const rightkey = Cookie.get('userRight').includes('operation_case_operate');//操作权限
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const { showWarningTip, warningTipText } = this.state;
    const columns = [
      {
        title: '风场',
        dataIndex: 'stationNames',
        key: 'stationNames',
        render: (text, record, index) => {
          return (
            <div className={styles.stationWidth} title={text} >{text}</div>
          );
        },
      },
      {
        title: '机型',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: (text, record, index) => {
          return (
            <div className={styles.tableWidth} title={text} >{text}</div>
          );
        },

      }, {
        title: '问题类别',
        dataIndex: 'questionTypeCodeName',
        key: 'questionTypeCodeName',
        render: (text, record, index) => {
          return (
            <div className={styles.questionType} title={text} >{text}</div>
          );
        },

      }, {
        title: '相关故障代码',
        dataIndex: 'faultCode',
        key: 'faultCode',
        render: (text, record, index) => {
          return (
            <div className={styles.tableWidth} title={text} >{text}</div>
          );
        },

      }, {
        title: '问题描述',
        dataIndex: 'faultDescription',
        key: 'faultDescription',
        render: (text, record, index) => {
          return (
            <div className={styles.questionDes} title={text} >{text}</div>
          );
        },

      }, {
        title: '处理措施',
        dataIndex: 'processingMethod',
        key: 'processingMethod',
        render: (text, record, index) => {
          return (
            <div className={styles.tableWidth} title={text} >{text}</div>
          );
        },

      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
        render: (text, record, index) => {
          return (
            <div className={styles.tableWidth} title={text} >{moment(text).format('YYYY-MM-DD')}</div>
          );
        },

      }, {
        title: '点赞数',
        dataIndex: 'likeCount',
        key: 'likeCount',
        sorter: true,
        render: (text, record, index) => {
          return (
            <div className={styles.likeWidth} title={text} >{text}</div>
          );
        },
      },
      {
        title: '操作',
        key: 'caozuo',
        className: styles.titleStyle,
        render: (text, record, index) => {
          return (
            <div>
              <span className={`${styles.editPoint}  iconfont icon-look`} onClick={() => this.showCaseDetail(record)}></span>
              {rightkey && <span className={`${styles.editPoint}  iconfont icon-edit`} onClick={() => this.showEditPage(record)}></span>}
              {rightkey && <span className={`${styles.editPoint}  iconfont icon-del`} onClick={() => this.deleteCasePart(record)}></span>}
            </div>
          );
        },

      },
    ];
    return (
      <div className={styles.caseList}>
        {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
        <Table
          loading={tableLoading}
          rowSelection={rowSelection}
          onChange={this.tableChange}
          columns={columns}
          dataSource={casePartTableData.map((e, i) => ({ key: i, ...e }))}
          pagination={false}
          locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
        />
        <div className={styles.selectKeyText}> 当前选中<span className={styles.num}>{selectedRowKeys.length}</span> 项 <span className={styles.cancelSelect} onClick={this.cancelSelect}>{selectedRowKeys.length ? '取消选择' : ''}</span></div>
      </div>
    );
  }
}
export default (CaseList);
