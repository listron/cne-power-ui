import React from 'react';
import PropTypes from 'prop-types';
import { styles } from './dataAnalysisStyle.scss';
import SingleScatter from './SingleScatter';

class ScatterContainer extends React.Component {
  static propTypes = {
    scatterData: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const { scatterData } = this.props;
    console.log('this.props: ', this.props);
    return (
      <React.Fragment>
        {scatterData.map((e, i) => {
          return (<SingleScatter {...this.props} title={e.deviceName} chartData={e.chartData} />);
        })}


      </React.Fragment>
    );
  }
}
export default (ScatterContainer)
  ;
