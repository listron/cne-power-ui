import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './enterpriseContainer.scss';
// import { enterpriseAction } from '../../../constants/actionTypes/system/enterpriseAction';
import PropTypes from 'prop-types';
/*
注： 此3引用在企业列表展示功能中引入，后产品调整为直接展示企业详情，去下企业列表页面展示。请不要删除，可能会重新展示企业列表功能；
import EnterpriseMain from '../../../components/System/Enterprise/EnterpriseMain/EnterpriseMain';
import EnterpriseSide from '../../../components/System/Enterprise/EnterpriseSide';
import TransitionContainer from '../../../components/Common/TransitionContainer';
*/
// import EnterpriseDetail from '../../../components/System/Enterprise/EnterpriseDetail';
// import EnterpriseEdit from '../../../components/System/Enterprise/EnterpriseEdit';

class DepartmentContainer extends Component {
  // static propTypes = {
  //   showPage: PropTypes.string,
  //   filterStatus: PropTypes.number, 
  //   enterpriseName: PropTypes.string, 
  //   enterprisePhone: PropTypes.string,
  //   sort: PropTypes.string, 
  //   ascend: PropTypes.bool,
  //   currentPage: PropTypes.number, 
  //   pageSize: PropTypes.number, 
  //   getEnterpriseDetail: PropTypes.func,
  // }
  constructor(props) {
    super(props);
  }
  // componentDidMount(){
  //   // const params = {
  //   //   filterStatus: this.props.filterStatus, 
  //   //   enterpriseName: this.props.enterpriseName, 
  //   //   enterprisePhone: this.props.enterprisePhone,
  //   //   sort: this.props.sort, 
  //   //   ascend: this.props.ascend,
  //   //   currentPage: this.props.currentPage, 
  //   //   pageSize: this.props.pageSize, 
  //   // }
  //   // this.props.getEnterpriseList(params)//请求企业列表
  //   this.props.getEnterpriseDetail()
  // }

  // onShowSide = () => {
  //   const showPage = this.props.showPage;
  //   this.setState({
  //     showDetail: showPage === 'detail'
  //   });
  // }

  render() {
    // const { showPage } = this.props;
    return (
      <div>部门页面基本container</div>
      // <div className={styles.enterpriseContainer}>
      //   {
      //     showPage==='detail' ?
      //     <EnterpriseDetail {...this.props} />:
      //     <EnterpriseEdit {...this.props} />
      //   }
      //   {/*注：不要删除，此备注用于展示企业列表，可能后续会用。
      //   <EnterpriseMain {...this.props} />
      //   <TransitionContainer
      //     show={showPage!=='list'}
      //     onEnter={this.onShowSide}
      //     timeout={500}
      //     effect="side"
      //   >
      //     <EnterpriseSide {...this.props} showDetail={showDetail} />
      //   </TransitionContainer>*/}
      //   <div className={styles.enterpriseFooter}>
      //     <span className={styles.footerText}>京ICP备12030847号-2 © 2017-2018 北京动力协合科技有限公司</span>
      //   </div>
        
      // </div>
    );
  }
}
const mapStateToProps = (state) => ({
//   loading: state.enterprise.get('loading'),
//   showPage: state.enterprise.get('showPage'),
//   filterStatus: state.enterprise.get('filterStatus'),
//   enterpriseName: state.enterprise.get('enterpriseName'),
//   enterprisePhone: state.enterprise.get('enterprisePhone'),
//   sort: state.enterprise.get('sort'),
//   ascend: state.enterprise.get('ascend'),
//   totalNum: state.enterprise.get('totalNum'),
//   enterpriseData: state.enterprise.get('enterpriseData').toJS(),
//   currentPage: state.enterprise.get('currentPage'),
//   pageSize: state.enterprise.get('pageSize'),
//   enterpriseDetail: state.enterprise.get('enterpriseDetail').toJS(),
//   selectedEnterprise: state.enterprise.get('selectedEnterprise').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
//   changeEnterpriseStore: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_ATTR_CHANGE_SAGA, payload}),
//   getEnterpriseList: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_LIST_SAGA, payload}),
//   getEnterpriseDetail: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_DETAIL_SAGA, payload}),
//   changeSelectedEnterprise: payload => dispatch({type:enterpriseAction.CHANGE_SELECTED_ENTERPRISE_SAGA, payload}),
//   saveEnterpriseInfor: payload => dispatch({type:enterpriseAction.SAVE_ENTERPRISE_INFO_SAGA, payload}),
//   ignoreEnterpirseEdit: payload => dispatch({type: enterpriseAction.IGNORE_ENTERPRISE_EDIT,payload})
});

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentContainer);
