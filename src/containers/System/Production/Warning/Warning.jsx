import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import Cookie from 'js-cookie';
import { warningAction } from "./warningAction";
import styles from "./warning.scss";
import CommonBreadcrumb from "../../../../components/Common/CommonBreadcrumb";
import SeriesMain from '../../../../components/System/Production/Warning/Series/SeriesMain.jsx';
import CleaningMain from '../../../../components/System/Production/Warning/Cleaning/CleaningMain.jsx';

const TabPane = Tabs.TabPane;

class Warning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'series',//默认显示低效组串
    }
  }
  onTabChange = (activeKey) => {
    const { enterpriseId} = this.props;
    this.setState({ activeKey })
    if (activeKey === 'series') { 
      this.props.getSeriesData();
    }else{
      this.props.getCleaningData({enterpriseId});
    }
  }

  render() {
    const { enterpriseId } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.warningBox}>
        <CommonBreadcrumb breadData={[{ name: '预警配置' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.warningContainer}>
          <div className={styles.warningMain}>
            <div className={styles.warningContent}>
              <div className="card-container">
                <Tabs type="card" onChange={this.onTabChange} activeKey={activeKey}>
                  <TabPane tab="低效组串" key="series">
                    <SeriesMain {...this.props} />
                  </TabPane>

                  <TabPane tab="清洗模型" key="clean">
                    <CleaningMain {...this.props} enterpriseId={enterpriseId} />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
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
  changeStore: payload => dispatch({ type: warningAction.CHANGE_WARNING_STORE_SAGA, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Warning)