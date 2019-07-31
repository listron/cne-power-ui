import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';


class DataAnalysisAllStation extends React.Component {
  static propTypes = {
    stationCode: PropTypes.num,
    stations: PropTypes.array,
    changeToolStore: PropTypes.func,

  }
  constructor(props, context) {
    super(props, context);
  }
  selectStation = (stationCode) => {
    this.props.changeToolStore({ stationCode, showPage: 'singleStation' });
  }
  render() {
    const { stations } = this.props;
    console.log('stations: ', stations);
    const dataList = stations.filter(e => e.stationType === 0);
    return (
      <div className={styles.allstationBox}>
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
export default (DataAnalysisAllStation)
  ;
