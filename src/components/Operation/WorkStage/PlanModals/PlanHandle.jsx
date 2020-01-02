import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from 'antd';
import moment from 'moment';
import HandlePart from './HandlePart';
import WarningTip from '@components/Common/WarningTip';
import styles from './planModals.scss';
import { handleRight } from '@utils/utilFunc';

class PlanHandle extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    showModal: PropTypes.bool,
    handlePlanLoading: PropTypes.bool,
    planListLoading: PropTypes.bool,
    handleError: PropTypes.bool,
    modalKey: PropTypes.string,
    datePlans: PropTypes.array,
    planList: PropTypes.array,
    activePlanDate: PropTypes.string,
    changeStore: PropTypes.func,
    handlePlanStatus: PropTypes.func,
  };

  state = {
    baseColumn: [
      {
        title: '计划类型',
        dataIndex: 'planTypeName',
        width: 160,
        render: (text = '') => (<div title={text} className={styles.planTypeNameText}>{text}</div>),
      }, {
        title: '内容',
        dataIndex: 'inspectContent',
        className: styles.inspectContent,
        render: (text = '') => (<div title={text} className={styles.inspectContentText}>{text}</div>),
      }, {
        title: '电站',
        dataIndex: 'stationName',
        className: styles.stationName,
        render: (text = '') => (<div title={text} className={styles.stationNameText}>{text}</div>),
      }, {
        title: '执行天数',
        dataIndex: 'validPeriod',
        width: 90,
        render: (text = '') => (<div title={text} className={styles.validPeriodText}>{text}</div>),
      },
    ],
    handleRow: {
      title: '操作',
      dataIndex: 'handle',
      width: 150,
      render: (text, record) => <HandlePart record={record} publishOnce={this.publishOnce} deleteOnce={this.deleteOnce} />,
    },
    handleType: '', // publish, delete
    selectedRowKeys: [], // 选中项
    handleParams: null,
    warningTipText: '',
  }

  componentWillReceiveProps(nextProps){
    const { handlePlanLoading, handleError, planListLoading, planList, activePlanDate } = nextProps;
    const preLoading = this.props.handlePlanLoading;
    const preListLoading = this.props.planListLoading;
    if (!handlePlanLoading && preLoading && !handleError) { // 操作请求 成功
      this.setState({
        selectedRowKeys: [],
        handleParams: null,
        warningTipText: '',
        handleType: '',
      });
    }
    if(!planListLoading && preListLoading){ // 日历列表数据返回
      const curPlan = planList.find(e => moment(e.reportDate).isSame(activePlanDate, 'day')) || {};
      const list = curPlan.list || [];
      const datePlans = list.map(e => ({ ...e, key: e.planDetailId }));
      this.props.changeStore({ datePlans });
    }
  }

  rowSelects = (selectedRowKeys) => { // 行选中
    this.setState({ selectedRowKeys });
  }

  hideModal = () => { // 取消退出弹框
    this.props.changeStore({
      showModal: false,
      modalKey: null,
    });
  }

  cancelHandle = () => { // 关闭弹框
    this.props.changeStore({
      showModal: false,
      modalKey: null,
      datePlans: [],
    });
  }

  publishAll = () => this.handleStatusChange(this.state.selectedRowKeys, 1, '确定要立即下发该工作计划么?', 'publish')

  publishOnce = ({ planDetailId }) => this.handleStatusChange([planDetailId], 1, '确定要立即下发该工作计划么?', '')

  deleteAll = () => this.handleStatusChange(this.state.selectedRowKeys, 3, '确定要立即删除该工作计划么?', 'delete')

  deleteOnce = ({ planDetailId }) => this.handleStatusChange([planDetailId], 3, '确定要立即删除该工作计划么?', '')

  handleStatusChange = (planDetailIds, taskStatus, warningTipText, handleType) => {
    this.setState({
      handleParams: {
        planDetailIds,
        taskStatus,
      },
      handleType,
      warningTipText,
    });
  }

  cancelHandle = () => { // 取消发布/删除
    this.setState({
      handleParams: null,
      warningTipText: '',
    });
  }

  confirmHandle = () => { // 发布 / 删除
    const { activePlanDate } = this.props;
    const { handleParams } = this.state;
    this.props.handlePlanStatus({
      ...handleParams,
      taskTime: activePlanDate,
    });
  }

  cancelSelect = () => {
    this.setState({ selectedRowKeys: [] });
  }

  render(){
    const { showModal, modalKey, activePlanDate, datePlans, handlePlanLoading, planListLoading, theme } = this.props;
    const { baseColumn, handleType, selectedRowKeys, handleParams, warningTipText, handleRow } = this.state;
    const hasRowSelected = selectedRowKeys.length > 0;
    const planManageRight = handleRight('operation_workStation_manage');
    const planColumn = planManageRight ? baseColumn.concat(handleRow): baseColumn;
    return (
      <Modal
        title={`工作计划 ${activePlanDate}`}
        visible={showModal && modalKey === 'handlePlan'}
        onCancel={this.hideModal}
        footer={null}
        width={1240}
        wrapClassName={styles[theme]}
      >
        <div className={styles.planHandle}>
          {planManageRight && <div className={styles.handle}>
            <Button
              onClick={this.publishAll}
              loading={handleType === 'publish' && handlePlanLoading}
              disabled={!hasRowSelected}
            >批量下发</Button>
            <Button
              onClick={this.deleteAll}
              loading={handleType === 'delete' && handlePlanLoading}
              disabled={!hasRowSelected}
            >批量删除</Button>
          </div>}
          <Table
            dataSource={datePlans}
            columns={planColumn}
            pagination={false}
            loading={planListLoading}
            scroll={{ y: 330 }}
            className={styles.planTable}
            rowSelection={{
              selectedRowKeys,
              onChange: this.rowSelects,
            }}
          />
          <div className={styles.planFooter}>
            已选择<span className={styles.selectNum}>{selectedRowKeys.length}</span>项
            <span onClick={this.cancelSelect} className={styles.cancelSelect}>取消选择</span>
          </div>
          {handleParams && <WarningTip
            onCancel={this.cancelHandle}
            onOK={this.confirmHandle}
            value={warningTipText}
            style={{ width: '220px', height: '88px' }}
          />}
        </div>
      </Modal>
    );
  }
}

export default PlanHandle;
