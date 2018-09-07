import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './alarmManage.scss';
import { alarmManageAction } from '../../../../constants/actionTypes/system/station/alarmManageAction';
import PropTypes from 'prop-types';

class AlarmManage extends Component {
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
      <div className={styles.alarmManage}>
        这个是告警管理，告警事件关键啊啊啊啊啊啊啊啊 ！！！！！ ++ {this.props.testWords}
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.alarmManage.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeAlarmManageStore: payload => dispatch({type:alarmManageAction.CHANGE_ALARM_MANAGE_STORE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlarmManage);
