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
    match: PropTypes.object,
    stations: PropTypes.object,
    stationCode: PropTypes.string,
    singleStationCode: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  stationName = () => {
    const {
      stations,
      match:{
        params: {
          stationCode
        }
      },
    } = this.props;
    const stationItems = stations && stations.toJS();
    const stationItem = stationItems.filter(e => (e.stationCode === +stationCode))[0];
    return stationItem.stationName;
  };


  render() {
    const algorithmName = localStorage.getItem("algorithmName");
    return (
      <div className={styles.faultAllFan}>
        <div className={styles.title}>
          <span>{`${this.stationName()}：`}</span><span>{algorithmName}</span>
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
