import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import SingleScatter from './SingleScatter';
import SingleStationModal from './SingleStationModal';
import toZip from '../../../../utils/js-zip';
class ScatterContainer extends React.Component {
  static propTypes = {
    scatterData: PropTypes.array,
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
  showImg = (index) => {
    this.setState({
      imageListShow: true,
      currentImgIndex: index,
    });
  }
  changeCurrentImgIndex = (index) => {
    this.setState({
      currentImgIndex: index,
    });

  }

  likeChange = (index, bool) => {
    // console.log('index', index, bool);
    const { deviceList, changeToolStore } = this.props;
    deviceList[index].likeStatus = bool;
    changeToolStore({ deviceList });
  };

  render() {
    const { scatterData, deviceList } = this.props;
    const { currentImgIndex, imageListShow } = this.state;
    return (
      <div className={styles.chartsContainer}>
        {deviceList.map((e, i) =>
          (
            <div className={styles.chartStyle} key={i}>
              <div className={styles.scatterChart} >
                <SingleScatter
                  {...this.props}
                  key={i}
                  index={i}
                  saveBtn={e.likeStatus}
                  id={e.deviceName}
                  title={e.deviceName}
                  chartData={scatterData[i]}
                  showImg={this.showImg}
                  saveImgUrl={this.saveImgUrl}
                  onChange={this.likeChange}
                />
              </div>
            </div>
          )
        )}
        {/* <span ref={'date'}></span> */}
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
