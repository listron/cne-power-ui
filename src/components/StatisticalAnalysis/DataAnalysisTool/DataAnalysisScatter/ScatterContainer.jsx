import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import SingleScatter from './SingleScatter';
import SingleStationModal from './SingleStationModal';
import toZip from '../../../../utils/js-zip';
class ScatterContainer extends React.PureComponent {
  static propTypes = {
    scatterData: PropTypes.object,
    newSrcUrl: PropTypes.array,
    srcObj: PropTypes.object,
    changeToolStore: PropTypes.func,
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
    if (nextProps.stationCode !== this.props.stationCode) {//改变电站清空图片地址
      this.setState({
        newSrcUrl: [],
        srcObj: {},
      });
    }
    if (nextProps.down && this.props.down !== nextProps.down) {
      const { stations, stationCode, pointCodeNameX, pointCodeNameY } = this.props;
      const stationArr = stations.filter(e => e.stationCode === stationCode)[0];
      const { stationName } = stationArr;
      toZip(this.state.newSrcUrl, `${stationName}-${pointCodeNameX}vs${pointCodeNameY}`);
      this.props.changeToolStore({ down: false });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if ((nextState.newSrcUrl !== this.state.newSrcUrl) || (nextState.srcObj !== this.state.srcObj)) {
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
