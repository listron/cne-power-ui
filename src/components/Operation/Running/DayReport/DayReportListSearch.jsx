

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './dayReportAll.scss';
import { DatePicker, Select, Radio } from 'antd';
import moment from 'moment';
const { MonthPicker } = DatePicker;
const { Option } = Select;

//部门主页面。部门查询组件，分页及表格组件；
class DayReportListSearch extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    stationType: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number, 
    regionCode: PropTypes.number,
    stationNameSort: PropTypes.number, 
    stations: PropTypes.array,
    getDayReportList: PropTypes.func,
  }

  constructor(props) {
    super(props);
  }

  startTimeChange = (value) => {
    console.log(value);
    const startTime = value?value.format('YYYY-MM'):moment().format('YYYY-MM');
    const { getDayReportList, stationType, stationNameSort, pageSize, pageNum, regionCode  } = this.props;
    getDayReportList({
      startTime,
      pageSize, 
      pageNum,
      stationType,
      stationNameSort,
      regionCode,
    });
  }

  regionSelect = (value) => {
    const { getDayReportList, stationType, stationNameSort, pageSize, pageNum, startTime  } = this.props;
    getDayReportList({
      startTime,
      pageSize, 
      pageNum,
      stationType,
      stationNameSort,
      regionCode: value
    });
  }

  stationTypeChange = (e) => {
    const { getDayReportList, stationNameSort, pageSize, pageNum, startTime, regionCode } = this.props;
    getDayReportList({
      startTime,
      pageSize, 
      pageNum,
      stationType: e.target.value,
      stationNameSort,
      regionCode
    });
  }

  disabledDate = (start) => {
    return start && start > moment();
  }

  render() {
    const { startTime, stations, regionCode, stationType } = this.props;
    let regionArr = [], regionSet = new Set(), stationTypeSet = new Set();
    stations.forEach(e=>{
      !regionSet.has(e.regionCode) && regionSet.add(e.regionCode) && regionArr.push({
        regionCode: e.regionCode,
        regionName: e.regionName,
      });
      stationTypeSet.add(e.stationType);
    });
    const showTypeChangeButtonGroup = stationTypeSet.size > 1; // 两种类型电站以上，才显示电站类型选择
    return (
      <div className={styles.search}>
        <span>条件查询</span>
        <MonthPicker value={moment(startTime)} className={styles.monthSearch} onChange={this.startTimeChange} disabledDate={this.disabledDate} format="YYYY[年]MM[月]" />
        <Select onChange={this.regionSelect} value={regionCode} className={styles.regionSearch} >
          <Option value={null}>全部</Option>
          {regionArr.map(e=>(
            <Option value={e.regionCode}>{e.regionName}</Option>
          ))}
        </Select>
        {showTypeChangeButtonGroup && <span>
          <span>电站类型</span>
          <Radio.Group value={stationType} onChange={this.stationTypeChange} className={styles.typeSearch} >
            <Radio.Button value={2}>全部</Radio.Button>
            <Radio.Button value={0}>风电</Radio.Button>
            <Radio.Button value={1}>光伏</Radio.Button>
          </Radio.Group>
        </span>}
      </div>
      
    )
  }
}

export default DayReportListSearch;
