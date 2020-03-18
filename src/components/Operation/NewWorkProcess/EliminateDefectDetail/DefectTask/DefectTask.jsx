import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefcetEventTitle from '../DefectEvent/DefcetEventTitle';
import DefectEvent from '../DefectEvent/DefectEvent';
import { localStateName } from '../../Common/processIconCode';


class DefectTask extends Component {
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
    stationCode: PropTypes.number,
    stations: PropTypes.array,
  };



  render() {
    const { baseInfo } = this.props;
    return (
      <React.Fragment>
        <DefectBaseTitle baseInfo={baseInfo} />
        <DefectBaseInfo baseInfo={baseInfo} {...this.props} editStation={false} />
        <DefcetEventTitle {...this.props} />
        <DefectEvent {...this.props} />
      </React.Fragment>
    );
  }
}



export default DefectTask;
