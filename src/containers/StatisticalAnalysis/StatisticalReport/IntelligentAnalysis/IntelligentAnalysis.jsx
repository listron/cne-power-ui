import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import { commonAction } from '../../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer/index';
import { intelligentAnalysisAction } from './intelligentAnalysisAction';
import SingleStationAnalysis from '../../../../components/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/SingleStationAnalysis';
import AreaStation from '../../../../components/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/AreaStation';
import AreaAnalysis from '../../../../components/StatisticalAnalysis/StatisticalReport/IntelligentAnalysis/AreaAnalysis';

class IntelligentAnalysis extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    changeIntelligentAnalysisStore: PropTypes.func,
    yearTime: PropTypes.string,
    monthTime: PropTypes.string,
    tabsType: PropTypes.string,
    theme: PropTypes.string,
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  testfunc = (e) => {
    const tabsValue = e.target.value;
    const { changeIntelligentAnalysisStore } = this.props;
    changeIntelligentAnalysisStore({
      tabsType: tabsValue,
      reportShow: false,
      singleStationInfo: {},
      areaStationInfo: {},
      areaInfo: {},
    });
  }

  render() {
    const { tabsType, theme } = this.props;
    return (
      <div className={`${styles.intelligentAnalysis} ${styles[theme]}`}>
        <CommonBreadcrumb breadData={[{ name: '智能分析报告' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.intelligentAnalysisContent}>
            <Radio.Group value={tabsType} buttonStyle="solid"
              onChange={this.testfunc}
              className={styles.intelligentChoice}>
              <Radio.Button value="singleStation">单电站分析</Radio.Button>
              <Radio.Button value="sameRegional">同区域电站对比</Radio.Button>
              <Radio.Button value="regionalComparative">区域对比分析</Radio.Button>
            </Radio.Group>
            {tabsType === 'singleStation' && <SingleStationAnalysis {...this.props} />}
            {tabsType === 'sameRegional' && <AreaStation {...this.props} />}
            {tabsType === 'regionalComparative' && <AreaAnalysis {...this.props} />}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.statisticalAnalysisReducer.intelligentAnalysisReducer.toJS(),
    stations: state.common.get('stations').toJS().filter(e => e.stationType === 1),
    theme: state.common.get('theme'),
  };
};
const mapDispatchToProps = (dispatch) => ({
  changeIntelligentAnalysisStore: payload => dispatch({ type: intelligentAnalysisAction.changeIntelligentAnalysisStore, payload }),
  resetStore: payload => dispatch({ type: intelligentAnalysisAction.resetStore, payload }),
  getSingleStationAnalysis: payload => dispatch({ type: intelligentAnalysisAction.getSingleStationAnalysis, payload }),
  getAreaStation: payload => dispatch({ type: intelligentAnalysisAction.getAreaStation, payload }),
  getArea: payload => dispatch({ type: intelligentAnalysisAction.getArea, payload }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile, payload: {
      ...payload,
      actionName: intelligentAnalysisAction.changeIntelligentAnalysisStore,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentAnalysis);
