import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './enterpriseContainer.scss';
import { 
  GET_ENTERPRISE_ATTR_CHANGE_SAGA,
  GET_ENTERPRISE_LIST_SAGA,
  CHANGE_SELECTED_ENTERPRISE_SAGA,
} from '../../constants/actionTypes/systemManage/enterpriseAction';
import PropTypes from 'prop-types';
import EnterpriseMain from '../../components/SystemManage/Enterprise/EnterpriseMain';
import EnterpriseSide from '../../components/SystemManage/Enterprise/EnterpriseSide';
import { CSSTransition } from 'react-transition-group';

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
    changeEnterpriseAttr: PropTypes.func,
    getEnterpriseList: PropTypes.func,
    changeSelectedEnterprise: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {}
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

  handleChangePages = (params) => {
    this.props.changeEnterpriseAttr(params)
  }

  render() {
    const { showPage } = this.props;
    return (
      <div className={styles.enterpriseContainer}>
        <EnterpriseMain handleChangePages={this.handleChangePages} {...this.props} />
        <CSSTransition
          in={showPage!=='list'}
          timeout={500}
          classNames={'enterpriseSide'}
        >
          <EnterpriseSide handleChangePages={this.handleChangePages} {...this.props} />
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
  enterpriseList: state.enterprise.get('enterpriseList').toJS(),
  currentPage: state.enterprise.get('currentPage'),
  pageSize: state.enterprise.get('pageSize'),
  enterpriseDetail: state.enterprise.get('enterpriseDetail').toJS(),
  selectedEnterprise: state.enterprise.get('selectedEnterprise').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeEnterpriseAttr: payload => dispatch({type:GET_ENTERPRISE_ATTR_CHANGE_SAGA, payload}),
  getEnterpriseList: payload => dispatch({type:GET_ENTERPRISE_LIST_SAGA, payload}),
  changeSelectedEnterprise: payload => dispatch({type:CHANGE_SELECTED_ENTERPRISE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseContainer);
