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
    departmentList: PropTypes.object,//immutable
    userList: PropTypes.object,//immutable
    getDepartmentTreeData: PropTypes.func,
    getUserList: PropTypes.func,
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedDepartment: Immutable.fromJS({}),//选中部门
      userList: Immutable.fromJS([]),//用户Id和部门Id一一匹配，一维数组
      selectedUserList: null,
      searchUserList: Immutable.fromJS([]),
      showAllUser: false,
      expandedKeys: [],
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.props.getDepartmentTreeData();
    this.props.getUserList();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.departmentList.size !== this.props.departmentList.size && nextProps.departmentList.size > 0) {
      let department = nextProps.departmentList.get(0);
      let departmentId = nextProps.departmentList.getIn([0, 'departmentId']);
      let showAllUser = departmentId === null ? false : true;
      this.setState({
        selectedDepartment: department,
        selectedKeys: [departmentId],
        showAllUser
      });
    }
    if(nextProps.userList.size !== this.props.userList.size && nextProps.userList.size > 0) {
      this.setState({
        userList: nextProps.userList,
      });
    }
  }

  onOk = () => {
    this.props.onSelect(this.state.userList);
  }

  onCancel = () => {
    Modal.warning({
      title: '关闭后将无法保存编辑信息！',
      okText: '确定',
      cancelText: '取消',
      onOk: this.props.onCancel
    });
  }

  onSearch = (value) => {
    let userList = this.state.userList;
    if(value !== '') {
      userList = userList.filter((item) => {
        return item.get('userName').index(value) !== -1;
      });
    } else {
      userList = null;
    }
    this.setState({
      searchUserList: userList
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
      if(item.get('disabled') === true) {
        this.setState({
          selectedUserList: this.state.userList.filter((user) => {
            return user.get('departmentId' === key)
          }),
          showAllUser: false
        });
      } else {
        this.setState({
          selectedUserList: Immutable.fromJS([]),
          showAllUser: true
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

  onCheckUser = (user, checked) => {
    let userList = this.state.userList;
    let selectedDepartment = this.state.selectedDepartment;
    const parentDepartmentId = selectedDepartment.get('parentId');
    if(checked) {
      let index = userList.findIndex((item) => {
        return item.get('departmentId') === parentDepartmentId && item.get('userId') === user.get('userId');
      });
      if(index === -1) {
        userList = userList.push(Immutable.fromJS({
          userId: user.get('userId'),
          userName: user.get('userName'),
          departmentId: selectedDepartment.get('departmentId'),
          departmentName: selectedDepartment.get('departmentName')
        }))
      } else {
        userList = userList.set(index, {
          userId: user.get('userId'),
          userName: user.get('userName'),
          departmentId: selectedDepartment.get('departmentId'),
          departmentName: selectedDepartment.get('departmentName')
        });
      }
    } else {
      let userIndex = userList.findIndex((item) => {
        item.get('userId') === user.get('userId') && item.get('departmentId') === selectedDepartment.get('departmentId')
      });
      let childHasCurrent = false;
      let parentDepartment = this.props.departmentList.find((item) => {
        return item.get('departmentId' === parentDepartmentId);
      });
      if(parentDepartment && parentDepartment.get('childDepartmentData')) {
        parentDepartment.get('childDepartmentData').forEach((department) => {
          let index = userList.findIndex((item) => {
            return department.get('departmentId') === item.get('departmentId') && user.get('userId') === item.get('userId');
          });
          if(department.get('departmenId') !== selectedDepartment.get('departmentId') && index !== -1) {
            childHasCurrent = true;
            return;
          }
        })
      }
      if(childHasCurrent) {
        userList.delete(userIndex);
      } else {
        userList = userList.set(userIndex, {
          userId: user.get('userId'),
          userName: user.get('userName'),
          departmentId: parentDepartmentId,
          departmentName: parentDepartment.get('departmentName')
        });
      }
    }
  }

  getUserChecked(user) {
    let selectedDepartment = this.state.selectedDepartment;
    let index = this.state.userList.findIndex((item) => {
      return item.get('userId') === user.get('userId') && item.get('departmentId') === selectedDepartment.get('departmentId');
    });
    if(index > -1) {
      return true;
    } else {
      return false;
    }
  }

  getDepartmentUser(department, isAll=true) {
    let { userList } = this.state;
    if(department === null) {
      return userList.filter((item) => {
        return item.get('departmentId') === null;
      });
    } else {
      const departmentId = department.get('departmentId');
      if(department.get('childDepartmentData') && isAll) {
        let parentUser = userList.filter((item) => {
          return item.get('departmentId') === departmentId;
        });
        department.get('childDepartmentData').forEach((item)=> {
          let childrenUser = userList.filter((user) => {
            return user.get('departmentId') === item.get('departmentId');
          });
          childrenUser.forEach((user) => {
            const index = parentUser.findIndex((item) => {
              item.get('userId') === user.get('userId')
            });
            if(index === -1) {
              parentUser = parentUser.push(user);
            }
          });
        });
        return parentUser;
      } else {
        return userList.filter((item) => {
          return item.get('departmentId') === departmentId;
        });
      }
    }
  }

  transformTreeData(data) {
    let department, child, parentUser;
    for(let i = 0; i < data.size; i++) {
      department = data.get(i);
      child = department.get('childDepartmentData');
      if(child.toJS() instanceof Array) {
        parentUser = this.getDepartmentUser(department, false);
        if(parentUser.size > 0) {
          child = child.unshift(Immutable.fromJS({
            departmentId: department.get('departmentId'),
            departmentName: '未分配人员',
            disabled: true
          }));
        }
        data = data.setIn([i, 'childDepartmentData'], child);
      }
    }
    const nonAssignUser = this.getDepartmentUser(null);
    if(nonAssignUser.size > 0) {
      data = data.unshift(Immutable({
        departmentId: null,
        departmentName: '待分配人员',
        disabled: true
      }));
    }
    return data;
  }

  tansformUserData(userList) {
    let newUserList = Immutable.fromJS();
    userList.forEach(element => {
      const index = newUserList.findIndex(item =>{
        return item.get('userId') === element.get('userId');
      })
      if(index === -1) {
        newUserList = newUserList.push(element);
      } else {
        let user = newUserList.get(index);
        user = user.set('departmentName', user.get('departmentName')+','+element.get('departmenName'))
                   .set('departmentId'),Immutable.fromJS([user.get('departmentId')].push(element.get('departmentId'))); 
        newUserList = newUserList.set(index, user);
      }
    });
    return newUserList;
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
        <TreeNode title={enterprise.enterpriseName} key={enterprise.enterpriseId}>
          {this.renderTreeNodes(this.transformTreeData(departmentUserList))}
        </TreeNode>
      </Tree>
    );
  }

  renderTreeNodes(treeData) {
    let userNum;
    return (
      treeData.map((item) => {
        if(item.get('childDepartmentData').toJS() instanceof Array) {
          userNum = this.getDepartmentUser(item, true).size;
          return (
            <TreeNode title={item.get('departmentName')+'('+userNum+')'} key={item.get('departmentId')+'_parent'} dataRef={item}>
              {this.renderTreeNodes(item.get('childDepartmentData'))}
            </TreeNode>
          );
        } else {
          userNum = this.getDepartmentUser(item, false).size;
          return <TreeNode title={item.get('departmentName')+'('+userNum+')'} key={item.get('departmentId')} dataRef={item} />
        }
      })
    );
  }

  renderUserList() {
    let {showAllUser, searchUserList, userList,selectedUserList} = this.state;
    let user = showAllUser ? 
    this.tansformUserData(searchUserList!==null?searchUserList:userList) : selectedUserList;
    return (
      user.map((item) => {
        return (
          <div key={item.get('userId')}>
            <div>
              {showAllUser && 
                <Checkbox 
                  onChange={(e)=>{this.onCheckUser(item, e.target.checked)}} 
                  checked={()=>this.getUserChecked(item)}
                  disabled={item.get('userStatus') === 4} />
              }
              <Avatar>{item.get('userName').charAt(0)}</Avatar>
              <span>{item.get('userName')}</span>
            </div>
            <div>
              {showAllUser && item.get('departmentName')}
              {item.get('userId') === this.props.currentUser.get('userId') && <span>我</span>}
            </div>
          </div>
        );
      })
    );
  }

  renderSelectedUser() {
    let department = this.state.selectedDepartment;
    let user = this.getDepartmentUser(department, false);
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
            {this.state.showAllUser && <Search
              placeholder="真实姓名/用户名"
              onSearch={this.onSearch}
              enterButton={true}
            />}
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
