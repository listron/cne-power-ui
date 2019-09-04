import React from 'react';
import PropTypes from 'prop-types';
import styles from './miniComponents.scss';
import { dataFormat } from '../../../../utils/utilFunc';

export const OperationInfo = ({ operationInfo }) => { // 运维情况
  const completeNum = dataFormat(operationInfo.completeNum);
  const handleNum = dataFormat(operationInfo.handleNum);
  return (
    <section className={styles.operationInfo}>
      <h3>运维情况</h3>
      <div className={styles.ticketDetail}>
        <div className={styles.ticketDone}>
          <h4>本月完成工单</h4>
          <div className={styles.circle}>
            {completeNum}
          </div>
        </div>
        <div className={styles.ticketDoing}>
          <h4>执行中工单</h4>
          <div className={styles.circle}>
            {handleNum}
          </div>
        </div>
      </div>
    </section>
  );
};

OperationInfo.propTypes = {
  operationInfo: PropTypes.object,
};
