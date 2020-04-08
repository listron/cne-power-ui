import React, { Component } from 'react';
import AddCleanoutRecord from './AddCleanoutRecord';
import styles from './PlanRecordTable.scss';
import WarningTip from '../../../../Common/WarningTip';
import CneTable from '@components/Common/Power/CneTable';
import { handleRight } from '@utils/utilFunc';
import { Table, Form } from 'antd';

class PlanRecordTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showWarningTip: false,
      warningTipText: '点击确定,可删除此条清洗计划',
      recordPlanData: {},
      showEditModal: false,
    };
  }
  tableChange = () => {
  }
  showDeletModal = (record) => {
    this.setState({
      recordPlanData: record,
      showWarningTip: true,
    });
  }

  confirmWarningTip = () => { // 提示框确认
    const { recordPlanData } = this.state;
    //此处的planId是记录ID
    const planId = recordPlanData.recordId;
    this.setState({
      showWarningTip: false,
    });
    //执行删除此条清洗计划
    this.props.deleteCleanRecord({ planId });
  }
  cancelWarningTip = () => {//取消提示框
    this.setState({
      showWarningTip: false,

    });
  }
  showEditRecoord = (record) => {
    this.setState({ showEditModal: true, recordId: record.recordId });
    const { getCleanRecordDetail } = this.props;
    getCleanRecordDetail({ planId: record.recordId });
  }

  cancelAddRecord = () => {
    this.setState({ showEditModal: false });
  }
  render() {

    const { planId, cleanRecordListData, loading, cleanRecorddetail, theme } = this.props;
    const { showWarningTip, warningTipText, showEditModal, recordId } = this.state;
    const planRecorOperation = handleRight('analysis_cleanModel_planRecord_operate');

    const column = [
      {
        title: '清洗时间',
        dataIndex: 'cleanTime',
        textAlign: 'center',
        className: styles.cleanTime,
        render: (text, record, index) => {
          return (
            <span className={styles.cleanTime} title={record.cleanTime}>{record.cleanTime ? record.cleanTime : '--'}</span>
          );
        },
      }, {
        title: '方阵',
        dataIndex: 'matrix',
        textAlign: 'left',
        className: styles.matrix,
        render: (text, record, index) => {
          return (
            <span className={styles.matrixText} title={record.matrix}>{(record.matrix && +record.matrix !== 0) ? record.matrix : '--'}</span>
          );
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        textAlign: 'left',
        className: styles.remark,
        render: (text, record, index) => {
          return (
            <span className={styles.remarkText} title={record.remark}>{(record.remark && +record.remark !== 0) ? record.remark : '--'}</span>
          );
        },
      }, {
        title: 'PR(三天前/三天后)',
        dataIndex: 'pr',
        key: 'pr',
        className: styles.pr,
        textAlign: 'text',
      },
    ];

    const cleanOperation = {
      title: '操作',
      dataIndex: 'check',
      textAlign: 'center',
      className: styles.check,
      render: (text, record, index) => {
        return (
          <div>
            <span style={{ marginRight: '4px' }} title="编辑" className="iconfont icon-edit" onClick={() => this.showEditRecoord(record)}></span>
            <span title="删除" className="iconfont icon-del" onClick={() => this.showDeletModal(record)}></span>
          </div>
        );
      },
    };

    return (
      <div className={styles[theme]}>
        {showWarningTip && <WarningTip style={{ width: '240px', marginTop: '312px' }} onOK={this.confirmWarningTip} onCancel={this.cancelWarningTip} value={warningTipText} />}
        <CneTable
          loading={loading}
          dataSource={cleanRecordListData.map((e, i) => {
            const prArr = e.pr.split(',');
            const pr = `${+prArr[0] && +prArr[0] !== 0 ? prArr[0] : '--'},${+prArr[1] && +prArr[1] !== 0 ? prArr[1] : '--'}`;
            return ({ ...e, key: i, pr: pr });
          })}
          columns={planRecorOperation ? column.concat(cleanOperation) : column}
          className={styles.stationTable}
          onChange={this.tableChange}
          pagination={false}
          locale={{ emptyText: <img src="/img/nodata.png" /> }}
        />
        {showEditModal ? <AddCleanoutRecord {...this.props} recordId={recordId} showAddRecordModal={showEditModal} cancelAddRecord={this.cancelAddRecord} getAddOrEditCleanRecord={this.props.editCleanRecord} initValue={cleanRecorddetail} /> : ''}
      </div>
    );
  }
}
export default Form.create()(PlanRecordTable);
