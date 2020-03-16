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
  };

  componentWillReceiveProps(nextProps) {
    const { eventInfos, addEventInfo, stateName } = nextProps;
    if (this.props.addEventInfo.length === 0 && localStateName(stateName) === 'return') {
      const list = eventInfos.map((e, index) => { return { index: index + 1, ...e }; });
      this.props.changeStore({ addEventInfo: list });
    }
  }

  render() {
    const { baseInfo, stateName } = this.props;
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo baseInfo={baseInfo} {...this.props} />
        {stateName &&
          <React.Fragment>
            <DefcetEventTitle {...this.props} />
            <DefectEvent {...this.props} />
            <HandleInfo
              {...this.props}
              editDisplay={localStateName(stateName) === 'execute'}
              addMultipleEvent={localStateName(stateName) === 'execute'}
            />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
}



export default DefectContent;
