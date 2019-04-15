import React from "react";
import PropTypes from "prop-types";
import styles from "./faultSingleFan.scss";
import PreTemperature from "../DiagnoseCharts/PreTemperature";
import AfterTemperature from "../DiagnoseCharts/AfterTemperature";
import DifferenceTemperature from "../DiagnoseCharts/DifferenceTemperature";
import SingleResult from "../DiagnoseCharts/SingleResult";
import HeatMap from "../DiagnoseCharts/HeatMap";
import AllFans from "../DiagnoseCharts/AllFans";


export default class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    stations: PropTypes.object,
    singleStationCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.title}>
          <span>肥西风场</span><span>WTG05</span>
        </div>
        <div className={styles.singleFanWrap}>
          <div className={styles.singleFanContent}>
            <PreTemperature {...this.props} />
            <AfterTemperature {...this.props} />
            <DifferenceTemperature {...this.props} />
            <SingleResult {...this.props} />
            <HeatMap {...this.props} />
            <AllFans {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}
