import React,{ Component } from "react";
import PropTypes from 'prop-types';
import styles from './intelligentAnalysis.scss';
import AreaStationSearch from './AreaStationSearch';
// import AreaStationReport from './AreaStationReport';

class AreaStation extends Component{
  static propTypes = {
    // reportShow: PropTypes.bool,
  }

  constructor(props){
    super(props);
  }

  render(){
    // const { reportShow } = this.props;
    return(
      <div className={styles.areaStation}>
        <AreaStationSearch {...this.props} />
        {/* { reportShow && <AreaStationReport {...this.props} /> } */}
      </div>
    )
  }
}

export default AreaStation;