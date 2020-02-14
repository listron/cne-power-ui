import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { meterListAction } from './meterListReducer';
import MeterSearch from '@components/Operation/WorkProcess/Meter/MeterSearch';
import MeterTable from '@components/Operation/WorkProcess/Meter/MeterTable';
import styles from './meterList.scss';

class MeterList extends Component {

  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    resetStore: PropTypes.func,
  };

  componentDidMount() {
  }

  render() {
    const { theme = 'light' } = this.props;
    return (
      <div className={`${styles.meterBox} ${theme}`}>
        <MeterSearch {...this.props} />
        <MeterTable {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.meterList.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: meterListAction.resetStore }),
  changeStore: payload => dispatch({ type: meterListAction.changeStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeterList);
