


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BaseInfo, ValueInfo } from './PointInfo';
import styles from './point.scss';

console.log()
class PointsList extends PureComponent{
  static propTypes = {
    // history: PropTypes.object,
    pointsData: PropTypes.array,
    // pointTopData: PropTypes.object,
    // pointConnectedDevices: PropTypes.array,
    // pointList: PropTypes.array,
    // deviceListUnix: PropTypes.number,
    // pointUnix: PropTypes.number,
    // pointParam: PropTypes.object,
    // pointsCheckedList: PropTypes.array,
    // // devicesData: PropTypes.object,
    // // deveiceLoading: PropTypes.bool,
    // // deviceCheckedList: PropTypes.array,
    // changeOverviewStore: PropTypes.func,
    // getOverviewStation: PropTypes.func,
    // getConnectedDevices: PropTypes.func,
    // getOverviewPoints: PropTypes.func,
    // getPoints: PropTypes.func,
  }
// histogram: "[[0.0, 15.0, 0.1034], [15.0, 30.0, 0.1034], [30.0, 45.0, 0.1034], [45.0, 60.0, 0.0], [60.0, 75.0, 0.0517], [75.0, 90.0, 0.1034], [90.0, 105.0, 0.1552], [105.0, 120.0, 0.069], [120.0, 135.0, 0.0345], [135.0, 150.0, 0.0], [150.0, 165.0, 0.0], [165.0, 180.0, 0.0], [180.0, 195.0, 0.0172], [195.0, 210.0, 0.0172], [210.0, 225.0, 0.2414]]"
  render(){
    const { pointsData = [] } = this.props;
    return(
      <div className={styles.pointsList}>
        {pointsData.map(e => {
          return (
            <div key={e.pointCode} className={styles.pointColumn}>
              <BaseInfo {...e} />

              <ValueInfo {...e} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default PointsList;
