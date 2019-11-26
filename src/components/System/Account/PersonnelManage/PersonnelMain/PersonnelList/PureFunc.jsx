import React from 'react';
import PropTypes from 'prop-types';
import styles from './list.scss';

const ListDepartmentName = ({ departmentTree, selectedDepartment }) => {
    const { departmentName, parentDepartmentId } = selectedDepartment;
    const parentInfo = !['0', '1'].includes(parentDepartmentId) && departmentTree.find(e => e.departmentId === parentDepartmentId);
    return (
      <div className={styles.listDepartmentName}>
        <span>图标</span>
        {parentInfo && <span className={styles.parentName}>{parentInfo.departmentName || '--'}</span>}
        <span>{departmentName}</span>
      </div>
    );
};

ListDepartmentName.propTypes = {
  departmentTree: PropTypes.array,
  selectedDepartment: PropTypes.object,
};

const ListFooter = ({ selectedLength = 0, cancel }) => {
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

ListFooter.propTypes = {
  selectedLength: PropTypes.number,
  cancel: PropTypes.func,
};


export default {
  ListDepartmentName: React.memo(ListDepartmentName),
  ListFooter: React.memo(ListFooter),
};



