
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Button } from 'antd';
import DepartSubSelect from './DepartSubSelect';
import styles from './modals.scss';

// 本身作为子组件使用, 也可以传入showControl与hiddenIcon配置后作为单独modal使用;
class DepartmentAssignModal extends Component { 
  static propTypes = {
    departmentTree: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
    username: PropTypes.string,
    hiddenIcon: PropTypes.bool,
    modalShowControl: PropTypes.bool,
  }

  state = {
    isShow: false,
    checkedDepartment: [],
  }

  componentWillReceiveProps(nextProps){
    const { modalShowControl } = nextProps;
    const preModalShow = this.props.modalShowControl;
    if (modalShowControl !== preModalShow) { // 外界手动控制显隐;
      modalShowControl ? this.showModal() : this.hideModal();
    }
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
    this.setState({
      isShow: false,
      checkedDepartment: [],
    });
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
    const { departmentTree, username, hiddenIcon } = this.props;
    const { isShow, checkedDepartment } = this.state;
    const { fartherNum, sonNum } = this.calcCheckNum(departmentTree, checkedDepartment);
    return (
      <div className={styles.departmentAssignModal} style={hiddenIcon ? {display: 'none'} : {}}>
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
                <Button className={styles.cancel} onClick={this.hideModal}>取消</Button>
                <Button onClick={this.handleOK}>确定</Button>
              </span>
            </div>
          </section>
        </Modal>
      </div>
    );
  }
}
export default DepartmentAssignModal;
