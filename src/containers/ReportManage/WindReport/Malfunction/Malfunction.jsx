import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./malfunction.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { malfunctionAction } from './malfunctionAction';
import Footer from '../../../../components/Common/Footer';
import MalfunctionContainer from '../../../../components/ReportManage/WindReport/Malfunction/Malfunction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';


class Malfunction extends Component {
  static propTypes = {
    resetMalfunctionStore: PropTypes.func,
    getRegionStationDevice: PropTypes.func,
    getStationDevicemode: PropTypes.func,
    getRegionStation: PropTypes.func,
    getRegion: PropTypes.func,
    changeMalfunctionStore: PropTypes.func,
    stationTypeCount: PropTypes.string,
    selectStationType: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.props.getRegionStationDevice()
    this.props.getStationDevicemode()
    this.props.getRegionStation()
    this.props.getRegion()
  }
  componentWillUnmount() {
    this.props.resetMalfunctionStore()
  }
  checkWind = () => this.props.changeMalfunctionStore({selectStationType:'0'}) // 选中风电站

  checkPv = () => this.props.changeMalfunctionStore({selectStationType:'1'}) // 选中光伏电站
  render() {
    const { stationTypeCount, selectStationType } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '报告查询-故障报表',
        }
      ],
    };
    return (
      <div className={styles.containerDiv}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.containerBg}>
          <div className={styles.container}>
           {/*
             {stationTypeCount === 'multiple' &&
              <div className={styles.typeCheck}>
                <div className={selectStationType === '0' ? styles.typeActive : styles.typeNormal} onClick={this.checkWind}>风电</div>
                <div className={selectStationType === '1' ? styles.typeActive : styles.typeNormal} onClick={this.checkPv}>光伏</div>
                <div className={styles.holder} />
              </div>
            }
         {selectStationType === '0' && <MalfunctionContainer {...this.props} />}
           {selectStationType === '1' && <MalfunctionContainer {...this.props} />}
           
          */}
            <MalfunctionContainer {...this.props} />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.reportManageReducer.malfunctionReducer.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),
  }
}
const mapDispatchToProps = (dispatch) => ({
  changeMalfunctionStore: payload => dispatch({ type: malfunctionAction.changeMalfunctionStore, payload }),
  resetMalfunctionStore: payload => dispatch({ type: malfunctionAction.resetMalfunctionStore, payload }),
  getMalfunctionList: payload => dispatch({ type: malfunctionAction.getMalfunctionList, payload }),
  getMalfunctionDetail: payload => dispatch({ type: malfunctionAction.getMalfunctionDetail, payload }),

  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile, payload: {
      ...payload,
      actionName: malfunctionAction.changeMalfunctionStore
    }
  }),
  getRegion: params => dispatch({ //获取用户权限的电站区域
    type: commonAction.getRegion,
    payload: {
      params,
      actionName: malfunctionAction.changeMalfunctionStore,
      resultName: 'regionData',
    }
  }),
  getRegionStation: params => dispatch({ // //获取用户权限的电站区域下的电站
    type: commonAction.getRegionStation,
    payload: {
      params,
      actionName: malfunctionAction.changeMalfunctionStore,
      resultName: 'regionStationData',
    }
  }),
  getStationDevicemode: params => dispatch({ //获取用户权限的电站区域下的电站下的对应型号
    type: commonAction.getStationDevicemode,
    payload: {
      params,
      actionName: malfunctionAction.changeMalfunctionStore,
      resultName: 'stationDevicemodeData',
    }
  }),
  getRegionStationDevice: params => dispatch({ //获取用户权限的电站区域下电站下的对应设备
    type: commonAction.getRegionStationDevice,
    payload: {
      params,
      actionName: malfunctionAction.changeMalfunctionStore,
      resultName: 'regionStationDeviceData',
    }
  }),
})
export default connect(mapStateToProps, mapDispatchToProps)(Malfunction)