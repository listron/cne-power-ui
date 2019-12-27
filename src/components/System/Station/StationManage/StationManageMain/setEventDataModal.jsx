

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Modal, message, Checkbox, Button } from 'antd';
import styles from './stationMain.scss'

class SetEventYxModal extends Component { // 电站管理列表页
  static propTypes = {
    allDepartmentData: PropTypes.array,
    departmentSetInfo: PropTypes.object,
    closeDepartmentModal: PropTypes.func,
  }

  constructor(props) {
    super(props);
    const { departmentSetInfo } = props;
    const checkedKeys = departmentSetInfo.stationDepartments || [];
    this.state = {
      checkedKeys,
    }
  }



  render() {
    const { departmentSetInfo, allDepartmentData } = this.props;
    return (
      <Modal
        title={<span>请设置平台级告警规则({departmentSetInfo.stationName})</span>}
        visible={true}
        onCancel={this.cancelSetting}
        okText="保存"
        cancelText="取消"
        wrapClassName={styles.departmentSetting}
        width={625}
        footer={<div className={styles.footer}>
          <Button onClick={this.cancelSetting} className={styles.cancel}>取消</Button>
          <Button onClick={this.confirmSetting} className={styles.confirm}>保存</Button>
        </div>}
      >


      </Modal>
    )
  }
}

export default SetEventYxModal;
