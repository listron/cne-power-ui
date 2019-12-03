

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tree } from 'antd';
import WarningTip from '@components/Common/WarningTip';
import Uploader from './Uploader';
import SingleAssignModal from './Modals/SingleAssignModal';
import styles from './main.scss';

const { TreeNode, DirectoryTree } = Tree;

const DepartMentTitle = ({ className, edit, remove, departmentInfo, hasChild, deleteRight, updateRight }) => (
  <span className={className}>
    <span
      title={departmentInfo.departmentName}
      className={styles.departmentName}
    >{departmentInfo.departmentName}</span>
    <span>
      {updateRight && <span title="编辑" onClick={(event) => edit(event, departmentInfo)} className="iconfont icon-edit" />}
      {deleteRight && <span title="删除" onClick={(event) => remove(event, departmentInfo, hasChild)} className="iconfont icon-del" />}
    </span>
  </span>
);

DepartMentTitle.propTypes = {
  className: PropTypes.string,
  hasChild: PropTypes.bool,
  departmentInfo: PropTypes.object,
  deleteRight: PropTypes.bool,
  updateRight: PropTypes.bool,
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
    getUserList: PropTypes.func,
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
    const { selectedDepartment } = this.props;
    const { node = {} } = selectNodes || {}; // 直接根据node节点实例获取挂载的数据;
    const { title = {} } = node.props || {};
    const { departmentInfo = {} } = title.props || {};
    const { departmentId } = departmentInfo;
    if (departmentId !== selectedDepartment.departmentId) {
      this.props.changeStore({
        selectedDepartment: departmentInfo,
        userListParams: {
          username: '',
          phoneNum: '',
          stationName: '',
        }, // 展示用户列表请求信息
        userListPageInfo: {
          pageNum: 1,
          pageSize: 10,
          sortField: 'u.create_time', // 排序（默认u.create_time，用户状态eu.enterprise_user_status）
          sortMethod: 'desc', // 排序规则 "asc"：正序  "desc"：倒序
        }, // 展示用户列表页面信息
      });
      this.props.getStationOfDepartment({ departmentId });
      this.props.getUserList({ departmentId });
      departmentId !== '1' && this.props.getDepartmentAllUser({ departmentId }); // 请求部门下电站并作为右侧 + 分配用户展示
    }
  }

  assignPersonnel = () => {
    this.props.changeStore({ showSingleAssignModal: true });
  }

  editDepartment = (event, departmentEditInfo) => { // 编辑
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.props.getStationOfDepartment({ departmentEditInfo }); // 请求该部门下的电站
  }

  removeDepartment = (event, departmentInfo, hasChild) => { // 删除部门 => 有子部门 或 预设部门, 不可删除
    event.stopPropagation();
    const { departmentSource } = departmentInfo;
    if (departmentSource === '0') {
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
    this.props.deleteDepartment({ departmentId: deleteDepartmentInfo.departmentId });
  }

  refuseTipHide = () => this.setState({ refuseText: '' })

  renderTreeNodes = (data, deleteRight, updateRight, level = 'fatherDepartmentTitle') => data.map(item => {
    const { departmentId, list } = item;
    const titleProps = {
      className: styles[level],
      edit: this.editDepartment,
      remove: this.removeDepartment,
      departmentInfo: item,
      deleteRight,
      updateRight,
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
          {this.renderTreeNodes(list, deleteRight, updateRight, 'subDepartmentTitle')}
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
    const { enterpriseId, templateLoading, selectedDepartment, departmentTree, preDeleteText } = this.props;
    const { refuseText } = this.state;
    const { departmentId } = selectedDepartment || {};
    const rights = localStorage.getItem('rightHandler');
    const createRight = rights && rights.split(',').includes('account_department_create');
    const userRight = rights && rights.split(',').includes('account_department_user');
    const deleteRight = rights && rights.split(',').includes('account_department_delete');
    const updateRight = rights && rights.split(',').includes('account_department_update');
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
              {createRight && <span className={styles.addTip} onClick={this.addDepartment}>添加部门</span>}
              {createRight && <span className={styles.tipHolder}>|</span>}
              {userRight && <span
                className={`${styles.assignTip} ${departmentId === '1' ? styles.forbidAssign : ''}`}
                onClick={departmentId === '1' ? null : this.assignPersonnel}
              >分配人员</span>}
            </span>
          </h4>
          <DirectoryTree
            blockNode
            className={styles.treeContent}
            onSelect={this.selectDepartmentNode}
          >
            {this.renderTreeNodes(departmentTree, deleteRight, updateRight)}
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
