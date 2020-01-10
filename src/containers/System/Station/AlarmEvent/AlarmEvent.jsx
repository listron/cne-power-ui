import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmEvent.scss';
import { alarmEventAction } from './alarmEventReducer';
import { commonAction } from '../../../alphaRedux/commonAction';
import VersionSelect from '../../../../components/System/Station/AlarmEvent/VersionSelect';
import VersionEvent from '../../../../components/System/Station/AlarmEvent/VersionEvent';

import Footer from '../../../../components/Common/Footer';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';


class AlarmEvent extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getDiagVersion: PropTypes.func,
    getAlarmEvent: PropTypes.func,
    deviceTypeCode: PropTypes.number,
  }
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.props.getDiagVersion({ deviceTypeCode: this.props.deviceTypeCode });
    this.props.getAlarmEvent({ eventType: 1, deviceTypeCode: this.props.deviceTypeCode });
  }

  componentWillUnmount() {
    this.props.resetStore();
  }


  render() {
    return (
      <div className={styles.alarmEventContiner}>
        <div className={styles.content}>
          <div className={styles.leftCont}>
            <VersionSelect {...this.props} />
          </div>
          <div className={styles.rightCont}>
            <VersionEvent {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return ({
    ...state.system.alarmEventReducer.toJS(),
    stations: state.common.get('stations').toJS(),
  });
};

const mapDispatchToProps = (dispatch) => ({
  resetStore: payload => dispatch({ type: alarmEventAction.resetStore, payload }),
  changeStore: payload => dispatch({ type: alarmEventAction.changeStore, payload }),
  getDiagVersion: payload => dispatch({ type: alarmEventAction.getDiagVersion, payload }),
  editVersion: payload => dispatch({ type: alarmEventAction.editVersion, payload }),
  updateVersion: payload => dispatch({ type: alarmEventAction.updateVersion, payload }),
  delVersion: payload => dispatch({ type: alarmEventAction.delVersion, payload }),
  getVersionEvent: payload => dispatch({ type: alarmEventAction.getVersionEvent, payload }),
  getEditVersionStation: payload => dispatch({ type: alarmEventAction.getEditVersionStation, payload }),
  addVersionEvent: payload => dispatch({ type: alarmEventAction.addVersionEvent, payload }),
  editVersionEvent: payload => dispatch({ type: alarmEventAction.editVersionEvent, payload }),
  delVersionEvent: payload => dispatch({ type: alarmEventAction.delVersionEvent, payload }),
  getAlarmEvent: payload => dispatch({ type: alarmEventAction.getAlarmEvent, payload }),
  getPointList: payload => dispatch({ type: alarmEventAction.getPointList, payload }),
  getVersionStation: payload => dispatch({ type: alarmEventAction.getVersionStation, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmEvent);
