import React, { Component } from 'react';
const { memo, useEffect, useCallback, useMemo, useState } = React;
import CneButton from '../../../../Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';
import { Tooltip } from 'antd';
import styles from './defectEvent.scss';
import PicUploader from '../../Common/PicUploader';
/** 
 * 
*/

const DefectEventDetail = ({ defectMessage, del = false, allowedOpr = false, eventChange, delChange }) => {
  const [state, changeState] = useState();
  const [visible, changeVisible] = useState(false);
  const { eventId, diagWarningId, eventImgs = [] } = defectMessage;
  const eventStatus = ['yijie', 'weijie', 'hulue1'];
  const levelStatus = ['一级', '二级', '三级', '四级'];
  const stateArr = [{ name: '已解决', value: 'yijie' }, { name: '未解决', value: 'weijie' }, { name: '忽略', value: 'hulue' }];
  const delEvent = () => {
    changeVisible(true);
    delChange(diagWarningId);
  };
  const handleChane = (value) => { // 状态改变的时候
    changeState(value);
    const arr = { 'yijie': 1, 'weijie': 2, 'hulue': 3 };
    eventChange({ eventId, eventState: arr[value] });
  };

  const onConfirm = () => { // 只有在 待领取 事件派发 的页面缺陷事件才可以删除 
    console.log('请求数据，去删除');
  };

  const onCancel = () => {
    changeVisible(false);
  };

  return (
    <div className={styles.eventDetail}>
      <div className={styles.messageWrap}>
        <div className={styles.status}>
          {defectMessage.eventState &&
            <i className={`iconfont icon-${eventStatus[+defectMessage.eventState - 1]} ${styles[eventStatus[+defectMessage.eventState - 1]]}`} />}
          {del && <i className={`iconfont icon-wrong ${styles.close}`} onClick={delEvent} />}
        </div>
        <div className={styles.oneLine}>
          <div className={styles.list}> <b>缺陷类型</b>:<p>{defectMessage.defectTypeCode === 1 && '设备缺陷' || '其他缺陷'}</p> </div>
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
          {diagWarningId &&
            <div className={styles.analysize}>
              <CneButton> <i className={'iconfont icon-look'} /> 查看分析 </CneButton>
            </div>
          }
        </div>
        {
          eventImgs && eventImgs.length > 0 &&
          <div className={styles.threeLine}>
            <PicUploader
              value={eventImgs.map(e => e.url)}
              mode="review"
            />
          </div>
        }
      </div>
      {allowedOpr && <div className={styles.footer}>
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
      </div>}
      <CneTips
        tipText={'确认删除此事件'}
        theme={'light'}
        onConfirm={onConfirm}
        onCancel={onCancel}
        confirmText={'确认'}
        visible={visible}
        width={260}
      />
    </div>
  );
};


export default DefectEventDetail;
