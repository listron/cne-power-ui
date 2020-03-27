import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs } from 'antd';
import Cookie from 'js-cookie';
import { warningAction } from "./warningAction";
import { commonAction } from '../../../alphaRedux/commonAction';
import styles from "./warning.scss";
import PropTypes from 'prop-types';
import SeriesMain from '../../../../components/System/Production/Warning/Series/SeriesMain.jsx';
import CleaningMain from '../../../../components/System/Production/Warning/Cleaning/CleaningMain.jsx';
import WarnConfig from '../../../../components/System/Production/Warning/WarnConfig/WarnConfig';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import WarnCofigSide from '../../../../components/System/Production/Warning/WarnConfig/WarnCofigSide';
import Footer from '../../../../components/Common/Footer';
const TabPane = Tabs.TabPane;

class Warning extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    getSeriesData: PropTypes.func,
    getCleaningData: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
    listQueryParams: PropTypes.object,
    resetStore: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'series',//默认显示低效组串
    }
  }

  componentDidMount() {
    const { enterpriseId, getStationOfEnterprise } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
  }

  componentWillUnmount() {
    this.props.resetStore(); // 重置数据
  }

  onTabChange = (activeKey) => {
    const { enterpriseId } = this.props;
    this.setState({ activeKey })
    activeKey === 'series' && this.props.getSeriesData();
    activeKey === 'clean' && this.props.getCleaningData({ enterpriseId });
    activeKey === 'warn' && this.props.getStationOfEnterprise({ enterpriseId })
  }

  onShowSideChange = () => {
    // console.log('test')
  }

  pages = [{
    name: '低效组串',
    value: 'series',
  }, {
    name: '清洗模型',
    value: 'clean',
  }, {
    name: '预警配置',
    value: 'warn',
  }]


  render() {
    const { enterpriseId, showPage } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={styles.warningBox}>
        <div className={styles.warningContainer}>
          <div className={styles.warningContent}>
            <div className={styles.WarnCont}>
              {/* <Tabs type="card" onChange={this.onTabChange} activeKey={activeKey}>
                <TabPane tab="低效组串" key="series">
                  <SeriesMain {...this.props} />
                </TabPane>

                <TabPane tab="清洗模型" key="clean">
                  <CleaningMain {...this.props} enterpriseId={enterpriseId} />
                </TabPane>
                <TabPane tab="预警配置" key="warn">
                  <WarnConfig {...this.props} enterpriseId={enterpriseId} />
                </TabPane>
              </Tabs> */}

              <div className={styles.headerTabs} >
                <span className={styles.leftHolder} />
                {this.pages.map(e => (
                  <React.Fragment key={e.value}>
                    <span
                      onClick={() => this.onTabChange(e.value)}
                      className={`${styles.tab} ${e.value === activeKey ? styles.active : styles.inactive}`}
                    >{e.name}</span>
                    <span className={styles.tabHolder} />
                  </React.Fragment>
                ))}
                <span className={styles.rightHolder} />
              </div>
                  
              {activeKey === 'series' && <div className={styles.mainPageStyle}><SeriesMain {...this.props} /> </div>}
              {activeKey === 'clean' &&  <div className={styles.mainPageStyle}><CleaningMain {...this.props} enterpriseId={enterpriseId} /> </div>}
              {activeKey === 'warn' && <WarnConfig {...this.props} enterpriseId={enterpriseId} />}
            </div>
            <TransitionContainer
              show={showPage !== 'home'}
              onEnter={this.onToggleSide}
              onExited={this.onToggleSide}
              timeout={500}
              effect="side"
            >
              <WarnCofigSide {...this.props} showSidePage={showPage} onShowSideChange={this.onShowSideChange} />
            </TransitionContainer>
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
  changeWarnStore: payload => dispatch({ type: warningAction.changeWarnStore, payload }),
  getSeriesData: payload => dispatch({ type: warningAction.getSeriesData, payload }),
  getCleaningData: payload => dispatch({ type: warningAction.getCleaningData, payload }),
  addSeriesData: payload => dispatch({ type: warningAction.addSeriesData, payload }),
  addCleaningData: payload => dispatch({ type: warningAction.addCleaningData, payload }),
  getWarnList: payload => dispatch({ type: warningAction.getWarnList, payload }),
  addWran: payload => dispatch({ type: warningAction.addWran, payload }),
  modify: payload => dispatch({ type: warningAction.modify, payload }),
  getDetail: payload => dispatch({ type: warningAction.getDetail, payload }),
  warnDelete: payload => dispatch({ type: warningAction.warnDelete, payload }),
  getOtherPageDetail: payload => dispatch({ type: warningAction.getOtherPageDetail, payload }),
  getFilterPoints: payload => dispatch({ type: warningAction.getFilterPoints, payload }), // 选取测点


  getStationOfEnterprise: params => dispatch({ // 企业电站下的所有电站
    type: commonAction.getStationOfEnterprise,
    payload: {
      params:params,
      actionName: warningAction.changeWarnStore,
      resultName: 'allStationBaseInfo'
    }
  }),

  getStationDeviceTypes: params => dispatch({ // 电站下的设备类型
    type: commonAction.getStationDeviceTypes,
    payload: { //stationDeviceTypes
      params:params.payload,
      deviceTypeAction: warningAction.changeWarnStore,
      resultName: params.resultName
    }
  }),
  getDeviceModel: params => dispatch({ // 设备型号
    type: commonAction.getDeviceModel,
    payload: { //deviceModels
      params:params.payload,
      actionName: warningAction.changeWarnStore,
      resultName: params.resultName
    }
  }),

  getPoints: params => dispatch({ // 测点
    type: commonAction.getPoints,
    payload: {
      params:params.payload,
      actionName: warningAction.changeWarnStore,
      resultName: params.resultName
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Warning)
