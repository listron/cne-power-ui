import React, { Component } from 'react';
const { memo, useEffect, useCallback, useMemo, useState } = React;
import CneButton from '../../../../Common/Power/CneButton';
import { Tooltip } from 'antd';
import styles from './defectEvent.scss';
/** 
 * 
*/

const DefectEventDetail = ({ defectMessage }) => {
  const [state, changeState] = useState();
  const { eventId } = defectMessage;
  const eventStatus = ['yijie', 'weijie', 'hulue1'];
  const levelStatus = ['一级', '二级', '三级', '四级'];
  const stateArr = [{ name: '已解决', value: 'yijie' }, { name: '未解决', value: 'weijie' }, { name: '忽略', value: 'hulue' }];
  const delEvent = () => {
    console.log('需要删除么');
    // this.props.change()
  };
  const handleChane = (value) => {
    changeState(value);
    // this.props.change()
  };

  return (
    <div className={styles.eventDetail}>
      <div className={styles.messageWrap}>
        <div className={styles.status}>
          {defectMessage.eventState &&
            <i className={`iconfont icon-${eventStatus[+defectMessage.eventState - 1]} ${styles[eventStatus[+defectMessage.eventState - 1]]}`} />}
          <i className={`iconfont icon-wrong ${styles.close}`} onClick={delEvent} />
        </div>
        <div className={styles.oneLine}>
          <div className={styles.list}> <b>缺陷类型</b>:<p>{defectMessage.defectTypeName}</p> </div>
          {defectMessage.deviceTypeName && <div className={styles.list}> <b>设备类型</b>:<p>{defectMessage.deviceTypeName}</p> </div>}
          {defectMessage.deviceName && <div className={styles.list}> <b>设备名称</b>:<p>{defectMessage.deviceName}</p> </div>}
          {defectMessage.defectLevel &&
            <div className={styles.list}>
              <b>缺陷级别</b>:
           <p>
                {levelStatus[defectMessage.defectLevel - 1]}
                <Tooltip placement="top" title="缺陷级别的定义，需要产品那边提供文案">
                  <i className={`iconfont icon-help ${styles.iconHelp}`} />
                </Tooltip>
              </p>
            </div>
          }
        </div>
        <div className={styles.twoLine}>
          <div className={styles.descipt}>
            <b>缺陷描述:</b>
            <p>{defectMessage.eventDesc}</p>
          </div>
          {defectMessage.eventId &&
            <div className={styles.analysize}>
              <CneButton> <i className={'iconfont icon-look'} /> 查看分析 </CneButton>
            </div>
          }
        </div>
        {
          defectMessage.eventImgs.length > 0 &&
          <div className={styles.threeLine}>
            {
              defectMessage.eventImgs.map((e) => {
                return <img src={e.url} key={e.imgId} />;
              })
            }
          </div>
        }
      </div>
      <div className={styles.footer}>
        {stateArr.map(e => {
          return (
            <div
              key={e.value}
              className={`${styles.stateBox} ${styles[e.value]} ${state === e.value && styles.selected}`}
              onClick={() => handleChane(e.value)}>
              <i className={`iconfont icon-${state === e.value && 'done' || 'goon'}`} /><span>{e.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default DefectEventDetail;
