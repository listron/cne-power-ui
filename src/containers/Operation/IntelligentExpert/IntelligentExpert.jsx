import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './intelligentExpert.scss';
import { intelligentExpertAction } from './intelligentExpertAction';
import { commonAction } from '../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import TransitionContainer from '../../../components/Common/TransitionContainer';

import AddIntelligent from '../../../components/Operation/IntelligentExpert/AddIntelligent';
import EditIntelligent from '../../../components/Operation/IntelligentExpert/EditIntelligent';
import ShowIntelligent from '../../../components/Operation/IntelligentExpert/ShowIntelligent';
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


  render() {
    const { showPage, theme } = this.props;
    return (
      <div className={`${styles.intelligentExpert} ${styles[theme]}`}>
        <CommonBreadcrumb breadData={[{ name: '智能专家库' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <InterlligentExpertMain {...this.props} />
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <IntelligentSide {...this.props} showPage={showPage} onShowSideChange={this.onShowSideChange} />
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
  getDevicemodes: payload => dispatch({ type: intelligentExpertAction.getDevicemodes, payload }),
  getFaultCodeList: payload => dispatch({ type: intelligentExpertAction.getFaultCodeList, payload }),
  deleteFile: payload => dispatch({ type: intelligentExpertAction.deleteFile, payload }),
  uploadFile: payload => dispatch({ type: intelligentExpertAction.uploadFile, payload }),
  // downloadFile: payload => dispatch({ type: intelligentExpertAction.downloadFile, payload }),
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
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: intelligentExpertAction.changeIntelligentExpertStore,
    },
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(IntelligentExpert);
