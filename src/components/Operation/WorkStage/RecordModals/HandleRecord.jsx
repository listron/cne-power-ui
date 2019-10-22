import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
// import styles from './recordModals.scss';
import RecordForm from './RecordForm';
import RecordDetail from './RecordDetail';

class HandleRecord extends PureComponent {

  static propTypes = {
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
  }

  render(){
    const { showModal, modalKey } = this.props;
    // modalKey: addRecord增记事 editRecord改记事, recordDetail记事详情
    return (
      <Modal
        title={this.modalTitle[modalKey]}
        visible={showModal && ['addRecord', 'editRecord', 'recordDetail'].includes(modalKey)}
        onCancel={this.cancelHandle}
        footer={null}
        width={625}
      >
        { ['addRecord', 'editRecord'].includes(modalKey) && <RecordForm
          {...this.props}
          cancelHandle={this.cancelHandle}
        />}
        { modalKey === 'recordDetail' && <RecordDetail
          {...this.props}
          cancelHandle={this.cancelHandle}
        />}
      </Modal>
    );
  }
}

export default HandleRecord;
