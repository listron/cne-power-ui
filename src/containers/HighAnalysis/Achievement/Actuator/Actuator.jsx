import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actuatorAction } from './actuatorReducer';
import ActuatorSearch from '../../../../components/HighAnalysis/Achievement/Actuator/ActuatorSearch/ActuatorSearch';
import LooseBarChart from '../../../../components/HighAnalysis/Achievement/Actuator/LooseBarChart/LooseBarChart';
import LooseLineChart from '../../../../components/HighAnalysis/Achievement/Actuator/LooseLineChart/LooseLineChart';
import YawBarChart from '../../../../components/HighAnalysis/Achievement/Actuator/YawBarChart/YawBarChart';
import YawLineChart from '../../../../components/HighAnalysis/Achievement/Actuator/YawLineChart/YawLineChart';
import searchUtil from '../../../../utils/searchUtil';

import styles from './actuator.scss';

class Actuator extends Component {

  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    getYawRank: PropTypes.func,
    getReleaseRank: PropTypes.func,
    getYawRend: PropTypes.func,
    getReleaseRend: PropTypes.func,
    yawType: PropTypes.string,
    releaseType: PropTypes.string,
  };

  componentDidMount() {
    const {
      location: {
        search,
      },
    } = this.props;
    const actuatorInfoStr = searchUtil(search).getValue('actuator');
    if(actuatorInfoStr) {
      const actuatorInfo = actuatorInfoStr ? JSON.parse(actuatorInfoStr) : {};
      this.queryParamsFunc(actuatorInfo);
    }
  }

  componentWillReceiveProps (nextProps) {
    const nextSearch = nextProps.location.search;
    const { search } = this.props.location;
    const actuatorNextInfoStr = searchUtil(nextSearch).getValue('actuator');
    const actuatorInfoStr = searchUtil(search).getValue('actuator');
    // 发生变化
    if (actuatorNextInfoStr && actuatorNextInfoStr !== actuatorInfoStr) {
      const actuator = actuatorNextInfoStr ? JSON.parse(actuatorNextInfoStr) : {};
      this.queryParamsFunc(actuator);
    }
  }

  queryParamsFunc = (actuatorInfo) => {
    const {
      getYawRank,
      getReleaseRank,
      getYawRend,
      getReleaseRend,
      releaseType,
      yawType,
    } = this.props;
    const {
      searchCode,
      searchDates,
      searchDevice,
    } = actuatorInfo;
    // 请求参数
    const params = {
      stationCode: searchCode,
      deviceFullCodes: searchDevice,
      startTime: searchDates[0],
      endTime: searchDates[1],
    };
    getYawRank(params);
    getReleaseRank(params);
    getYawRend({...params, type: yawType});
    getReleaseRend({...params, type: releaseType});
  };

  render() {
    return (
      <div className={styles.actuatorBox}>
        <ActuatorSearch {...this.props} />
        <div className={styles.actuatorCenter}>
          <div className={styles.actuatorTop}>
            <YawBarChart queryParamsFunc={this.queryParamsFunc} {...this.props} />
            <LooseBarChart queryParamsFunc={this.queryParamsFunc} {...this.props} />
          </div>
          <div className={styles.actuatorBottom}>
            <YawLineChart {...this.props} />
            <LooseLineChart {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.actuator.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  getDevices: payload => dispatch({ type: actuatorAction.getDevices, payload }),
  changeStore: payload => dispatch({ type: actuatorAction.changeStore, payload }),
  getYawRank: payload => dispatch({ type: actuatorAction.getYawRank, payload }),
  getReleaseRank: payload => dispatch({ type: actuatorAction.getReleaseRank, payload }),
  getYawRend: payload => dispatch({ type: actuatorAction.getYawRend, payload }),
  getReleaseRend: payload => dispatch({ type: actuatorAction.getReleaseRend, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Actuator);

