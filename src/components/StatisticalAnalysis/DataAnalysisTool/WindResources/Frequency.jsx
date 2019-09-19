import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './resources.scss';
import FrequencyChart from './FrequencyChart';
import FrequencyModal from './FrequencyModal';
import toZip from '../../../../utils/js-zip';
import { message } from 'antd';
import moment from 'moment';

class Frequency extends Component{
  static propTypes = {
    changeWindResourcesStore: PropTypes.func,
    getBigFrequency: PropTypes.func,
    frequencyData: PropTypes.array,
    deviceList: PropTypes.array,
    stations: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    deviceName: PropTypes.string,
    stationCode: PropTypes.number,
    down: PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      newSrcUrl: [],
      srcObj: {},
      isShowModal: false,
      currentImgIndex: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { stationCode, startTime, endTime } = nextProps;
    const isChangeStationCode = stationCode !== this.props.stationCode;
    const isChangeStartTime = startTime !== this.props.startTime;
    const isChangeEndTime = endTime !== this.props.endTime;
    if (isChangeStationCode || isChangeStartTime || isChangeEndTime) {//改变电站清空图片地址
      this.setState({
        newSrcUrl: [],
        srcObj: {},
      });
    }
    if (this.state.newSrcUrl.length >= nextProps.deviceList.length - 1) {//控制是否可以下载图片
      this.props.changeWindResourcesStore({
        isClick: true,
      });
    } else {
      this.props.changeWindResourcesStore({
        isClick: false,
      });
    }
    if (nextProps.down && this.props.down !== nextProps.down) {
      if (this.state.newSrcUrl.length === nextProps.deviceList.length) {
        const { stations, stationCode, startTime, endTime, deviceList } = this.props;
        const sTime = moment(startTime).format('YYYY-MM-DD');
        const eTime = moment(endTime).format('YYYY-MM-DD');
        const stationArr = stations.filter(e => e.stationCode === stationCode)[0];
        const { stationName } = stationArr;
        const fileName = `【${stationName}】风速&风能频率图【${sTime}】_【${eTime}】`;
        const childFileName = `风速&风能频率图`;
        toZip(this.state.newSrcUrl, fileName, childFileName, deviceList);
      } else {
        message.warning('图片未全部加载完成');
      }
      this.props.changeWindResourcesStore({ down: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((nextState.newSrcUrl !== this.state.newSrcUrl) || (nextState.srcObj !== this.state.srcObj)) {
      return false;
    }
    return true;
  }

  likeStatusChange = (index, bool, frequencyData) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeWindResourcesStore({ deviceList, frequencyData });
  };

  likeStatusChange2 = (index, bool) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeWindResourcesStore({ deviceList });
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
    this.props.changeWindResourcesStore({ curBigChartData: [] });
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
    const { getBigFrequency, startTime, endTime } = this.props;
    getBigFrequency({
      startTime,
      endTime,
      deviceFullCode: value,
    });
  }

  render(){
    const { deviceList } = this.props;
    const { isShowModal, currentImgIndex } = this.state;
    return(
      <div className={styles.frequency}>
        {deviceList.map((e, i) => {
          return (
            <div className={styles.chartStyle} key={i}>
              <div className={styles.frequencyBox}>
                <FrequencyChart
                  {...this.props}
                  saveBtn={e.likeStatus}
                  deviceFullCode={e.deviceFullCode}
                  deviceName={e.deviceName}
                  index={i}
                  likeStatusChange={this.likeStatusChange}
                  saveImgUrl={this.saveImgUrl}
                  showImg={this.showImg}
                />
                </div>
            </div>
          );
        })}

        {
          <FrequencyModal
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
export default Frequency;
