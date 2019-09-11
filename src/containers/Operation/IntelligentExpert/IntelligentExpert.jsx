import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './intelligentExpert.scss';
import { intelligentExpertAction } from './intelligentExpertAction';
import { commonAction } from '../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import TransitionContainer from '../../../components/Common/TransitionContainer';

import IntelligentSide from '../../../components/Operation/IntelligentExpert/IntelligentSide';
import Footer from '../../../components/Common/Footer';
import InterlligentExpertMain from '../../../components/Operation/IntelligentExpert/InterlligentExpertMain';

class IntelligentExpert extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    listParams: PropTypes.object,
    theme: PropTypes.string,
    changeIntelligentExpertStore: PropTypes.func,
    stationType: PropTypes.string,
    stationTypeCount: PropTypes.string,
    showPage: PropTypes.string,
    getStationTypeDeviceTypes: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { stationType } = this.props;
    this.props.getStationTypeDeviceTypes({ type: stationType });
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.stationTypeCount === 'pv') {
      this.props.changeIntelligentExpertStore({ stationType: '1' });
      this.props.getStationTypeDeviceTypes({ type: '1' });
    }
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

  queryTargetData = (value) => { // 切换电站
    const { getStationTypeDeviceTypes } = this.props;
    this.props.changeIntelligentExpertStore({ stationType: value });
    getStationTypeDeviceTypes({ type: value });
  }

  render() {
    const { showPage, theme, stationTypeCount, stationType } = this.props;
    return (
      <div className={`${styles.intelligentExpert} ${styles[theme]}`}>
        <CommonBreadcrumb breadData={[{ name: '智能专家库' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.container}>
            <div className={styles.intelligentContent}>
              {stationTypeCount === 'multiple' &&
                <div className={styles.stationType}>
                  <p className={`${stationType === '0' && styles.activeStation} `} onClick={() => { this.queryTargetData('0'); }}>风电</p>
                  <p className={`${stationType === '1' && styles.activeStation} `} onClick={() => { this.queryTargetData('1'); }}>光伏</p>
                </div>
              }
              <InterlligentExpertMain {...this.props} />
            </div>
          </div>
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <div>测试</div>
            {/* <IntelligentSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} /> */}
          </TransitionContainer>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.operation.intelligentExpert.toJS(),
    enterpriseId: Cookie.get('enterpriseId'),
    stations: state.common.get('stations').toJS(),
    // deviceTypes: state.common.get('deviceTypes').toJS(),
    theme: state.common.get('theme'),
    stationTypeCount: state.common.get('stationTypeCount'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeIntelligentExpertStore: payload => dispatch({ type: intelligentExpertAction.changeIntelligentExpertStore, payload }),
  getIntelligentTable: payload => dispatch({ type: intelligentExpertAction.getIntelligentTable, payload }),
  getImportIntelligent: payload => dispatch({ type: intelligentExpertAction.getImportIntelligent, payload }),
  deleteIntelligent: payload => dispatch({ type: intelligentExpertAction.deleteIntelligent, payload }),
  getUserName: payload => dispatch({ type: intelligentExpertAction.getUserName, payload }),
  addIntelligent: payload => dispatch({ type: intelligentExpertAction.addIntelligent, payload }),
  getKnowledgebase: payload => dispatch({ type: intelligentExpertAction.getKnowledgebase, payload }),
  getLike: payload => dispatch({ type: intelligentExpertAction.getLike, payload }),
  editIntelligent: payload => dispatch({ type: intelligentExpertAction.editIntelligent, payload }),
  resetStore: () => dispatch({ type: intelligentExpertAction.resetStore }),
  getLostGenType: params => dispatch({
    type: commonAction.getLostGenType,
    payload: {
      params,
      actionName: intelligentExpertAction.changeIntelligentExpertStore,
      resultName: 'defectTypes',
    },
  }),
  getStationTypeDeviceTypes: params => dispatch({
    type: commonAction.getStationTypeDeviceTypes,
    payload: {
      params,
      actionName: intelligentExpertAction.changeIntelligentExpertStore,
      resultName: 'deviceTypes',
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentExpert);
