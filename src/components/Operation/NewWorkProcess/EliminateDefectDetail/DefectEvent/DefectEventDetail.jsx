import React, { Component } from 'react';
const { memo, useEffect, useCallback, useMemo, useState, useRef } = React;
import CneButton from '../../../../Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';
import { Tooltip } from 'antd';
import styles from './defectEvent.scss';
import PicUploader from '../../Common/PicUploader';
import { Link } from 'react-router-dom';
/** 
 * 
*/

const DefectEventDetail = ({ defectMessage, del = false, allowedOpr = false, eventChange, delChange }) => {
  const [state, changeState] = useState();
  const [visible, changeVisible] = useState(false);
  const defectType = useRef();
  const deviceTypeName = useRef();
  const deviceName = useRef();
  const defectLevel = useRef();
  const allLine = useRef();
  const { eventId, diagWarningId, eventImgs = [], deviceFullcode } = defectMessage;
  const eventStatus = ['yijie', 'weijie', 'hulue1'];
  const levelStatus = ['一级', '二级', '三级', '四级'];
  const defectLevelMes = [
    '一级:(示例)相关开关量决定的停机事件；设备疑似有重大隐患。',
    '二级:(示例)相关测量值诊断的设备不发电或发电性能偏弱问题。',
    '三级:(示例)由于设备不稳定或者外部环境影响造成的保护值越限问题。',
    '四级:(示例)专指设备运行数据越界、恒值不变、缺失、错位问题。',
  ];
  const stateArr = [{ name: '已解决', value: 'yijie' }, { name: '未解决', value: 'weijie' }, { name: '忽略', value: 'hulue' }];
  const delEvent = () => {
    changeVisible(true);
  };
  const handleChane = (value) => { // 状态改变的时候
    changeState(value);
    const arr = { 'yijie': 1, 'weijie': 2, 'hulue': 3 };
    eventChange({ eventId, eventState: arr[value] });
  };

  const onConfirm = () => { // 只有在 待领取 事件派发 的页面缺陷事件才可以删除 
    // console.log('请求数据，去删除');
    delChange(diagWarningId);
  };

  const onCancel = () => {
    changeVisible(false);

  };

  const getWidth = (type) => {
    return type.current && type.current.offsetWidth;
  };
  const width = defectMessage.defectTypeCode && getWidth(allLine) - getWidth(defectType) - getWidth(deviceTypeName) - getWidth(defectLevel) - 150 || 130;

  return (
    <div className={styles.eventDetail}>
      <div className={styles.messageWrap}>
        <div className={styles.status}>
          {defectMessage.eventState &&
            <i className={`iconfont icon-${eventStatus[+defectMessage.eventState - 1]} ${styles[eventStatus[+defectMessage.eventState - 1]]}`} />}
          {del && <i className={`iconfont icon-wrong ${styles.close}`} onClick={delEvent} />}
        </div>
        <div className={styles.oneLine} ref={allLine}>
          <div className={styles.list} ref={defectType}>
            <span className={styles.recordName}>缺陷类型:</span>
            <span className={styles.recordText}>{defectMessage.defectTypeCode === 1 && '设备缺陷' || '其他缺陷'}</span>
          </div>
          {defectMessage.deviceTypeName &&
            <div className={styles.list} ref={deviceTypeName}>
              <span className={styles.recordName}>设备类型:</span>
              <span className={styles.recordText}>{defectMessage.deviceTypeName}</span>
            </div>
          }
          {defectMessage.deviceName &&
            <div className={`${styles.list} `} ref={deviceName}>
              <span className={styles.recordName}>设备名称:</span>
              <span className={`${styles.recordText} ${styles.deviceName}`} style={{ maxWidth: width }}>{defectMessage.deviceName}</span>
            </div>}
          {defectMessage.defectLevel &&
            <div className={styles.list} ref={defectLevel}>
              <span className={styles.recordName}>缺陷级别:</span>
              <span className={styles.recordText}>
                {levelStatus[defectMessage.defectLevel - 1]}
                <Tooltip placement="top" title={`${defectLevelMes[defectMessage.defectLevel - 1]}`}>
                  <i className={`iconfont icon-help ${styles.iconHelp}`} />
                </Tooltip>
              </span>
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
              <CneButton className={styles.handleButton}> <i className={'iconfont icon-look'} />
                <Link to={`/monitor/diagnoseCenter?diagWarningId=${diagWarningId}&deviceFullcode=${deviceFullcode}`}> 查看分析 </Link>
              </CneButton>
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
