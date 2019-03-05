import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./allDeviceCurve.scss";
import DeviceFilter from "./DeviceFilter"

class AllDeviceCurve extends Component {
  static propTypes = {
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    return (
      <div className={styles.allDeviceBox}>
        <DeviceFilter {...this.props} />
      </div>
    )
  }
}
export default (AllDeviceCurve)