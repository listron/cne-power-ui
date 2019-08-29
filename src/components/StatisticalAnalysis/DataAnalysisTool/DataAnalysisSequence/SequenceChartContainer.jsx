import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import styles from './sequenceStyles.scss';
import SequenceChart from './SequenceChart';
import SequenceModal from './SequenceModal';
import toZip from '../../../../utils/js-zip';
import { message } from 'antd';
import moment from 'moment';

class SequenceChartContainer extends React.Component {
  static propTypes = {

    down: PropTypes.bool,
    saveBtn: PropTypes.bool,
    stationCode: PropTypes.number,
    deviceList: PropTypes.array,
    stations: PropTypes.array,
    sequenceData: PropTypes.object,
    getSequenceData: PropTypes.func,
    likeStatusChange: PropTypes.func,
    getBigSequenceData: PropTypes.func,
    changeSquenceStore: PropTypes.func,
    pointY1: PropTypes.string,
    pointY2: PropTypes.string,
    activeCode: PropTypes.string,
    theme: PropTypes.string,
    showImg: PropTypes.func,
    deviceName: PropTypes.string,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    xPointCode: PropTypes.string,
    yPointCode: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    xyValueLimit: PropTypes.object,
  }
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
    if (this.state.newSrcUrl.length >= nextProps.deviceList.length - 1) {//控制是否可以下载图片
      this.props.changeSquenceStore({
        isClick: true,
      });
    } else {
      this.props.changeSquenceStore({
        isClick: false,
      });
    }
    if (nextProps.down && this.props.down !== nextProps.down) {
      if (this.state.newSrcUrl.length === nextProps.deviceList.length) {
        const { stations, stationCode, pointCodeNameX, pointCodeNameY, startTime, endTime } = this.props;
        const sTime = moment(startTime).format('YYYY-MM-DD');
        const eTime = moment(endTime).format('YYYY-MM-DD');
        const stationArr = stations.filter(e => e.stationCode === stationCode)[0];
        const { stationName } = stationArr;
        toZip(this.state.newSrcUrl, `${stationName}-${pointCodeNameX}&${pointCodeNameY}-${sTime}_${eTime}`, `${pointCodeNameX}&${pointCodeNameY}`);
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
    return true;
  }

  likeStatusChange = (index, bool, sequenceData) => {
    const { deviceList, changeSquenceStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeSquenceStore({ deviceList, sequenceData });
  };
  likeStatusChange2 = (index, bool) => {
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
  hideImg = () => {
    this.setState({
      isShowModal: false,
    });
  }
  //如果参数中有当前风机数据怕影响数据源
  showImg = (index) => {
    const { deviceList } = this.props;
    this.setState({
      isShowModal: true,
      currentImgIndex: index,
    });
    this.props.changeSquenceStore({ curBigChartData: {} });
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
            likeStatusChange={this.likeStatusChange2}
          />
        }

      </div>
    );
  }
}
export default (SequenceChartContainer)
  ;
