

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import CommonPagination from '@components/Common/CommonPagination';
import styles from './list.scss';

const { Option } = Select;

class ListHandle extends Component {
  static propTypes = {
    userListPageInfo: PropTypes.object,
    changeStore: PropTypes.func,
    getUserList: PropTypes.func,
  }

  toAddUser = () => {
    this.props.changeStore({ pageKey: 'addPersonnel' });
  }

  handleUser = (a, b, c) => {
    console.log(a, b, c);
  }

  paginationChange = ({ pageSize, currentPage }) => {
    const { userListPageInfo } = this.props;
    const newPageInfo = {
      ...userListPageInfo,
      pageNum: currentPage,
      pageSize,
    };
    this.props.changeStore({ userListPageInfo });
    this.props.getUserList({ ...newPageInfo });
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
            <Option key="assign">
              <span className={`iconfont icon-bumenx ${styles.icon}`} />分配人员
            </Option>
            <Option key="examine">
              <span className={`iconfont icon-examine1 ${styles.icon}`} />审核人员
            </Option>
            <Option key="logout">
              <span className={`iconfont icon-remove ${styles.icon}`} />注销人员
            </Option>
          </Select>
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
