import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './station.scss';

class StationList extends PureComponent{
  static propTypes = {
    // tab: PropTypes.string,
    // pages: PropTypes.array,
    // history: PropTypes.object,
    // changeOverviewStore: PropTypes.func,
    stations: PropTypes.array,
  }

  checkStation = (e) => {
    const { code } = e.target.dataset;
    if (code) {
      console.log(code);
    }
  }

  render(){
    const { stations } = this.props;
    return(
      <div className={styles.list} onClick={this.checkStation}>
        {stations.map((e, i) => (
          <span key={e.stationCode} data-code={e.stationName} className={styles.eachStation}>{e.stationName || '--'}</span>
        ))}
      </div>
    );
  }
}

export default StationList;
