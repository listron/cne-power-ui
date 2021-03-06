

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DepartmentSearch from './DepartmentSearch';
import DepartmentTable from './DepartmentTable';
import Footer from '../../../../Common/Footer';
import styles from './departmentMain.scss';


//部门主页面。部门查询组件，分页及表格组件；
class DepartmentMain extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    departmentSource: PropTypes.number,
    departmentName: PropTypes.string,
    parentDepartmentName: PropTypes.string,
    stationName: PropTypes.string,
    sort: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    changeDepartmentStore: PropTypes.func,
    getDepartmentList: PropTypes.func,
    selectedDepartment: PropTypes.array,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.changeDepartmentStore({
      selectedDepartment: []
    })
  }

  searchDepartment = ({ departmentName, parentDepartmentName, stationName }) => {//部门搜索
    const params = {
      enterpriseId: this.props.enterpriseId,
      departmentSource: this.props.departmentSource,
      departmentName,
      parentDepartmentName,
      stationName,
      sort: this.props.sort,
      pageNum: 1,
      pageSize: this.props.pageSize,
    }
    this.props.getDepartmentList(params)//请求部门列表
  }

  render() {
    const { departmentName, parentDepartmentName, stationName } = this.props;
   
    return (
  
        <div className={styles.departmentMain}>
          <div className={styles.contentMain}>
            <DepartmentSearch searchDepartment={this.searchDepartment} departmentName={departmentName} parentDepartmentName={parentDepartmentName} stationName={stationName} />
            <DepartmentTable {...this.props} />
          </div>
          <Footer />
        </div>
      
    )
  }
}

export default DepartmentMain;
