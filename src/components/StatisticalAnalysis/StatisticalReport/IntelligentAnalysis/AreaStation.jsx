import React,{ Component } from "react";
import styles from './intelligentAnalysis.scss';
import AreaStationSearch from './AreaStationSearch';
import AreaStationReport from './AreaStationReport';

class AreaStation extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className={styles.areaStation}>
        <AreaStationSearch {...this.props} />
        <AreaStationReport {...this.props} />
      </div>
    )
  }
}

export default AreaStation;