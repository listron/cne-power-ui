import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';

class SequenceAllStation extends React.Component {
  static propTypes = {
    changeSquenceStore: PropTypes.func,
    getSequenceName: PropTypes.func,
    getStationDevice: PropTypes.func,
    stations: PropTypes.array,
    theme: PropTypes.string,
    resetStore: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
  }

  selectStation = (stationCode) => {
    const { changeSquenceStore, getStationDevice, getSequenceName } = this.props;
    changeSquenceStore({ stationCode, showPage: 'singleStation' });
    getStationDevice({ stationCode, queryName: true });
    // getSequenceName({ stationCode });
  }
  render() {
    const { stations, theme } = this.props;
    const dataList = stations.filter(e => (e.stationType === 0 && e.isConnected === 1));
    return (
      <div className={`${styles.allstationBox}  ${styles[theme]}`}>
        <div className={styles.boxtitle}>风电站列表<span>(点击查看电站时序图)</span></div>
        <div className={styles.boxcard}>
          {dataList.map((e, i) => (
            <div className={styles.stationCard} key={e.stationCode} onClick={(() => this.selectStation(e.stationCode))}>{e.stationName}</div>
          ))}
        </div>
      </div >
    );
  }
}
export default (SequenceAllStation);
