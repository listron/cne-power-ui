import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectCreate.scss';
import DefectBaseTitle from '../DefectBase/DefectBaseTitle';
import DefectBaseInfo from '../DefectBase/DefectBaseInfo';
import DefcetEventTitle from '../DefectEvent/DefcetEventTitle';
import DefectEvent from '../DefectEvent/DefectEvent';
import HandleInfo from '../HandleInfo/HandleInfo';


class DefectCreate extends Component {
  static propTypes = {
    actionCode: PropTypes.string,
    isFinish: PropTypes.string,

  };

  componentWillReceiveProps(nextProps) {
    const { eventInfos, addEventInfo, stateName } = nextProps;
    if (this.props.addEventInfo.length === 0 && localStateName(stateName) === 'return') {
      const list = eventInfos.map((e, index) => { return { index: index + 1, ...e }; });
      this.props.changeStore({ addEventInfo: list });
    }
  }


  render() {
    const { isFinish } = this.props;
    return (
      <React.Fragment>
        <DefectBaseTitle />
        <DefectBaseInfo {...this.props} />
        <DefcetEventTitle {...this.props} />
        <DefectEvent {...this.props} edit={true} addMultipleEvent={false} />
        <HandleInfo {...this.props} editDisplay={isFinish === '1'} />
      </React.Fragment>
    );
  }
}



export default DefectCreate;
