import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, Tree, Checkbox, Avatar, Tag }  from 'antd';
import Immutable from 'immutable';
import Styles from './assignStationModal.scss';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

class AssignStationModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    enterprise: PropTypes.object,//当前企业
    departmentList: PropTypes.object,//immutable
    stationList: PropTypes.object,//immutable
    getDepartmentTreeData: PropTypes.func,
    getStationList: PropTypes.func,
    onSelect: PropTypes.func,
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedDepartment: Immutable.fromJS({}),
      stationList: Immutable.fromJS([]),
      selectedStationList: Immutable.fromJS([]),
      searchStationList: null,
      expandedKeys: [],
      selectedKeys: [],
    };
  }

  componentDidMount() {
    this.props.getDepartmentTreeData();
    this.props.getStationList();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.departmentList.size !== this.props.departmentList.size && nextProps.departmentList.size > 0) {
      let department = nextProps.departmentList.get(0);
      let departmentId = nextProps.departmentList.getIn([0, 'departmentId']);
      this.setState({
        selectedDepartment: department,
        selectedKeys: [departmentId],
      });
    }
    if(nextProps.stationList.size !== this.props.stationList.size && nextProps.stationList.size > 0) {
      this.setState({
        stationList: nextProps.stationList,
        selectedStationList: nextProps.stationList,
      });
    }
  }

  onOk = () => {
    this.props.onSelect(this.state.stationList);
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
    let stationList = this.state.selectedStationList;
    if(value !== '') {
      stationList = stationList.filter((item) => {
        return item.get('stationName').index(value) !== -1;
      });
    } else {
      stationList = null;
    }
    this.setState({
      searchStationList: stationList
    });  
  }

  onSelectNode = (selectedKeys, info) => {
    let item = info.node.props.dataRef;
    let selectedStationList = this.getDepartmenStationRange(item, this.state.stationList);
    this.setState({
      selectedDepartment: item,
      selectedStationList,
      selectedKeys
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys
    });
  }

  onCheckStation = (station, checked) => {
    let { selectedDepartment, stationList } = this.state;
    if(checked) {
      stationList = stationList.push(Immutable.fromJS({
        departmentId: selectedDepartment.get('departmentId'),
        departmentName: selectedDepartment.get('departmentName'),
        stationCode: station.get('stationCode'),
        stationName: station.get('stationName'),
      }))
    } else {
      if(selectedDepartment.get('childDepartmentData')) {
        let child = selectedDepartment.get('childDepartmentData');
        child.forEach((item) => {
          let childIndex = stationList.findIndex((current) => {
            item.get('departmentId') === current.get('departmentId') && 
            station.get('stationCode') === current.get('stationCode')
          })
          if(childIndex !== -1) {
            stationList = stationList.delete(childIndex);
          }
        })
        let index = stationList.findIndex((current) => {
          selectedDepartment.get('departmentId') === current.get('departmentId') && 
          station.get('stationCode') === current.get('stationCode')
        });
        stationList = stationList.delete(index);
      }
    }
    let selectedStationList = this.getDepartmenStationRange(selectedDepartment, stationList);
    this.setState({
      stationList,
      selectedStationList
    });
  }

  getStationChecked(station) {
    let selectedDepartment = this.state.selectedDepartment;
    let index = this.state.userList.findIndex((item) => {
      return item.get('stationCode') === station.get('stationCode') && item.get('departmentId') === selectedDepartment.get('departmentId');
    });
    if(index > -1) {
      return true;
    } else {
      return false;
    }
  }

  getDepartmenStationRange(department, stationList) {
    let parentDepartmentId = department.get('parentId');
    let selectedStationList;
    if(parentDepartmentId === null) {
      selectedStationList = stationList;
    } else {
      selectedStationList = stationList.filter((item) => {
        return item.get('departmentId') === parentDepartmentId;
      });
    }
    return selectedStationList;
  }

  getDepartmentStation(departmentId) {
    return this.state.stationList.filter((item) => {
      return item.get('departmentId') === departmentId;
    });
  }

  tansformStationData(stationList) {
    let newStationList = Immutable.fromJS([]);
    stationList.forEach(element => {
      const index = newStationList.findIndex(item =>{
        return item.get('userId') === element.get('userId');
      })
      if(index === -1) {
        newStationList = newStationList.push(element);
      } else {
        let user = newStationList.get(index);
        user = user.set('departmentName', user.get('departmentName')+','+element.get('departmenName'))
                   .set('departmentId'),Immutable.fromJS([user.get('departmentId')].push(element.get('departmentId'))); 
        newStationList = newStationList.set(index, user);
      }
    });
    return newStationList;
  }

  renderDepartmentTree() {
    const { enterprise, departmentList } = this.props;
    return (
      <Tree 
        onSelect={this.onSelectNode} 
        onExpand={this.onExpand} 
        expandedKeys={this.state.expandedKeys}
        selectedKeys={this.state.selectedKeys}
      >
        <TreeNode title={enterprise.enterpriseId} key={enterprise.enterpriseName}>
          {this.renderTreeNodes(departmentList)}
        </TreeNode>
      </Tree>
    );
  }

  renderTreeNodes(treeData) {
    let stationNum;
    return (
      treeData.map((item) => {
        stationNum = this.getDepartmentStation(item.get('departmentId')).size;
        if(item.get('childDepartmentData').toJS() instanceof Array) {
          return (
            <TreeNode title={item.get('departmentName')+'('+stationNum+')'} key={item.get('departmentId')} dataRef={item}>
              {this.renderTreeNodes(item.get('childDepartmentData'))}
            </TreeNode>
          );
        } else {
          return <TreeNode title={item.get('departmentName')+'('+stationNum+')'} key={item.get('departmentId')} dataRef={item} />
        }
      })
    );
  }

  renderStationList() {
    const { searchStationList , selectedStationList } = this.state;
    let station = this.tansformStationData(searchStationList===null?searchStationList:selectedStationList);
    return (
      station.map((item) => {
        return (
          <div key={item.get('stationCode')}>
            <div>
              <Checkbox 
                onChange={(e)=>{this.onCheckStation(item, e.target.checked)}} 
                checked={()=>this.getStationChecked(item)} />
              <Avatar>{item.get('stationName').charAt(0)}</Avatar>
              <span>{item.get('stationName')}</span>
            </div>
            <div>
              {this.getStationDepartment(item)}
            </div>
          </div>
        );
      })
    );
  }

  renderSelectedStation() {
    let department = this.state.selectedDepartment;
    let station = this.getDepartmentStation(department.get('departmentId'));
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
        <div className={Styles.assignStationModal}>
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
            <div className={Styles.stationList}>{this.renderStationList()}</div>
          </div>
          <div className={Styles.selectedStation}>{this.renderSelectedStation()}</div>
          <div className={Styles.footer}>
            <Button onClick={this.onCancel}>取消</Button>
            <Button onClick={this.onOk}>选择</Button>
          </div>
        </div>        
      </Modal>
    );
  }
}


export default AssignStationModal;
