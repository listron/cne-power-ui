import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, message } from 'antd';
import styles from './historyStyle.scss';

const { TreeNode } = Tree;

class PointTree extends Component {

  static propTypes = {
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    pointInfo: PropTypes.array,
    getChartHistory: PropTypes.func,
    getListHistory: PropTypes.func,
    // changeHistoryStore: PropTypes.func,
  };

  pointSelect = (selectedKeys) => {
    const valideKeys = selectedKeys.filter(e => !e.includes('group_'));
    if (valideKeys.length > 4) {
      message.error('所选测点不得超过4个');
      return;
    }
    const { queryParam, listParam, getChartHistory, getListHistory } = this.props;
    const newQueryParam = {
      ...queryParam,
      devicePoint: selectedKeys,
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
          devicePointCode: point.devicePointCode,
          devicePointName: point.devicePointName,
        }))
      }
    })
    return groupInfo.map(e => {
      if (e.devicePointIecCode) { // 有分组信息
        return (
          <TreeNode title={e.devicePointIecName} key={`group_${e.devicePointIecCode}`} >
            {e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointCode} />)}
          </TreeNode>
        )
      } else { // 无分组信息
        return e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointCode} />)
      }
    })
  }

  render(){
    const { queryParam } = this.props;
    const { devicePoint } = queryParam;
    return (
      <section className={styles.pointTree}>
        <h3>选择测点({devicePoint.length})</h3>
        <Tree
          checkable
          onCheck={this.pointSelect}
          checkedKeys={devicePoint}
        >
          {this.renderTreeNodes()}
        </Tree>
      </section>
    )
  }
}

export default PointTree;