
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Button } from 'antd';
import DepartSubSelect from './DepartSubSelect';
import styles from './modals.scss';
import CneButton from '@components/Common/Power/CneButton';

// 本身作为子组件使用, 也可以传入showControl与hiddenIcon配置后作为单独modal使用;
class DepartmentAssignModal extends Component {
  static propTypes = {
    modalShow: PropTypes.bool,
    departmentTree: PropTypes.array,
    value: PropTypes.array,
    username: PropTypes.string,
    onChange: PropTypes.func, // 最终确定输出
    onCheck: PropTypes.func, // 选中部门
    hideModal: PropTypes.func,
  }

  handleOK = () => {
    const { value } = this.props;
    this.props.onChange(value);
  }

  onChecked = (checkedDepartment) => {
    this.props.onCheck(checkedDepartment);
  }

  calcCheckNum = (departmentTree, checkedDepartment) => {
    const fartherNum = departmentTree.filter(e => checkedDepartment.includes(e.departmentId)).length;
    const sonNum = checkedDepartment.length - fartherNum;
    return { fartherNum, sonNum };
  }

  render() {
    const { departmentTree, username, modalShow, value } = this.props;
    const { fartherNum, sonNum } = this.calcCheckNum(departmentTree, value);
    return (
      <Modal
        visible={modalShow}
        onOk={this.props.onChange}
        onCancel={this.props.hideModal}
        title={
          <div className={styles.title}>
            <span>请选择所属部门</span>
            <Icon className={styles.close} type="close" onClick={this.props.hideModal} />
          </div>
        }
        closable={false}
        footer={null}
        width={625}
        wrapClassName={styles.departmentModal}
      >
        <section>
          <h3 className={styles.toptips}>
            <span className={styles.usernames}>当前人员: {username || '--'}</span>
            <span>
              <Icon type="check" className={styles.activeIcon} />
              <span>已选</span>
              <Icon type="check" className={styles.inactiveIcon} />
              <span>可选</span>
            </span>
          </h3>
          <div className={styles.departsContent}>
            {departmentTree.map(e => (
              <DepartSubSelect key={e.departmentId} checkedIds={value} departInfo={e} checkChange={this.onChecked} />
            ))}
          </div>
          <div className={styles.footer}>
            <span>已选{fartherNum}个父部门, {sonNum}个子部门</span>
            <span>
              <CneButton className={styles.cancel} onClick={this.props.hideModal}>取消</CneButton>
              <CneButton onClick={this.handleOK}>确定</CneButton>
            </span>
          </div>
        </section>
      </Modal>
    );
  }
}
export default DepartmentAssignModal;
