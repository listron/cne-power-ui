import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './dataAnalysisStyle.scss';
import SingleScatter from './SingleScatter';

class ScatterContainer extends React.Component {
  static propTypes = {
    scatterData: PropTypes.array,
    newSrcUrl: PropTypes.array,
    srcObj: PropTypes.object,
  }
  constructor(props, context) {
    super(props, context);


  }
  saveImgUrl = (title, src) => {
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
  render() {
    const { scatterData, newSrcUrl } = this.props;

    return (
      <React.Fragment>
        {scatterData.map((e, i) => {
          return (<SingleScatter key={i} {...this.props} title={e.deviceName} chartData={e.chartData} saveImgUrl={this.saveImgUrl} />);
        })}
      </React.Fragment>
    );
  }
}
export default (ScatterContainer)
  ;
