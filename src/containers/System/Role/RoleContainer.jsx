import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './roleContainer.scss';
import { roleAction } from '../../../constants/actionTypes/system/roleAction';
import PropTypes from 'prop-types';
import Footer from '../../../components/Common/Footer';
import TransitionContainer from '../../../components/Common/TransitionContainer';
import RoleEdit from '../../../components/System/Role/RoleEdit';
import RoleTable from '../../../components/System/Role/RoleTable';

class RoleContainer extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    sort: PropTypes.string, 
    ascend: PropTypes.bool,
    currentPage: PropTypes.number, 
    pageSize: PropTypes.number,
    selectedRole: PropTypes.array, 
    getRoleList: PropTypes.func,
    modifyRole: PropTypes.func,
    deleteRole: PropTypes.func,
    changeRoleStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount(){
    const params = {
      sort: this.props.sort, 
      ascend: this.props.ascend,
      currentPage: this.props.currentPage, 
      pageSize: this.props.pageSize, 
    }
    this.props.getRoleList(params)
  }

  render() {
    const { showPage } = this.props;
    return (
      <div className={styles.RoleContainer}>
        <RoleTable {...this.props} />
        <TransitionContainer
          show={showPage!=='list'}
          timeout={500}
          effect="side"
        >
          <RoleEdit {...this.props} />
        </TransitionContainer>
        <Footer />
        
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  isFetching: state.role.get('isFetching'),
  showPage: state.role.get('showPage'),
  sort: state.role.get('sort'),
  ascend: state.role.get('ascend'),
  totalNum: state.role.get('totalNum'),
  roleData: state.role.get('roleData').toJS(),
  currentPage: state.role.get('currentPage'),
  pageSize: state.role.get('pageSize'),
  selectedRole: state.role.get('selectedRole').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeRoleStore: payload => dispatch({type:roleAction.CHANGE_ROLE_STORE_SAGA, payload}),
  getEnterpriseList: payload => dispatch({type:roleAction.GET_ROLE_LIST_SAGA, payload}),
  modifyRole: payload => dispatch({type:roleAction.MODIFT_ROLE_SAGA, payload}),
  deleteRole: payload => dispatch({type:roleAction.DELETE_ROLE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleContainer);
