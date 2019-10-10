import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './station.scss';

class StationList extends PureComponent{
  static propTypes = {
    // tab: PropTypes.string,
    // pages: PropTypes.array,
    // history: PropTypes.object,
    stations: PropTypes.array,
    changeOverviewStore: PropTypes.func,
    getOverviewStation: PropTypes.func,
  }

  checkStation = (e) => {
    const { code } = e.target.dataset;
    if (code) {
      this.props.changeOverviewStore({
        stationParam: { stationCode: parseInt(code, 10) },
      });
      this.props.getOverviewStation({ // 电站信息;
        stationCode: code,
        pageKey: 'station',
      });
    }
  }

  render(){
    const { stations } = this.props;
    return(
      <div className={styles.list} onClick={this.checkStation}>
        {stations.filter(e => e.stationType === 0 && e.isConnected === 1).map((e, i) => (
          <span key={e.stationCode} data-code={e.stationCode} className={styles.eachStation}>{e.stationName || '--'}</span>
        ))}
      </div>
    );
  }
}

export default StationList;
