import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './enterprise.scss';
import { getCookie } from '../../../../utils';
import { enterpriseAction } from '../../../../constants/actionTypes/system/account/enterpriseAction';
import PropTypes from 'prop-types';
import Footer from '../../../../components/Common/Footer';
/*
注： 此3引用在企业列表展示功能中引入，后产品调整为直接展示企业详情，去下企业列表页面展示。请不要删除，可能会重新展示企业列表功能；
import EnterpriseMain from '../../../../components/System/Account/Enterprise/EnterpriseMain/EnterpriseMain';
import EnterpriseSide from '../../../../components/System/Account/Enterprise/EnterpriseSide';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
*/
import EnterpriseDetail from '../../../../components/System/Account/Enterprise/EnterpriseDetail';
import EnterpriseEdit from '../../../../components/System/Account/Enterprise/EnterpriseEdit';

class Enterprise extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    enterpriseId: PropTypes.string,
    getEnterpriseDetail: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    // const params = {
    //   filterStatus: this.props.filterStatus, 
    //   enterpriseName: this.props.enterpriseName, 
    //   enterprisePhone: this.props.enterprisePhone,
    //   sort: this.props.sort, 
    //   ascend: this.props.ascend,
    //   currentPage: this.props.currentPage, 
    //   pageSize: this.props.pageSize, 
    // }
    // this.props.getEnterpriseList(params)//请求企业列表
    this.props.getEnterpriseDetail({
      // enterpriseId:"1010694160817111040"
      // enterpriseName:"协合新能源"
      enterpriseId: this.props.enterpriseId, //this.props.enterpriseId //'1010694160817111040',
    })
  }

  onShowSide = () => {
    const showPage = this.props.showPage;
    this.setState({
      showDetail: showPage === 'detail'
    });
  }

  render() {
    const { showPage } = this.props;
    return (
      <div className={styles.enterpriseContainer}>
        {
          showPage==='detail' ?
          <EnterpriseDetail {...this.props} />:
          <EnterpriseEdit {...this.props} />
        }
        {/*注：不要删除，此备注用于展示企业列表，可能后续会用。
        <EnterpriseMain {...this.props} />
        <TransitionContainer
          show={showPage!=='list'}
          onEnter={this.onShowSide}
          timeout={500}
          effect="side"
        >
          <EnterpriseSide {...this.props} showDetail={showDetail} />
        </TransitionContainer>*/}
        <Footer />
        
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.system.enterprise.toJS(),
  enterpriseId: getCookie('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeEnterpriseStore: payload => dispatch({type:enterpriseAction.CHANGE_ENTERPRISE_STORE_SAGA, payload}),
  getEnterpriseList: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_LIST_SAGA, payload}),
  getEnterpriseDetail: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_DETAIL_SAGA, payload}),
  changeSelectedEnterprise: payload => dispatch({type:enterpriseAction.CHANGE_SELECTED_ENTERPRISE_SAGA, payload}),
  saveEnterpriseInfor: payload => dispatch({type:enterpriseAction.SAVE_ENTERPRISE_INFO_SAGA, payload}),
  ignoreEnterpirseEdit: payload => dispatch({type: enterpriseAction.IGNORE_ENTERPRISE_EDIT,payload})
});

export default connect(mapStateToProps, mapDispatchToProps)(Enterprise);
