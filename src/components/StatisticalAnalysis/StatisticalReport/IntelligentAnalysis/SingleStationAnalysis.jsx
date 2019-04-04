import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import SingleStationAnalysisSearch from './SingleStationAnalysisSearch';


class SingleStationAnalysis extends Component{

  static propTypes = {
    stationCode: PropTypes.array,
  };

  constructor(props){
    super(props);
  }

  render(){

    return(
      <div className={styles.SingleStationAnalysis}>
        <SingleStationAnalysisSearch {...this.props} />
      </div>
    )
  }
}

export default SingleStationAnalysis;