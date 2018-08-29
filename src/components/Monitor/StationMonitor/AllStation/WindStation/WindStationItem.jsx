import React from "react";
import PropTypes from "prop-types";
import styles from './windStation.scss';
import { Progress } from "antd";
import { Link } from 'react-router-dom';


class WindStationItem extends React.Component {
  static propTypes = {
    stationDataList: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context)
  }
  render() {
    const { stationDataList } = this.props;

    return (
      <div>
        <div className={styles.stationCardContainer}>
          {
            stationDataList.map((item, index) => {
              // item.stationStatus.stationStatus==='900'

              return (

                <div className={item.stationStatus.stationStatus === '900' ? styles.stationTest : styles.stationCard} key={index}>
                  <Link to={`/monitor/singleStation/${item.stationCode}`} key={item.stationCode}>
                    <div className={styles.stationCardTitle}>
                      <div className={styles.stationName}>{item.stationName}</div>
                      {item.stationStatus.stationStatus === '500' ? <i className="iconfont icon-outage"></i> : ''}
                    </div>
                    <div className={styles.stationCardProgress}>
                      <Progress percent={item.stationPower / item.stationCapacity * 100} showInfo={false} />
                    </div>
                    <div className={styles.stationCardValue}>
                      <div className={styles.stationMark}>{item.stationPower}MW</div>
                      <div>{item.stationCapacity}MW</div>
                    </div>
                    <div className={styles.stationCardWindSpeed}>{item.instantaneous}m/s</div>
                  </Link>
                  <div className={styles.stationCardEquipmentNum}>
                    <Link to={`/monitor/singleStation/${item.stationCode}`} key={item.stationCode}>
                    <div>{item.stationCapacity}台</div>
                    </Link>
                    {item.alarmNum > 0 ? <Link to={`monitor/singleStation/${item.stationCode}`} key={item.stationCode}><div className={styles.stationWarning}>
                      <i className="iconfont icon-alarm1"></i>{item.alarmNum}</div></Link> : ''}
                    {/*  <div className={styles.stationWarning}>⚠{item.alarmNum}</div> */}
                  </div>
                </div>

              )

            })
          }


        </div>

      </div>
    )
  }
}
export default WindStationItem;
