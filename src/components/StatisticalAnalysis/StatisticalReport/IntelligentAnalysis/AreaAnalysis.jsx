import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import AreaAnalysisSearch from'./AreaAnalysisSearch';


class AreaAnalysis extends Component{

  static propTypes = {
    reportShow: PropTypes.bool,
  };

  constructor(props){
    super(props);
  }

  render(){
    const { reportShow } = this.props;
    return(
      <div className={styles.areaAnalysis}>
        <AreaAnalysisSearch {...this.props} />
      </div>
    )
  }
}

export default AreaAnalysis;