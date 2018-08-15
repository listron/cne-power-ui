
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allstation.scss";
import PropTypes from "prop-types";
import { allStationAction } from '../../../../constants/actionTypes/monitor/stationMonitor/allStationAction';
import Allstation from '../../../../components/Monitor/StationMonitor/AllStation/AllStation.jsx';
import TransitionContainer from '../../../../components/Common/TransitionContainer';
//import PvStation from '../../../../components/Monitor/StationMonitor/AllStation/PvStation/PvStation.jsx'


class AllStation extends Component {
  static PropTypes = {
    getAllMonitorStation: PropTypes.func,

  }
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleTab = () => {
    console.log(1);
  }


  render() {

    return (
      <div className={styles.stationMonitor}>
        <Allstation />
        {/* <PvStation /> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let allStationProps = {};
  [...state.monitor.stationMonitor].forEach(e => allStationProps[e[0]] = e[1])
  return allStationProps;
}
const mapDispatchToProps = (dispatch) => ({
  getAllMonitorStation: payload => dispatch({ type: allStationAction. GET_ALL_MONITORSTATION_SAGA, payload }),
  changeMonitorStationStore: payload => dispatch({ type: allStationAction.CHANGE_MONITORSTATION_STORE_SAGA, payload }),
  // changeDepartmentStore: payload => dispatch({ type: allStationAction.CHANGE_DEPARTMENT_STORE_SAGA, payload }),
  // deleteDepartment: payload => dispatch({ type: allStationAction.DELETE_DEPARTMENT_SAGA, payload }),
  // getDepartmentList: payload => dispatch({ type: allStationAction.GET_DEPARTMENT_LIST_SAGA, payload }),
  // getDepartmentDetail: payload => dispatch({ type: allStationAction.GET_DEPARTMENT_DETAIL_SAGA, payload }),
  // getOtherPageDetail: (payload, { previous }) => dispatch({ type: allStationAction.GET_OTHER_PAGE_DEPARTMENT_DETAIL_SAGA, payload, previous }),
  // getAllUsers: payload => dispatch({ type: allStationAction.GET_ALL_USERS_SAGA, payload }),
  // getAllDepartment: payload => dispatch({ type: allStationAction.GET_ALL_DEPARTMENT_SAGA, payload }),
  // addDepartmentInfor: payload => dispatch({ type: allStationAction.ADD_DEPARTMENT_INFO_SAGA, payload }),
  // editDepartmentInfor: payload => dispatch({ type: allStationAction.EDIT_DEPARTMENT_INFO_SAGA, payload })
})


export default connect(mapStateToProps, mapDispatchToProps)(AllStation);

