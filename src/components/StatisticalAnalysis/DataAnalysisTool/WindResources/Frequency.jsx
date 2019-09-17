import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './resources.scss';
import FrequencyChart from './FrequencyChart';
import FrequencyModal from './FrequencyModal';

class Frequency extends Component{
  static propTypes = {
    getFrequency: PropTypes.func,
    changeWindResourcesStore: PropTypes.func,
    getBigFrequency: PropTypes.func,
    frequencyData: PropTypes.array,
    deviceList: PropTypes.array,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
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

  likeStatusChange = (index, bool) => {
    const { deviceList, changeWindResourcesStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeWindResourcesStore({ deviceList });
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
