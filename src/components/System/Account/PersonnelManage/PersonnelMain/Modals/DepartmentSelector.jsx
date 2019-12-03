
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import DepartmentAssignModal from './DepartmentAssignModal';
import styles from './modals.scss';

const { Option } = Select;

class DepartmentSelector extends Component {
  static propTypes = {
    departmentTree: PropTypes.array,
    value: PropTypes.array,
    username: PropTypes.string,
    onChange: PropTypes.func,
  }

  state = {
    departmentsList: [], // 将departmentTree 树形结构全部抽离为一维数组的结果
    modalShow: false, // modal展示
    tmpCheckedDeparts: [], // 用于缓存modal数据的部门ids
  }

  componentDidMount(){
    const { departmentTree } = this.props;
    departmentTree.length > 0 && this.createDepartmentsList(departmentTree);
  }

  componentWillReceiveProps(nextProps){
    const { departmentTree } = nextProps;
    const preTree = this.props.departmentTree;
    if (preTree !== departmentTree) {
      this.createDepartmentsList(departmentTree);
    }
  }

  showModal = () => { // 展示弹框
    const { value } = this.props;
    this.setState({
      modalShow: true,
      tmpCheckedDeparts: value,
    });
  }

  hideModal = () => { // 隐藏弹框
    this.setState({
      modalShow: false,
      tmpCheckedDeparts: [],
    });
  }

  onChecked = (tmpCheckedDeparts) => { // 弹框内容选中
    this.setState({ tmpCheckedDeparts });
  }

  onModalOK = () => { // 弹框内容确定
    const { tmpCheckedDeparts } = this.state;
    this.props.onChange(tmpCheckedDeparts);
    this.setState({
      modalShow: false,
      tmpCheckedDeparts: [],
    });
  }

  handleChange = (value) => {
    this.props.onChange(value);
  }

  createDepartmentsList = (departmentTree) => {
    const departmentsList = [];
    departmentTree.forEach(e => {
      const { list, ...rest } = e;
      departmentsList.push(rest);
      if (list && list.length > 0) {
        departmentsList.push(...list);
      }
    });
    this.setState({ departmentsList });
  }

  render() {
    const { value, departmentTree, username = '' } = this.props;
    const { departmentsList, modalShow, tmpCheckedDeparts } = this.state;
    return (
      <div className={styles.departmentSelector}>
        <Select
          mode="multiple"
          style={{ width: '200px' }}
          placeholder="请选择"
          onChange={this.handleChange}
          value={value}
        >
          {departmentsList.map(e => (
            <Option key={e.departmentId} value={e.departmentId}>{e.departmentName}</Option>
          ))}
        </Select>
        <div className={styles.departmentAssignModal}>
          <i className={`iconfont icon-filter ${styles.handlIcon}`} onClick={this.showModal} />
          <DepartmentAssignModal
            value={tmpCheckedDeparts}
            onCheck={this.onChecked}
            onChange={this.onModalOK}
            modalShow={modalShow}
            departmentTree={departmentTree}
            username={username}
            hideModal={this.hideModal}
          />
        </div>
      </div>
    );
  }
}
export default DepartmentSelector;
