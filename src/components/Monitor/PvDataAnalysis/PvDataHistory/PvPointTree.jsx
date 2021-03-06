import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, message } from 'antd';
import moment from 'moment';
import searchUtil from '@utils/searchUtil';
import styles from './pvHistoryStyle.scss';

const { TreeNode } = Tree;

class PvPointTree extends Component {

  static propTypes = {
    reRenderTree: PropTypes.number,
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    history: PropTypes.object,
    pointInfo: PropTypes.array,
    getChartHistory: PropTypes.func,
    getListHistory: PropTypes.func,
    changeHistoryStore: PropTypes.func,
  };

  state = {
    halfCheckedKeys: [],
    expandedKeys: [],
    selectPointArr: [],
    isNoDataTip: false, // 诊断中心传来的数据与历史趋势无数据相同时，提示用户
  };


  componentWillReceiveProps(nextProps) {
    const { reRenderTree, pointInfo } = nextProps;
    const { history, queryParam, listParam, changeHistoryStore, getChartHistory, getListHistory } = this.props;
    const preReRenderTree = this.props.reRenderTree;
    const { location } = history;
    const { search } = location;
    if (reRenderTree !== preReRenderTree) {
      this.setState({
        expandedKeys: [],
      });
      const { devicePoints } = searchUtil(search).parse();

      if (search) {
        if (devicePoints) {
          const filterPoint = pointInfo.filter(e => devicePoints.indexOf(e.devicePointCode) !== -1); // 诊断中心传来的devicePointId,筛选出相同的devicePointId数组
          const devicePointCodes = filterPoint.map(e => e.devicePointId);
          if (filterPoint.length === 0) {
            this.setState({ isNoDataTip: true });
            setTimeout(() => {
              this.setState({ isNoDataTip: false });
            }, 3000);
          }
          changeHistoryStore({
            queryParam: {
              ...queryParam,
              devicePoints: devicePointCodes,
            },
          });
          getChartHistory({
            queryParam: {
              ...queryParam,
              devicePoints: devicePointCodes,
            },
           });
          getListHistory({
            queryParam: {
              ...queryParam,
              devicePoints: devicePointCodes,
            },
            listParam,
          });
        }else{
          this.setState({ isNoDataTip: true });
          setTimeout(() => {
            this.setState({ isNoDataTip: false });
          }, 3000);
        }
      }
    }
  }

  expandTree = (expandedKeys, expanded) => {
    this.setState({ expandedKeys });
    if (expanded.expanded) {
      if (expandedKeys.length > 0) {
        expandedKeys.splice(0, expandedKeys.length - 1);
      }
      this.setState({
        expandedKeys: expandedKeys,
      });
    } else {
      const key = expanded.node.props.children.map((obj, index) => {
        if (expandedKeys.indexOf(obj.key) > -1) {
          return obj.key;
        }
        return '';
      }).filter((v, index) => v !== '');
      //index  是点击收起节点的下级展开节点
      const index = expandedKeys.indexOf(key[0]); //因为展开的时候会收起兄弟节点  所以这里应该只有一个
      if (index > 0) {
        expandedKeys.splice(0, index + 1); //从0开始  删除到点击的下一级已展开节点
      }
      this.setState({
        expandedKeys: expandedKeys,
      });
    }
  };

  pointSelect = (selectedKeys, { halfCheckedKeys }) => {
    this.setState({
      halfCheckedKeys,
      selectPointArr: selectedKeys,
    });
    const { queryParam, listParam, getChartHistory, getListHistory, changeHistoryStore } = this.props;
    const { startTime, endTime, timeInterval } = queryParam;
    const startData = moment(startTime);
    const newQueryParam = {
      ...queryParam,
      devicePoints: selectedKeys,
    };
    const tmpEndTime = {
      10: moment(endTime).subtract(1, 'M'),
      2: moment(endTime).subtract(14, 'd'),
      5: moment(endTime).subtract(1, 'd'),
    };
    const tmpAllowedEnd = tmpEndTime[timeInterval];
    const tmpText = {
      10: '时间选择范围不可超过1个月',
      2: '时间选择范围不可超过14天',
      5: '时间选择范围不可超过1天',
    };
    if (startData.isBefore(tmpAllowedEnd, 's')) {
      message.error(tmpText[timeInterval]);
      changeHistoryStore({
        queryParam: newQueryParam,
      });
    } else {
      getChartHistory({ queryParam: newQueryParam });
      getListHistory({
        queryParam: newQueryParam,
        listParam,
      });
    }
  };

