import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from 'antd';
import styles from './planModals.scss';

class PlanHandle extends PureComponent {

  static propTypes = {
    showModal: PropTypes.bool,
    handlePlanLoading: PropTypes.bool,
    modalKey: PropTypes.string,
    datePlans: PropTypes.string,
    activePlanDate: PropTypes.string,
    changeStore: PropTypes.func,
  };

  state = {
    planColumn: [
      {
        title: '计划类型',
        dataIndex: 'planTypeName',
        className: styles.planTypeName,
        render: (text = '') => (<div title={text} className={styles.planTypeNameText}>{text}</div>),
      }, {
        title: '内容',
        dataIndex: 'inspectContent',
        className: styles.inspectContent,
        render: (text = '') => (<div title={text} className={styles.inspectContentText}>{text}</div>),
      }, {
        title: '电站',
        dataIndex: 'stationName',
        render: (text = '') => (<div title={text} className={styles.stationNameText}>{text}</div>),
      }, {
        title: '计划天数',
        dataIndex: 'validPeriod',
        render: (text = '') => (<div title={text} className={styles.validPeriodText}>{text}</div>),
      }, {
        title: '操作',
        dataIndex: 'handle',
        render: (text = '') => (<div title={text} className={styles.handle}>{text}</div>),
      },
    ],
  }

  cancelHandle = () => { // 关闭
    this.props.changeStore({
      showModal: false,
      modalKey: null,
      datePlans: [],
    });
  }

  render(){
    const { showModal, modalKey, activePlanDate, datePlans, handlePlanLoading } = this.props;
    const { planColumn } = this.state;
    return (
      <Modal
        title={`工作计划 ${activePlanDate}`}
        visible={showModal && modalKey === 'handlePlan'}
        onCancel={this.cancelHandle}
        footer={null}
        width={1240}
      >
        <div>
          <div>
            <Button>批量下发</Button>
            <Button>批量删除</Button>
          </div>
          <Table
            dataSource={datePlans}
            columns={planColumn}
            pagination={false}
            loading={handlePlanLoading}
            scroll={{ y: 330 }}
            className={styles.recordTable}
          />
        </div>
      </Modal>
    );
  }
}

export default PlanHandle;
