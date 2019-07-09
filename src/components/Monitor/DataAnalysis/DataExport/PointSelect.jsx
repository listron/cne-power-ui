import React, { Component } from 'react';
import { message, Modal, Tree } from 'antd';
import styles from './dataExport.scss';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Select, Input } from 'antd';
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
      selectedtags: [], // props.pointsSeleted || [],
      checkPoint:[],
    }
    this.arrTree = []; // 备份选中的测点
  }

  componentWillReceiveProps(nextProps) {
    const { pointsSeleted } = nextProps;
    const prepointsSeleted = this.props.pointsSeleted;
    if (pointsSeleted !== prepointsSeleted && pointsSeleted.length) {
      this.setState({checkPoint: pointsSeleted})
    }
  }

  componentDidUpdate(prevProps){ // 默认选中测点
    const { pointInfo = [], changeDataExportStore, queryParams } = this.props;
    const prevPoints = prevProps.pointInfo;
    const checkedPoint = pointInfo.filter(e => e.isChecked >= 1).slice(0, 30).map(e => ({
      key: e.devicePointId,
      title: e.devicePointName,
    }));
    const prevPoint = prevPoints.length && prevPoints[0] && prevPoints[0].devicePointId; 
    const pointInfos = pointInfo.length && pointInfo[0] && pointInfo[0].devicePointId; 

    if (prevPoints.length === 0 && pointInfo.length > 0) { // 得到初始测点数据
      this.arrTree = checkedPoint; // 备份选中的测点
      changeDataExportStore({
        queryParams: {
          ...queryParams,
          devicePointIds: pointInfo.filter(e => e.isChecked >= 1).map(e => e.devicePointId), // 默认选中测点
        },
        pointsSeleted: checkedPoint,
      })
    }else if(!!prevPoint && !!pointInfos && prevPoints[0].devicePointId !== pointInfo[0].devicePointId){ // 设备数据切换
      changeDataExportStore({
        queryParams: {
          ...queryParams,
          devicePointIds: pointInfo.filter(e => e.isChecked >= 1).map(e => e.devicePointId), // 默认选中测点
        },
        pointsSeleted: checkedPoint,
      });
    }
  }

  clearDevice = () => { // 清空测点
    const { changeDataExportStore } = this.props;
    this.setState({
      checkPoint: []
    })
    changeDataExportStore({
      pointsSeleted: []
    })
  }

  cancelChecked = (devicePointId) => { // 取消单个选中设备。
    const { changeDataExportStore, pointsSeleted } = this.props;
    const newPoint = pointsSeleted.filter(e => {
      if (e.key !== devicePointId) {
        return true
      }
    });
    changeDataExportStore({
      pointsSeleted: newPoint
    })
  }

  showModal = () => { // 显示模态框
    const { pointInfo } = this.props;
    if (pointInfo.length !== 0) {
      this.setState({
        visible: true,
      });
    }
  };

  handleOk = e => { // 确认模态框
    const { changeDataExportStore, queryParams } = this.props;
    const { selectedtags, checkPoint } = this.state;
    const pointsSeleted = checkPoint;
    this.setState({
      visible: false,
    });
    changeDataExportStore({
      queryParams: {
        ...queryParams,
        devicePointIds: selectedtags
      },
        pointsSeleted
    })
  };

  handleCancel = e => { // 关闭模态框
    const { pointsSeleted } = this.props;
    this.setState({
      checkPoint: pointsSeleted,
    });
    this.setState({
      visible: false,
    }, () => { // 当选中的测点被清除时，将备份的测点赋值给之前的选中测点数组
      if (pointsSeleted.length === 0) {
        const { changeDataExportStore } = this.props;
        changeDataExportStore({
          pointsSeleted: this.arrTree
        })
      }
    });
  };

  pointSelect = (selectedKeys, { checkedNodes = [], halfCheckedKeys }) => { // 选择测点
    const valideKeys = selectedKeys.filter(e => !e.includes('group_'));
    if (valideKeys.length > 30) {
      const preHalfCheckedKeys = this.state.halfCheckedKeys;
      message.error('所选测点不得超过30个');
      this.setState({
        halfCheckedKeys: preHalfCheckedKeys
      });
      return;
    }

    const checkPoint = checkedNodes.map(e => ({
      key: e.key,
      title: e.props.title
    }))

    this.setState({
      halfCheckedKeys,
      selectedtags: selectedKeys,
      checkPoint
    })
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
    const { halfCheckedKeys, checkPoint, visible } = this.state;
    const { pointsSeleted, pointInfo } = this.props;
      return (
      <div className={styles.pointSelect}>
        <div className={styles.pointTree} onClick={this.showModal}>
          <Input disabled={pointInfo.length === 0} />
          {pointsSeleted.length !== 0 ? 
            <span className={styles.pointNumDark}>已选{pointsSeleted.length}/{pointInfo.length}</span>
          : <span className={styles.pointNumLight}>已选{pointsSeleted.length}/{pointInfo.length}</span>}
          <div className={styles.filterIcon}>
            <i className="iconfont icon-filter" />
          </div>
        </div>
        <div className={styles.checkPoint}>
          <Modal
            title="请选择测点"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
            <Tree
              multiple
              checkable
              className={styles.pointTrees}
              onCheck={this.pointSelect}
              onExpand={this.expandTree}
              checkedKeys={{
                checked: checkPoint.map(e => e.key),
                halfChecked: halfCheckedKeys
              }}
              >
              {this.renderTreeNodes()}
            </Tree>
        
            <div className={styles.checkedList}>
              <div className={styles.top}>
                <span>已选测点 {checkPoint.length}个</span>
                <span className={styles.clear} onClick={this.clearDevice}>清空</span>
              </div>
              <div className={styles.checkedInfo}>
                {checkPoint.map((e, index) => (
                  <span key={e.key + index} className={styles.eachDevice}>
                    <span className={styles.name}>{e.title}</span>
                    <span className={styles.cancel} onClick={() => this.cancelChecked(e.key)}>X</span>
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