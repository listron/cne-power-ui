import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Tag, Input, Select, Radio, Button } from 'antd';
import Immutable from 'immutable';
import classnames from 'classnames';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class User extends Component {
  static propTypes = {
    fetchUsers: PropTypes.func,
    onRoleAuth: PropTypes.func,
    onStationAuth: PropTypes.func,
    users: PropTypes.object
  }

  static defaultProps = {
    users: Immutable.fromJS([])
  }

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchName: "",
      searchStatus: "",
      tab: "all",
      selectedRowKeys: []
    };
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.onChangeSearchStatus = this.onChangeSearchStatus.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onSelectChange = this. onSelectChange.bind(this);
    this.onRoleAuth = this.onRoleAuth.bind(this);
    this.onStationAuth = this.onStationAuth.bind(this);
  }

  componentWillMount() {
    this.props.fetchUsers();
  }

  onChangeSearchName(e) {
    this.setState({
      searchName: e.target.value
    });
  }

  onChangeSearchStatus(value) {
    this.setState({
      searchStatus: value
    });
  }

  onChangeTab(e) {
    this.setState({
      tab: e.target.value
    });
  }

  onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  }

  onRoleAuth() {
    this .props.onRoleAuth(this.state.selectedRowKeys);
  }

  onStationAuth() {
    this.props.onStationAuth(this.state.selectedRowKeys);
  }

  renderList() {
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
      showQuickJumper: true,
      current: this.state.currentPage,
      onChange: (current) => {
        this.setState({
          currentPage: current
        });
      }
    };
  
    return (
      <div>
        <div>
          <div>
            <Tag color="#7ec5c2">用户列表</Tag>
            <RadioGroup onChange={this.onChangeTab} defaultValue="all" value={this.state.status}>
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="on">已授权</RadioButton>
              <RadioButton value="off">未授权</RadioButton>
            </RadioGroup>
          </div>
          <div>
            <Button onClick={this.onRoleAuth}>
              <span className={classnames("iconfont icon-user")} /> 
              角色授权
            </Button>
            <Button onClick={this.onStationAuth}>
              <span className={classnames("iconfont icon-power-station")} /> 
              电站授权
            </Button>
          </div>
        </div>
        <Table rowKey="id" dataSource={users} columns={columns} pagination={pagination} />
      </div>
    );
  }

  

  renderFilter() {
    return (
      <div>
        <Tag color="#7ec5c2">查询</Tag>
        <Input 
          id="searchName" 
          placeholder="输入手机号/姓名快速查询" 
          onChange={this.onChangeSearchName}
          value={this.state.searchName} />
        <Select 
          id="searchStatus"
          placeholder="状态"
          onChange={this.onChangeSearchStatus}
          value={this.state.searchStatus}>
          <Option value="all">全部</Option>
          <Option value="on">正常</Option>
          <Option value="off">禁用</Option>
        </Select>
      </div>
    );
  }



  render() {
    return (
      <div>
        {this.renderFilter()}
        {this.renderList()}
      </div>
    );
  }
}

export default User;