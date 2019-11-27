

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import styles from './list.scss';

const { Option } = Select;

class ListHandle extends Component {
  static propTypes = {
    userListPageInfo: PropTypes.object,
  }

  toAddUser = () => {
    console.log('to add user');
  }

  handleUser = (a, b, c) => {
    console.log(a, b, c);
  }

  paginationChange = (a, b, c) => {
    console.log(a, b, c);
  }

  render(){
    const { userListPageInfo } = this.props;
    const { pageNum, pageSize } = userListPageInfo;
    return (
      <div className={styles.listHandle}>
        <span className={styles.leftHandle}>
          <Button type="add" onClick={this.toAddUser}><i>+</i>添加人员</Button>
          <Select
            onChange={this.handleUser}
            style={{width: '70px', margin: '0 28px 0 10px'}}
            value="操作"
            dropdownMatchSelectWidth={false}
          >
            <Option key="assign">分配人员</Option>
            <Option key="examine">审核人员</Option>
            <Option key="logout">注销人员</Option>
          </Select>
          <span>设置</span>
        </span>
        <CommonPagination
          total={0}
          pageSize={pageSize}
          currentPage={pageNum}
          onPaginationChange={this.paginationChange}
        />
      </div>
    );
  }
}

export default ListHandle;
