import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import PropTypes from "prop-types";
import styles from './intelligentAnalysis.scss';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';  
import Footer from '../../../../components/Common/Footer/index';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';
import SingleStationAnalysis from '../../../../components/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/SingleStationAnalysis';
import AreaStation from '../../../../components/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/AreaStation';
import AreaAnalysis from '../../../../components/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/AreaAnalysis';

const TabPane = Tabs.TabPane;

class IntelligentAnalysis extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.resetStore()
  }

  render() {
    return (
      <div className={styles.intelligentAnalysis}>
        <CommonBreadcrumb breadData={[{ name: '智能分析报告' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.intelligentAnalysisContent}>
          <Tabs type="card" defaultActiveKey="singleStation">
            <TabPane tab="单电站分析" key="singleStation">
            {<SingleStationAnalysis {...this.props} />}
            </TabPane>
            <TabPane tab="同区域电站对比" key="sameRegional">
              <AreaStation {...this.props} />
            </TabPane>
            <TabPane tab="区域对比分析" key="regionalComparative">
              <AreaAnalysis {...this.props} />
            </TabPane>
          </Tabs>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.intelligentAnalysisReducer.toJS(),
    stations: state.common.get('stations').toJS()
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeIntelligentAnalysisStore: payload => dispatch({type: intelligentAnalysisAction.changeIntelligentAnalysisStore, payload}),
  resetStore: payload => dispatch({type: intelligentAnalysisAction.resetStore, payload}),
  getSingleStationAnalysis: payload => dispatch({type: intelligentAnalysisAction.getSingleStationAnalysis, payload}),
  getAreaStation: payload => dispatch({type: intelligentAnalysisAction.getAreaStation, payload}),
  downLoadFile: payload => dispatch({ type: commonAction.downLoadFile, payload }),
})

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentAnalysis);









