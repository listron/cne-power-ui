import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, message } from 'antd';
import styles from './realtimeStyle.scss';

const { TreeNode } = Tree;

class PointTree extends Component {

  static propTypes = {
    realtimeType: PropTypes.string,
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    pointInfo: PropTypes.array,
    getRealtimeChart: PropTypes.func,
    getRealtimeList: PropTypes.func,
    stopRealtimeChart: PropTypes.func,
    stopRealtimeList: PropTypes.func,
  };

  pointSelect = (selectedKeys) => {
    const valideKeys = selectedKeys.filter(e => !e.includes('group_'));
    if (valideKeys.length > 4) {
      message.error('所选测点不得超过4个');
      return;
    }
    const {
      queryParam, listParam, getRealtimeChart, getRealtimeList, realtimeType, stopRealtimeChart, stopRealtimeList
    } = this.props;
    const newQueryParam = {
      ...queryParam,
      devicePoints: selectedKeys,
    };
    if (realtimeType === 'chart') { // 停止计时，重启计时。
      stopRealtimeChart();
      getRealtimeChart({ queryParam: newQueryParam });
    } else {
      stopRealtimeList();
      getRealtimeList({
        queryParam: newQueryParam,
        listParam,
      });
    }
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
    const { devicePoints = [] } = queryParam;
    return (
      <section className={styles.pointTree}>
        <h3>选择测点({devicePoints.length})</h3>
        <Tree
          checkable
          onCheck={this.pointSelect}
          checkedKeys={devicePoints}
        >
          {this.renderTreeNodes()}
        </Tree>
      </section>
    )
  }
}

export default PointTree;