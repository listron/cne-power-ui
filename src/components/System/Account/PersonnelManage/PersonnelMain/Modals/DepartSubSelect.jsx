
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import styles from './modals.scss';

class EachDepart extends Component{
  static propTypes = {
    departmentId: PropTypes.string,
    departmentName: PropTypes.string,
    checkedDepartIds: PropTypes.array,
    checked: PropTypes.bool,
    onCheck: PropTypes.func,
  }

  checkDepart = () => {
    const { departmentId, checkedDepartIds, checked } = this.props;
    const newCheckedIds = checked ? checkedDepartIds.filter(e => departmentId !== e) : checkedDepartIds.concat(departmentId);
    this.props.onCheck(newCheckedIds);
  }

  render(){
    const { departmentName, checked } = this.props;
    return (
      <span onClick={this.checkDepart} className={styles.eachDepart}>
        <Icon type="check" className={`${checked ? styles.activeIcon : styles.inactiveIcon}`} />
        <span title={departmentName} className={styles.name}>{departmentName}</span>
      </span>
    );
  }
}

class DepartSubSelect extends Component {
  static propTypes = {
    checkedIds: PropTypes.array, // 选中的departmentId数组
    departInfo: PropTypes.object,
    checkChange: PropTypes.func,
  }

  state={
    open: false,
  }

  checkDepartment = (newCheckedIds) => {
    this.props.checkChange(newCheckedIds);
  }

  toggleSubShow = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  render() {
    const { open } = this.state;
    const { checkedIds, departInfo } = this.props;
    const { list, departmentName, departmentId } = departInfo || {};
    const subDeparts = list || [];
    const height = Math.ceil(subDeparts.length / 3) * 24;
    return (
      <div className={styles.departSubSelect}>
        <div className={styles.fartherDepart}>
          <EachDepart
            departmentName={departmentName}
            departmentId={departmentId}
            onCheck={this.checkDepartment}
            checked={checkedIds.includes(departmentId)}
            checkedDepartIds={checkedIds}
          />
          {list.length > 0 && <Icon
            className={`${styles.icon} ${open ? styles.iconRotate : ''}`}
            type="down"
            onClick={this.toggleSubShow}
          />}
        </div>
        <div className={styles.subLists} style={{height: open ? `${height}px` : '0px'}}>
          {subDeparts.map(e => {
            const { departmentId, departmentName } = e;
            return (
              <div className={styles.eachDepartBox} key={departmentId}>
                <EachDepart
                  key={departmentId}
                  departmentName={departmentName}
                  departmentId={departmentId}
                  checked={checkedIds.includes(departmentId)}
                  onCheck={this.checkDepartment}
                  checkedDepartIds={checkedIds}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DepartSubSelect;
