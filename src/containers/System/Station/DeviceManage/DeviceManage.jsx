import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './deviceManage.scss';
import { devicenManageAction } from '../../../../constants/actionTypes/system/station/deviceManageAction';
import PropTypes from 'prop-types';

class DeviceManage extends Component {
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
      <div className={styles.deviceManage}>
        this is device Manageeeeeeerrrrrr! ++ {this.props.testWords}
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.deviceManage.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeDeviceManageStore: payload => dispatch({type:devicenManageAction.CHANGE_DEVICE_MANAGE_STORE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeviceManage);
