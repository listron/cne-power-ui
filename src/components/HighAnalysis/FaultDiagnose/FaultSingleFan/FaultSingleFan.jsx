import React from 'react';
import PropTypes from 'prop-types';
import styles from './faultSingleFan.scss';
import PreTemperature from '../DiagnoseCharts/PreTemperature/PreTemperature';
import AfterTemperature from '../DiagnoseCharts/AfterTemperature/AfterTemperature';
import DifferenceTemperature from '../DiagnoseCharts/DifferenceTemperature/DifferenceTemperature';
import SingleResult from '../DiagnoseCharts/SingleResult/SingleResult';
import HeatMap from '../DiagnoseCharts/HeatMap/HeatMap';
import AllFans from '../DiagnoseCharts/AllFans/AllFans';
import FaultNavList from './FaultNavList/FaultNavList';


export default class FaultSingleFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    stations: PropTypes.object,
    singleStationCode: PropTypes.string,
    getFaultInfo: PropTypes.func,
    faultInfo: PropTypes.object,
    warnId: PropTypes.number,
  };

  render() {
    const {
      faultInfo: {
        stationName,
      },
      warnId,
    } = this.props;
    const deviceName = localStorage.getItem('deviceName');
    return (
      <div className={styles.faultSingleFan}>
        <div className={styles.title}>
          <span>{`${stationName || ''}`}</span>
          <span>{`：${deviceName || ''}`}</span>
        </div>
        <div className={styles.singleFanWrap}>
          <div className={styles.singleFanContent}>
            <FaultNavList {...this.props} />
            <div className={styles.singleFanContentCharts}>
              <PreTemperature {...this.props} />
              <AfterTemperature {...this.props} />
              <DifferenceTemperature {...this.props} />
              {(warnId === 1) && ([
                <SingleResult key="singleResult" {...this.props} />,
                <HeatMap key="heatMap" {...this.props} />,
                <AllFans key="allFans" {...this.props} />,
              ])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
