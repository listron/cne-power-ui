


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BaseInfo, ValueInfo } from './PointInfo';
import PointChart from './PointChart';
import styles from './point.scss';

class PointsList extends PureComponent{
  static propTypes = {
    theme: PropTypes.string,
    pointsLoading: PropTypes.bool,
    pointsData: PropTypes.array,
    pointList: PropTypes.array,
  }
// histogram: "[[0.0, 15.0, 0.1034], [15.0, 30.0, 0.1034], [30.0, 45.0, 0.1034], [45.0, 60.0, 0.0], [60.0, 75.0, 0.0517], [75.0, 90.0, 0.1034], [90.0, 105.0, 0.1552], [105.0, 120.0, 0.069], [120.0, 135.0, 0.0345], [135.0, 150.0, 0.0], [150.0, 165.0, 0.0], [165.0, 180.0, 0.0], [180.0, 195.0, 0.0172], [195.0, 210.0, 0.0172], [210.0, 225.0, 0.2414]]"
  render(){
    const { pointsData = [], pointsLoading, theme, pointList } = this.props;
    return(
      <div className={styles.pointsList}>
        {pointsData.map(e => {
          const { histogram } = e;
          let histogramList = [];
          try {
            histogramList = JSON.parse(histogram) || [];
          } catch(err){
            console.log(err);
          }
          const { unit } = pointList.find(m => m.value === e.pointCode) || {};
          return (
            <div key={e.pointCode} className={styles.pointColumn}>
              <BaseInfo {...e} unit={unit} />
              <PointChart histogramList={histogramList} pointsLoading={pointsLoading} theme={theme} />
              <ValueInfo {...e} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default PointsList;
