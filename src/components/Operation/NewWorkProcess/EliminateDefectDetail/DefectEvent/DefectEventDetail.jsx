import React from "react";
import { render } from "node-sass";
const { memo, useEffect, useCallback, useMemo, useState } = React;
import CneButton from '../../../../Common/Power/CneButton';

/** 
 * 
*/
function DefectEventDeatil() {
  const item = {
    eventId: 123,
    diagWarningId: 123,
    eventName: '测试1233',
    eventDesc: '描述描述描述么，太难了，怎么这么难啊，我想出去走走',
    deviceFullcode: '305M201M2345',
    deviceName: '逆变器名字名字名字名字名字名字名',
    defectTypeCode: 1,
    defectTypeName: '设备缺陷',
    deviceTypeCode: 201,
    deviceTypeName: '集中式逆变器',
    defectLevel: 2,
    eventState: 1,
    eventImgs: [],
  }
  //  eventState 1 yijie 2 weijie 3 hulue
  const eventStatus = ['yijie', 'weijie', 'hulue'];
  render(){
    <div className={styles.eventDetail}>
      <div>
        <i className={`iconfont icon-${eventStatus[+item.eventState + 1]}`} />
      </div>
      <div className={styles.deviceMessge}>
        <div>
          <b>缺陷类型</b><div>{item.defectTypeName}</div>
          <b>设备类型</b><div>{item.deviceTypeName}</div>
          <b>设备名称</b><div>{item.deviceName}</div>
          <b>缺陷级别</b><div>{item.defectLevel}</div>
        </div>
      </div>
      <div className={styles.description}>
        <div>
          <b>缺陷描述</b>
          <span>{item.eventDesc}</span>
        </div>
        <div>
          <CneButton> <i className={'iconfont icon-look'} /> 查看分析 </CneButton>
        </div>
      </div>
      <div></div>
    </div>
  }
}