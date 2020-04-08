import React, { Component } from 'react';
const { useState, useRef } = React;
import CneButton from '../../../../Common/Power/CneButton';
import CneTips from '@components/Common/Power/CneTips';
import { Tooltip } from 'antd';
import styles from './defectEvent.scss';
import PicUploader from '../../Common/PicUploader';
import PropTypes from 'prop-types';




const DefectEventDetail = ({ defectMessage, delRight = false, allowedOpr = false, eventChange, delChange }) => {
  const [state, changeState] = useState();
  const [visible, changeVisible] = useState(false);
  const defectType = useRef();
  const deviceTypeName = useRef();
  const deviceName = useRef();
  const defectLevel = useRef();
  const allLine = useRef();

  const { eventId, diagWarningId, eventImgs = [], deviceFullcode, eventState, defectTypeCode } = defectMessage;
  const eventStatus = ['yijie', 'weijie', 'hulue1'];
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
          {eventState &&
            <i className={`iconfont icon-${eventStatus[+eventState - 1]} ${styles[eventStatus[+eventState - 1]]}`} />}
          {delRight && <i className={`iconfont icon-wrong ${styles.close}`} onClick={delEvent} />}
        </div>
        <div className={styles.oneLine} ref={allLine}>
          <div className={styles.list} ref={defectType}>
            <span className={styles.recordName}>缺陷类型:</span>
            <span className={styles.recordText}>{defectTypeCode === 1 && '设备缺陷' || '其他缺陷'}</span>
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
                {defectMessage.defectLevelName}
                <Tooltip placement="top" title={`${defectMessage.defectLevelDesc}`}>
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
                <a href={`#/monitor/diagnoseCenter?diagWarningId=${diagWarningId}&deviceFullcode=${deviceFullcode}`} className={styles.actionName} target="_blank">查看分析</a>
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

DefectEventDetail.propTypes = {
  defectMessage: PropTypes.object,
  delRight: PropTypes.bool,
  allowedOpr: PropTypes.bool,
  eventChange: PropTypes.func,
  delChange: PropTypes.func,
};


export default DefectEventDetail;