  onSelect = (selectedKeys, e) => {
    const { queryParam, listParam, getChartHistory, getListHistory, changeHistoryStore } = this.props;
    const { startTime, endTime, timeInterval } = queryParam;
    const { selectPointArr } = this.state;
    const newSelectPointArr = new Set(selectPointArr);
    if (selectPointArr.includes(e.node.props.eventKey)) {
      newSelectPointArr.delete(e.node.props.eventKey);
    } else {
      newSelectPointArr.add(e.node.props.eventKey);
    }
    this.setState({
      selectPointArr: [...newSelectPointArr],
    });
    const newQueryParam = {
      ...queryParam,
      devicePoints: [...newSelectPointArr],
    };
    const tmpEndTime = {
      10: moment(endTime).subtract(1, 'M'),
      2: moment(endTime).subtract(14, 'd'),
      5: moment(endTime).subtract(1, 'd'),
    };
    const tmpAllowedEnd = tmpEndTime[timeInterval];
    const tmpText = {
      10: '时间选择范围不可超过1个月',
      2: '时间选择范围不可超过14天',
      5: '时间选择范围不可超过1天',
    };
    if (startTime.isBefore(tmpAllowedEnd, 's')) {
      message.error(tmpText[timeInterval]);
      changeHistoryStore({
        queryParam: newQueryParam,
      });
    } else {
      getChartHistory({ queryParam: newQueryParam });
      getListHistory({
        queryParam: newQueryParam,
        listParam,
      });
    }
  }

  renderTreeNodes = () => { // 数据分组并基于分组渲染节点。
    const { pointInfo } = this.props;
    const PointsNodes = [];
    const sortNames = [
      '整机系统', '变桨系统', '传动系统', '发电机', '变频器', '机舱系统', '偏航系统', '塔筒系统', '箱变系统', '事件信息', '逆变器', '汇流箱', '气象站', '汇流箱电流', '集电线路', '箱变', '主变', '站用变', '主进线', '母线分段', '馈线', '功率预测系统', '能量管理', 'SVG', '电能采集', '站内木箱', '全场信息汇', '其他',
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
          {e.points.map(inner => <TreeNode title={inner.devicePointName} key={inner.devicePointId} />)}
        </TreeNode>,
      );
    });
    return PointsNodes;
  };



  render() {
    const { queryParam, pointInfo } = this.props;
    const { halfCheckedKeys, expandedKeys, isNoDataTip } = this.state;
    const { devicePoints } = queryParam;
    return (
      <section className={styles.pointTree}>
        {isNoDataTip && <div className={styles.tipText}>数据不存在，请选择其他周期</div>}
        <h3>
          <span>选择测点（</span>
          <span className={styles.num}>{devicePoints.filter(e => !e.includes('group_')).length}</span>
          <span>）</span>
        </h3>
        {pointInfo.length === 0 ? (
          <div className={styles.pointTreeInfo}>
            请先选择电站及设备!
            </div>
        ) : (
            <Tree
              checkable
              onCheck={this.pointSelect}
              onSelect={this.onSelect}
              onExpand={this.expandTree}
              expandedKeys={expandedKeys}
              checkedKeys={{
                checked: devicePoints,
                halfChecked: halfCheckedKeys,
              }}
            >
              {this.renderTreeNodes()}
            </Tree>
          )}
      </section>
    );
  }
}

export default PvPointTree;
