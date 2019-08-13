import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import SequenceChart from './SequenceChart';

class SequenceChartContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  likeStatusChange = (index, bool) => {
    // console.log('index', index, bool);
    const { deviceList, changeSquenceStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeSquenceStore({ deviceList });
  };
  render() {
    const { deviceList, sequenceData } = this.props;
    console.log('sequenceData: ', sequenceData);
    return (
      <div className={styles.chartsContainer}>
        {deviceList.map((e, i) => (
          <div className={styles.chartStyle} key={i}>
            <div className={styles.sequenceChart} >
              {/* <img src={e.likeStatus ? '/img/mark.png' : '/img/unmark.png'} alt="" /> */}
              <SequenceChart
                {...this.props}
                saveBtn={e.likeStatus}
                allChartData={sequenceData[i]}
                index={i}
                deviceName={e.deviceName}
                likeStatusChange={this.likeStatusChange} />
            </div>
            <div></div>
          </div>
        ))}
      </div>
    );
  }
}
export default (SequenceChartContainer)
  ;
