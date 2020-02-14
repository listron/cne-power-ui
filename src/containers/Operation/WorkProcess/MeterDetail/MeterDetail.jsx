import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { meterDetailAction } from './meterDetailReducer';
import MeterTop from '@components/Operation/WorkProcess/MeterDetail/MeterTop/MeterTop.jsx';
import MeterBaseInfo from '@components/Operation/WorkProcess/MeterDetail/MeterBaseInfo/MeterBaseInfo.jsx';
import MeterProcess from '@components/Operation/WorkProcess/MeterDetail/MeterProcess/MeterProcess.jsx';
import MeterDisposeInfo from '@components/Operation/WorkProcess/MeterDetail/MeterDisposeInfo/MeterDisposeInfo.jsx';
import styles from './meterDetail.scss';

class MeterDetail extends Component {

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
      <div className={`${styles.meterDetailBox} ${theme}`}>
        <MeterTop {...this.props} />
        <div className={styles.meterContent}>
          <div className={styles.contentLeft}>
            <MeterBaseInfo {...this.props} />
            <MeterDisposeInfo {...this.props} />
          </div>
          <div className={styles.contentRight}>
            <MeterProcess {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.operation.meterDetail.toJS(),
  stations: state.common.get('stations').toJS(),
  deviceTypes: state.common.get('deviceTypes').toJS(),
  theme: state.common.get('theme'),
});

const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: meterDetailAction.resetStore }),
  changeStore: payload => dispatch({ type: meterDetailAction.changeStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeterDetail);
