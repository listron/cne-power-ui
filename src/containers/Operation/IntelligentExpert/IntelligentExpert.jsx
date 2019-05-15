import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import styles from './intelligentExpert.scss';
import { intelligentExpertAction } from './intelligentExpertAction';
import { commonAction } from '../../alphaRedux/commonAction';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import IntelligentSearch from '../../../components/Operation/IntelligentExpert/IntelligentSearch';
import IntelligentTable from '../../../components/Operation/IntelligentExpert/IntelligentTable';
import IntelligentSide from '../../../components/Operation/IntelligentExpert/IntelligentSide';
import Footer from '../../../components/Common/Footer';

class IntelligentExpert extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    showPage: PropTypes.string,
    resetStore: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
    getLostGenType: PropTypes.func,
    listParams: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showSidePage: 'add',
    }
  }
  componentDidMount(){
    const { enterpriseId, getStationOfEnterprise, getLostGenType } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
    getLostGenType({ // 获取所有损失缺陷类型
      objectType: 1
    })
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  onShowSideChange = (showSidePage) => {
    this.setState({ showSidePage });
  }

  onToggleSide = () => {
    const { showPage } = this.props;
    this.setState({
      showSidePage: showPage
    });
  }

  render() {
    const { showSidePage } = this.state;
    const { showPage, listParams } = this.props;
    const { deviceTypeCode, faultTypeId, pageNum, pageSize, orderField, sortMethod } = listParams;
    const queryParams = { deviceTypeCode, faultTypeId, pageNum, pageSize, orderField, sortMethod };

    return (
      <div className={styles.intelligentExpert}>
        <CommonBreadcrumb breadData={[{ name: '光伏智能专家库' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <div className={styles.container}>
            <IntelligentSearch {...this.props} />
            <IntelligentTable {...this.props} />
          </div>
          <TransitionContainer 
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <IntelligentSide {...this.props} showSidePage={showSidePage} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>
        </div>
        <Footer />
      </div>
      )
    }
  }

  const mapStateToProps = (state) => {
    return {
      ...state.operation.intelligentExpert.toJS(),
      enterpriseId: Cookie.get('enterpriseId'),
      stations: state.common.get('stations').toJS(),
      deviceTypes: state.common.get('deviceTypes').toJS(),
    }
  };

  const mapDispatchToProps = (dispatch) => ({
    getIntelligentExpertStore: payload => dispatch({ type: intelligentExpertAction.getIntelligentExpertStore,payload }),
    getDefectType: payload => dispatch({ type: intelligentExpertAction.getDefectType, payload }),
    getIntelligentTable: payload => dispatch({ type: intelligentExpertAction.getIntelligentTable, payload }),
    getImportIntelligent: payload => dispatch({ type: intelligentExpertAction.getImportIntelligent, payload }),
    deleteIntelligent: payload => dispatch({ type: intelligentExpertAction.deleteIntelligent, payload }),
    getUserName: payload => dispatch({ type: intelligentExpertAction.getUserName, payload }),
    addIntelligent: payload => dispatch({ type: intelligentExpertAction.addIntelligent, payload }),
    resetStore: () => dispatch({ type: intelligentExpertAction.resetStore }),
    getStationOfEnterprise: params =>dispatch({
      type: commonAction.getStationOfEnterprise, 
      payload: {
        params, 
        actionName: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        resultName: 'allStationBaseInfo'
      } 
    }),
    getLostGenType: params => dispatch({
      type: commonAction.getLostGenType,
      payload: {
        params,
        actionName: intelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        resultName: 'defectTypes'
      }
    }),
  });

  export default connect(mapStateToProps, mapDispatchToProps)(IntelligentExpert);