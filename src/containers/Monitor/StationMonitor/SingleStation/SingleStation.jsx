import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/singleStationAction';
import { SingleStationMonitor } from '../../../../components/Monitor/StationMonitor/SingleStation/SingleStationMonitor';
class SingleStation extends Component {
  static propTypes = {
    
  };
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount() {
    
  }

  render() {

    return (
      <div className={styles.singleStationContainer}>
        <SingleStationMonitor {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.SingleStationMonitor.toJS(),
})

const mapDispatchToProps = (dispatch) => ({
  getSingleMonitorStation: payload => dispatch({type:singleStationAction.GET_SINGLE_MONITORSTATION_SAGA, payload}),


});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
