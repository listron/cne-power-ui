
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Button } from 'antd';
import DepartSubSelect from './DepartSubSelect';
import styles from './modals.scss';

class DepartmentSelector extends Component {
  static propTypes = {
    departmentTree: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
    username: PropTypes.string,
  }

  state = {
    isShow: false,
    checkedDepartment: [],
  }

  showModal = () => {
    const { value } = this.props;
    this.setState({
      isShow: true,
      checkedDepartment: value,
    });
  }

  handleOK = () => {
    const { checkedDepartment } = this.state;
    this.props.onChange(checkedDepartment);
    this.setState({ isShow: false });
  }

  hideModal = () => {
    this.setState({ isShow: false });
  }

  onChecked = (checkedDepartment) => {
    this.setState({ checkedDepartment });
  }

  calcCheckNum = (departmentTree, checkedDepartment) => {
    const fartherNum = departmentTree.filter(e => checkedDepartment.includes(e.departmentId)).length;
    const sonNum = checkedDepartment.length - fartherNum;
    return { fartherNum, sonNum };
  }

  render() {
    const { departmentTree, username } = this.props;
    const { isShow, checkedDepartment } = this.state;
    const { fartherNum, sonNum } = this.calcCheckNum(departmentTree, checkedDepartment);
    return (
      <div className={styles.departmentAssignModal}>
        <i className={`iconfont icon-filter ${styles.handlIcon}`} onClick={this.showModal} />
        <Modal
          visible={isShow}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          title={
            <div className={styles.title}>
              <span>请选择所属部门</span>
              <Icon className={styles.close} type="close" onClick={this.cancelAssign} />
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
                <DepartSubSelect key={e.departmentId} checkedIds={checkedDepartment} departInfo={e} checkChange={this.onChecked} />
              ))}
            </div>
            <div className={styles.footer}>
              <span>已选{fartherNum}个父部门, {sonNum}个子部门</span>
              <span>
                <Button>取消</Button>
                <Button>确定</Button>
              </span>
            </div>
          </section>
        </Modal>
      </div>
    );
  }
}
export default DepartmentSelector;
