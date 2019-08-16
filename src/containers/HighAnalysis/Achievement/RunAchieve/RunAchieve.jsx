import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import searchUtil from '../../../../utils/searchUtil';
import { runAchieveAction } from './runAchieveReducer';
import RunSearch from '../../../../components/HighAnalysis/Achievement/RunAchieve/RunSearch/RunSearch';
// import RunSequenceChart from '../../../../components/HighAnalysis/Achievement/RunAchieve/RunSequenceChart/RunSequenceChart';
// import RunScatterChart from '../../../../components/HighAnalysis/Achievement/RunAchieve/RunScatterChart/RunScatterChart';
import searchUtil from '../../../../utils/searchUtil';

import styles from './runAchieve.scss';

class RunAchieve extends Component {

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
  };

  componentDidMount() {
    const { search } = this.props.location;
    const groupInfoStr = searchUtil(search).getValue('run');
    console.log(groupInfoStr);
  }

  render() {
    return (
      <div className={styles.runAchieve}>
        <RunSearch {...this.props} />
        {/*<RunSequenceChart {...this.props} />*/}
        {/*<RunScatterChart {...this.props} />*/}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveRun.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getDevices: payload => dispatch({ type: runAchieveAction.getDevices, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RunAchieve);
