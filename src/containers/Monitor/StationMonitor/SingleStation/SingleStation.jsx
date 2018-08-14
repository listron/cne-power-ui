import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './singleStation.scss';
import { singleStationAction } from '../../../../constants/actionTypes/monitor/stationmonitor/singleStationAction';
import SingleStationMain from '../../../../components/Monitor/StationMonitor/SingleStation/SingleStationMain';
class SingleStation extends Component {
  static propTypes = {
    match: PropTypes.object,
    getSingleStation: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount() {
    const { stationCode } = this.props.match.params;
    this.props.getSingleStation({stationCode});
  }

  render() {
    console.log(this.props);
    return (
      <div className={styles.singleStationContainer} >
        <div>这是单电站监控页面！</div>
        <SingleStationMain {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.monitor.singleStation.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getSingleStation: payload => dispatch({type:singleStationAction.GET_SINGLE_STATION_SAGA, payload}),


});

export default connect(mapStateToProps, mapDispatchToProps)(SingleStation);
