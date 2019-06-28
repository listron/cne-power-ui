import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import { manufacturersAction } from './manufacturersAction';
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import Footer from '../../../../components/Common/Footer';
import ManufacturersCont from '../../../../components/StatisticalAnalysis/EquipmentAnalysis/Manufacturers/Manufacturers'

class Manufacturers extends Component {
  static propTypes = {
    resetStore: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)
  }

 
  componentWillUnmount() {
    this.props.resetStore()
  }

  render() {
    return (
      <div className={styles.manufacturersBox}>
        <CommonBreadcrumb breadData={[{ name: '设备对比' }]} style={{ marginLeft: '38px' }} />
        <div className={styles.manufacturersContainer}>
          <ManufacturersCont {...this.props} />
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return ({
    ...state.statisticalAnalysisReducer.manufacturers.toJS(),
    stations: state.common.get('stations').toJS(),
  })
}
const mapDispatchToProps = (dispatch) => ({
  changeManufacturersStore: payload => dispatch({ type: manufacturersAction.changeManufacturersStore, payload }),
  resetStore: () => dispatch({ type: manufacturersAction.resetStore }),
  getManufacturer: payload => dispatch({ type: manufacturersAction.getManufacturer, payload }),
  getDevicemode: payload => dispatch({ type: manufacturersAction.getDevicemode, payload }),
  getDevicecontrast: payload => dispatch({ type: manufacturersAction.getDevicecontrast, payload }),
  getChartsData: payload => dispatch({ type: manufacturersAction.getChartsData, payload }),

})
export default connect(mapStateToProps, mapDispatchToProps)(Manufacturers)