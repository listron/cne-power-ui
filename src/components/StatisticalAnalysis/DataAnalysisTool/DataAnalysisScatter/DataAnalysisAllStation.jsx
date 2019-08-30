import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';


class DataAnalysisAllStation extends React.Component {
  static propTypes = {
    stations: PropTypes.array,
    changeToolStore: PropTypes.func,
    getScatterName: PropTypes.func,
    getStationDevice: PropTypes.func,
    theme: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context);
  }
  selectStation = (stationCode) => {
    const { changeToolStore, getScatterName, getStationDevice } = this.props;
    changeToolStore({ stationCode, showPage: 'singleStation' });
    getScatterName({ stationCode });
    getStationDevice({ stationCode });

  }
  render() {
    const { stations, theme } = this.props;
    const dataList = stations.filter(e => (e.stationType === 0 && e.isConnected === 1));
    return (
      <div className={`${styles.allstationBox}  ${styles[theme]} `}>
        <div className={styles.boxtitle}>风电站列表<span>(点击查看电站散点图)</span></div>
        <div className={styles.boxcard}>
          {dataList.map((e, i) => (
            <div className={styles.stationCard} key={e.stationCode} onClick={(() => this.selectStation(e.stationCode))}>{e.stationName}</div>
          ))}
        </div>
      </div >
    );
  }
}
export default (DataAnalysisAllStation);


