import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { commonAction } from '../../../alphaRedux/commonAction';
import styles from './performanceAnalysis.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import PerformanceAnalysisFilter from '../../../../components/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysisFilter';
import PerformanceAnalysisTabs from '../../../../components/StatisticalAnalysis/EquipmentAnalysis/PerformanceAnalysis/PerformanceAnalysisTabs';
import Footer from '../../../../components/Common/Footer';
import { performanceAnalysisAction } from "./performanceAnalysisAction";
import Cookie from 'js-cookie';

class PerformanceAnalysis extends Component {
  static propTypes = {
    changePerformanceAnalysisStore: PropTypes.func,
    targetTabs: PropTypes.string,
    getPerformanceContrast: PropTypes.func,
    getFaultContrast: PropTypes.func,
    getPerformance: PropTypes.func,
    getFault: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }
  componentWillUnmount() {
    this.props.resetStore();
  }

  queryData = (activeKey) => {
    const { contrastSwitch, stationCode, deviceTypeCode, endDate, startDate } = this.props;
    this.props.changePerformanceAnalysisStore({ targetTabs: activeKey })
    const prams = {
      stationCode,
      startDate,
      endDate,
      deviceTypeCode
    }
    if (contrastSwitch) {
      if (activeKey === '1') {
        this.props.getPerformanceContrast({ ...prams })
      } else {
        this.props.getFaultContrast({ ...prams })
      }
    } else {
      if (activeKey === '1') {
        this.props.getPerformance({ ...prams })
      } else {
        this.props.getFault({ ...prams })
      }
    }
  }
  render() {
    return (
      <div className={styles.PerformanceAnalysisContainerBox}>
        <CommonBreadcrumb breadData={[{ name: '性能分析' }]} style={{ marginLeft: '38px' }}></CommonBreadcrumb>
        <div className={styles.PerformanceAnalysisContainer}>
          <div className={styles.PerformanceAnalysisMain}>
            <PerformanceAnalysisFilter {...this.props} />
            <PerformanceAnalysisTabs {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.statisticalAnalysisReducer.performanceAnalysisReducer.toJS(),
  stations: state.common.get('stations').toJS(),
  stationDeviceTypes: state.common.get('stationDeviceTypes').toJS(),

})

const mapDispatchToProps = (dispatch) => ({
  changePerformanceAnalysisStore: payload => dispatch({ type: performanceAnalysisAction.CHANGE_PERFORMANCEANALYSIS_STORE, payload }),
  getDeviceModels: payload => dispatch({ type: performanceAnalysisAction.getDeviceModels, payload }),
  getEquipmentSelection: payload => dispatch({ type: performanceAnalysisAction.getEquipmentSelection, payload }),
  getEleLineCode: payload => dispatch({ type: performanceAnalysisAction.getEleLineCode, payload }),
  getPerformance: payload => dispatch({ type: performanceAnalysisAction.getPerformance, payload }),
  getFault: payload => dispatch({ type: performanceAnalysisAction.getFault, payload }),
  getPerformanceContrast: payload => dispatch({ type: performanceAnalysisAction.getPerformanceContrast, payload }),
  getFaultContrast: payload => dispatch({ type: performanceAnalysisAction.getFaultContrast, payload }),
  getStationDeviceType: payload => dispatch({ type: commonAction.getStationDeviceType, payload }),
  resetStore: () => dispatch({ type: performanceAnalysisAction.resetStore }),
  getEleDeviceData: payload => dispatch({ type: performanceAnalysisAction.getEleDeviceData, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceAnalysis);
