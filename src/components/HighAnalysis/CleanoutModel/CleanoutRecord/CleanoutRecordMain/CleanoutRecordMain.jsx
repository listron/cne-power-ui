

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Button, Icon } from 'antd';
// import StationManageSearch from './StationManageSearch';
// import StationManageTable from './StationManageTable';
import styles from './cleanoutRecordMain.scss';
import CleanoutRecordTable from './CleanoutRecordTable';
import moment from 'moment';
import StationFilter from './StationFilter';
import Pagination from '../../../../../components/Common/CommonPagination/index';
import FilterCondition from '../../../../Common/FilterCondition/FilterCondition';

class CleanoutRecordMain extends Component { // 电站管理列表页
  static propTypes = {
  }
 
  constructor(props) {
    super(props);
    this.state = {
      panelOpen: false,
      showFilter: '',
    }
  }

  filterCondition = (change) => {
    console.log('change', change)
    const{changeCleanoutRecordStore,stationCodes}=this.props;
    changeCleanoutRecordStore({stationCodes:change.stationCodes})
  }

  render() {
    const { stations } = this.props;
    const { showFilter } = this.state;
    return (
      <div className={styles.cleanoutRecordMain}>
        <div className={styles.topFilter}>
          <FilterCondition
            option={['stationName',]}
            stations={stations}
            onChange={this.filterCondition}
          />
        </div>
      
        <div className={styles.paginationStyle}>
          <Pagination />
        </div>
        <CleanoutRecordTable {...this.props} />
      </div>
    )
  }
}

export default CleanoutRecordMain;

  // onFilterShowChange = (filterText) => {
  //   const { showFilter } = this.state;
  //   if (showFilter === filterText) {
  //     this.setState({
  //       showFilter: ''
  //     })
  //   } else {
  //     this.setState({
  //       showFilter: filterText
  //     })
  //   }
  // }