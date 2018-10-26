
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./operateAnalysis.scss";
import { operateAnalysisAction } from './operateAnalysisAction';
import PropTypes from "prop-types";
import OperateAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/OperateAnalysis/OperateAnalysis';
import { getCookie } from '../../../../utils/index.js';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';


class OperateAnalysisContainer extends Component {
  static propTypes = {
    // stationCode: PropTypes.array,

    location: PropTypes.object,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    // console.log('父组件',this.props);
  }

  componentWillReceiveProps(nextProps) {
  //  console.log('父组件',nextProps)

  }

  componentWillUnmount() {

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
    userId : getCookie('userId'),
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

})


export default connect(mapStateToProps, mapDispatchToProps)(OperateAnalysisContainer);









