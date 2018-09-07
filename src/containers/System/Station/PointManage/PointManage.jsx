
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './pointManage.scss';
import { pointManageAction } from '../../../../constants/actionTypes/system/station/pointManageAction';
import PropTypes from 'prop-types';

class PointManage extends Component {
  static propTypes = {
    // showPage: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    
  }

  render() {
    return (
      <div className={styles.pointManage}>
        测点管理页面嘎嘎嘎嘎嘎嘎嘎。 ++ {this.props.testWords}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.pointManage.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changePointManageStore: payload => dispatch({type:pointManageAction.CHANGE_POINT_MANAGE_STORE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(PointManage);
