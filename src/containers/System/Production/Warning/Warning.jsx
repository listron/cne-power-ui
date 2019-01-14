import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import Cookie from 'js-cookie';
import { warningAction } from "./warningAction";
import styles from "./warning.scss";
import PropTypes from 'prop-types';
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import SeriesMain from '../../../../components/System/Production/Warning/Series/SeriesMain.jsx';
import CleaningMain from '../../../../components/System/Production/Warning/Cleaning/CleaningMain.jsx';
import Footer from '../../../../components/Common/Footer';
const TabPane = Tabs.TabPane;

class Warning extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    getSeriesData: PropTypes.func,
    getCleaningData: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'warn',//默认显示低效组串
    }
  }
  onTabChange = (activeKey) => {
    const { enterpriseId } = this.props;
    this.setState({ activeKey })
    activeKey === 'series' && this.props.getSeriesData();
    activeKey === 'clean' && this.props.getCleaningData({ enterpriseId });
  }

  render() {
    const { enterpriseId } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.warningBox}>
        <CommonBreadcrumb breadData={[{ name: '预警配置' }]} style={{ paddingLeft: '38px',background:'#fff' }} />
        <div className={styles.warningContainer}>
          <div className={styles.warningContent}>
            <div className="card-container">
              <Tabs type="card" onChange={this.onTabChange} activeKey={activeKey}>
                <TabPane tab="低效组串" key="series">
                  <SeriesMain {...this.props} />
                </TabPane>

                <TabPane tab="清洗模型" key="clean">
                  <CleaningMain {...this.props} enterpriseId={enterpriseId} />
                </TabPane>

                <TabPane tab="预警配置" key="warn">
                  <CleaningMain {...this.props} enterpriseId={enterpriseId} />
                </TabPane>
              </Tabs>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return ({
    ...state.system.warning.toJS(),
    enterpriseId: Cookie.get('enterpriseId'),
    stations: state.common.get('stations').toJS(),
  });
}


const mapDispatchToProps = (dispatch) => ({
  resetStore: () => dispatch({ type: warningAction.resetStore }),
  getSeriesData: payload => dispatch({ type: warningAction.getSeriesData, payload }),
  getCleaningData: payload => dispatch({ type: warningAction.getCleaningData, payload }),
  addSeriesData: payload => dispatch({ type: warningAction.addSeriesData, payload }),
  addCleaningData: payload => dispatch({ type: warningAction.addCleaningData, payload }),
  changeWarnStore: payload => dispatch({ type: warningAction.changeWarnStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Warning)