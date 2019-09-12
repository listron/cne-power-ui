import React from 'react';
import PropTypes from 'prop-types';
import styles from './CasePartContainer.scss';
import { Table } from 'antd';
import WarningTip from '../../../components/Common/WarningTip';
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
      warningTipText: '确定要删除选中测点?',
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
  tableChange = (pagination, filter, sorter) => { // 排序触发重新请求设备列表
    const { getCasePartList, questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId } = this.props;
    const queryParams = { questionTypeCodes, deviceModeList, stationCodes, faultDescription, userName, userId };
    const { field, order } = sorter;
    getCasePartList({
      ...queryParams,
      orderField: field ? field : '',
      //sortField: field ? field === 'warningLevel' ? '1' : '2' : '',
      orderType: order ? (sorter.order === 'ascend' ? 0 : 1) : null,
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
      },
      {
        title: '机型',
        dataIndex: 'deviceName',
        key: 'deviceName',

      }, {
        title: '问题类别',
        dataIndex: 'questionTypeCodeName',
        key: 'questionTypeCodeName',
      }, {
        title: '相关故障代码',
        dataIndex: 'faultCode',
        key: 'faultCode',
      }, {
        title: '问题描述',
        dataIndex: 'faultDescription',
        key: 'faultDescription',
      }, {
        title: '处理措施',
        dataIndex: 'processingMethod',
        key: 'processingMethod',
      }, {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        sorter: true,
      }, {
        title: '点赞数',
        dataIndex: 'likeCount',
        key: 'likeCount',
        sorter: true,
      },
      {
        title: '操作',
        key: 'caozuo',
        render: (text, record, index) => {
          return (
            <div>
              <span className={`${styles.editPoint}  iconfont icon-look`} onClick={() => this.showCaseDetail(record)}></span>
              <span className={`${styles.editPoint}  iconfont icon-edit`} onClick={() => this.showEditPage(record)}></span>
              <span className={`${styles.editPoint}  iconfont icon-del`} onClick={() => this.deleteCasePart(record)}></span>
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
      </div>
    );
  }
}
export default (CaseList);
