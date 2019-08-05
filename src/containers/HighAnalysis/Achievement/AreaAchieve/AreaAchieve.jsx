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
    testArea: PropTypes.func,
    location: PropTypes.object,
  };

  componentDidMount(){
    console.log('did mount');
    console.log(this.props.location);
    console.log('did mount');
    this.props.testArea();
  }

  componentWillReceiveProps(nextProps){
    console.log('did componentWillReceiveProps');
    console.log(nextProps.location);
    console.log(this.props.location);
    console.log('did componentWillReceiveProps');
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
            <AreaChart />
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
  testArea: () => dispatch({type: areaAchieveAction.testArea}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaAchieve);

