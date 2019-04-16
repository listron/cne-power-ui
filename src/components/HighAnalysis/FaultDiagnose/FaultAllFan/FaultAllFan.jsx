import React from "react";
import PropTypes from "prop-types";
import styles from "./faultAllFan.scss";
import PreTemperature from "../DiagnoseCharts/PreTemperature/PreTemperature";
import AfterTemperature from "../DiagnoseCharts/AfterTemperature/AfterTemperature";
import DifferenceTemperature from "../DiagnoseCharts/DifferenceTemperature/DifferenceTemperature";
import SingleResult from "../DiagnoseCharts/SingleResult/SingleResult";
import HeatMap from "../DiagnoseCharts/HeatMap/HeatMap";
import AllFans from "../DiagnoseCharts/AllFans/AllFans";
import FaultNavList from "../FaultNavList/FaultNavList";
import FaultAllFanTop from "./FaultAllFanTop/FaultAllFanTop";


export default class FaultAllFan extends React.Component {
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
      <div className={styles.faultAllFan}>
        <div className={styles.title}>
          <span>肥西风场</span><span>变桨电机温度异常识别</span>
        </div>
        <div className={styles.allFanWrap}>
          <div className={styles.allFanContent}>
            <FaultAllFanTop {...this.props} />
            <FaultNavList {...this.props} />
            <div className={styles.allFanContentCharts}>
              <PreTemperature {...this.props} />
              <AfterTemperature {...this.props} />
              <DifferenceTemperature {...this.props} />
              <SingleResult {...this.props} />
              <HeatMap {...this.props} />
              <AllFans {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
