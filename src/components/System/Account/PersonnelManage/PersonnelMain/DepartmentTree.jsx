

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Uploader from './Uploader';
import styles from './main.scss';

class DepartmentTree extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    templateLoading: PropTypes.bool,
    selectedDepartment: PropTypes.object,
    downloadTemplate: PropTypes.func,
    changeStore: PropTypes.func,
  }

  downloadTemplate = () => {
    this.props.downloadTemplate();
  }

  addDepartment = () => {
    this.props.changeStore({ showDepartmentDrawer: 'add' });
  }

  assignPersonnel = () => {
    console.log('点击分配人员中');
  }

  render(){
    // todo 批量导入成功后, 回归默认状态请求 未分配部门人员页面
    // todo 当处于未分配部门时，分配人员选项不能点击
    const { enterpriseId, templateLoading, selectedDepartment } = this.props;
    const { departmentId } = selectedDepartment || {};
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
          <div>
            部门的树形结构
          </div>
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
