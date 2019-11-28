

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import ListHandle from './ListHandle';
import styles from './list.scss';

class List extends Component {
  static propTypes = {
    userList: PropTypes.array,
  }

  state = {
    column: [
      {
        title: '用户名',
        dataIndex: 'username',
        render: (text) => <div className={styles.username} title={text}>{text}</div>,
      }, {
        title: '真实姓名',
        dataIndex: 'userFullName',
      }, {
        title: '电话',
        dataIndex: 'phoneNum',
      }, {
        title: '角色',
        dataIndex: 'roleName',
        render: (text) => <div className={styles.roleName} title={text}>{text}</div>,
      }, {
        title: '用户状态',
        dataIndex: 'enterpriseStatus',
        render: (text) => {
          const statusText = this.enterpriseStatusInfo[text];
          return <span className={statusText === '待审核' ? styles.toExamine : styles.status}>{statusText || '--'}</span>;
        },
        sorter: true,
      }, {
        title: '操作',
        dataIndex: 'handle',
      },
    ],
    rowSelectedKeys: [],
  }

  componentWillReceiveProps(nextProps){
    const { userList } = nextProps;
    const preList = this.props.userList;
    if (userList !== preList) { // 表格数据更新时候, 自动清空选中行
      this.setState({ rowSelectedKeys: [] });
    }
  }

  enterpriseStatusInfo = {
    3: '启用',
    4: '禁用',
    5: '待审核',
    6: '审核不通过',
    7: '移除',
  }

  rowSelect = (rowSelectedKeys) => {
    this.setState({ rowSelectedKeys });
  }

  render(){
    const { userList } = this.props;
    const { column, rowSelectedKeys } = this.state;
    return (
      <div className={styles.personnelMain}>
        <ListHandle {...this.props} />
        <Table
          dataSource={userList}
          columns={column}
          pagination={false}
          rowSelection={{
            onChange: this.rowSelect,
            selectedRowKeys: rowSelectedKeys,
          }}
        />
      </div>
    );
  }
}

export default List;
