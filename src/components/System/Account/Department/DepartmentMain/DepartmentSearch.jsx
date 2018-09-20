

import React, { Component } from 'react';
import { Input, Button } from 'antd';
import styles from './departmentMain.scss';
import PropTypes from 'prop-types';


class DepartmentSearch extends Component {
  static propTypes = {
    searchDepartment: PropTypes.func,
    departmentName: PropTypes.string,
    parentDepartmentName: PropTypes.string,
    stationName: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
      departmentName: '',
      parentDepartmentName: '',
      stationName: '',
    }
  }
  onDepartmentSearch = () => {
    const { departmentName, parentDepartmentName, stationName, } = this.state;
    this.props.searchDepartment({
      pageNum: 1,
      departmentName,
      parentDepartmentName,
      stationName
    })
  }
  onDepartmentReset = () => {
    const searchResetInfor = {
      departmentName: '',
      parentDepartmentName: '',
      stationName: '',
      pageNum: 1,
    }
    this.props.searchDepartment({...searchResetInfor})
    this.setState({...searchResetInfor})
  }

  onNameChange = (e) => {
    this.setState({
      departmentName: e.target.value
    })
  }
  onParentNameChange = (e) => {
    this.setState({
      parentDepartmentName: e.target.value
    })
  }
  onStationNameChange = (e) => {
    this.setState({
      stationName: e.target.value
    })
  }

  render(){
    const { departmentName, parentDepartmentName,stationName } = this.state;
    const showRestButton = this.props.departmentName || this.props.parentDepartmentName || this.props.stationName;
    return (
      <div className={styles.departmentSearch}>
          <span  className={styles.departmentName}>部门名称</span>
          <Input placeholder="请输入..." className={styles.departmentInput} onChange={this.onNameChange} value={departmentName} />
          <span className={styles.parentName}>所属部门</span>
          <Input placeholder="请输入..." className={styles.parentInput} onChange={this.onParentNameChange} value={parentDepartmentName} />      
          <span className={styles.stationName}>负责电站</span>
          <Input placeholder="请输入..." className={styles.stationInput} onChange={this.onStationNameChange} value={stationName} />     
          <Button className={styles.searchButton} onClick={this.onDepartmentSearch}>查询</Button>  
          {showRestButton && <span className={styles.clearButton}  onClick={this.onDepartmentReset}>重置</span>}         
      </div>
    )
  }
}

export default DepartmentSearch;
