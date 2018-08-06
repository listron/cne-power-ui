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
    selectedDepartment: PropTypes.array,
    currentUserId: PropTypes.string,//当前用户Id
    enterpriseId: PropTypes.string,//当前企业Id
    enterpriseName: PropTypes.string,//当前企业名称
    departmentList: PropTypes.object,//immutable
    stationList: PropTypes.object,//immutable
    getDepartmentTreeData: PropTypes.func,
    getStationList: PropTypes.func,
    onSetDepartmentStation: PropTypes.func,
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedDepartment: Immutable.fromJS({}),//选中部门
      stationList: Immutable.fromJS([]),//电站Id和部门Id一一匹配，一维数组，最后回传的数组
      selectedStationList: Immutable.fromJS([]),//右边的电站列表数据
      searchStationList: null,//右边有搜索文字的电站列表数据
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
      let department = nextProps.selectedDepartment[0];
      let departmentId = department.departmentId;
      this.setState({
        selectedDepartment: Immutable.fromJS(department),
        selectedKeys: [departmentId],
        expandedKeys: [nextProps.enterpriseId]
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
    this.props.onSetDepartmentStation(this.state.stationList);
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
        stationId: station.get('stationId'),
        stationName: station.get('stationName'),
      }))
    } else {
      if(selectedDepartment.get('list')) {
        let child = selectedDepartment.get('list');
        child.forEach((item) => {
          let childIndex = stationList.findIndex((current) => {
            item.get('departmentId') === current.get('departmentId') && 
            station.get('stationId') === current.get('stationId')
          })
          if(childIndex !== -1) {
            stationList = stationList.delete(childIndex);
          }
        })
        let index = stationList.findIndex((current) => {
          selectedDepartment.get('departmentId') === current.get('departmentId') && 
          station.get('stationId') === current.get('stationId')
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
    let index = this.state.stationList.findIndex((item) => {
      return item.get('stationId') === station.get('stationId') && item.get('departmentId') === selectedDepartment.get('departmentId');
    });
    if(index > -1) {
      return true;
    } else {
      return false;
    }
  }

  getDepartmenStationRange(department, stationList) {
    let parentDepartmentId = department.get('parentDepartmentId');
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
        return item.get('stationId') === element.get('stationId');
      })
      if(index === -1) {
        newStationList = newStationList.push(element);
      } else {
        let station = newStationList.get(index);
        station = station.set('departmentName', station.get('departmentName')+','+element.get('departmenName'))
                   .set('departmentId'),Immutable.fromJS([station.get('departmentId')].push(element.get('departmentId'))); 
        newStationList = newStationList.set(index, station);
      }
    });
    return newStationList;
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
        if(item.get('list').size > 0) {
          return (
            <TreeNode title={item.get('departmentName')+'('+stationNum+')'} key={item.get('departmentId')} dataRef={item}>
              {this.renderTreeNodes(item.get('list'))}
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
          <div key={item.get('stationId')}>
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
          key={item.get('stationId')}
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
