
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./operateAnalysis.scss";
import { operateAnalysisAction } from './operateAnalysisAction';
import PropTypes from "prop-types";
import OperateAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis';
// import { getCookie } from '../../../../utils/index.js';
import Cookie from 'js-cookie';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class OperateAnalysisContainer extends Component {
  static propTypes = {
    resetStore:PropTypes.func,
    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }


  componentWillUnmount() {
    this.props.resetStore()
  }

  render() {
    const breadCrumbData = {
      breadData: [
        {
          name: '运行分析',
        }
      ],
    };

    return (
      <div className={styles.operateAnalysisBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.operateAnalysis}>
          <OperateAnalysis {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.operateAnalysisReducer.toJS(),
    stations: state.common.get('stations'),
    userId: Cookie.get('userId'),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeOperateStationStore: payload => dispatch({ type: operateAnalysisAction.CHANGE_OPERATESTATIONDATA_STORE_SAGA, payload }),
  getOperatePlanComplete: payload => dispatch({ type: operateAnalysisAction.getOperatePlanComplete, payload }),
  getComponentPowerStatistic: payload => dispatch({ type: operateAnalysisAction.getComponentPowerStatistic, payload }),
  getUsageRate: payload => dispatch({ type: operateAnalysisAction.getUsageRate, payload }),
  getLostPowerType: payload => dispatch({ type: operateAnalysisAction.getLostPowerType, payload }),
  getLimitPowerRate: payload => dispatch({ type: operateAnalysisAction.getLimitPowerRate, payload }),
  getYearLimitPowerRate: payload => dispatch({ type: operateAnalysisAction.getYearLimitPowerRate, payload }),
  getPlantPower: payload => dispatch({ type: operateAnalysisAction.getPlantPower, payload }),
  getPowerEfficiency: payload => dispatch({ type: operateAnalysisAction.getPowerEfficiency, payload }),
  getlostPower: payload => dispatch({ type: operateAnalysisAction.getlostPower, payload }),
  getAllStationAvalibaData: payload => dispatch({ type: operateAnalysisAction.getAllStationAvalibaData, payload }),
  resetStore: payload => dispatch({ type: operateAnalysisAction.resetStore, payload }),

})


export default connect(mapStateToProps, mapDispatchToProps)(OperateAnalysisContainer);









