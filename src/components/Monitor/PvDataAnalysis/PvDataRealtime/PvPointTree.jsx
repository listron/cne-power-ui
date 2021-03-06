import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tree, message, Button} from 'antd';
import styles from './pvRealtimeStyle.scss';
import moment from 'moment';


const {TreeNode} = Tree;

class PvPointTree extends Component {

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
    expandedKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    const {reRenderTree} = nextProps;
    const preReRenderTree = this.props.reRenderTree;
    if (reRenderTree !== preReRenderTree) {
      this.setState({
        expandedKeys: [],
      });
    }
  }

  onPointsQuery = () => {
    const {
      queryParam, listParam, getRealtimeChart, getRealtimeList, realtimeType, stopRealtimeChart, stopRealtimeList, changeRealtimeStore,
    } = this.props;
    const clickStartTime = moment(); // 点击确定按钮的时间

    if (realtimeType === 'chart') { // 停止计时，重启计时。
      stopRealtimeChart();
      getRealtimeChart({queryParam});
    } else {
      stopRealtimeList();
      getRealtimeList({
        queryParam,
        listParam,
      });
    }

    changeRealtimeStore({
      startTime: clickStartTime,
    });
  };

  expandTree = (expandedKeys) => {
    this.setState({expandedKeys});
  };

  pointSelect = (selectedKeys, {halfCheckedKeys}) => {
    const {queryParam, changeRealtimeStore} = this.props;
    const valideKeys = selectedKeys.filter(e => !e.includes('group_'));
    if (valideKeys.length > 4) {
      const preHalfCheckedKeys = this.state.halfCheckedKeys;
      message.error('所选测点不得超过4个');
      this.setState({
        halfCheckedKeys: preHalfCheckedKeys,
      });
      return;
    }
    this.setState({
      halfCheckedKeys,
    });
    changeRealtimeStore({
      queryParam: {
        ...queryParam,
        devicePoints: selectedKeys,
      },
    });
  };

  renderTreeNodes = () => { // 数据分组并基于分组渲染节点。
    const {pointInfo} = this.props;
    const PointsNodes = [];
    const sortNames = [
      '整机系统', '变桨系统', '传动系统', '发电机', '变频器', '机舱系统', '偏航系统', '塔筒系统', '箱变系统', '事件信息', '其他',
    ];
    if (pointInfo.length === 0) {
      return null;
    }
    const tmpGroupArr = pointInfo.map(e => e.devicePointIecCode);
    const codeGroupArr = Array.from(new Set(tmpGroupArr));
    const groupInfo = codeGroupArr.map(e => {
      const innerGroupedInfo = pointInfo.filter(point => point.devicePointIecCode === e);
      const {devicePointIecCode, devicePointIecName} = innerGroupedInfo[0];
      return { // 无分组信息测点： 其他组。
        devicePointIecCode: devicePointIecCode ? `group_${devicePointIecCode}` : 'group_others',
        devicePointIecName: devicePointIecCode ? devicePointIecName : '其他',
        points: innerGroupedInfo.map(point => ({
          devicePointId: point.devicePointId,
          devicePointName: point.devicePointName,
        })),
      };
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
        return -1;
      }
      return (sortIndexA - sortIndexB);
    });

    groupInfo.forEach(e => {
      PointsNodes.push(
        <TreeNode title={e.devicePointIecName} key={e.devicePointIecCode}>
          {e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointId}/>)}
        </TreeNode>,
      );
    });
    return PointsNodes;
  };

  render() {
    const {queryParam = {}} = this.props;
    const {halfCheckedKeys, expandedKeys} = this.state;
    const {devicePoints = []} = queryParam;
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
            halfChecked: halfCheckedKeys,
          }}
        >
          {this.renderTreeNodes()}
        </Tree>
      </section>
    );
  }
}

export default PvPointTree;
