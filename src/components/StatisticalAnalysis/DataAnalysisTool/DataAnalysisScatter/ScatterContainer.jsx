import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import SingleScatter from './SingleScatter';
import SingleStationModal from './SingleStationModal';
import toZip from '../../../../utils/js-zip';
import { message } from 'antd';
import moment from 'moment';
class ScatterContainer extends React.PureComponent {
  static propTypes = {
    scatterData: PropTypes.object,
    newSrcUrl: PropTypes.array,
    stations: PropTypes.array,
    srcObj: PropTypes.object,
    changeToolStore: PropTypes.func,
    stationCode: PropTypes.number,
    xPointCode: PropTypes.string,
    yPointCode: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    down: PropTypes.bool,
    deviceList: PropTypes.array,
    pointCodeNameX: PropTypes.string,
    pointCodeNameY: PropTypes.string,
    getBigScatterData: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      imageListShow: false,
      currentImgIndex: 0,
      newSrcUrl: [],
      srcObj: {},
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
      this.props.changeToolStore({
        isClick: true,
      });
    } else {
      this.props.changeToolStore({
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
        toZip(this.state.newSrcUrl, `${stationName}-${pointCodeNameX}vs${pointCodeNameY}-${sTime}_${eTime}`, `${pointCodeNameX}vs${pointCodeNameY}`);
      } else {
        message.warning('图片未全部加载完成');
      }
      this.props.changeToolStore({ down: false });


    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if ((nextState.newSrcUrl !== this.state.newSrcUrl) || (nextState.srcObj !== this.state.srcObj)) {
      return false;
    }
    if (JSON.stringify(nextProps.xyValueLimit) !== JSON.stringify(this.props.xyValueLimit)) {
      return false;
    }
    return true;
  }
  saveImgUrl = (title, src) => {//存储批量下载图片的编码
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
      imageListShow: false,
    });
  }
  showImg = (index, scatterData) => {

    this.setState({
      imageListShow: true,
      currentImgIndex: index,
    });
    this.props.changeToolStore({
      bigScatterData: scatterData,
    });

  }
  changeCurrentImgIndex = (index) => {
    this.setState({
      currentImgIndex: index,
    });

    const { getBigScatterData, deviceList, stationCode, xPointCode, yPointCode, startTime, endTime } = this.props;
    const params = { stationCode, xPointCode, yPointCode, startTime, endTime };
    const deviceFullCode = deviceList[index].deviceFullCode;

    getBigScatterData({
      ...params,
      deviceFullCode,
    });
  }
  likeChange = (index, bool, scatterData) => {
    const { deviceList, changeToolStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeToolStore({ deviceList, scatterData });
  };

  render() {
    const { scatterData, deviceList } = this.props;
    const { currentImgIndex, imageListShow } = this.state;

    return (
      <div className={styles.chartsContainer}>
        {deviceList.map((e, i) => {
          // const data = this.props[e.deviceFullCode];
          return (
            <div className={styles.chartStyle} key={e.deviceFullCode}>
              <div className={styles.scatterChart} >
                <SingleScatter
                  {...this.props}
                  key={e.deviceFullCode}
                  deviceFullCode={e.deviceFullCode}
                  index={i}
                  saveBtn={e.likeStatus}
                  title={e.deviceName}
                  showImg={this.showImg}
                  saveImgUrl={this.saveImgUrl}
                  onChange={this.likeChange}
                />
              </div>
            </div>
          );
        }
        )}
        {
          <SingleStationModal
            {...this.props}
            data={scatterData}
            imageListShow={imageListShow}
            hideImg={this.hideImg}
            currentImgIndex={currentImgIndex}
            changeCurrentImgIndex={this.changeCurrentImgIndex}
            likeChange={this.likeChange}
          />
        }
      </div>
    );
  }
}
export default (ScatterContainer);
