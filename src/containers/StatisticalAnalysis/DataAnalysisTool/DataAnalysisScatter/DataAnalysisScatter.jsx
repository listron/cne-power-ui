
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { dataAnalysisScatterAction } from './dataAnalysisScatterAction';
import styles from './dataAnalysisScatter.scss';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import DataAnalysisAllStation from '../../../../components/StatisticalAnalysis/DataAnalysisTool/DataAnalysisScatter/DataAnalysisAllStation';

class DataAnalysisScatter extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    //请求所有电站
  }
  render() {
    const breadCrumbData = { breadData: [{ name: '散点图' }] };
    const { showPage } = this.props;
    return (
      <div className={styles.dataAnalysisScatter} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.scatterMain}>
          {showPage === 'allStation' && <DataAnalysisAllStation {...this.props} />}
          {showPage === 'singleStation' && <DataAnalysisAllStation {...this.props} />}
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.dataAnalysisScatterReducer.toJS(),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeToolStore: payload => dispatch({ type: dataAnalysisScatterAction.changeToolStore, payload }),
  resetStore: payload => dispatch({ type: dataAnalysisScatterAction.resetStore, payload }),


})
export default connect(mapStateToProps, mapDispatchToProps)(DataAnalysisScatter)