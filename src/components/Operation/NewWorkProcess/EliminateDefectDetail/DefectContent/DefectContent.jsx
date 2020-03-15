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
    // changeStore: PropTypes.func,
    warnEventInfos: PropTypes.array,
    baseInfo: PropTypes.object,
  };

  render() {
    const { baseInfo, stateName } = this.props;
    const edit = localStateName(stateName) === 'receive';
    const editDisplay = localStateName(stateName) === 'receive';
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo baseInfo={baseInfo} {...this.props} />
        <DefcetEventTitle {...this.props} />
        <DefectEvent {...this.props} edit={!edit} />
        <HandleInfo {...this.props} editDisplay={!editDisplay} />
      </React.Fragment>
    );
  }
}



export default DefectContent;
