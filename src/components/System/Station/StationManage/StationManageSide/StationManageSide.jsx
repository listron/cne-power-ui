
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationSide.scss';
import StationManageDetail from './StationManageDetail';
import StationManageEdit from './StationManageEdit';
import Footer from '../../../../Common/Footer';

class StationManageSide extends Component {
  static propTypes = {
    showSidePage: PropTypes.string,
    changeStationManageStore: PropTypes.func,
  }

  constructor(props){
    super(props);
  }

  render(){
    const { showSidePage } = this.props;
    return (
      <div className={styles.stationManageSide}>
        <StationManageDetail {...this.props} />
        {/* { showSidePage === 'detail' && <StationManageDetail {...this.props} /> }
        { showSidePage === 'edit' && <StationManageEdit {...this.props} /> } */}
        <Footer />
      </div>
    )
  }
}

export default StationManageSide;
