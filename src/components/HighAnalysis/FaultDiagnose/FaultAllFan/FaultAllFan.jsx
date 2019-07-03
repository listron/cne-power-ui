import React from 'react';
import PropTypes from 'prop-types';
import styles from './faultAllFan.scss';
import PreTemperature from '../DiagnoseCharts/PreTemperature/PreTemperature';
import AfterTemperature from '../DiagnoseCharts/AfterTemperature/AfterTemperature';
import DifferenceTemperature from '../DiagnoseCharts/DifferenceTemperature/DifferenceTemperature';
import SingleResult from '../DiagnoseCharts/SingleResult/SingleResult';
import HeatMap from '../DiagnoseCharts/HeatMap/HeatMap';
import AllFans from '../DiagnoseCharts/AllFans/AllFans';
import FaultNavList from './FaultNavList/FaultNavList';
import FaultAllFanTop from './FaultAllFanTop/FaultAllFanTop';


export default class FaultAllFan extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    history: PropTypes.object,
    stations: PropTypes.object,
    stationCode: PropTypes.string,
    singleStationCode: PropTypes.string,
    faultInfo: PropTypes.object,
    warnId: PropTypes.number,
  };

  render() {
    const {
      faultInfo: {
        algorithmName,
        status,
        stationName,
      },
      warnId,
    } = this.props;
    const rightHandler = localStorage.getItem('rightHandler') || '';
    const roleDeleteRight = rightHandler.split(',').includes('analysis_turbineFDD_repeat');
    return (
      <div className={styles.faultAllFan}>
        <div className={styles.title}>
          <span>{`${stationName || ''}`}</span>
          <span>{`：${algorithmName || ''}`}</span>
        </div>
        <div className={styles.allFanWrap}>
          <div className={styles.allFanContent}>
            {roleDeleteRight && (<FaultAllFanTop {...this.props} />)}
            {status && status === 4 ?
                <div className={styles.noData}>
                  <img src="/img/nodata.png" style={{ width: 223, height: 164 }} />
                </div> : [
                <FaultNavList key="faultNavList" {...this.props} />,
                <div key="allFanContentCharts" className={styles.allFanContentCharts}>
                  <PreTemperature {...this.props} />
                  <AfterTemperature {...this.props} />
                  <DifferenceTemperature {...this.props} />
                  {(warnId === 1) && ([
                    <SingleResult key="singleResult" {...this.props} />,
                    <HeatMap key="heatMap" {...this.props} />,
                    <AllFans key="allFans" {...this.props} />,
                  ])}
                </div>,
              ]}
          </div>
        </div>
      </div>
    );
  }
}
