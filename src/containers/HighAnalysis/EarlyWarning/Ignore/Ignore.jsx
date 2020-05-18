import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './reIgnore.scss';
import { ignoreAction } from './ignoreAction';
import Footer from '../../../../components/Common/Footer';
import Ingore from '../../../../components/HighAnalysis/EarlyWarning/Ignore/Ignore';

class Ignore extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);

  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  render() {
    return (
      <div className={styles.ignoreBox} >
        <Ingore {...this.props} />
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.highAanlysisReducer.ignore.toJS(),
    stations: state.common.get('stations').toJS(),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeIgnoreStore: payload => dispatch({ type: ignoreAction.changeIgnoreStoreSaga, payload }),
  getMatrixlist: payload => dispatch({ type: ignoreAction.getMatrixlist, payload }),
  getIgnoreList: payload => dispatch({ type: ignoreAction.getIgnoreList, payload }),
  getUnignore: payload => dispatch({ type: ignoreAction.getUnignore, payload }),
  resetStore: () => dispatch({ type: ignoreAction.resetStore }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Ignore);
