import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, Tree, Checkbox, Avatar, Tag }  from 'antd';
import Immutable from 'immutable';
import Styles from './assignUserModal.scss';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

class AssignUserModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    currentUser: PropTypes.object,//当前用户
    enterprise: PropTypes.object,//当前企业
    departmentUserList: PropTypes.object,//immutable
    userList: PropTypes.object,//immutable
    getDepartmentTreeData: PropTypes.func,
    getUserList: PropTypes.func,
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      departmentUserList: Immutable.fromJS([]),
      selectedDepartment: Immutable.fromJS({}),
      userList: Immutable.fromJS([]),
      expandedKeys: [],
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.props.getDepartmentTreeData();
    this.props.getUserList();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.departmentUserList.size !== this.props.departmentUserList.size && nextProps.departmentUserList.size > 0) {
      let department = nextProps.departmentUserList.get(0);
      let departmentId = nextProps.departmentUserList.getIn([0, 'departmentId']);
      this.setState({
        departmentUserList: nextProps.departmentUserList,
        selectedDepartment: department,
        selectedKeys: [departmentId],
        userList: departmentId === 0 ? nextProps.departmentUserList.getIn([0, 'user']) : Immutable.fromJS([]),
      });
    }
  }

  onOk = () => {
    this.props.onSelect(this.state.departmentUserList);
  }

  onCancel = () => {
    Modal.warning({
      title: '关闭后将无法保存编辑信息！',
      okText: '确定',
      cancelText: '取消',
      onOk: this.props.onCancel
    });
  }

  onSelectNode = (selectedKeys, info) => {
    let item = info.node.props.dataRef;
    let key = info.node.props.key;//item.get('departmentId')
    const expandedKeys = this.state.expandedKeys;
    if(item.get('childDepartmentData')) {
      if(expandedKeys.indexOf(key) === -1) {
        expandedKeys.push(key);
      } else {
        expandedKeys.splice(expandedKeys.indexOf(key), 1);
      }
      this.setState({
        expandedKeys,
      });
    } else {
      if(key === 0) {
        this.setState({
          userList: item.get('user')
        });
      } else {
        this.setState({
          userList: Immutable.fromJS([])
        });
      }
    }
    this.setState({
      selectedDepartment: item,
      selectedKeys
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  onCheckUser = (obj, checked) => {
    let { selectedDepartment, departmentUserList, selectedKeys } = this.state;
    let user = selectedDepartment.get('user');
    let departmentId = selectedKeys[0];
    const departmentIndex = departmentUserList.findIndex((item) => {
      return departmentId === item.get('departmentId');
    });
    if(checked) {
      user = user.push(Immutable.fromJS({
        userId: obj.get('userId'),
        userName: obj.get('userName'),
        disabled: false
      }));
    } else {
      let index = user.findIndex((item) => {
        return item.get('userId') === obj.get('userId');
      });
      if(index > -1) {
        user = user.delete(index);
      }
    }
    selectedDepartment = selectedDepartment.set('user', user);
    departmentUserList = departmentUserList.set(departmentIndex, selectedDepartment);
    this.setState({
      selectedDepartment,
      departmentUserList
    });
  }

  getUserChecked(obj) {
    let selectedDepartment = this.state.selectedDepartment;
    let user = selectedDepartment.get('user');
    let index = user.findIndex((item) => {
      return item.get('userId') === obj.get('userId');
    });
    if(index > -1) {
      return true;
    } else {
      return false;
    }
  }

  getUserDepartment(obj) {
    let departmentData = obj.get('departmentData');
    let result = '';
    for(let i = 0; i < departmentData.size; i++) {
      result += '，' + departmentData.getIn([i, 'departmentName']);
    }
    result.splice(0, 1);
    return result;
  }

  transformData(data) {
    let child, user, childUser;
    const filterNode = (data, childData) => {
      let result;
      result = data.filter(item => !childData.some(childItem => 
        childItem.get('userId') === item.get('userId')));
      return result;
    }
    for(let i = 0; i < data.size; i++) {
      if(data.getIn([i, 'childDepartmentData]']).toJS() instanceof Array) {
        child = data.getIn([i, 'childDepartmentData]']);
        user = data.getIn([i, 'user']);
        for(let j = 0; j < child.size; j++) {
          childUser = child.getIn([j, 'user']);
          // otherUser = user.filter(item => !childUser.some(childItem => 
          //   childItem.get('userId') === item.get('userId')));
          user = filterNode(user, childUser);
        }
        if(user.size > 0) {
          child = child.unshift(Immutable({
            departmentId: 0,
            departmentName: '未分配子部门',
            user: user
          }));
          data = data.setIn([i, 'childDepartmentData]'], child);
        }
      }
    }
    return data;
  }

  renderConfirm() {
    return (
      <Modal >

      </Modal>
    )
  }

  renderDepartmentTree() {
    const { enterprise } = this.props;
    const { departmentUserList } = this.state;
    return (
      <Tree 
        onSelect={this.onSelectNode} 
        onExpand={this.onExpand} 
        expandedKeys={this.state.expandedKeys}
        selectedKeys={this.state.selectedKeys}
      >
        <TreeNode title={enterprise.enterpriseId} key={enterprise.enterpriseName}>
          {this.renderTreeNodes(this.transformData(departmentUserList))}
        </TreeNode>
      </Tree>
    );
  }

  renderTreeNodes(treeData) {
    return (
      treeData.map((item) => {
        if(item.get('childDepartmentData').toJS() instanceof Array) {
          return (
            <TreeNode title={item.get('departmentName')} key={item.get('departmentId')} dataRef={item}>
              {this.renderTreeNodes(item.get('childDepartmentData'))}
            </TreeNode>
          );
        } else {
          return <TreeNode title={item.get('departmentName')} key={item.get('departmentId')} dataRef={item} />
        }
      })
    );
  }

  renderUserList() {
    let selectedId = this.state.selectedKeys[0];
    let user = selectedId === 0 ? this.state.userList : this.props.userList;
    return (
      user.map((item) => {
        return (
          <div key={item.get('userId')}>
            <div>
              {selectedId !== 0 && 
                <Checkbox 
                  onChange={(e)=>{this.onCheckUser(item, e.target.checked)}} 
                  checked={()=>this.getUserChecked(item)}
                  disabled={item.get('disabled')} />
              }
              <Avatar>{item.get('userName').charAt(0)}</Avatar>
              <span>{item.get('userName')}</span>
            </div>
            <div>
              {this.getUserDepartment(item)}
              {item.get('userId') === this.props.currentUser.get('userId') && <span>我</span>}
            </div>
          </div>
        );
      })
    );
  }

  renderSelectedUser() {
    let user = this.state.selectedDepartment.get('user');
    return user.map((item) => {
      return (
        <Tag 
          key={item.get('userId')}
          closable={true}
          style={{ background: '#fff', borderStyle: 'dashed' }}
          onClose={()=>{this.onCheckUser(item, false)}}
        >
          {item.get('userName')}
        </Tag>
      );
    });
  }

  render() {
    return (
      <Modal
        visible={this.props.show}
        footer={null}
        onCancel={this.onCancel}
        destroyOnClose={true}
      >
        <div className={Styles.assignUserModal}>
          <div className={Styles.header}>
            <span>分配用户</span>
            <Search
              placeholder="真实姓名/用户名"
              onSearch={this.onSearch}
              enterButton={true}
            />
          </div>
          <div className={Styles.content}>
            <div className={Styles.departmentList}>{this.renderDepartmentTree()}</div>
            <div className={Styles.userList}>{this.renderUserList()}</div>
          </div>
          <div className={Styles.selectedUser}>{this.renderSelectedUser()}</div>
          <div className={Styles.footer}>
            <Button onClick={this.onCancel}>取消</Button>
            <Button onClick={this.onOk}>选择</Button>
          </div>
        </div>        
      </Modal>
    );
  }
}


export default AssignUserModal;
