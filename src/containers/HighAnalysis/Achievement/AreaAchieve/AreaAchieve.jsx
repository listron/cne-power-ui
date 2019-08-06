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
    getLostGenHour: PropTypes.func,
    getTrendInfo: PropTypes.func,
    getIndicatorRank: PropTypes.func,
    getIndicatorRankTotal: PropTypes.func,
    location: PropTypes.object,
    rankTotal: PropTypes.array,
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
      'deviceModes': null,
      'regionName': ['蒙东'],
      'startTime': '2018-07-01 01:01:01',
      'endTime': '2019-07-31 01:01:01',
      'stationCodes': [27, 28, 30, 16, 17, 18],
      'manufactorIds': null,
    };
    const b = {
      'indicatorCode': 101,
      'stationCodes': [],
      'startTime': '2014-04-01',
      'endTime': '2015-01-01',
      'manufactorIds': [
        '69',
      ],
      'deviceModes': [
        35,
      ],
    };
    const c = {
      'regionName': [
        '安徽',
      ],
      'indicatorCode': 101,
      'stationCodes': [
        73,
        74,
        76,
      ],
      'startTime': '2014-01-01 01:01:01',
      'endTime': '2019-07-31 01:01:01',
      'type': 2,
    };
    const d = {
      'indicatorCode': 101,
      'stationCodes': [
        73,
      ],
      'startTime': '2018-07-01 01:01:01',
      'endTime': '2019-07-31 01:01:01',
    };
    const e = {
      'deviceModes': null,
      'regionName': ['安徽'],
      'indicatorCode': '102',
      'startTime': '2018-07-01',
      'endTime': '2019-07-31',
      'stationCodes': null,
      'manufactorIds': null,
    };
    this.props.getModesInfo(params);
    this.props.getStationCapacity(a);
    this.props.getLostGenHour(b);
    this.props.getTrendInfo(c);
    this.props.getIndicatorRank(d);
    this.props.getIndicatorRankTotal(e);
  }

  componentWillReceiveProps(nextProps){
    // console.log('did componentWillReceiveProps');
    // console.log(nextProps.location);
    // console.log(this.props.location);
    // console.log('did componentWillReceiveProps');
  }

  render() {
    const { rankTotal } = this.props;
    return (
      <div className={styles.areaAchieveBox}>
        <AreaSearch {...this.props} />
        <div className={styles.areaTitle}>
          {1 === 2 ? (
            <span>{`${rankTotal[0].regionName}: PBA ${rankTotal[0].indicatorData.value}`}</span>
          ) : (
            <span>{`${rankTotal[0].regionName}: 实发小时数${rankTotal[0].indicatorData.actualGen} 应发小时数${rankTotal[0].indicatorData.theoryGen}`}</span>
          )}
        </div>
        <div className={styles.areaChartBox}>
          <div className={styles.areaTopChart}>
            <AreaChart {...this.props} />
            <StationPBAChart {...this.props} />
          </div>
          <div className={styles.areaBottomChart}>
            <AreaTrendChart {...this.props} />
            <AreaLossChart {...this.props} />
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
  getStationCapacity: (payload) => dispatch({type: areaAchieveAction.getStationCapacity, payload}),
  getLostGenHour: (payload) => dispatch({type: areaAchieveAction.getLostGenHour, payload}),
  getTrendInfo: (payload) => dispatch({type: areaAchieveAction.getTrendInfo, payload}),
  getIndicatorRank: (payload) => dispatch({type: areaAchieveAction.getIndicatorRank, payload}),
  getIndicatorRankTotal: (payload) => dispatch({type: areaAchieveAction.getIndicatorRankTotal, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

