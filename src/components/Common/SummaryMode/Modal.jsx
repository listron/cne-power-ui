import React, { Component } from 'react';
import { Modal, Tree, Checkbox } from 'antd';
import styles from './styles.scss';
import PropTypes from 'prop-types';
const { TreeNode } = Tree;



/* 
汇总方式弹窗共用控件。
参数：
1.组件接收参数
    hideModal:  必填  隐藏弹窗方法
    showModal: 必填   显示弹窗方法
    handleOK: 必填    数据选择后的回调
    sourceData: 必填  初始数据tree
    list: 必填        默认所选项
    visiable: 必填    控制弹窗显示隐藏变量
2.tree结构要符合antd要求
*/

class SelectModal extends Component {
  static propTypes = {
    hideModal: PropTypes.func,
    showModal: PropTypes.func,
    handleOK: PropTypes.func,
    sourceData: PropTypes.array,
    list: PropTypes.array,
    visiable: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [...props.list],
      children: props.sourceData,
      // tree: [
      //   {
      //     title: '全部',
      //     key: '-999999',
      //     children: props.sourceData,
      //   },
      // ],
    };

  }
  componentWillReceiveProps(nextProps) {
    this.setState({ checkedKeys: nextProps.list });
  }
  onCheck = (checkedKeys) => {

    this.setState({ checkedKeys });
    this.delParentNode(this.props.sourceData, checkedKeys);

  }
  showModal = () => {
    this.props.showModal();
    this.setState({
      list: [...this.props.list],
    });
  }
  handleOK = () => {
    const keys = this.delParentNode(this.props.sourceData, [...this.state.checkedKeys]);

    this.props.handleOK(keys);
  }
  //去除选中节点中的父节点 需要递归
  delParentNode = (data, keys) => {

    data.forEach(e => {
      if (e.children) {
        this.delParentNode(e.children, keys);
        if (keys.indexOf(String(e.key)) !== -1) {
          keys.splice(keys.indexOf(String(e.key)), 1);
        }


      }

    });
    return keys;
  }
  hideModal = () => {
    this.props.hideModal();
  }


  checkAllStation = (e) => {
    if (!e.target.checked) { // 取消全选时清空。
      this.setState({ checkedKeys: [] });
      return;
    }
    const { sourceData } = this.props;
    const getSelectCode = (data) => {
      const selectArray = []; const selectStation = [];
      data && data.length > 0 && data.forEach(e => {
        if (e && e.children && e.children.length > 0) {
          selectArray.push(...getSelectCode(e.children));//递归
        }
        if (e && e.stationCode) {//拿到电站code
          selectStation.push(e.stationCode);
        }
        if (e && e.deviceCode) {
          selectArray.push(e.key);
          // selectArray.push(`${e.deviceCode}_${e.deviceCode}`)
        } else if (e && e.deviceModeCode) {
          selectArray.push(`${e.key}`);
          //  selectArray.push(e.deviceModeCode)
        }
      });
      return selectArray.length > 0 ? selectArray : selectStation;
    };
    const selectDepartment = getSelectCode(sourceData);
    this.setState({ checkedKeys: selectDepartment });
  }
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })



  render() {
    const { visiable, sourceData, dataNum } = this.props;
    const { checkedKeys } = this.state;
    const checked = dataNum && checkedKeys.length === dataNum;
    return (
      <div className={styles.deviceSelectModal}>
        <i className="iconfont icon-filter" onClick={this.showModal} />
        <Modal
          visible={visiable}
          onOk={this.handleOK}
          onCancel={this.hideModal}
          cancelText="取消"
          okText="确定"
          title="请选择"
          width={625}
          wrapClassName={styles.deviceModal}
        >
          <div className={styles.deviceContent}>
            <Checkbox onChange={this.checkAllStation} checked={checked} >全选</Checkbox>
            <Tree
              checkable
              autoExpandParent={true}
              // defaultExpandAll={true}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              blockNode={false}
            >
              {this.renderTreeNodes(this.props.sourceData)}
            </Tree>
          </div>
        </Modal>
      </div>
    );

  }
}
export default SelectModal;
