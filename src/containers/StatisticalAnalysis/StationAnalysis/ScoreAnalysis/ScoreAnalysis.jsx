import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Tabs, } from 'antd';
import styles from "./scoreAnalysis.scss";
import { scoreAnalysisAction } from "./scoreAnalysisAction";
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import PvScoreAnalysis from '../../../../components/StatisticalAnalysis/StationAnalysis/ScoreAnalysis/PvScoreAnalysis';
import Footer from '../../../../components/Common/Footer';
const TabPane = Tabs.TabPane;


class ScoreAnalysis extends Component {
  static propTypes = {
    stationTypeCount: PropTypes.string,
    resetStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'pv',//默认显示光伏
    }
  }

  render() {
    const { stationTypeCount } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.stationScore}>
        <CommonBreadcrumb breadData={[{ name: '电站评分', }]} style={{ paddingLeft: '38px', background: '#fff' }} />
        <div className={styles.scoreContainer}>
          <div className={styles.scoreContent}>
            {stationTypeCount === 'multiple' &&
              <Tabs type="card" onChange={this.onTabChange} activeKey={activeKey}>
                <TabPane tab="风电" key="wind" disabled><div>风电</div> </TabPane>
                <TabPane tab="光伏" key="pv"> <PvScoreAnalysis {...this.props} /> </TabPane>
              </Tabs>
            }
            {stationTypeCount === 'pv' && <div> <PvScoreAnalysis {...this.props} /></div>}
            {stationTypeCount === 'wind' && <div>风电</div>}
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.statisticalAnalysisReducer.scoreAnalysis.toJS(),
    stations: state.common.get('stations').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
  });
}


const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: scoreAnalysisAction.resetStore }),
  changeScoreStore: payload => dispatch({ type: scoreAnalysisAction.changeScoreStore, payload }),
  singleStaionScore: payload => dispatch({ type: scoreAnalysisAction.singleStaionScore, payload }),
  getScoreList: payload => dispatch({ type: scoreAnalysisAction.getScoreList, payload }),
  getPvStationType: payload => dispatch({ type: scoreAnalysisAction.getPvStationType, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScoreAnalysis)
