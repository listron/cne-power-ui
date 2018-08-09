import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, Tree, Checkbox, Avatar, Tag }  from 'antd';
import Immutable from 'immutable';
import styles from './assignUserModal.scss';
import WarningTip from '../../../../Common/WarningTip';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

class AssignUserModal extends Component {
  static propTypes = {
    selectedDepartment: PropTypes.array,
    currentUserId: PropTypes.string,//当前用户Id
    enterpriseId: PropTypes.string,//当前企业Id
    enterpriseName: PropTypes.string,//当前企业名称
    departmentList: PropTypes.object,//immutable
    userList: PropTypes.object,//immutable
    getUserList: PropTypes.func,
    onSetDepartmentUser: PropTypes.func,       
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    const department = props.selectedDepartment[0];      
    const hasChild = department.hasChildren;
    let selectedDepartment = props.departmentList.find((item)=>item.get('departmentId')===department.departmentId);
    if(hasChild) {
      selectedDepartment = selectedDepartment.getIn(['list', 0]);
    }
    const departmentId = selectedDepartment.get('departmentId');
    this.state = {
      selectedDepartment: selectedDepartment,//选中部门
      userList: Immutable.fromJS([]),//用户Id和部门Id一一匹配，一维数组，最后回传的数组
      selectedUserList: Immutable.fromJS([]),//右边的用户列表数据
      searchUserList: null,//右边有搜索文字的用户列表数据
      expandedKeys: hasChild ? [departmentId] : [props.enterpriseId],
      selectedKeys: [departmentId],
      showWarningTip: false,
      warningTipText: ''
    };
  }

