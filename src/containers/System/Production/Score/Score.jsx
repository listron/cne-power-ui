import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import { scoreAction } from "./scoreAction";
import styles from "./score.scss";
import PropTypes from 'prop-types';
import Footer from '../../../../components/Common/Footer';
import ScoreMain from '../../../../components/System/Production/Score/Score';
const TabPane = Tabs.TabPane;

class Score extends Component {
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

  componentDidMount() {

  }


  onTabChange = () => { //tab 切换

  }

  render() {
    const { stationTypeCount } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.scoreBox}>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreContent}>
            {stationTypeCount === 'multiple' &&
              <Tabs type="card" onChange={this.onTabChange} activeKey={activeKey}>
                <TabPane tab="风电" key="wind" disabled><div>test</div> </TabPane>
                <TabPane tab="光伏" key="pv"> <ScoreMain {...this.props} /> </TabPane>
              </Tabs>
            }
            {stationTypeCount === 'pv' && <div> <ScoreMain {...this.props} /></div>}
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
    ...state.system.score.toJS(),
    stations: state.common.get('stations').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
  });
}


const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: scoreAction.resetStore }),
  changeIsVaild: () => dispatch({ type: scoreAction.changeIsVaild }),
  changeScoreStore: payload => dispatch({ type: scoreAction.changeScoreStore, payload }),
  getScoreConfig: payload => dispatch({ type: scoreAction.getScoreConfig, payload }),
  editScoreConfig: payload => dispatch({ type: scoreAction.editScoreConfig, payload }),
  getPvStionType: payload => dispatch({ type: scoreAction.getPvStionType, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Score)
