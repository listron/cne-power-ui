import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import StationSearch from '../../../../components/HighAnalysis/Achievement/StationAchieve/StationSearch';
import AnimationBox from '../../../../components/HighAnalysis/Achievement/StationAchieve/AnimationBox';
import LostAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/LostAnalysis/LostAnalysis';
import { stationAchieveAction } from './stationAchieveReducer';
import styles from './station.scss';

class StationAchieve extends Component {

  static propTypes = {
    active: PropTypes.bool,
    changeStore: PropTypes.func,
  }

  render() {
    const { active, changeStore } = this.props;
    const modeDevices = [{
      value: 1001123142,
      label: '金风科技',
      children: [{
        value: 'M12011M221M13',
        label: 'SD-13',
        children: [{
          value: 'M12#1',
          label: 'M12#1',
        }],
      }, {
        value: 'M12011M221M11',
        label: 'SD-11',
      }],
    }, {
      value: 10011231445,
      label: '湘电',
      children: [{
        value: 'M35011M221M221',
        label: 'XD-221',
      }, {
        value: 'M35011M221M222',
        label: 'XD-222',
      }],
    }];
    return (
      <div className={styles.stationAchieve} >
        <StationSearch {...this.props} modeDevices={modeDevices} />
        <AnimationBox changeStore={changeStore} active={active}>
          <LostAnalysis {...this.props} active={active === 'lost'} />
          <div
            className={`${styles.eachPage} ${active === 'stop' ? styles.active : styles.inactive}`}
            style={{backgroundColor: 'yellowGreen'}}
          >停机数据</div>
          <div
            className={`${styles.eachPage} ${active === 'curve' ? styles.active : styles.inactive}`}
            style={{backgroundColor: 'gray'}}
          >功率曲线</div>
        </AnimationBox>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStation.toJS(),
  areaStation: state.highAanlysisReducer.achieveLayout.get('areaStation').toJS(),
  quotaInfo: state.highAanlysisReducer.achieveLayout.get('quotaInfo').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: stationAchieveAction.changeStore, payload }),
  getDevices: payload => dispatch({ type: stationAchieveAction.getDevices, payload }),
  getLostRank: payload => dispatch({ type: stationAchieveAction.getLostRank, payload }),
  getLostTrend: payload => dispatch({ type: stationAchieveAction.getLostTrend, payload }),
  getLostTypes: payload => dispatch({ type: stationAchieveAction.getLostTypes, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationAchieve);