  componentDidMount() {
    const {enterpriseId} = this.props;
    this.props.getUserList({
      enterpriseId
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userList.size > 0) {
      this.setState({
        userList: nextProps.userList,
        selectedUserList: this.getDepartmentUserRange(this.state.selectedDepartment, nextProps.userList)
      });
    }
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
      });
    }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.onCancel();   
  }

  onSelect = () => {
    this.props.onSetDepartmentUser({
      enterpriseId: this.props.enterpriseId,
      list: this.state.userList.toJS()
    });
  }

  onCancel = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '关闭后将无法保持编辑信息!'
    });
  }

  onSearch = (value) => {
    let userList = this.state.selectedUserList;
    if(value !== '') {
      userList = userList.filter((item) => {
        return item.get('username').indexOf(value) !== -1;
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
    if(item.get('list')) {
      if(expandedKeys.indexOf(key) === -1) {
        expandedKeys.push(key);
      } else {
        expandedKeys.splice(expandedKeys.indexOf(key), 1);
      }
      this.setState({
        expandedKeys,
        selectedDepartment: item,
        selectedKeys
      });
    } else {
      let selectedUserList = this.getDepartmentUserRange(item, this.state.userList);
      this.setState({
        selectedUserList,
        selectedDepartment: item,
        selectedKeys
      });
    }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  onCheckUser = (user, checked) => {
    let userList = this.state.userList;
    const selectedDepartment = this.state.selectedDepartment;
    const selectedDepartmrntId = selectedDepartment.get('departmentId');
    const selectedDepartmentName = selectedDepartment.get('departmentName');
    const parentDepartmentId = selectedDepartment.get('parentDepartmentId');
    const userId = user.get('userId');
    const username = user.get('username');
    if(checked) {
      let index = userList.findIndex((item) => {
        return (item.get('departmentId') === null || item.get('departmentId') === parentDepartmentId) && item.get('userId') === userId;
      });
      if(index === -1) {
        const lastIndex = userList.findLastIndex((item) => {
          return item.get('userId') === userId;
        });
        userList = userList.splice(lastIndex+1, 0, Immutable.fromJS({
          userId: userId,
          username: username,
          departmentId: selectedDepartmrntId,
          departmentName: selectedDepartmentName
        }))
      } else {
        userList = userList.set(index, Immutable.fromJS({
          userId: userId,
          username: username,
          departmentId: selectedDepartmrntId,
          departmentName: selectedDepartmentName
        }));
      }
    } else {
      let userIndex = userList.findIndex((item) => {
        return item.get('userId') === userId && item.get('departmentId') === selectedDepartmrntId
      });
      if(parentDepartmentId === '0') {//从一级部门里勾掉
        let otherHasCurrent = userList.findIndex((item) => {
          return item.get('userId') === userId && item.get('departmentId') !== null && item.get('departmentId') !== selectedDepartmrntId;
      });
        if(otherHasCurrent !== -1) {
          userList = userList.delete(userIndex);
        } else {   
          userList = userList.set(userIndex, Immutable.fromJS({
            userId: userId,
            username: username,
            departmentId: null,
            departmentName: null
          }));
        }
      } else {//当前是二级部门
      let childHasCurrent = false;
      let parentDepartment = this.props.departmentList.find((item) => {
          return item.get('departmentId') === parentDepartmentId;
      });
      if(parentDepartment && parentDepartment.get('list')) {
        parentDepartment.get('list').forEach((department) => {
          let index = userList.findIndex((item) => {
              return department.get('departmentId') === item.get('departmentId') && userId === item.get('userId') && department.get('departmenId') !== selectedDepartmrntId;
          });
            if(index !== -1) {
            childHasCurrent = true;
            return;
          }
        })
      }
      if(childHasCurrent) {
          userList = userList.delete(userIndex);
      } else {
          userList = userList.set(userIndex, Immutable.fromJS({
            userId: userId,
            username: username,
          departmentId: parentDepartmentId,
          departmentName: parentDepartment.get('departmentName')
          }));
        }
      }
      
    }
    let selectedUserList = this.getDepartmentUserRange(selectedDepartment, userList);
    this.setState({
      userList,
      selectedUserList
    });
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

  getDepartmentUserRange(department, userList) {
    let selectedUserList;
    if(department.get('disabled') === true) {
      selectedUserList = userList.filter((user) => {
        return user.get('departmentId' === department.get('parentDepartmentId'))
      });
    } else {
      selectedUserList = userList;
    }
    return selectedUserList
  }

  getDepartmentUser(department, isAll=true) {
    let { userList } = this.state;
    if(department === null) {
      return userList.filter((item) => {
        return item.get('departmentId') === null;
      });
    } else {
      const departmentId = department.get('disabled') ? department.get('parentDepartmentId') : department.get('departmentId');
      if(department.get('list') && isAll) {
        let parentUser = userList.filter((item) => {
          return item.get('departmentId') === departmentId;
        });
        department.get('list').forEach((item)=> {
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
      child = department.get('list');
      if(child.size > 0) {
        parentUser = this.getDepartmentUser(department, false);
        if(parentUser.size > 0) {
          child = child.unshift(Immutable.fromJS({
            departmentId: department.get('departmentId')+'_'+i,
            parentDepartmentId: department.get('departmentId'),
            departmentName: '未分配人员',
            list: [],
            userNum: parentUser.size,
            disabled: true,
          }));
        }
        data = data.setIn([i, 'list'], child);
      }
    }
    const nonAssignUser = this.getDepartmentUser(null);
    if(nonAssignUser.size > 0) {
      data = data.unshift(Immutable.fromJS({
        departmentId: null,
        parentDepartmentId: '0',
        departmentName: '待分配人员',
        list: [],
        userNum: nonAssignUser.size,
        disabled: true,
      }));
    }
    return data;
  }

  tansformUserData(userList) {
    let newUserList = Immutable.fromJS([]);
    userList.forEach(element => {
      const index = newUserList.findIndex(item =>{
        return item.get('userId') === element.get('userId');
      })
      if(index === -1) {
        newUserList = newUserList.push(element);
      } else {
        let user = newUserList.get(index);
        user = user.set('departmentName', user.get('departmentName')+','+element.get('departmentName'))
                   .set('departmentId'),Immutable.fromJS([user.get('departmentId')].push(element.get('departmentId'))); 
        newUserList = newUserList.set(index, user);
      }
    });
    return newUserList;
  }

  renderDepartmentTree() {
    const { enterpriseId, enterpriseName, departmentList } = this.props;
    return (
      <Tree 
        onSelect={this.onSelectNode} 
        onExpand={this.onExpand} 
        expandedKeys={this.state.expandedKeys}
        selectedKeys={this.state.selectedKeys}
      >
        <TreeNode title={enterpriseName} key={enterpriseId}>
          {this.renderTreeNodes(this.transformTreeData(departmentList))}
        </TreeNode>
      </Tree>
    );
  }

  renderTreeNodes(treeData) {
    let userNum;
    return (
      treeData.map((item) => {
        if(item.get('list') && item.get('list').size > 0) {
          userNum = this.getDepartmentUser(item, true).size;
          return (
            <TreeNode title={item.get('departmentName')+'('+userNum+')'} key={item.get('departmentId')} dataRef={item}>
              {this.renderTreeNodes(item.get('list'))}
            </TreeNode>
          );
        } else {
          userNum = !!item.get('userNum')? item.get('userNum') : this.getDepartmentUser(item, false).size;
          return <TreeNode title={item.get('departmentName')+'('+userNum+')'} key={item.get('departmentId')} dataRef={item} />
        }
      })
    );
  }

  renderUserList() {
    let {searchUserList, selectedUserList} = this.state;
    const disabled = this.state.selectedDepartment.get('disabled');
    let user = this.tansformUserData(searchUserList!==null?searchUserList:selectedUserList);
    return (
      user.map((item) => {
        return (
          <div key={item.get('userId')} className={styles.userItem}>
            <div className={styles.userCheck}>
              {!disabled && 
                <Checkbox 
                  style={{marginRight: 6}}
                  onChange={(e)=>{this.onCheckUser(item, e.target.checked)}} 
                  checked={this.getUserChecked(item)}
                  disabled={item.get('userStatus') === 4} />
              }
              <Avatar size="small">{item.get('username').charAt(0)}</Avatar>
              <span className={styles.userName}>{item.get('username')}</span>
            </div>
            <div className={styles.deparymentName}>
              {!disabled && item.get('departmentName')}
              {item.get('userId') === this.props.currentUserId && <span>我</span>}
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
          {item.get('username')}
        </Tag>
      );
    });
  }

  render() {
    if(this.state.userList.size === 0) {
      return null;
    }
    const { showWarningTip, warningTipText } = this.state;
    return (
      <Modal
        visible={true}
        footer={null}
        onCancel={this.onCancel}
        width={625}
      >
        <div className={styles.assignUserModal}>
          {showWarningTip && 
          <WarningTip 
            style={{marginTop:'250px',width: '210px',height:'88px'}} 
            onCancel={this.onCancelWarningTip} 
            onOK={this.onConfirmWarningTip} value={warningTipText} />}
          <div className={styles.header}>
            <span>分配用户</span>
             <Search
              placeholder="真实姓名/用户名"
              onSearch={this.onSearch}
              enterButton={true}
              style={{ width: 200 }}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.departmentList}>{this.renderDepartmentTree()}</div>
            <div className={styles.userList}>{this.renderUserList()}</div>
          </div>
          <div className={styles.selectedUser}>{this.renderSelectedUser()}</div>
          <div className={styles.footer}>
            <Button onClick={this.onCancel}>取消</Button>
            <Button onClick={this.onSelect}>选择</Button>
          </div>
        </div>        
      </Modal>
    );
  }
}


export default AssignUserModal;
