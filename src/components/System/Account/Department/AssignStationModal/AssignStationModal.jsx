import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Input, Button, Tree, Checkbox, Tag }  from 'antd';
import Immutable from 'immutable';
import styles from './assignStationModal.scss';
import WarningTip from '../../../../Common/WarningTip';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

class AssignStationModal extends Component {
  static propTypes = {
    selectedDepartment: PropTypes.array,
    enterpriseId: PropTypes.string,//当前企业Id
    enterpriseName: PropTypes.string,//当前企业名称
    departmentList: PropTypes.object,//immutable
    stationList: PropTypes.object,//immutable
    getStationList: PropTypes.func,
    getDepartmentStation: PropTypes.func,
    onSetDepartmentStation: PropTypes.func,
    onCancel: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedDepartment: Immutable.fromJS([]),//选中部门
      stationList: Immutable.fromJS([]),//电站Id和部门Id一一匹配，一维数组，最后回传的数组
      selectedStationList: Immutable.fromJS([]),//右边的电站列表数据
      searchStationList: null,//右边有搜索文字的电站列表数据
      expandedKeys: [],
      selectedKeys: [],
      showWarningTip: false,
      warningTipText: '',
    };
  }

  componentDidMount() {
    const {enterpriseId} = this.props;
    this.props.getStationList({
      enterpriseId
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDepartment.length > 0) {
      const department = nextProps.selectedDepartment[0];
      const departmentId = department.departmentId;
      let selectedDepartment;
      let parentDepartmentId;
      let hasParent = false;
      if(department.parentDepartmentName) {//二级部门
        const parentDepartment = nextProps.departmentList.find((item)=>item.get('departmentName')===department.parentDepartmentName);
        selectedDepartment = parentDepartment.get('list').find((item)=>item.get('departmentId')===department.departmentId);
        parentDepartmentId = parentDepartment.get('departmentId');
        hasParent = true;
      } else {//一级部门
        selectedDepartment = nextProps.departmentList.find((item)=>item.get('departmentId')===department.departmentId);
        hasParent = false;
      }
      this.setState({
        selectedDepartment: selectedDepartment,//选中部门
        expandedKeys: hasParent ? [nextProps.enterpriseId, parentDepartmentId] : [nextProps.enterpriseId],
        selectedKeys: [departmentId],
      })
    }
    if(nextProps.stationList.size > 0) {
      this.setState({
        stationList: nextProps.stationList,
        selectedStationList: this.getDepartmenStationRange(this.state.selectedDepartment, nextProps.stationList),
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
    this.props.onSetDepartmentStation({
      enterpriseId: this.props.enterpriseId,
      list: this.state.stationList.toJS()
    });
  }

  onCancel = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '关闭后将无法保持编辑信息!'
    });
  }

  onSearch = (value) => {
    let stationList = this.state.selectedStationList;
    if(value !== '') {
      stationList = stationList.filter((item) => {
        return item.get('stationName').indexOf(value) !== -1;
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
    if(item === null) {
      return;
    }
    let selectedStationList = this.getDepartmenStationRange(Immutable.fromJS(item), this.state.stationList);
    this.setState({
      selectedDepartment: Immutable.fromJS(item),
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
    const selectedDepartmentId = selectedDepartment.get('departmentId');
    const selectedDepartmentName = selectedDepartment.get('departmentName');
    const stationId = station.get('stationId');
    const stationName = station.get('stationName');
    if(checked) {
      let index = stationList.findIndex((item) => {
        return item.get('departmentId') === null && item.get('stationId') === stationId;
      });
      if(index === -1) {
        const lastIndex = stationList.findLastIndex((item) => {
          return item.get('stationId') === stationId;
        });
        stationList = stationList.splice(lastIndex+1, 0, Immutable.fromJS({
          stationId: stationId,
          stationName: stationName,
          departmentId: selectedDepartmentId,
          departmentName: selectedDepartmentName
        }));
      } else {
        stationList = stationList.set(index, Immutable.fromJS({
          stationId: stationId,
          stationName: stationName,
          departmentId: selectedDepartmentId,
          departmentName: selectedDepartmentName
        }));
      }
    } else {
      if(selectedDepartment.get('list')&&selectedDepartment.get('list').size > 0) {
        let child = selectedDepartment.get('list');
        child.forEach((item) => {
          let childIndex = stationList.findIndex((current) => {
            return item.get('departmentId') === current.get('departmentId') && 
            stationId === current.get('stationId')
          });
          if(childIndex !== -1) {
            stationList = stationList.delete(childIndex);
          }
        })
      }
      let index = stationList.findIndex((current) => {
        return selectedDepartmentId === current.get('departmentId') && 
        stationId === current.get('stationId')
      });
      const num = stationList.filter(item => {
        return stationId === item.get('stationId')
      }).size;
      if(num > 1) {
        stationList = stationList.delete(index);
      } else {
        stationList = stationList.set(index, Immutable.fromJS({
          stationId: stationId,
          stationName: stationName,
          departmentId: null,
          departmentName: null
        }));
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
    if(parentDepartmentId === '0' || parentDepartmentId === null) {
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
        station = station.set('departmentName', station.get('departmentName')+','+element.get('departmentName'))
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
        <TreeNode title={enterpriseName} key={enterpriseId} dataRef={null}>
          {this.renderTreeNodes(departmentList.toJS())}
        </TreeNode>
      </Tree>
    );
  }

  renderTreeNodes(treeData) {
    let stationNum;
    return (
      treeData.map((item) => {
        stationNum = this.getDepartmentStation(item.departmentId).size;
        if(item.list && item.list.length > 0) {
          return (
            <TreeNode title={item.departmentName+'('+stationNum+')'} key={item.departmentId} dataRef={item}>
              {this.renderTreeNodes(item.list)}
            </TreeNode>
          );
        } else {
          return <TreeNode title={item.departmentName+'('+stationNum+')'} key={item.departmentId} dataRef={item} />
        }
      })
    );
  }

  renderStationList() {
    const { searchStationList , selectedStationList, stationList } = this.state;
    let transformStationList = this.tansformStationData(stationList);
    let station = this.tansformStationData(searchStationList!==null?searchStationList:selectedStationList);
    return (
      station.map((item) => {
        return (
          <div key={item.get('stationId')} className={styles.stationItem}>
            <div className={styles.stationCheck}>
              <Checkbox
                style={{marginRight: 6}}
                onChange={(e)=>{this.onCheckStation(item, e.target.checked)}} 
                checked={this.getStationChecked(item)} />
              <span className={styles.stationName}>{item.get('stationName')}</span>
            </div>
            <div className={styles.deparymentName}>
              {transformStationList.find(obj=>obj.get('stationId')===item.get('stationId')).get('departmentName')}
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
    if(this.state.stationList.size === 0) {
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
        <div className={styles.assignStationModal}>
          { showWarningTip && 
          <WarningTip 
            style={{marginTop:'250px',width: '210px',height:'88px'}} 
            onCancel={this.onCancelWarningTip} 
            onOK={this.onConfirmWarningTip} value={warningTipText} />}
          <div className={styles.header}>
            <span>分配用户</span>
            <Search
              placeholder="搜索电站名称"
              onSearch={this.onSearch}
              enterButton={true}
              style={{ width: 200 }}
            />
          </div>
          <div className={styles.content}>
            <div className={styles.departmentList}>{this.renderDepartmentTree()}</div>
            <div className={styles.stationList}>{this.renderStationList()}</div>
          </div>
          <div className={styles.selectedStation}>{this.renderSelectedStation()}</div>
          <div className={styles.footer}>
            <Button onClick={this.onCancel}>取消</Button>
            <Button onClick={this.onSelect}>选择</Button>
          </div>
        </div>        
      </Modal>
    );
  }
}


export default AssignStationModal;
