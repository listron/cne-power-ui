import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import styles from './historyStyle.scss';

const { TreeNode } = Tree;

class PointTree extends Component {

  static propTypes = {
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    pointInfo: PropTypes.array,
    getChartHistory: PropTypes.func,
    getListHistory: PropTypes.func,
  };

  pointSelect = (selectedKeys) => {
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

  renderTreeNodes = () => {
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
    // queryParam: { // 请求chart数据的参数集合
    //   stationCode: null, // 选中的电站
    //   deviceFullCode: [], // 选中的设备
    //   startTime: moment().subtract(1, 'day').startOf(),
    //   endTime: moment(),
    //   devicePoint: [], // 选中的测点
    //   timeInterval: 10, // 数据时间间隔:1-1s, 5-5s, 10-10min;
    // },
    // listParam: { // 表格排序额外参数
    //   orderField: '', // 排序字段(默认时间倒序（最新的时间在最上方）
    //   orderType: 1, //	排序方式	否	0：ASC正序，1：DESC倒序
    //   pageNum: 1, // 当前页码（从1开始）
    //   pageSize: 10 // 每页条数
    // },
    return (
      <section className={styles.pointTree}>
        <h3>选择测点({devicePoint.length})</h3>
        <Tree
          checkable
          onCheck={this.pointSelect}
          selectedKeys={devicePoint}
        >
          {this.renderTreeNodes()}
        </Tree>
      </section>
    )
  }
}

export default PointTree;