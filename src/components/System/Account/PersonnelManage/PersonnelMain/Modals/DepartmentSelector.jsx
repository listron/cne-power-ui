
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
    onChange: PropTypes.func,
  }

  state = {
    departmentsList: [], // 将departmentTree 树形结构全部抽离为一维数组的结果
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
    const { value } = this.props;
    const { departmentsList } = this.state;
    // departmentId
    // departmentName
    // parentDepartmentId
    // departmentSource
    return (
      <div>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择"
          onChange={this.handleChange}
          value={value}
        >
          {departmentsList.map(e => (
            <Option key={e.departmentId} value={e.departmentId}>{e.departmentName}</Option>
          ))}
        </Select>
        <DepartmentAssignModal { ...this.props} />
      </div>
    );
  }
}
export default DepartmentSelector;
