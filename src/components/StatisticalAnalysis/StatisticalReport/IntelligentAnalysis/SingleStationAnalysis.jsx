import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import SingleStationAnalysisSearch from './SingleStationAnalysisSearch';
import SingleStationAnalysisReport from './SingleStationAnalysisReport';

class SingleStationAnalysis extends Component{

  static propTypes = {
  };

  constructor(props){
    super(props);
  }

  render(){

    return(
      <div className={styles.SingleStationAnalysis}>
        <SingleStationAnalysisSearch {...this.props} />
        <SingleStationAnalysisReport {...this.props} />
      </div>
    )
  }
}

export default SingleStationAnalysis;