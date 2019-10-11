import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import toZip from '@utils/js-zip';
import {message} from 'antd';
import SingleWindRose from './SingleWindRose.jsx';
import WindRoseModal from './WindRoseModal.jsx';

import styles from './windRose.scss';
export default class WindRose extends Component{
  static propTypes = {
    deviceList: PropTypes.array,
    changeWindResourcesStore: PropTypes.func,
    stationCode: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    stations: PropTypes.array,
    down: PropTypes.bool,
    getBigDirections: PropTypes.func,
  };

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
        const fileName = `${stationName}风向风能玫瑰图${sTime.split('-').join('')}_${eTime.split('-').join('')}`;
        const childFileName = '风向&风能玫瑰图';
        toZip(this.state.newSrcUrl, fileName, childFileName, deviceList);
      } else {
        message.warning('图片未全部加载完成');
      }
      this.props.changeWindResourcesStore({ down: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !((nextState.newSrcUrl !== this.state.newSrcUrl) || (nextState.srcObj !== this.state.srcObj));
  }

  hideImg = () => {
    this.setState({
      isShowModal: false,
    });
  };

  changeCurrentImgIndex = (index) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    const deviceFullCode = deviceList[index].deviceFullCode;
    this.setState({
      currentImgIndex: index,
    });
    // 清空放大玫瑰图数据
    changeWindResourcesStore({ bigWindRoseData: [] });
    this.queryData(deviceFullCode);
  };

  likeSmallChange = (index, bool, directionsData) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeWindResourcesStore({ deviceList, directionsData });
  };

  likeBigChange = (index, bool, bigWindRoseData) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeWindResourcesStore({ deviceList, directionsData: bigWindRoseData });
  };

  saveImgUrl = (title, src) => {
    const { srcObj } = this.state;
    const newSrcUrl = [];
    const srcArr = [];
    srcArr.push({ title, src });
    srcArr.forEach((e, i) => {
      srcObj[e.title] = e.src;
    });
    for (const item in srcObj) {
      newSrcUrl.push({ title: item, src: srcObj[item] });
    }
    this.setState({
      newSrcUrl: newSrcUrl,
      srcObj: srcObj,
    });
  };

  showImg = (index) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    this.setState({
      isShowModal: true,
      currentImgIndex: index,
    });
    // 清空放大玫瑰图数据
    changeWindResourcesStore({ bigWindRoseData: [] });
    const deviceFullCode = deviceList[index].deviceFullCode;
    this.queryData(deviceFullCode);
  };

  queryData = (value) => {
    const { getBigDirections, startTime, endTime } = this.props;
    getBigDirections({
      startTime,
      endTime,
      deviceFullCode: value,
    });
  };

  render(){
    const { deviceList } = this.props;
    const { isShowModal, currentImgIndex } = this.state;
    return(
      <div className={styles.windRoseBox}>
        <div className={styles.chartsContainer}>
          {deviceList && deviceList.map((cur, index) => {
            return (
              <div className={styles.chartStyle} key={index.toString()}>
                <div className={styles.windRoseChart} >
                  <SingleWindRose
                    {...this.props}
                    saveBtn={cur.likeStatus}
                    deviceFullCode={cur.deviceFullCode}
                    deviceName={cur.deviceName}
                    index={index}
                    likeStatusChange={this.likeSmallChange}
                    saveImgUrl={this.saveImgUrl}
                    showImg={this.showImg}
                  />
                </div>
              </div>
            );
          })}
          <WindRoseModal
            {...this.props}
            isShowModal={isShowModal}
            hideImg={this.hideImg}
            currentImgIndex={currentImgIndex}
            changeCurrentImgIndex={this.changeCurrentImgIndex}
            likeStatusChange={this.likeBigChange}
          />
        </div>
      </div>
    );
  }
}
