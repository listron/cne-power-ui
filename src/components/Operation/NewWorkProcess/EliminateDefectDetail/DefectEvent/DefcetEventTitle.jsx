import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CneButton from '@components/Common/Power/CneButton';
import styles from './defectEvent.scss';

export default class DefectEvent extends Component {
  static propTypes = {
    allowedActions: PropTypes.array,
    addEventInfo: PropTypes.array,
    changeStore: PropTypes.array,
  };

  componentDidMount() {
    // const { addEventInfo } = this.props;
    // const eventInfos = {
    //   index: 1,
    //   eventId: null, // 缺陷ID，新建为空
    //   diagWarningId: null, // 告警ID
    //   defectTypeCode: null, // 缺陷类型
    //   deviceTypeCode: null, // 设备类型
    //   deviceTypeName: '', // 设备类型名称
    //   deviceFullcode: null, // 设备全编码
    //   deviceName: '', // 设备名称
    //   defectLevel: 1, // 缺陷级别
    //   eventDesc: '', // 缺陷描述
    //   eventName: '', // 缺陷名称  设备缺陷还是其他缺陷
    //   source: 1, // 缺陷来源 0 告警 1 手动 2 巡检 3 预警
    //   defectImgs: [], //
    // };
    // addEventInfo.unshift(eventInfos);
    // this.props.changeStore({ addEventInfo });
  }

  exchangeActioncode = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }

  addHandleInfo = () => {
    const { addEventInfo } = this.props;
    const index = addEventInfo.length > 0 && `${addEventInfo[0].index}` || 1; // 用于创建的删除使用
    const eventInfos = {
      index: +index + 1,
      eventId: null, // 缺陷ID，新建为空
      diagWarningId: null, // 告警ID
      defectTypeCode: null, // 缺陷类型
      deviceTypeCode: null, // 设备类型
      deviceTypeName: '', // 设备类型名称
      deviceFullcode: null, // 设备全编码
      deviceName: '', // 设备名称
      defectLevel: 1, // 缺陷级别
      eventDesc: '', // 缺陷描述
      eventName: '', // 缺陷名称  设备缺陷还是其他缺陷
      source: 1, // 缺陷来源 0 告警 1 手动 2 巡检 3 预警
      defectImgs: [], //
    };
    addEventInfo.unshift(eventInfos);
    this.props.changeStore({ addEventInfo });
  }

  render() {
    const { allowedActions } = this.props;
    const isAdd = this.exchangeActioncode(allowedActions, '14'); // 添加的权限是14
    return (
      <div className={styles.eventTitle}>
        <div><i className={'iconfont icon-quex'} /> <span>缺陷事件</span></div>
        {isAdd && <CneButton className={styles.addBtn} onClick={this.addHandleInfo}>
          <i className={`iconfont icon-newbuilt ${styles.addIcon}`} />
          <span className={styles.text}>添加缺陷</span>
        </CneButton>}
      </div>
    );
  }
}
