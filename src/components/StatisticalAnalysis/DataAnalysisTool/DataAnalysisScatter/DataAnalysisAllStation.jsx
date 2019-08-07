import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';


class DataAnalysisAllStation extends React.Component {
  static propTypes = {

    stations: PropTypes.array,
    changeToolStore: PropTypes.func,
    getScatterName: PropTypes.func,
    getScatterData: PropTypes.func,

  }
  constructor(props, context) {
    super(props, context);
  }
  selectStation = (stationCode) => {
    this.props.changeToolStore({ stationCode, showPage: 'singleStation' });
    this.props.getScatterName({ stationCode });
    this.props.getScatterData({
      'stationCode': 82,
      'startTime': '2019-01-10T02:37:05Z',
      'endTime': '2019-01-10T05:37:05Z',
      'xPointCode': 'GN010',
      'yPointCode': 'GN011',
    });
  }
  render() {
    const { stations, theme } = this.props;
    const dataList = stations.filter(e => e.stationType === 0);
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


