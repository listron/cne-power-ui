

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tree } from 'antd';
import WarningTip from '@components/Common/WarningTip';
import Uploader from './Uploader';
import SingleAssignModal from './Modals/SingleAssignModal';
import styles from './main.scss';

const { TreeNode, DirectoryTree } = Tree;

const DepartMentTitle = ({ className, edit, remove, departmentInfo, hasChild}) => (
  <span className={className}>
    <span
      title={departmentInfo.departmentName}
      className={styles.departmentName}
    >{departmentInfo.departmentName}</span>
    <span>
      <span title="编辑" onClick={(event) => edit(event, departmentInfo)} className="iconfont icon-edit" />
      <span title="删除" onClick={(event) => remove(event, departmentInfo, hasChild)} className="iconfont icon-del" />
    </span>
  </span>
);

DepartMentTitle.propTypes = {
  className: PropTypes.string,
  hasChild: PropTypes.bool,
  departmentInfo: PropTypes.object,
  remove: PropTypes.func,
  edit: PropTypes.func,
};

class DepartmentTree extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    preDeleteText: PropTypes.string,
    templateLoading: PropTypes.bool,
    selectedDepartment: PropTypes.object,
    departmentTree: PropTypes.array,
    downloadTemplate: PropTypes.func,
    changeStore: PropTypes.func,
    getStationOfDepartment: PropTypes.func,
    preDeleteDepartmentCheck: PropTypes.func,
    deleteDepartment: PropTypes.func,
    getDepartmentAllUser: PropTypes.func,
  }

  state = {
    refuseText: '',
    deleteDepartmentInfo: {},
  }

  downloadTemplate = () => {
    this.props.downloadTemplate();
  }

  addDepartment = () => { // 新增部门;
    this.props.changeStore({ departmentDrawerKey: 'add' });
  }

  selectDepartmentNode = (selectedKeys, selectNodes) => { // 选中部门 => 请求右侧所有数据 + 记录选中的部门
    const { node = {} } = selectNodes || {}; // 直接根据node节点实例获取挂载的数据;
    const { title = {} } = node.props || {};
    const { departmentInfo = {} } = title.props || {};
    const { departmentId } = departmentInfo;
    // departmentId !== '1' && this.props.getStationOfDepartment({ departmentId }); // 请求部门下电站并作为右侧展示
    this.props.getDepartmentAllUser({ departmentId });
    this.props.changeStore({
      showSingleAssignModal: true,
      selectedDepartment: departmentInfo,
    });
  }

  assignPersonnel = () => {
    console.log('点击分配人员中');
  }

  editDepartment = (event, departmentEditInfo) => { // 编辑
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.props.getStationOfDepartment({ departmentEditInfo }); // 请求该部门下的电站
  }

  removeDepartment = (event, departmentInfo, hasChild) => { // 删除部门 => 有子部门 或 预设部门, 不可删除
    event.stopPropagation();
    const { departmentSource } = departmentInfo;
    if (departmentSource === 0) {
      this.setState({
        refuseText: '不得删除预设部门!',
      });
    } else if (hasChild) {
      this.setState({
        refuseText: '请先删除子部门!',
      });
    } else { // 调用删前预请求接口
      this.setState({ deleteDepartmentInfo: departmentInfo });
      this.props.preDeleteDepartmentCheck({ departmentInfo });
    }
  }

  cancelRemoveDepartment = () => { // 取消删除部门
    this.setState({ deleteDepartmentInfo: {} });
    this.props.changeStore({ preDeleteText: '' });
  }

  confirmRemoveDepartment = () => {
    const { deleteDepartmentInfo } = this.state;
    this.props.deleteDepartment({ deleteDepartmentInfo });
  }

  refuseTipHide = () => this.setState({ refuseText: '' })

  renderTreeNodes = (data, level = 'fatherDepartmentTitle') => data.map(item => {
    const { departmentId, list } = item;
    const titleProps = {
      className: styles[level],
      edit: this.editDepartment,
      remove: this.removeDepartment,
      departmentInfo: item,
    };
    const hasChild = list && list.length > 0;
    if (hasChild) {
      return (
        <TreeNode
          title={<DepartMentTitle {...titleProps} hasChild={true} />}
          key={departmentId}
          className={styles.eachDepartment}
          // selectable={false}
        >
          {this.renderTreeNodes(list, 'subDepartmentTitle')}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={departmentId}
        // selectable={false}
        title={<DepartMentTitle {...titleProps} hasChild={false} className={styles[level]} />}
        className={styles.eachDepartment}
      />
    );
  });

  render(){
    // todo 批量导入成功后, 重新请求列表页数据信息
    const { enterpriseId, templateLoading, selectedDepartment, departmentTree, preDeleteText } = this.props;
    const { refuseText } = this.state;
    const { departmentId } = selectedDepartment || {};
    return (
      <div className={styles.departmentTree}>
        <h3 className={styles.treeTop}>
          <Button className={styles.templateDown} onClick={this.downloadTemplate} loading={templateLoading}>导入模板下载</Button>
          <Uploader enterpriseId={enterpriseId} />
        </h3>
        <section className={styles.treeSection}>
          <h4 className={styles.treeTitle}>
            <span className={styles.treeName}>部门列表</span>
            <span className={styles.titleHandle}>
              <span className={styles.addTip} onClick={this.addDepartment}>添加部门</span>
              <span className={styles.tipHolder}>|</span>
              <span
                className={`${styles.assignTip} ${departmentId === '1' ? styles.forbidAssign : ''}`}
                onClick={departmentId === '1' ? null : this.assignPersonnel}
              >分配人员</span>
            </span>
          </h4>
          <DirectoryTree
            blockNode
            className={styles.treeContent}
            onSelect={this.selectDepartmentNode}
          >
            {this.renderTreeNodes(departmentTree)}
          </DirectoryTree>
        </section>
        {refuseText && <WarningTip onOK={this.refuseTipHide} value={refuseText} />}
        {preDeleteText && <WarningTip
          onOK={this.confirmRemoveDepartment}
          onCancel={this.cancelRemoveDepartment}
          value={preDeleteText}
        />}
        <SingleAssignModal {...this.props} />
      </div>
    );
  }
}

export default DepartmentTree;
