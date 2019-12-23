import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './role.scss';
import Cookie from 'js-cookie';
import { roleAction } from './roleAction';
import PropTypes from 'prop-types';
import Footer from '../../../../components/Common/Footer';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
import RoleEdit from '../../../../components/System/Account/Role/RoleEdit';
import RoleTable from '../../../../components/System/Account/Role/RoleTable';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';

class Role extends Component {
  static propTypes = {
    showPage: PropTypes.string,
    selectedRole: PropTypes.array,
    getRoleList: PropTypes.func,
    modifyRole: PropTypes.func,
    deleteRole: PropTypes.func,
    changeRoleStore: PropTypes.func,
    resetRole: PropTypes.func,
    enterpriseId: PropTypes.string,
    continueAdd: PropTypes.bool,
    getOperatetype: PropTypes.func,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const params = {
      enterpriseId: this.props.enterpriseId
    }
    this.props.getRoleList(params);
    this.props.getOperatetype(); // 获得权限操作类型
  }
  componentWillUnmount() {
    this.props.resetRole();
  }

  render() {
    const { showPage } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '角色',
        }
      ],
    };
    return (
      <div className={styles.roleContainerBox} >
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.roleContainer}>
          <div className={styles.roleMain} style={{ visibility: showPage === 'list' ? 'visible' : 'hidden' }}>
            <RoleTable {...this.props} />
            <Footer />
          </div>
          <TransitionContainer
            show={showPage !== 'list'}
            timeout={500}
            effect="side"
          >
            <div className={styles.roleSide}>
              <RoleEdit {...this.props} />
              <Footer />
            </div>
          </TransitionContainer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state.system.role.toJS(),
  enterpriseId: Cookie.get('enterpriseId'),
});

const mapDispatchToProps = (dispatch) => ({
  changeRoleStore: payload => dispatch({ type: roleAction.CHANGE_ROLE_STORE_SAGA, payload }),
  getRoleList: payload => dispatch({ type: roleAction.GET_ROLE_LIST_SAGA, payload }),
  getMenuList: payload => dispatch({ type: roleAction.GET_MENU_LIST_SAGA, payload }),
  getDefaultMenuList: payload => dispatch({ type: roleAction.GET_DEFAULT_MENU_LIST_SAGA, payload }),
  onCreateRole: payload => dispatch({ type: roleAction.CREATE_ROLE_SAGA, payload }),
  onEditRole: payload => dispatch({ type: roleAction.EDIT_ROLE_SAGA, payload }),
  onDeleteRole: payload => dispatch({ type: roleAction.DELETE_ROLE_SAGA, payload }),
  resetRole: payload => dispatch({ type: roleAction.RESET_ROLE_SAGA, payload }),
  getOperatetype: payload => dispatch({ type: roleAction.GET_OPERATE_TYPE, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Role);
