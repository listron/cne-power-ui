import React from 'react';
import PropTypes from 'prop-types';
import styles from './dataAnalysisStyle.scss';
import ScatterContainer from './ScatterContainer';
import HandleSeacher from './HandleSeacher';

class SingleStationScatter extends React.Component {
  static propTypes = {
    resetStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props, context) {
    super(props, context);
  }
  // componentWillUnmount() {
  //   this.props.resetStore();
  // }
  render() {
    const { theme } = this.props;
    // console.log('scatterData: ', this.props.scatterData);
    return (
      <div className={`${styles.singleStationBox} ${styles[theme]}`}>
        <HandleSeacher {...this.props} />
        <div className={styles.scatterBox}>
          <ScatterContainer {...this.props} />
        </div>
      </div>
    );
  }
}



export default (SingleStationScatter);
