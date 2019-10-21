import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import styles from './workPage.scss';
import { dataFormats } from '@utils/utilFunc';

function RunningLog({ runLogInfo = {}, theme = 'light' }){
  const { inWarehouseNum, outWarehouseNum, reportNum } = runLogInfo;
  const logsArr = [
    {
      title: '日报上报',
      value: dataFormats(reportNum),
    }, {
      title: '入库记录',
      value: dataFormats(inWarehouseNum),
    }, {
      title: '出库记录',
      value: dataFormats(outWarehouseNum),
    },
  ];
  return (
    <section className={`${styles.runningLog} ${styles[theme]}`}>
      <h3>运行记录</h3>
      <div className={styles.infoList}>
        {logsArr.map(e => {
          const { title, value } = e;
          return (
            <p key={title} className={styles.eachInfo}>
              <span className={styles.infoName}>{title}</span>
              <span className={styles.infoDetail}>
                <span>当月记录条数</span>
                <span className={styles.infoValue}>{value}</span>
                <Icon type="right" />
              </span>
            </p>
          );
        })}
      </div>
    </section>
  );
}

RunningLog.propTypes = {
  runLogInfo: PropTypes.object,
  theme: PropTypes.string,
};

function TicketsLog({ ticketsInfo = {}, theme = 'light' }){
  const { finish = {}, unfinish = {} } = ticketsInfo;
  const ticketArr = [
    {
      title: '消缺',
      finishValue: dataFormats(finish.defectNum),
      unfinishValue: dataFormats(unfinish.defectNum),
    }, {
      title: '巡检',
      finishValue: dataFormats(finish.defectNum),
      unfinishValue: dataFormats(unfinish.defectNum),
    }, {
      title: '工作票',
      finishValue: dataFormats(finish.defectNum),
      unfinishValue: dataFormats(unfinish.defectNum),
    }, {
      title: '操作票',
      finishValue: dataFormats(finish.defectNum),
      unfinishValue: dataFormats(unfinish.defectNum),
    },
  ];
  return (
    <section className={`${styles.ticketsLog} ${styles[theme]}`}>
      <h3>两票三制</h3>
      <div className={styles.infoList}>
        {ticketArr.map(e => {
          const { title, finishValue, unfinishValue } = e;
          return (
            <p key={title} className={styles.eachInfo}>
              <span className={styles.infoName}>{title}</span>
              <span className={styles.infoDetail}>
                <span>今日未完成</span>
                <span className={styles.infoValue}>{finishValue}</span>
                <span>|</span>
                <span>已完成</span>
                <span className={styles.infoValue}>{unfinishValue}</span>
                <Icon type="right" />
              </span>
            </p>
          );
        })}
      </div>
    </section>
  );
}

TicketsLog.propTypes = {
  ticketsInfo: PropTypes.object,
  theme: PropTypes.string,
};

export {
  RunningLog,
  TicketsLog,
};
