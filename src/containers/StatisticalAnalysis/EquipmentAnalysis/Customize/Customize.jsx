import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './customize.scss';
import PropTypes from 'prop-types';
import { customizeAction } from './customizeAction';
import CustomizeCont from '../../../../components/StatisticalAnalysis/EquipmentAnalysis/Customize/Customize';
import Footer from '../../../../components/Common/Footer';

class Customize extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    const { theme } = this.props;
    return (
      <div className={`${styles.customizeBox} ${styles[theme]}`}>
        <div className={styles.customizeContainer}>
          <CustomizeCont {...this.props} />
        </div>
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.statisticalAnalysisReducer.customize.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  });
};
const mapDispatchToProps = (dispatch) => ({
  changeCustomizeStore: payload => dispatch({ type: customizeAction.changeCustomizeStore, payload }),
  getDetailData: payload => dispatch({ type: customizeAction.getDetailData, payload }),
  getManufacturer: payload => dispatch({ type: customizeAction.getManufacturer, payload }),
  getDevicemode: payload => dispatch({ type: customizeAction.getDevicemode, payload }),
  resetStore: () => dispatch({ type: customizeAction.resetStore }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Customize)
;
