import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import RecordForm from './RecordForm';
import RecordDetail from './RecordDetail';
import PlanDetail from './PlanDetail';
import styles from './recordModals.scss';

class HandleRecord extends PureComponent {

  static propTypes = {
    theme: PropTypes.string,
    modalKey: PropTypes.string,
    showModal: PropTypes.bool,
    changeStore: PropTypes.func,
  };

  cancelHandle = () => { // 关闭
    this.props.changeStore({
      showModal: false,
      modalKey: null,
      recordDetailInfo: null,
    });
  }

  modalTitle = {
    addRecord: '添加工作记事',
    editRecord: '编辑工作记事',
    recordDetail: '工作记事详情',
    planDetail: '工作计划详情',
  }

  render(){
    const { showModal, modalKey, theme } = this.props;
    // modalKey: addRecord增记事 editRecord改记事, recordDetail记事详情, planDetail工作计划详情,
    return (
      <Modal
        title={this.modalTitle[modalKey]}
        visible={showModal && ['addRecord', 'editRecord', 'recordDetail', 'planDetail'].includes(modalKey)}
        onCancel={this.cancelHandle}
        footer={null}
        width={625}
        wrapClassName={styles[theme]}
      >
        { ['addRecord', 'editRecord'].includes(modalKey) && <RecordForm
          {...this.props}
          cancelHandle={this.cancelHandle}
        />}
        { modalKey === 'recordDetail' && <RecordDetail
          {...this.props}
          cancelHandle={this.cancelHandle}
        />}
        { modalKey === 'planDetail' && <PlanDetail
          {...this.props}
          cancelHandle={this.cancelHandle}
        />}
      </Modal>
    );
  }
}

export default HandleRecord;
