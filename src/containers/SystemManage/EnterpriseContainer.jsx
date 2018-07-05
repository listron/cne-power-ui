import React, { Component } from 'react';
import { connect } from 'react-redux';
// import styles from './preLogin.scss';
import { 
  CHANGE_ENTERPRISE_PAGE_SAGA,
  GET_ENTERPRISE_LIST_SAGA,
  CHANGE_SELECTED_ENTERPRISE_SAGA,
} from '../../constants/actionTypes/systemManage/enterpriseAction';
import PropTypes from 'prop-types';
import EnterpriseMain from '../../components/SystemManage/Enterprise/EnterpriseMain';

class EnterpriseContainer extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    showPage: PropTypes.string,
    filterStatus: PropTypes.number, 
    enterpriseName: PropTypes.string, 
    enterprisePhone: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    enterpriseList: PropTypes.array,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number, 
    enterpriseDetail:PropTypes.object, 
    selectedEnterprise: PropTypes.array,
    getEnterpriseList: PropTypes.func,
    getEnterpriseList: PropTypes.func,
    changeSelectedEnterprise: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    const params = {
      filterStatus: this.props.filterStatus, 
      enterpriseName: this.props.enterpriseName, 
      enterprisePhone: this.props.enterprisePhone,
      sort: this.props.sort, 
      ascend: this.props.ascend,
      enterpriseList: this.props.enterpriseList,
      currentPage: this.props.currentPage, 
      pageSize: this.props.pageSize, 
    }
    this.props.getEnterpriseList(params)
  }

  render() {
    // const { showPage, enterpriseList, enterpriseDetail } = this.props;
    return (
      <div>
        这里是企业管理页面！！！！哈哈哈哈，猴赛雷！
        <EnterpriseMain {...this.props} />
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
  enterpriseList: state.enterprise.get('enterpriseList').toJS(),
  currentPage: state.enterprise.get('currentPage'),
  pageSize: state.enterprise.get('pageSize'),
  enterpriseDetail: state.enterprise.get('enterpriseDetail').toJS(),
  selectedEnterprise: state.enterprise.get('selectedEnterprise').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeEnterpriseShow: params => dispatch({type:CHANGE_ENTERPRISE_PAGE_SAGA, payload: params}),
  getEnterpriseList: params => dispatch({type:GET_ENTERPRISE_LIST_SAGA, payload: params}),
  changeSelectedEnterprise: params => dispatch({type:CHANGE_SELECTED_ENTERPRISE_SAGA, payload: params}),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseContainer);
