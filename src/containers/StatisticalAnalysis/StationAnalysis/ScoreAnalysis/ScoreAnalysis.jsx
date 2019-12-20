import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './ScoreAnalysis.scss';
import { scoreAnalysisAction } from './scoreAnalysisAction';
import PvScoreAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/ScoreAnalysis/PvScoreAnalysis';
import Footer from '../../../../components/Common/Footer';


class ScoreAnalysis extends Component {
  static propTypes = {
    stationTypeCount: PropTypes.string,
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'pv', //默认显示光伏
    };
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  onTabChange = (e) => {
  }

  queryTargetData = (activeKey) => { //切换电站
    this.props.changeScoreStore({ stationType: activeKey });
  }

  render() {
    const { stationTypeCount, theme, stationType } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={`${styles.stationScore} ${styles[theme]}`}>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreContent}>
            {stationTypeCount === 'multiple' &&
              <div className={styles.allStationTitle}>
                {/* <p className={`${stationType === '0' && styles.activeStation} `} onClick={() => { this.queryTargetData('0'); }}>风电</p> */}
                <p className={`${stationType === '1' && styles.activeStation} `} onClick={() => { this.queryTargetData('1'); }}>光伏</p>
              </div>
            }
            {stationTypeCount === 'multiple' && stationType === '1' && <PvScoreAnalysis {...this.props} />}
            {stationTypeCount === 'multiple' && stationType === '0' && <div>风电</div>}
            {stationTypeCount === 'pv' && <PvScoreAnalysis {...this.props} />}
            {stationTypeCount === 'wind' && <div>风电</div>}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.statisticalAnalysisReducer.scoreAnalysis.toJS(),
    stations: state.common.get('stations').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
    theme: state.common.get('theme'),
  });
};


const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: scoreAnalysisAction.resetStore }),
  changeScoreStore: payload => dispatch({ type: scoreAnalysisAction.changeScoreStore, payload }),
  singleStaionScore: payload => dispatch({ type: scoreAnalysisAction.singleStaionScore, payload }),
  getScoreList: payload => dispatch({ type: scoreAnalysisAction.getScoreList, payload }),
  getPvStationType: payload => dispatch({ type: scoreAnalysisAction.getPvStationType, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScoreAnalysis);
