

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tree } from 'antd';
import Uploader from './Uploader';
import styles from './main.scss';

const { TreeNode, DirectoryTree } = Tree;

const DepartMentTitle = ({ className, edit, remove, departmentInfo}) => (
  <span className={className}>
    <span title={departmentInfo.departmentName} className={styles.departmentName}>{departmentInfo.departmentName}</span>
    <span>
      <span onClick={(e) => edit(event, departmentInfo)} className="iconfont icon-edit" />
      <span onClick={(e) => remove(event, departmentInfo)} className="iconfont icon-del" />
    </span>
  </span>
);

DepartMentTitle.propTypes = {
  className: PropTypes.string,
  departmentInfo: PropTypes.object,
  remove: PropTypes.func,
  edit: PropTypes.func,
};

class DepartmentTree extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    templateLoading: PropTypes.bool,
    selectedDepartment: PropTypes.object,
    departmentTree: PropTypes.array,
    downloadTemplate: PropTypes.func,
    changeStore: PropTypes.func,
    getStationOfDepartment: PropTypes.func,
  }

  downloadTemplate = () => {
    this.props.downloadTemplate();
  }

  selectDepartmentTree = (selectedKeys) => {
    console.log(selectedKeys);
  }

  addDepartment = () => {
    this.props.changeStore({ departmentDrawerKey: 'add' });
  }

  assignPersonnel = () => {
    console.log('点击分配人员中');
  }

  editDepartment = (event, departmentEditInfo) => { // 编辑
    event.stopPropagation();
    this.props.getStationOfDepartment({ departmentEditInfo }); // 请求该部门下的电站
  }

  removeDepartment = (event, departmentInfo) => {
    event.stopPropagation();
  }

  renderTreeNodes = (data, level = 'fatherDepartmentTitle') => data.map(item => {
    const { departmentName, departmentId, parentDepartmentId, list } = item;
    const titleProps = {
      className: styles[level],
      edit: this.editDepartment,
      remove: this.removeDepartment,
      departmentInfo: { departmentName, departmentId, parentDepartmentId },
    };
    if (list && list.length > 0) {
      return (
        <TreeNode
          title={<DepartMentTitle {...titleProps} />}
          key={departmentId}
          className={styles.eachDepartment}
        >
          {this.renderTreeNodes(list, 'subDepartmentTitle')}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={departmentId}
        title={<DepartMentTitle {...titleProps} className={styles[level]} />}
        className={styles.eachDepartment}
      />
    );
  });

  render(){
    // todo 批量导入成功后, 重新请求列表页数据信息
    const { enterpriseId, templateLoading, selectedDepartment, departmentTree } = this.props;
    const { departmentId } = selectedDepartment || {};
    // onSelect, selectedKeys
    return (
      <div className={styles.departmentTree}>
        <h3 className={styles.treeTop}>
          <Button className={styles.templateDown} onClick={this.downloadTemplate} loading={templateLoading}>导入模板下载</Button>
          <Uploader enterpriseId={enterpriseId} />
        </h3>
        <section>
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
            onSelect={this.selectDepartmentTree}
          >
            {this.renderTreeNodes(departmentTree)}
          </DirectoryTree>
        </section>
      </div>
    );
  }
}

export default DepartmentTree;

// const uploadProps = {
//   name: 'file',
//   action: url,
//   headers: { 'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? authData : '') },
//   beforeUpload: this.beforeUpload,
//   data: {
//     enterpriseId: this.props.enterpriseId,
//   },
//   onChange: (info) => {
//     if (info.file.status === 'done') {
//       if (info.file.response.code === '10000') {
//         message.success(`${info.file.name} 导入完成`);
//         const params = {
//           enterpriseId: this.props.enterpriseId,
//           userStatus: this.props.userStatus,
//           roleId: this.props.roleId,
//           pageNum: this.props.pageNum,
//           pageSize: this.props.pageSize,
//         };
//         this.props.getUserList(params);
//       } else {
//         message.error(info.file.response.message);
//       }
//     } else if (info.file.status === 'error') {
//       message.error(`${info.file.name} 导入失败，请重新导入.`);
//     }
//   },
// };
