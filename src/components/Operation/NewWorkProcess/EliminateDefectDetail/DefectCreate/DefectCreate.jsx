import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefcetEventTitle from '../DefectEvent/DefcetEventTitle';
import DefectEvent from '../DefectEvent/DefectEvent';
import HandleInfo from '../HandleInfo/HandleInfo';
import { localStateName } from '../../Common/processIconCode';


class DefectCreate extends Component {
  static propTypes = {
    actionCode: PropTypes.string,
    isFinish: PropTypes.string,
    addEventInfo: PropTypes.array,
    handleInfos: PropTypes.array,
    addhandleList: PropTypes.array,
    changeStore: PropTypes.func,
    getBaseUsername: PropTypes.func,
    getDeviceType: PropTypes.func,
    baseInfo: PropTypes.object,
    stateName: PropTypes.string,
    eventInfos: PropTypes.array,

  };

  componentDidMount() {
    const { eventInfos, addEventInfo, stateName, addhandleList, handleInfos, baseInfo } = this.props;
    this.retrunDataSet({ addEventInfo, eventInfos, stateName, addhandleList, handleInfos, baseInfo });
  }

  componentWillReceiveProps(nextProps) {
    const { eventInfos, stateName, handleInfos, baseInfo, isFinish, addEventInfo } = nextProps;
    this.retrunDataSet({
      addEventInfo: this.props.addEventInfo,
      addhandleList: this.props.addhandleList,
      eventInfos, stateName,
      handleInfos, baseInfo,
    });
    // 默认创建的时候会添加一条缺陷事件
    if (!this.props.isFinish && (isFinish === '0' || isFinish === '1' && addEventInfo.length === 0)) {
      // 默认添加一个缺陷事件
      const eventInfos = {
        index: 1,
        eventId: null, // 缺陷ID，新建为空
        diagWarningId: null, // 告警ID
        defectTypeCode: 1, // 缺陷类型
        deviceTypeCode: null, // 设备类型
        deviceTypeName: '', // 设备类型名称
        deviceFullcode: null, // 设备全编码
        deviceName: '', // 设备名称
        defectLevel: 1, // 缺陷级别
        eventDesc: '', // 缺陷描述
        eventName: '', // 缺陷名称  设备缺陷还是其他缺陷
        source: 1, // 缺陷来源 0 告警 1 手动 2 巡检 3 预警
        eventImgs: [], //
      };
      addEventInfo.unshift(eventInfos);
      this.props.changeStore({ addEventInfo });
    }
  }

  dealImg = (imgs) => { // 处理图片
    if (imgs && imgs.length > 0) {
      return imgs.map(e => { return { imgId: '', url: e.url, updateSign: 1 }; });
    }
    return [];
  }

  retrunDataSet = ({ addEventInfo, eventInfos, stateName, addhandleList, handleInfos, baseInfo }) => {
    const { stationCode } = baseInfo;
    if (addEventInfo.length === 0 && eventInfos.length > 0 && localStateName(stateName) === 'return') {
      const list = eventInfos.map((e, index) => {
        return { index: eventInfos.length - index, ...e, eventImgs: this.dealImg(e.eventImgs) };
      });
      this.props.changeStore({ addEventInfo: list, addbaseInfo: baseInfo });
      this.props.getBaseUsername({ stationCode }); // 当前电站有权限的人
      this.props.getDeviceType({ stationCode }); // 获取当前电站下的设备类型
    }
    if (addhandleList.length === 0 && handleInfos.length > 0 && localStateName(stateName) === 'return') {
      const handlList = handleInfos.map((e, index) => { return { index: handleInfos.length - index, ...e, handleImgs: this.dealImg(e.handleImgs) }; });
      this.props.changeStore({ addhandleList: handlList, handleInfos: [] });
    }
  }

  render() {
    const { isFinish, baseInfo, stateName } = this.props;
    // editStation 电站是否编辑 退回不可以编辑 只有在创建的时候可以编辑
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo {...this.props} editStation={!stateName} />
        <DefcetEventTitle {...this.props} />
        <DefectEvent {...this.props} edit={true} />
        <HandleInfo {...this.props} editDisplay={isFinish === '1'} addMultipleEvent={false} />
      </React.Fragment>
    );
  }
}



export default DefectCreate;
