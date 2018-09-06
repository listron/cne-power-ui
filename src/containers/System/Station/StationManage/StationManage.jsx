import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './stationManage.scss';
import { stationManageAction } from '../../../../constants/actionTypes/system/station/stationManageAction';
import PropTypes from 'prop-types';

class StationManage extends Component {
  static propTypes = {
    // showPage: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    console.log(this.props)
  }

  render() {
    return (
      <div className={styles.stationManage}>
        这个是电站管理页面 ++ {this.props.testWords}
      </div>

    );
  }
}
const mapStateToProps = (state) => ({
    ...state.system.stationManage.toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStationManageStore: payload => dispatch({type:stationManageAction.CHANGE_STATION_MANAGE_STORE_SAGA, payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(StationManage);
