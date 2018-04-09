import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import Immutable from 'immutable';

class User extends Component {
  static propTypes = {
    fetchUsers: PropTypes.func
  }

  static defaultProps = {
    users: Immutable.fromJS([])
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentStatus: 1,
      searchName: "",
      searchStatus: ""
    };
  }

  _renderList() {
    const users = this.props.users.toJS();

    const columns = [{
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => {return (index + 1)}
    }, {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    }, {
      title: '真实姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
    }, {
      title: '授权电站个数',
      dataIndex: 'number',
      key: 'number',
    }, {
      title: '注册时间',
      dataIndex: 'date',
      key: 'date',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }];

    const pagination = {
      total: users.length,
      current: 1,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      },
      onChange(current) {
        console.log('Current: ', current);
      }
    };
    

    return (
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
        <Table rowKey="id" dataSource={posts} columns={columns} pagination={pagination} />
      </div>
    );
  }

  componentWillMount() {
    this.props.fetchUsers();
  }



  render() {
    return (
      <div>
        {this._renderFilter()}
        {this._renderList()}
      </div>
    );
  }
}

export default User;