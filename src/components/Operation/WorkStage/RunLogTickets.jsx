import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './workPage.scss';
import { dataFormats } from '@utils/utilFunc';

const getMaxValue = (arr, defaultResult = 10) => { // 获取数组最大值
  const tmpArr = arr.filter(e => e > 0 || e === 0 || e === '0');
  return arr.length > 0 ? Math.max(...tmpArr) : defaultResult;
};

const getNumberLength = (valueNumber, baseWidth = 8) => { // 根据数据大小自动判断宽度
  return valueNumber === 0 ? baseWidth : (`${parseInt(valueNumber, 10)}`).length * baseWidth;
};

function RunningLog({ runLogInfo = {}, theme = 'light' }){
  const { inWarehouseNum, outWarehouseNum, reportNum } = runLogInfo;
  const tmpMaxValue = getMaxValue([inWarehouseNum, outWarehouseNum, reportNum]);
  const tmpWidth = getNumberLength(tmpMaxValue);
  const logsArr = [
    {
      title: '日报上报',
      value: dataFormats(reportNum),
      path: '/operation/running/dayReport',
    }, {
      title: '入库记录',
      value: dataFormats(inWarehouseNum),
      path: '/operation/book/stockRecords',
    }, {
      title: '出库记录',
      value: dataFormats(outWarehouseNum),
      path: '/operation/book/stockRecords',
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
              <Link to={e.path} target="_blank" className={styles.infoDetail}>
                <span>当月记录条数</span>
                <span className={styles.infoValue} style={{flexBasis: `${tmpWidth}px`}}>{value}</span>
                <Icon type="right" />
              </Link>
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

function TicketsLog({ ticketsInfo = {}, theme = 'light', stageStations }){
  const { finish = {}, unfinish = {} } = ticketsInfo;

  const tmpFinishMaxValue = getMaxValue([finish.defectNum, finish.inspectNum, finish.workDocketNum, finish.operateDocketNum]);
  const tmpFinishWidth = getNumberLength(tmpFinishMaxValue);
  const tmpUnfinishMaxValue = getMaxValue([unfinish.defectNum, unfinish.inspectNum, unfinish.workDocketNum, unfinish.operateDocketNum]);
  const tmpUnfinishWidth = getNumberLength(tmpUnfinishMaxValue);
  // 消缺 + 巡检 跳新页面的选中电站参数
  const listSearch = {
    stationCodes: stageStations && stageStations.map(cur => (cur.stationCode)) || [],
  };
  const ticketArr = [
    {
      title: '消缺',
      finishValue: dataFormats(finish.defectNum),
      unfinishValue: dataFormats(unfinish.defectNum),
      path: `/operation/workProcess/view?page=list&tab=defect&listSearch=${JSON.stringify(listSearch)}`,
    }, {
      title: '巡检',
      finishValue: dataFormats(finish.inspectNum),
      unfinishValue: dataFormats(unfinish.inspectNum),
      path: `/operation/workProcess/view?page=list&tab=inspect&listSearch=${JSON.stringify(listSearch)}`,
    }, {
      title: '工作票',
      finishValue: dataFormats(finish.workDocketNum),
      unfinishValue: dataFormats(unfinish.workDocketNum),
      path: '/operation/twoTickets/workflow',
    }, {
      title: '操作票',
      finishValue: dataFormats(finish.operateDocketNum),
      unfinishValue: dataFormats(unfinish.operateDocketNum),
      path: '/operation/twoTickets/operateflow',
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
              <Link to={e.path} target="_blank" className={styles.infoDetail}>
                <span>今日未完成</span>
                <span className={styles.infoValue} style={{flexBasis: `${tmpUnfinishWidth}px`}}>{unfinishValue}</span>
                <span className={styles.linkAndTip}>|</span>
                <span>已完成</span>
                <span className={styles.infoValue} style={{flexBasis: `${tmpFinishWidth}px`}}>{finishValue}</span>
                <Icon type="right" />
              </Link>
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
  stageStations: PropTypes.array,
};

export {
  RunningLog,
  TicketsLog,
};
