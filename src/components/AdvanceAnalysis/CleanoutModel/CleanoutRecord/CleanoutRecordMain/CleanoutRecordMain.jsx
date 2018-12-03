

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




class CleanoutRecordMain extends Component { // 电站管理列表页
  static propTypes = {

  }
  static defaultProps = {
    value: {
      startTime: moment().format('YYYY-MM-DD'), // 默认今年
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.value.startTime,
      panelOpen: false,
      showFilter: '',
    }
  }
  onYearSelect = ({ selectedYear }) => { // 选择年份
    const { changeCleanoutRecordStore } = this.props;
    changeCleanoutRecordStore({ startTime: selectedYear })

  }
  onOpenChange = (panelOpen) => { // 面板开关控制
    this.setState({ panelOpen });
  }

  onPanelChange = value => {
    this.setState({ panelOpen: false });
    this.onYearSelect({ selectedYear: value.format('YYYY') }) // 输出年份字符串。
  }
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: ''
      })
    } else {
      this.setState({
        showFilter: filterText
      })
    }
  }

  render() {
    const { startTime, stations } = this.props;
  
    const { panelOpen, showFilter } = this.state;


    return (
      <div className={styles.cleanoutRecordMain}>
        <div className={styles.topFilter}>
          <span>  筛选条件:</span>
          <div className={styles.timeFilter}>
            <DatePicker
              placeholder="选择年"
              format="YYYY年"
              mode="year"
              value={startTime ? moment(startTime) : null}
              open={panelOpen}
              onOpenChange={this.onOpenChange}
              onPanelChange={this.onPanelChange}
            /></div>
          <Button onClick={() => this.onFilterShowChange('stationName')}>
            电站名称{showFilter === 'stationName' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
        </div>
        <div className={styles.filterBox}>
          {showFilter === 'stationName' && <StationFilter {...this.props} />}
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
