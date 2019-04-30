import React from "react";
import PropTypes from "prop-types";
import styles from "./faultSingleFan.scss";
import PreTemperature from "../DiagnoseCharts/PreTemperature/PreTemperature";
import AfterTemperature from "../DiagnoseCharts/AfterTemperature/AfterTemperature";
import DifferenceTemperature from "../DiagnoseCharts/DifferenceTemperature/DifferenceTemperature";
import SingleResult from "../DiagnoseCharts/SingleResult/SingleResult";
import HeatMap from "../DiagnoseCharts/HeatMap/HeatMap";
import AllFans from "../DiagnoseCharts/AllFans/AllFans";
import FaultNavList from "./FaultNavList/FaultNavList";


export default class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    stations: PropTypes.object,
    singleStationCode: PropTypes.string,
    data: PropTypes.array,
    getFaultInfo: PropTypes.func,
    faultInfo: PropTypes.object,
    warnId: PropTypes.number,
    stationDeviceList:PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { getFaultInfo } = this.props;
    // 读取localStorage
    const taskId = localStorage.getItem("taskId");
    const params = {
      taskId
    };
    getFaultInfo(params);
  }


  render() {
    const {
      faultInfo: {
        stationName
      },
      stationDeviceList,
      warnId
    } = this.props;
    const deviceName = localStorage.getItem("deviceName");
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.title}>
          <span>{`${stationName || ""}`}</span>
          <span>{`：${deviceName || ""}`}</span>
        </div>
        <div className={styles.singleFanWrap}>
          <div className={styles.singleFanContent}>
            <FaultNavList {...this.props} />
            <div className={styles.singleFanContentCharts}>
              <PreTemperature {...this.props} />
              <AfterTemperature {...this.props} />
              <DifferenceTemperature {...this.props} />
              {(warnId ? warnId === 1 : stationDeviceList[0].warnId) && ([
                <SingleResult key="singleResult" {...this.props} />,
                <HeatMap key="heatMap" {...this.props} />,
                <AllFans key="allFans" {...this.props} />
              ])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
