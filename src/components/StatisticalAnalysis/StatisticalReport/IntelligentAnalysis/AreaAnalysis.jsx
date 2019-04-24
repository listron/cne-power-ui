import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import AreaAnalysisSearch from'./AreaAnalysisSearch';
import AreaAnalysisReport from'./AreaAnalysisReport';

class AreaAnalysis extends Component{

  static propTypes = {
    reportShow: PropTypes.bool,
  };

  render(){
    const { reportShow } = this.props;
    return(
      <div className={styles.areaAnalysis}>
        <AreaAnalysisSearch {...this.props} />
        { reportShow ? <AreaAnalysisReport {...this.props} /> : <div className={styles.nodata} ><img src="/img/nodata.png" /></div> }
      </div>
    )
  }
}

export default AreaAnalysis;