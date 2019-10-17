import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { dataFormats } from '@utils/utilFunc';

function RunningLog({ runLogInfo = {} }){
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
    <section>
      <h3>运行记录</h3>
      <div>
        {logsArr.map(e => {
          const { title, value } = e;
          return (
            <p key={title}>
              <span>{title}</span>
              <span>
                <span>当月记录条数</span>
                <span>{value}</span>
                <Icon type="right" />
              </span>
            </p>
          );
        })}
      </div>
    </section>
  )
}

RunningLog.propTypes = {
  runLogInfo: PropTypes.object,
};

function TicketsLog({ ticketsInfo = {} }){
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
    <section>
      <h3>运行记录</h3>
      <div>
        {ticketArr.map(e => {
          const { title, finishValue, unfinishValue } = e;
          return (
            <p key={title}>
              <span>{title}</span>
              <span>
                <span>今日未完成</span>
                <span>{finishValue}</span>
                <span>|</span>
                <span>已完成</span>
                <span>{unfinishValue}</span>
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
};

export {
  RunningLog,
  TicketsLog,
};
