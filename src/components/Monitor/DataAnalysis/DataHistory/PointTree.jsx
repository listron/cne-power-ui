import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, message } from 'antd';
import moment from 'moment';
import styles from './historyStyle.scss';

const { TreeNode } = Tree;

class PointTree extends Component {

  static propTypes = {
    reRenderTree: PropTypes.number,
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    pointInfo: PropTypes.array,
    getChartHistory: PropTypes.func,
    getListHistory: PropTypes.func,
    changeHistoryStore: PropTypes.func,
  };

  state = {
    halfCheckedKeys: [],
    expandedKeys: [],
  }

  componentWillReceiveProps(nextProps){
    const { reRenderTree } = nextProps;
    const preReRenderTree =  this.props.reRenderTree;
    if (reRenderTree !== preReRenderTree) {
      this.setState({
        expandedKeys: []
      })
    }
  }

  expandTree = (expandedKeys) => {
    this.setState({ expandedKeys });
  }

  pointSelect = (selectedKeys, { halfCheckedKeys }) => {
    const valideKeys = selectedKeys.filter(e => !e.includes('group_'));
    if (valideKeys.length > 4) {
      const preHalfCheckedKeys = this.state.halfCheckedKeys;
      message.error('所选测点不得超过4个');
      this.setState({
        halfCheckedKeys: preHalfCheckedKeys
      });
      return;
    }
    this.setState({
      halfCheckedKeys,
    })
    const { queryParam, listParam, getChartHistory, getListHistory, changeHistoryStore } = this.props;
    const { startTime, endTime, timeInterval } = queryParam;
    const newQueryParam = {
      ...queryParam,
      devicePoints: selectedKeys,
    };

    const tmpAllowedEnd = timeInterval === 10 ? moment(endTime).subtract(1, 'M') : moment(endTime).subtract(1, 'd');
    if (startTime.isBefore(tmpAllowedEnd, 's')) {
      message.error(`${timeInterval === 10 ? '时间选择范围不可超过1个月' : '时间选择范围不可超过1天'}`);
      changeHistoryStore({
        queryParam: newQueryParam
      })
    }else {
      getChartHistory({ queryParam: newQueryParam });
      // getListHistory({
      //   queryParam: newQueryParam,
      //   listParam,
      // })
    }
  }

  renderTreeNodes = () => { // 数据分组并基于分组渲染节点。
    const { pointInfo } = this.props;
    const PointsNodes = [];
    const sortNames = [
      '整机系统', '变桨系统', '传动系统', '发电机', '变频器', '机舱系统', '偏航系统', '塔筒系统', '箱变系统', '事件信息', '逆变器', '汇流箱', '气象站', '汇流箱电流', '集电线路', '箱变', '主变', '站用变', '主进线', '母线分段', '馈线', '功率预测系统', '能量管理', 'SVG', '电能采集', '站内木箱', '全场信息汇', '其他'
    ];
    if (pointInfo.length === 0) {
      return null;
    }
    const tmpGroupArr = pointInfo.map(e => e.devicePointIecCode);
    const codeGroupArr = Array.from(new Set(tmpGroupArr));
    const groupInfo = codeGroupArr.map(e => {
      const innerGroupedInfo = pointInfo.filter(point => point.devicePointIecCode === e);
      const { devicePointIecCode, devicePointIecName } = innerGroupedInfo[0];
      return { // 无分组信息测点： 其他组。
        devicePointIecCode: devicePointIecCode ? `group_${devicePointIecCode}` : 'group_others',
        devicePointIecName: devicePointIecCode ? devicePointIecName: '其他',
        points: innerGroupedInfo.map(point => ({
          devicePointId: point.devicePointId,
          devicePointName: point.devicePointName,
        }))
      }
    });
    groupInfo.sort((a, b) => {
      const sortIndexA = sortNames.indexOf(a.devicePointIecName);
      const sortIndexB = sortNames.indexOf(b.devicePointIecName);
      if (sortIndexA === sortNames.length - 1) { // '其他'
        return 1;
      }
      if (sortIndexB === sortNames.length - 1) {
        return -1;
      }
      if (sortIndexA === -1) {
        return 1;
      }
      if (sortIndexB === -1) {
        return -1
      }
      return (sortIndexA - sortIndexB)
    })
    groupInfo.forEach(e => {
      PointsNodes.push(
        <TreeNode title={e.devicePointIecName} key={e.devicePointIecCode} >
          {e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointId} />)}
        </TreeNode>
      )
    });
    return PointsNodes;
  }

  render(){
    const { queryParam } = this.props;
    const { halfCheckedKeys, expandedKeys } = this.state;
    const { devicePoints } = queryParam;
    return (
      <section className={styles.pointTree}>
        <h3>选择测点({devicePoints.filter(e => !e.includes('group_')).length})</h3>
        <Tree
          checkable
          onCheck={this.pointSelect}
          onExpand={this.expandTree}
          expandedKeys={expandedKeys}
          checkedKeys={{
            checked: devicePoints,
            halfChecked: halfCheckedKeys
          }}
        >
          {this.renderTreeNodes()}
        </Tree>
      </section>
    )
  }
}

export default PointTree;