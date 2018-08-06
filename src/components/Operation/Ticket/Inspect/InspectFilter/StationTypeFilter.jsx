import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectFilter.scss';

class StationTypeFilter extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    listQueryParams: PropTypes.object,
    getInspectList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  selectStationType = (stationType) => {
    this.props.getInspectList({
      ...this.props.listQueryParams,
      stationType,
    });
  }

  render() {
    //	电站类型(0:风电，1光伏，2：全部)
    const { stationType } = this.props;
    return (
      <div className={styles.stationTypeFilter}>
        <span onClick={()=>this.selectStationType('2')} className={styles.all } >不限</span>
        <span onClick={()=>this.selectStationType('1')} className={styles.pv} >光伏</span>
        <span onClick={()=>this.selectStationType('0')} className={styles.wind} >风电</span>
      </div>
    );
  }

}

export default StationTypeFilter;