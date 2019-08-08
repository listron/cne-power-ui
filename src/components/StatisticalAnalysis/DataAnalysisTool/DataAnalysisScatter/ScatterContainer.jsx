import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import SingleScatter from './SingleScatter';
import SingleStationModal from './SingleStationModal';

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
    };
  }
  saveImgUrl = (title, src) => {//存储批量下载图片的编码
    const srcArr = [];
    const newSrcUrl = [];
    const { srcObj } = this.props;
    srcArr.push({ title, src });
    srcArr.forEach((e, i) => {
      srcObj[e.title] = e.src;
    });
    for (var item in srcObj) {
      newSrcUrl.push({ title: [item], src: srcObj[item] });
    }
    this.props.changeToolStore({
      newSrcUrl, srcObj,
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
    console.log('index: ', index);
    this.setState({
      currentImgIndex: index,
    });

  }

  likeChange = (index, bool) => {
    // console.log('index', index, bool);
    const { scatterData, changeToolStore } = this.props;
    scatterData[index].likeStatus = bool;
    changeToolStore({ scatterData });
  };

  render() {
    const { scatterData } = this.props;
    console.log('scatterData: ', scatterData);
    const { currentImgIndex, imageListShow } = this.state;
    return (
      <React.Fragment>
        {scatterData.map((e, i) => {
          return (<SingleScatter
            {...this.props}
            key={i}
            index={i}
            saveBtn={e.likeStatus}
            id={e.deviceName}
            title={e.deviceName}
            chartData={e.chartData}
            showImg={this.showImg}
            saveImgUrl={this.saveImgUrl}
            onChange={this.likeChange}
          />);
        })}
        <span ref={'date'}></span>
        {
          <SingleStationModal
            {...this.props}
            data={scatterData}
            imageListShow={imageListShow}
            hideImg={this.hideImg}
            currentImgIndex={currentImgIndex}
            changeCurrentImgIndex={this.changeCurrentImgIndex}
            onChange={this.likeChange}
          />

        }
      </React.Fragment>
    );
  }
}
export default (ScatterContainer)
  ;
