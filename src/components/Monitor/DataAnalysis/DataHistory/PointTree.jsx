import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, message } from 'antd';
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
    // changeHistoryStore: PropTypes.func,
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
    const { queryParam, listParam, getChartHistory, getListHistory } = this.props;
    const newQueryParam = {
      ...queryParam,
      devicePoints: selectedKeys,
    };
    getChartHistory({ queryParam: newQueryParam });
    getListHistory({
      queryParam: newQueryParam,
      listParam,
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
          devicePointName: point.devicePointName,
        }))
      }
    })
    const PointsNodes = [], tmpNoneGroupNodes = [];
    groupInfo.forEach(e => { // 无分组的测点，应放末尾。
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