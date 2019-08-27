import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './sequenceStyles.scss';
import SequenceChart from './SequenceChart';
import { downloadFile } from '../../../../utils/utilFunc';
import SequenceModal from './SequenceModal';
import toZip from '../../../../utils/js-zip';
import { message } from 'antd';
class SequenceChartContainer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newSrcUrl: [],
      srcObj: {},
      isShowModal: false,
      currentImgIndex: 0,

    };
  }
  componentWillReceiveProps(nextProps) {
    const { stationCode, startTime, endTime, xPointCode, yPointCode } = nextProps;
    const isChangeStationCode = stationCode !== this.props.stationCode;
    const isChangeStartTime = startTime !== this.props.startTime;
    const isChangeEndTime = endTime !== this.props.endTime;
    const isChangeXcode = xPointCode !== this.props.xPointCode;
    const isChangeYcode = yPointCode !== this.props.yPointCode;
    if (isChangeStationCode || isChangeStartTime || isChangeEndTime || isChangeXcode || isChangeYcode) {//改变电站清空图片地址
      this.setState({
        newSrcUrl: [],
        srcObj: {},
      });
    }
    if (nextProps.down && this.props.down !== nextProps.down) {
      // this.state.newSrcUrl.forEach((e, i) => {
      //   downloadFile(`${e.title}`, e.src);
      // });
      if (this.state.newSrcUrl.length === nextProps.deviceList.length) {
        const { stations, stationCode, pointCodeNameX, pointCodeNameY } = this.props;
        const stationArr = stations.filter(e => e.stationCode === stationCode)[0];
        const { stationName } = stationArr;
        toZip(this.state.newSrcUrl, `${stationName}-${pointCodeNameX}vs${pointCodeNameY}`);
      } else {
        message.warning('图片未全部加载完成');
      }

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

  likeStatusChange = (index, bool, sequenceData) => {
    const { deviceList, changeSquenceStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeSquenceStore({ deviceList, sequenceData });
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
  hideImg = () => {
    this.setState({
      isShowModal: false,
    });
  }
  showImg = (index) => {
    const { deviceList } = this.props;
    this.setState({
      isShowModal: true,
      currentImgIndex: index,
    });
    const deviceFullCode = deviceList[index].deviceFullCode;
    this.queryData(deviceFullCode);

  }
  changeCurrentImgIndex = (index) => {
    const { deviceList } = this.props;
    const deviceFullCode = deviceList[index].deviceFullCode;
    this.setState({
      currentImgIndex: index,
    });
    this.queryData(deviceFullCode);
  }

  queryData = (value) => {
    const { getBigSequenceData, pointY1, pointY2, startTime, endTime } = this.props;
    getBigSequenceData({
      deviceFullCode: value,
      pointY1,
      pointY2,
      startTime,
      endTime,
      interval: 10,
    });

  }

  render() {
    const { deviceList } = this.props;
    const { currentImgIndex, isShowModal } = this.state;
    return (
      <div className={styles.chartsContainer}>
        {deviceList.map((e, i) => {
          return (
            <div className={styles.chartStyle} key={i}>
              <div className={styles.sequenceChart} >
                <SequenceChart
                  {...this.props}
                  saveBtn={e.likeStatus}
                  deviceFullCode={e.deviceFullCode}
                  index={i}
                  showImg={this.showImg}
                  deviceName={e.deviceName}
                  saveImgUrl={this.saveImgUrl}
                  likeStatusChange={this.likeStatusChange} />
              </div>

            </div>
          );
        })}
        {
          <SequenceModal
            {...this.props}
            isShowModal={isShowModal}
            hideImg={this.hideImg}
            currentImgIndex={currentImgIndex}
            changeCurrentImgIndex={this.changeCurrentImgIndex}
            likeStatusChange={this.likeStatusChange}
          />
        }

      </div>
    );
  }
}
export default (SequenceChartContainer)
  ;
