import React from 'react';
import PropTypes from 'prop-types';
import styles from './sequenceStyles.scss';
import SequenceChart from './SequenceChart';
import { downloadFile } from '../../../../utils/utilFunc';
class SequenceChartContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newSrcUrl: [],
      srcObj: {},

    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.down && this.props.down !== nextProps.down) {
      this.state.newSrcUrl.forEach((e, i) => {
        downloadFile(`${e.title}`, e.src);
      });
      this.props.changeSquenceStore({ down: false });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {

    if ((nextState.newSrcUrl !== this.state.newSrcUrl) || (nextState.srcObj !== this.state.srcObj)) {
      return false;
    }
    if (nextProps.deviceList !== this.props.deviceList || (nextProps.sequenceChart !== this.props.sequenceChart)) {
      return true;
    }
    return true;
  }

  likeStatusChange = (index, bool) => {
    const { deviceList, changeSquenceStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeSquenceStore({ deviceList });
  };
  saveImgUrl = (title, src) => {
    const { srcObj } = this.state;
    const newSrcUrl = [];
    const srcArr = [];
    srcArr.push({ title, src });
    srcArr.forEach((e, i) => {
      srcObj[e.title] = e.src;
    });
    for (var item in srcObj) {
      newSrcUrl.push({ title: item, src: srcObj[item] });
    }
    this.setState({
      newSrcUrl: newSrcUrl,
      srcObj: srcObj,
    });
  }

  render() {
    const { deviceList, sequenceData } = this.props;
    return (
      <div className={styles.chartsContainer}>
        {deviceList.map((e, i) => (
          <div className={styles.chartStyle} key={i}>
            <div className={styles.sequenceChart} >
              <SequenceChart
                {...this.props}
                saveBtn={e.likeStatus}
                allChartData={sequenceData[i]}
                index={i}
                deviceName={e.deviceName}
                saveImgUrl={this.saveImgUrl}
                likeStatusChange={this.likeStatusChange} />
            </div>
            <div>

            </div>
          </div>
        ))}

      </div>
    );
  }
}
export default (SequenceChartContainer)
  ;
