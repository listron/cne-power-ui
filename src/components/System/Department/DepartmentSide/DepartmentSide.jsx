


//备注： 次文件在最初产品设计时用于展示企业列表时使用。现只展示企业详情不展示企业列表。后续可能继续开发企业列表展示功能，请不要贸然删除。
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './departmentSide.scss';
import AddDepartment from './AddDepartment';
import DepartmentDetail from './DepartmentDetail';
import EditDepartment from './EditDepartment';

class DepartmentSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    changeDepartmentStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }


  render(){
    const { showSidePage, changeDepartmentStore } = this.props;
    return (
      <div className={styles.departmentSide}>
        {showSidePage === 'detail' && <div>
            详情页标志
            <DepartmentDetail {...this.props} />
          </div>
        }
        { showSidePage === 'add' && <AddDepartment {...this.props} /> }
        { showSidePage === 'edit' && <EditDepartment {...this.props} />
        }
      </div>
    )
  }
}

export default DepartmentSide;
