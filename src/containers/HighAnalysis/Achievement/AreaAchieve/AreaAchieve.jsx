import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { areaAchieveAction } from './areaAchieveReducer';
import AreaSearch from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaSearch/AreaSearch';
import AreaChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaChart/AreaChart';
import StationPBAChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/StationPBAChart/StationPBAChart';
import AreaTrendChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaTrendChart/AreaTrendChart';
import AreaLossChart from '../../../../components/HighAnalysis/Achievement/AreaAchieve/AreaLossChart/AreaLossChart';

import styles from './areaAchieve.scss';

class AreaAchieve extends Component {

  static propTypes = {
    getStationCapacity: PropTypes.func,
    getQuotaInfo: PropTypes.func,
    getModesInfo: PropTypes.func,
    location: PropTypes.object,
  };

  componentDidMount(){
    // console.log('did mount');
    // console.log(this.props.location);
    // console.log('did mount');
    const params = {
      stationCodes: [82],
      regionName: ['河南'],
    };
    const a = {
      'deviceModes': [55],
      'regionName': ['山东'],
      'startTime': '2018-07-01 01:01:01',
      'endTime': '2019-07-31 01:01:01',
      'stationCodes': null,
      'manufactorIds': null,
    };
    this.props.getModesInfo(params);
    this.props.getStationCapacity(a);
  }

  componentWillReceiveProps(nextProps){
    // console.log('did componentWillReceiveProps');
    // console.log(nextProps.location);
    // console.log(this.props.location);
    // console.log('did componentWillReceiveProps');
  }

  render() {
    return (
      <div className={styles.areaAchieveBox}>
        <AreaSearch {...this.props} />
        <div className={styles.areaTitle}>
          湖南：PBA 89%
        </div>
        <div className={styles.areaChartBox}>
          <div className={styles.areaTopChart}>
            <AreaChart {...this.props} />
            <StationPBAChart />
          </div>
          <div className={styles.areaBottomChart}>
            <AreaTrendChart />
            <AreaLossChart />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveArea.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getStationCapacity: () => dispatch({type: areaAchieveAction.getStationCapacity}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

