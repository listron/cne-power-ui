import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './enterpriseContainer.scss';
import { enterpriseAction } from '../../../constants/actionTypes/system/enterpriseAction';
import PropTypes from 'prop-types';
import EnterpriseMain from '../../../components/System/Enterprise/EnterpriseMain';
import EnterpriseSide from '../../../components/System/Enterprise/EnterpriseSide';
import { CSSTransition } from 'react-transition-group';

class EnterpriseContainer extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    filterStatus: PropTypes.number, 
    enterpriseName: PropTypes.string, 
    enterprisePhone: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number, 
    enterpriseDetail:PropTypes.object, 
    selectedEnterprise: PropTypes.array,
    
    getEnterpriseList: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      showDetail: true,
    }
  }
  componentDidMount(){
    const params = {
      filterStatus: this.props.filterStatus, 
      enterpriseName: this.props.enterpriseName, 
      enterprisePhone: this.props.enterprisePhone,
      sort: this.props.sort, 
      ascend: this.props.ascend,
      currentPage: this.props.currentPage, 
      pageSize: this.props.pageSize, 
    }
    this.props.getEnterpriseList(params)
  }

  render() {
    const { showPage } = this.props;
    const { showDetail } = this.state;
    console.log(this.props)
    console.log(showDetail)
    return (
      <div className={styles.enterpriseContainer}>
        <EnterpriseMain {...this.props} />
        <CSSTransition
          in={showPage!=='list'}
          onEnter={()=>this.setState({showDetail:showPage==='detail'})}
          onExited={()=>this.setState({showDetail:showPage==='detail'})}
          timeout={500}
          classNames={'enterpriseSide'}
        >
          <EnterpriseSide {...this.props} showDetail={showDetail} />
        </CSSTransition>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  loading: state.enterprise.get('loading'),
  showPage: state.enterprise.get('showPage'),
  filterStatus: state.enterprise.get('filterStatus'),
  enterpriseName: state.enterprise.get('enterpriseName'),
  enterprisePhone: state.enterprise.get('enterprisePhone'),
  sort: state.enterprise.get('sort'),
  ascend: state.enterprise.get('ascend'),
  totalNum: state.enterprise.get('totalNum'),
  enterpriseData: state.enterprise.get('enterpriseData').toJS(),
  currentPage: state.enterprise.get('currentPage'),
  pageSize: state.enterprise.get('pageSize'),
  enterpriseDetail: state.enterprise.get('enterpriseDetail').toJS(),
  selectedEnterprise: state.enterprise.get('selectedEnterprise').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeEnterpriseAttr: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_ATTR_CHANGE_SAGA, payload}),
  getEnterpriseList: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_LIST_SAGA, payload}),
  getEnterpriseDetail: payload => dispatch({type:enterpriseAction.GET_ENTERPRISE_DETAIL_SAGA, payload}),
  changeSelectedEnterprise: payload => dispatch({type:enterpriseAction.CHANGE_SELECTED_ENTERPRISE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseContainer);
