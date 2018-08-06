import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Button, Switch, Icon } from 'antd';
import DateFilter from './DateFilter';
import StationTypeFilter from './StationTypeFilter';
import StationsFilter from './StationsFilter';
import DeviceTypeFilter from './DeviceTypeFilter';
import FilteredItems from './FilteredItems';
import styles from './inspectFilter.scss';

class InspectFilter extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,   
    timeInterval: PropTypes.string,
    status: PropTypes.string, 
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    sort: PropTypes.string,
    hasAbnormal: PropTypes.bool,
    selfDefect: PropTypes.bool,
    getInspectList: PropTypes.func,
    userName: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
    };
  }
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if(showFilter === filterText){
      this.setState({
        showFilter: ''
      })
    }else{
      this.setState({
        showFilter: filterText
      })
    }
  }
  onUserSelect = (value) => {//check 我参与的
    this.props.getInspectList({
      stationType: this.props.stationType,
      stationCodes: this.props.stationCodes,
      timeInterval: this.props.timeInterval,
      status: this.props.status,
      pageNum: this.props.pageNum + 1,
      pageSize: this.props.pageSize,
      createTimeStart: this.props.createTimeStart,
      createTimeEnd: this.props.createTimeEnd,
      deviceTypeCode: this.props.deviceTypeCode,
      sort: this.props.sort,
      selfDefect: value,
      handleUser: value?this.props.userName:'',
      hasAbnormal: this.props.hasAbnormal,
    });
  }
  onabnormalSelect = (value) => {//check 是否异常
    this.props.getInspectList({
      stationType: this.props.stationType,
      stationCodes: this.props.stationCodes,
      timeInterval: this.props.timeInterval,
      status: this.props.status,
      pageNum: this.props.pageNum + 1,
      pageSize: this.props.pageSize,
      createTimeStart: this.props.createTimeStart,
      createTimeEnd: this.props.createTimeEnd,
      deviceTypeCode: this.props.deviceTypeCode,
      sort: this.props.sort,
      selfDefect: this.props.selfDefect,
      handleUser: this.props.selfDefect?this.props.userName:'',
      hasAbnormal: value,
    });
  }
  

  render() {
    const { showFilter } = this.state;
    const listQueryParams = {
      stationType: this.props.stationType,
      stationCodes: this.props.stationCodes,
      timeInterval: this.props.timeInterval,
      status: this.props.status,
      pageNum: this.props.pageNum + 1,
      pageSize: this.props.pageSize,
      createTimeStart: this.props.createTimeStart,
      createTimeEnd: this.props.createTimeEnd,
      deviceTypeCode: this.props.deviceTypeCode,
      selfDefect: this.props.selfDefect,
      handleUser: this.props.selfDefect?this.props.userName:'',
      sort: this.props.sort,
    }
    return (
      <div className={styles.defectFilter}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          <Button onClick={()=>this.onFilterShowChange('time')}>
            发生时间{showFilter==='time'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('stationType')}>
            电站类型{showFilter==='stationType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('stationName')}>
            电站名称{showFilter==='stationName'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('deviceType')}>
            设备类型{showFilter==='deviceType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <span>
            <Switch onChange={this.onUserSelect} /><span>我参与的</span>
          </span>
          <span>
            <Switch onChange={this.onabnormalSelect} /><span>有无异常</span>
          </span>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='time' && <DateFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='stationType' && <StationTypeFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='stationName' && <StationsFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} listQueryParams={listQueryParams} />}
        </div>
        <FilteredItems {...this.props} listQueryParams={listQueryParams} />
      </div>
    );
  }

}

export default InspectFilter;