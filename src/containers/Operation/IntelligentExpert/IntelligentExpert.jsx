import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie';
import CommonBreadcrumb from '../../../components/Common/CommonBreadcrumb';
import { commonAction } from '../../alphaRedux/commonAction';
import { IntelligentExpertAction } from './intelligentExpertReducer';
import IntelligentSearch from '../../../components/Operation/IntelligentExpert/IntelligentSearch';
import styles from './intelligentExpert.scss';

class IntelligentExpert extends Component {
  static propTypes = {
    resetStore: PropTypes.func,
    getStationOfEnterprise: PropTypes.func,
    enterpriseId: PropTypes.string,
  }
  componentDidMount(){
    const { enterpriseId, getStationOfEnterprise } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
  }

  componentWillUnmount(){
    this.props.resetStore();
  }

  render() {
    return (
      <div className={styles.intelligentExpert}>
        <CommonBreadcrumb breadData={[{ name: '光伏智能专家库' }]} style={{ marginLeft: '40px' }} />
        <div className={styles.contentBox}>
          <IntelligentSearch {...this.props} />
        </div>
      </div>
      )
    }
  }
  const mapStateToProps = (state) => ({
    enterpriseId: Cookie.get('enterpriseId'),
  });

  const mapDispatchToProps = (dispatch) => ({
    getIntelligentexpertStore: () => dispatch({ type: IntelligentExpertAction.CHANGE_INTELLIGENTEXPERT_STORE }),
    resetStore: () => dispatch({ type: IntelligentExpertAction.resetStore }),
    getStationOfEnterprise: params =>dispatch({
      type: commonAction.getStationOfEnterprise, 
      payload: {
        params, 
        actionName: IntelligentExpertAction.GET_INTELLIGENTEXPERT_SUCCESS,
        resultName: 'allStationBaseInfo'
      } 
    }),
  });

  export default connect(mapStateToProps, mapDispatchToProps)(IntelligentExpert);