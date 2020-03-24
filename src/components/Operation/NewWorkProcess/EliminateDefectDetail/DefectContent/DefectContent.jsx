import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefcetEventTitle from '../DefectEvent/DefcetEventTitle';
import DefectEvent from '../DefectEvent/DefectEvent';
import HandleInfo from '../HandleInfo/HandleInfo';
import { localStateName } from '../../Common/processIconCode';


class DefectContent extends Component {
  static propTypes = {
    actionCode: PropTypes.string,
    eventInfos: PropTypes.array,
    eventStatus: PropTypes.array,
    changeStore: PropTypes.func,
    warnEventInfos: PropTypes.array,
    baseInfo: PropTypes.object,
    addEventInfo: PropTypes.array,
    stateName: PropTypes.string,
    handleInfos: PropTypes.array,
    addhandleList: PropTypes.array,
  };

  componentWillReceiveProps(nextProps) {
    const { eventInfos, addEventInfo, stateName, stationCode } = nextProps;
    if (!this.props.stationCode && stationCode) {
      this.props.getBaseUsername({ stationCode }); // 当前电站有权限的人
      this.props.getDeviceType({ stationCode }); // 获取当前电站下的设备类型
    }
  }

  exchangeActioncode = (allActions, code) => {
    const cur = allActions.filter(e => e.actionCode === code);
    return cur.length > 0 && !cur[0].isPermission || false;
  }

  render() {
    const { baseInfo, stateName, handleInfos, addhandleList, allowedActions } = this.props;
    console.log('allowedActions', this.props);
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo {...this.props} editStation={false} />
        {stateName &&
          <React.Fragment>
            <DefcetEventTitle {...this.props} />
            <DefectEvent {...this.props} />
            {/* 在执行的时候 需要默认显示一条 可以添加多条 */}
            {localStateName(stateName) === 'execute' &&
              <HandleInfo
                {...this.props}
                editDisplay={localStateName(stateName) === 'execute' && this.exchangeActioncode(allowedActions, '23')}
                addMultipleEvent={localStateName(stateName) === 'execute' && this.exchangeActioncode(allowedActions, '15')}
                singleSave={true}
              />}
            {/* 在其他时候如过不存在处理信息，则不显示 */}
            {localStateName(stateName) !== 'execute' && handleInfos.length + addhandleList.length > 0 &&
              <HandleInfo
                {...this.props}
                editDisplay={false}
                addMultipleEvent={false}
              />
            }
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}



export default DefectContent;
