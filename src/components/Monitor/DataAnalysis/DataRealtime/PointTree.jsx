import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, message, Button } from 'antd';
import styles from './realtimeStyle.scss';

const { TreeNode } = Tree;

class PointTree extends Component {

  static propTypes = {
    realtimeType: PropTypes.string,
    reRenderTree: PropTypes.number,
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    pointInfo: PropTypes.array,
    getRealtimeChart: PropTypes.func,
    getRealtimeList: PropTypes.func,
    stopRealtimeChart: PropTypes.func,
    stopRealtimeList: PropTypes.func,
    changeRealtimeStore: PropTypes.func,
  };

  state = {
    halfCheckedKeys: [],
    expandedKeys: []
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

  onPointsQuery = () => {
    const {
      queryParam, listParam, getRealtimeChart, getRealtimeList, realtimeType, stopRealtimeChart, stopRealtimeList
    } = this.props;
    if (realtimeType === 'chart') { // 停止计时，重启计时。
      stopRealtimeChart();
      getRealtimeChart({ queryParam });
    } else {
      stopRealtimeList();
      getRealtimeList({
        queryParam,
        listParam,
      });
    }
  }

  expandTree = (expandedKeys) => {
    this.setState({ expandedKeys });
  }

  pointSelect = (selectedKeys, { halfCheckedKeys }) => {
    const { queryParam, changeRealtimeStore } = this.props;
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
      halfCheckedKeys
    })
    changeRealtimeStore({
      queryParam: {
        ...queryParam,
        devicePoints: selectedKeys,
      }
    })
  }

  renderTreeNodes = () => { // 数据分组并基于分组渲染节点。
    const { pointInfo } = this.props;
    if (pointInfo.length === 0) {
      return null;
    }
    const tmpGroupArr = pointInfo.map(e => e.devicePointIecCode);
    const codeGroupArr = Array.from(new Set(tmpGroupArr));
    const groupInfo = codeGroupArr.map(e => {
      const innerGroupedInfo = pointInfo.filter(point => point.devicePointIecCode === e);
      const { devicePointIecCode, devicePointIecName } = innerGroupedInfo[0];
      return {
        devicePointIecCode,
        devicePointIecName,
        points: innerGroupedInfo.map(point => ({
          devicePointId: point.devicePointId,
          devicePointCode: point.devicePointCode,
          devicePointName: point.devicePointName,
        }))
      }
    })
    const PointsNodes = [], tmpNoneGroupNodes = []; // 无分组的测点，应放末尾。
    groupInfo.forEach(e => {
      if (e.devicePointIecCode) { // 有分组信息
        PointsNodes.push(
          <TreeNode title={e.devicePointIecName} key={`group_${e.devicePointIecCode}`} >
            {e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointId} />)}
          </TreeNode>
        )
      } else { // 无分组信息
        tmpNoneGroupNodes.push(
          ...e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointId} />)
        )
      }
    });
    return PointsNodes.concat(tmpNoneGroupNodes);
  }

  render(){
    const { queryParam = {} } = this.props;
    const { halfCheckedKeys, expandedKeys } = this.state;
    const { devicePoints = [] } = queryParam;
    return (
      <section className={styles.pointTree}>
        <h3>
          <Button onClick={this.onPointsQuery} disabled={devicePoints.length === 0}>
            确定选择({devicePoints.filter(e => !e.includes('group_')).length})
          </Button>
        </h3>
        <Tree
          checkable
          onCheck={this.pointSelect}
          expandedKeys={expandedKeys}
          onExpand={this.expandTree}
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