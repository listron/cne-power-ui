import React from 'react';
import PropTypes from 'prop-types';
import styles from './list.scss';

const ListDepartmentNameFunc = ({ departmentTree, selectedDepartment }) => {
    const { departmentName, departmentId, parentDepartmentId } = selectedDepartment;
    let parentInfo; // parentDepartmentId为0代表无父部门, departmentId为1代表未分配部门, 均不用遍历
    if (parentDepartmentId && departmentId !== '1' && parentDepartmentId !== '0') {
      parentInfo = departmentTree.find(e => e.departmentId === parentDepartmentId);
    }
    return (
      <div className={styles.listDepartmentName}>
        <span className="iconfont icon-bumenx" />
        {parentInfo && <span className={styles.parentName}>{parentInfo.departmentName || '--'}</span>}
        <span>{departmentName}</span>
      </div>
    );
};

ListDepartmentNameFunc.propTypes = {
  departmentTree: PropTypes.array,
  selectedDepartment: PropTypes.object,
};

const ListFooterFunc = ({ selectedLength = 0, cancel }) => {
  return (
    <div className={styles.listFooter}>
      <span>
        当前选中
        <span className={styles.footerValue}>{selectedLength}</span>
        项
        <span className={styles.cancel} onClick={cancel}>取消选择</span>
      </span>
      <span>请选择同一状态下的列表项, 进行操作</span>
    </div>
  );
};

ListFooterFunc.propTypes = {
  selectedLength: PropTypes.number,
  cancel: PropTypes.func,
};

const ListDepartmentName = React.memo(ListDepartmentNameFunc);
const ListFooter = React.memo(ListFooterFunc);

export {
  ListDepartmentName,
  ListFooter,
};


