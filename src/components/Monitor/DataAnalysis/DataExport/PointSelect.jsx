import React, { Component } from 'react';
import { message, Modal, Tree } from 'antd';
import styles from './dataExport.scss';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { runInThisContext } from 'vm';
const { TreeNode } = Tree;

class PointSelect extends Component {
  static propTypes = {
    reRenderTree: PropTypes.number,
    queryParams: PropTypes.object,
    pointInfo: PropTypes.array,
    pointsSeleted: PropTypes.array,
    changeDataExportStore: PropTypes.func,
    getDataExport: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      halfCheckedKeys: [],
      expandedKeys: [],
      selectedtags: props.pointsSeleted || [],
    }
  }

  componentWillReceiveProps(nextProps) {
    const { reRenderTree } = nextProps;
    const preReRenderTree = this.props.reRenderTree;
    if (reRenderTree !== preReRenderTree) {
      this.setState({
        expandedKeys: []
      })
    }
  }

  // componentDidUpdate(prevProps){ // 默认选中测点
  //   const { pointInfo, changeDataExportStore, queryParams } = this.props;
  //   const prevPoints = prevProps.pointInfo;
  //   if (prevPoints.length === 0 && pointInfo.length > 0) { // 得到初始测点数据
  //     changeDataExportStore({
  //       ...queryParams,
  //       devicePointCodes: pointInfo.isChecked(1) // 默认选中测点
  //     })
  //     this.pointSelect(pointInfo.isChecked(1));
  //   }else if(prevPoints.length > 0 && pointInfo.length > 0 && prevPoints[0].devicePointCode === pointInfo[0].devicePointCode){ // 设备数据切换
  //     changeDataExportStore({
  //       ...queryParams,
  //       devicePointCodes: pointInfo.isChecked(1) // 默认选中测点
  //     })
  //     this.pointSelect(pointInfo.isChecked(1));
  //   }
  // }

  clearDevice = () => { // 清空测点
    const { changeDataExportStore } = this.props;
    changeDataExportStore({
      pointsSeleted: []
    })
  }

  cancelChecked = (devicePointCode) => { // 取消单个选中设备。
    const { changeDataExportStore, pointsSeleted } = this.props;
    const newDevices = pointsSeleted.filter(e => e.devicePointCode !== devicePointCode);
    changeDataExportStore({
      pointsSeleted: newDevices
    })
  }

  showModal = () => { // 显示模态框
    this.setState({
      visible: true,
    });
  };

  handleOk = e => { // 关闭模态框
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => { // 关闭模态框
    this.setState({
      visible: false,
    });
  };

  expandTree = (expandedKeys) => {
    this.setState({ expandedKeys });
  }

  pointSelect = (selectedKeys, { checkedNodes, halfCheckedKeys }) => { 
    const { queryParams, changeDataExportStore } = this.props;
    const { startTime, endTime, timeInterval } = queryParams;
    const { selectedtags } = this.state;
    const pointsSeleted = checkedNodes.map(e => ({
      key:e.key,
      title: e.props.title
    }))

    const valideKeys = selectedKeys.filter(e => !e.includes('group_'));
    if (valideKeys.length > 30) {
      const preHalfCheckedKeys = this.state.halfCheckedKeys;
      message.error('所选测点不得超过30个');
      this.setState({
        halfCheckedKeys: preHalfCheckedKeys
      });
      return;
    }
    
    this.setState({
      halfCheckedKeys,
      selectedtags
    })
    const newQueryParam = {
      ...queryParams,
      devicePointCodes: selectedKeys,
    };
    console.log('newQueryParam: ', newQueryParam);
    
    changeDataExportStore({
      queryParams: newQueryParam,
      pointsSeleted
    })

    const tmpAllowedEnd = timeInterval === 10 ? moment(endTime).subtract(1, 'M') : moment(endTime).subtract(1, 'd');
    if (startTime.isBefore(tmpAllowedEnd, 's')) {
      message.error(`${timeInterval === 10 ? '时间选择范围不可超过1个月' : '时间选择范围不可超过1天'}`);
      changeDataExportStore({
        queryParams: newQueryParam,
        pointsSeleted
      })
    }else {
      changeDataExportStore({
        queryParams: newQueryParam,
        pointsSeleted
      })
    }
  }

  renderTreeNodes = () => { // 数据分组并基于分组渲染节点。
    const { pointInfo } = this.props;
    const PointsNodes = [];
    const sortNames = [
      '整机系统', '变桨系统', '传动系统', '发电机', '变频器', '机舱系统', '偏航系统', '塔筒系统', '箱变系统', '事件信息', '其他'
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


  render() {
    const { halfCheckedKeys, expandedKeys } = this.state;
    const { queryParams, pointsSeleted, pointInfo } = this.props;
    const { devicePointCodes } = queryParams;
    return (
      <div className={styles.pointSelect}>
        <div className={styles.pointTree} onClick={this.showModal}>
          <span className={styles.pointNum}>已选{pointsSeleted.length}/{pointInfo.length}</span>
          <div className={styles.filterIcon}>
            <i className="iconfont icon-filter" />
          </div>
        </div>
        <div className={styles.checkPoint}>
          <Modal
            title="请选择测点"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <Tree
              multiple
              checkable
              onCheck={this.pointSelect}
              onExpand={this.expandTree}
              expandedKeys={expandedKeys}
              checkedKeys={{
                checked: pointsSeleted.map(e => e.key),
                halfChecked: halfCheckedKeys
              }}
              >
              {this.renderTreeNodes()}
            </Tree>
          
            <div className={styles.checkedList}>
              <div className={styles.top}>
                <span>已选测点 {pointsSeleted.length}个</span>
                <span className={styles.clear} onClick={this.clearDevice}>清空</span>
              </div>
              <div className={styles.checkedInfo}>
                {pointsSeleted.map((e, index) => (
                  <span key={e.devicePointCode + index} className={styles.eachDevice}>
                    <span className={styles.name}>{e.title}</span>
                    <span className={styles.cancel} onClick={() => this.cancelChecked(e.devicePointCode)}>X</span>
                  </span>
                ))}
              </div>
            </div>
          </Modal>
          </div>
      </div>
    )
  }
}
export default PointSelect;