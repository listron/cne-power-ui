
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './stationContrast.scss';
import { stationContrastAction } from './stationContrastAction';
import PropTypes from 'prop-types';
import StationContrast from '../../../../components/StatisticalAnalysis/StationAnalysis/StationContrast/StationContrast';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';

class StationContrastContainer extends Component {
  static propTypes = {
    stationCode: PropTypes.array,
    location: PropTypes.object,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.productionAnalysisBox} ${styles[theme]}`} >
        <CommonBreadcrumb breadData={[{ name: '电站对比' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.productionAnalysis}>
          <StationContrast {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.stationContrastReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  toChangeStationContrastStore: payload => dispatch({ type: stationContrastAction.toChangeStationContrastStore, payload }),
  getStationContrast: payload => dispatch({ type: stationContrastAction.getStationContrast, payload }),
  getStationContrastDetail: payload => dispatch({ type: stationContrastAction.getStationContrastDetail, payload }),
  resetStationContrastStore: payload => dispatch({ type: stationContrastAction.resetStationContrastStore, payload }),

});

export default connect(mapStateToProps, mapDispatchToProps)(StationContrastContainer);









