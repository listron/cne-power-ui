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
    enterprise: PropTypes.object,//当前企业
    departmentStationList: PropTypes.object,//immutable
    stationList: PropTypes.object,//immutable
    getDepartmentTreeData: PropTypes.func,
    getStationList: PropTypes.func,
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      departmentStationList: Immutable.fromJS([]),
      selectedDepartment: Immutable.fromJS({}),
      stationList: Immutable.fromJS([]),
      expandedKeys: [],
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.props.getDepartmentTreeData();
    this.props.getStationList();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.departmentStationList.size !== this.props.departmentStationList.size && nextProps.departmentStationList.size > 0) {
      let department = nextProps.departmentStationList.get(0);
      let departmentId = nextProps.departmentStationList.getIn([0, 'departmentId']);
      this.setState({
        departmentStationList: nextProps.departmentStationList,
        selectedDepartment: department,
        selectedKeys: [departmentId],
        stationList: departmentId === 0 ? nextProps.departmentStationList.getIn([0, 'station']) : Immutable.fromJS([]),
      });
    }
  }

  onOk = () => {
    this.props.onSelect(this.state.departmentStationList);
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
    let stationList = this.props.stationList;
    if(value !== '') {
      stationList = stationList.filter((item) => {
        return item.get('userName').index(value) !== -1;
      });
    } else {
      stationList = Immutable.fromJS([]);
    }
    this.setState({
      stationList
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
          stationList: item.get('station')
        });
      } else {
        this.setState({
          stationList: Immutable.fromJS([])
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

  onCheckStation = (obj, checked) => {
    let { selectedDepartment, departmentStationList, selectedKeys } = this.state;
    let station = selectedDepartment.get('station');
    let departmentId = selectedKeys[0];
    const departmentIndex = departmentStationList.findIndex((item) => {
      return departmentId === item.get('departmentId');
    });
    if(checked) {
      station = station.push(Immutable.fromJS({
        stationCode: obj.get('stationCode'),
        stationName: obj.get('stationName'),
        disabled: false
      }));
    } else {
      let index = station.findIndex((item) => {
        return item.get('stationCode') === obj.get('stationCode');
      });
      if(index > -1) {
        station = station.delete(index);
      }
    }
    selectedDepartment = selectedDepartment.set('station', station);
    departmentStationList = departmentStationList.set(departmentIndex, selectedDepartment);
    this.setState({
      selectedDepartment,
      departmentStationList
    });
  }

  getStationChecked(obj) {
    let selectedDepartment = this.state.selectedDepartment;
    let station = selectedDepartment.get('station');
    let index = station.findIndex((item) => {
      return item.get('stationCode') === obj.get('stationCode');
    });
    if(index > -1) {
      return true;
    } else {
      return false;
    }
  }

  getStationDepartment(obj) {
    let departmentData = obj.get('departmentData');
    let result = '';
    for(let i = 0; i < departmentData.size; i++) {
      result += '，' + departmentData.getIn([i, 'departmentName']);
    }
    result.splice(0, 1);
    return result;
  }

  transformData(data) {
    let child, station, childStation;
    const filterNode = (data, childData) => {
      let result;
      result = data.filter(item => !childData.some(childItem => 
        childItem.get('stationCode') === item.get('stationCode')));
      return result;
    }
    for(let i = 0; i < data.size; i++) {
      if(data.getIn([i, 'childDepartmentData]']).toJS() instanceof Array) {
        child = data.getIn([i, 'childDepartmentData]']);
        station = data.getIn([i, 'station']);
        for(let j = 0; j < child.size; j++) {
          childStation = child.getIn([j, 'station']);
          // otherUser = station.filter(item => !childStation.some(childItem => 
          //   childItem.get('stationCode') === item.get('stationCode')));
          station = filterNode(station, childStation);
        }
        if(station.size > 0) {
          child = child.unshift(Immutable({
            departmentId: 0,
            departmentName: '未分配子部门',
            station: station
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
    const { departmentStationList } = this.state;
    return (
      <Tree 
        onSelect={this.onSelectNode} 
        onExpand={this.onExpand} 
        expandedKeys={this.state.expandedKeys}
        selectedKeys={this.state.selectedKeys}
      >
        <TreeNode title={enterprise.enterpriseId} key={enterprise.enterpriseName}>
          {this.renderTreeNodes(this.transformData(departmentStationList))}
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
    let station = selectedId === 0 ? this.state.stationList : this.props.stationList;
    return (
      station.map((item) => {
        return (
          <div key={item.get('stationCode')}>
            <div>
              {selectedId !== 0 && 
                <Checkbox 
                  onChange={(e)=>{this.onCheckStation(item, e.target.checked)}} 
                  checked={()=>this.getStationChecked(item)}
                  disabled={item.get('disabled')} />
              }
              <Avatar>{item.get('stationName').charAt(0)}</Avatar>
              <span>{item.get('stationName')}</span>
            </div>
            <div>
              {selectedId !== 0 && this.getStationDepartment(item)}
            </div>
          </div>
        );
      })
    );
  }

  renderSelectedUser() {
    let station = this.state.selectedDepartment.get('station');
    return station.map((item) => {
      return (
        <Tag 
          key={item.get('stationCode')}
          closable={true}
          style={{ background: '#fff', borderStyle: 'dashed' }}
          onClose={()=>{this.onCheckStation(item, false)}}
        >
          {item.get('stationName')}
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
              placeholder="搜索电站名称"
              onSearch={this.onSearch}
              enterButton={true}
            />
          </div>
          <div className={Styles.content}>
            <div className={Styles.departmentList}>{this.renderDepartmentTree()}</div>
            <div className={Styles.stationList}>{this.renderUserList()}</div>
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
