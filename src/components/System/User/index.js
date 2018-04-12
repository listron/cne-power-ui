import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Tag, Input, Select, Radio, Button } from 'antd';
import Immutable from 'immutable';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class User extends Component {
  static propTypes = {
    fetchUsers: PropTypes.func,
    onRoleAuth: PropTypes.func,
    onStationAuth: PropTypes.func,
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
    this._onChangeSearchName = this._onChangeSearchName.bind(this);
    this._onChangeSearchStatus = this._onChangeSearchStatus.bind(this);
    this._onChangeTab = this._onChangeTab.bind(this);
    this._onSelectChange = this. _onSelectChange.bind(this);
    this._onRoleAuth = this._onRoleAuth.bind(this);
    this._onStationAuth = this._onStationAuth.bind(this);
  }

  _onChangeSearchName(e) {
    this.setState({
      searchName: e.target.value
    });
  }

  _onChangeSearchStatus(value) {
    this.setState({
      searchStatus: value
    });
  }

  _onChangeTab(e) {
    this.setState({
      tab: e.target.value
    });
  }

  _onSelectChange(selectedRowKeys) {
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  }

  _onRoleAuth() {

  }

  _onStationAuth() {
    
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

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this._onSelectChange,
    };

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
            <RadioGroup onChange={this._onChangeTab} defaultValue="all" value={this.state.status}>
              <RadioButton value="all">全部</RadioButton>
              <RadioButton value="on">已授权</RadioButton>
              <RadioButton value="off">未授权</RadioButton>
            </RadioGroup>
          </div>
          <div>
            <Button onClick={this._onRoleAuth}>
              <span className={classnames("iconfont icon-user")} /> 
              角色授权
            </Button>
            <Button onClick={this._onStationAuth}>
              <span className={classnames("iconfont icon-power-station")} /> 
              电站授权
            </Button>
          </div>
        </div>
        <Table rowKey="id" dataSource={posts} columns={columns} pagination={pagination} />
      </div>
    );
  }

  componentWillMount() {
    this.props.fetchUsers();
  }

  _renderFilter() {
    return (
      <div>
        <Tag color="#7ec5c2">查询</Tag>
        <Input id="searchName" 
          placeholder="输入手机号/姓名快速查询" 
          onChange={this._onChangeSearchName}
          value={this.state.searchName} />
        <Select id="searchStatus"
          placeholder="状态"
          onChange={this._onChangeSearchStatus}
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
        {this._renderFilter()}
        {this._renderList()}
      </div>
    );
  }
}

export default User;