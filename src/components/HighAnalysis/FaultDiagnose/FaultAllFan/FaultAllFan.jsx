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
    faultInfo: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      faultInfo: {
        algorithmName,
        status,
        stationName
      }
    } = this.props;
    return (
      <div className={styles.faultAllFan}>
        <div className={styles.title}>
          <span>{`${stationName || ""}`}</span>
          <span>{`：${algorithmName || ""}`}</span>
        </div>
        <div className={styles.allFanWrap}>
          <div className={styles.allFanContent}>
            <FaultAllFanTop {...this.props} />
            {status && status === 4 ?
                <div className={styles.noData}>
                  <img src="/img/nodata.png" style={{ width: 223, height: 164 }} />
                </div> : [
                <FaultNavList key="faultNavList" {...this.props} />,
                <div key="allFanContentCharts" className={styles.allFanContentCharts}>
                  <PreTemperature {...this.props} />
                  <AfterTemperature {...this.props} />
                  <DifferenceTemperature {...this.props} />
                  <SingleResult {...this.props} />
                  <HeatMap {...this.props} />
                  <AllFans {...this.props} />
                </div>
              ]}
          </div>
        </div>
      </div>
    );
  }
}
