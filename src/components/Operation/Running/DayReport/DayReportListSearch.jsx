

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './dayReportAll.scss';
import { DatePicker, Select, Radio } from 'antd';
import moment from 'moment';
import CneInputSearch from "@components/Common/Power/CneInputSearch";
const { MonthPicker } = DatePicker;
const { Option } = Select;

//部门主页面。部门查询组件，分页及表格组件；
class DayReportListSearch extends Component {
  static propTypes = {
    startTime: PropTypes.string,
    stationType: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number, 
    regionName: PropTypes.string,
    stationNameSort: PropTypes.number, 
    stations: PropTypes.array,
    getDayReportList: PropTypes.func,
    keyword: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  startTimeChange = (value) => {
    const startTime = value?value.format('YYYY-MM'):moment().format('YYYY-MM');
    const { getDayReportList, stationType, stationNameSort, pageSize, pageNum, regionName  } = this.props;
    const params = { stationType, stationNameSort, pageSize, pageNum, regionName };
    getDayReportList({
      ...params,
      startTime,
    });
  }

  /*
  regionSelect = (value) => {
    const { getDayReportList, stationType, stationNameSort, pageSize, startTime  } = this.props;
    let params = { stationType, stationNameSort, pageSize, startTime };
    getDayReportList({ ...params, pageNum: 1, regionName: value });
  }

  stationTypeChange = (e) => {
    const { getDayReportList, stationNameSort, pageSize, startTime, regionName } = this.props;
    let params = { stationNameSort, pageSize, startTime, regionName };
    getDayReportList({ ...params, pageNum: 1, stationType: e.target.value });
  }
  */

  disabledDate = (start) => {
    return start && start > moment();
  }

  doSearch = (str) => {
    const { getDayReportList, stationType, stationNameSort, pageSize, startTime, regionName } = this.props;
    let params = { stationNameSort, pageSize, startTime, regionName, stationType };
    getDayReportList({ ...params, pageNum: 1, keyword: str });
  }

  render() {
    const { startTime, stations, regionName, stationType } = this.props;
    let regionSet = new Set(), stationTypeSet = new Set();
    stations.forEach(e=>{
      e.regionName && regionSet.add(e.regionName);
      stationTypeSet.add(e.stationType);
    });
    // const showTypeChangeButtonGroup = stationTypeSet.size > 1; // 两种类型电站以上，才显示电站类型选择
    return (
      <div className={styles.search}>
        <div>
          <span>条件查询</span>
          <MonthPicker 
            value={startTime?moment(startTime):null} 
            className={styles.monthSearch} 
            onChange={this.startTimeChange} 
            disabledDate={this.disabledDate} 
          />
        </div>
        <CneInputSearch 
          placeholder="电站类型／区域／电站名称"
          onSearch = {this.doSearch}
        />
        {/* <Select onChange={this.regionSelect} placeholder="区域" value={!regionName? undefined: regionName} className={styles.regionSearch} >
          <Option value={null}>全部</Option>
          {[...regionSet].map(e=>(
            <Option value={e} key={e}>{e}</Option>
          ))}
        </Select>
        {showTypeChangeButtonGroup && <span>
          <span>电站类型</span>
          <Radio.Group value={stationType} onChange={this.stationTypeChange} className={styles.typeSearch} >
            <Radio.Button value={2}>全部</Radio.Button>
            <Radio.Button value={0}>风电</Radio.Button>
            <Radio.Button value={1}>光伏</Radio.Button>
          </Radio.Group>
        </span>} */}
      </div>
      
    )
  }
}

export default DayReportListSearch;
