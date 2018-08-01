import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {  Button, Switch, Icon } from 'antd';
import DateFilter from './DateFilter';
import StationTypeFilter from './StationTypeFilter';
import StationsFilter from './StationsFilter';
import DeviceTypeFilter from './DeviceTypeFilter';
import DefectLevelFilter from './DefectLevelFilter';
import FilteredItems from './FilteredItems';
import styles from './defectFilter.scss';

class DefectTable extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    defectSource: PropTypes.string,   
    defectLevel: PropTypes.string,	  
    timeInterval: PropTypes.string,
    status: PropTypes.string, 
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    defectTypeCode: PropTypes.string,
    userName: PropTypes.string,
    sort: PropTypes.string,
    getDefectList: PropTypes.func,
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
  onUserSelect = (value) => {
    this.props.getDefectList({
      stationType: this.props.stationType,
      stationCodes: this.props.stationCodes,
      defectSource: this.props.defectSource, 
      defectLevel: this.props.defectLevel,
      timeInterval: this.props.timeInterval,
      status: this.props.status,
      pageNum: this.props.pageNum + 1,
      pageSize: this.props.pageSize,
      createTimeStart: this.props.createTimeStart,
      createTimeEnd: this.props.createTimeEnd,
      deviceTypeCode: this.props.deviceTypeCode,
      defectTypeCode: this.props.defectTypeCode,
      handleUser: value?this.props.userName:'',
      sort: this.props.sort,
    });
  }
  

  render() {
    const { showFilter } = this.state;
    const listQueryParams = {
      stationType: this.props.stationType,
      stationCodes: this.props.stationCodes,
      defectSource: this.props.defectSource, 
      defectLevel: this.props.defectLevel,
      timeInterval: this.props.timeInterval,
      status: this.props.status,
      pageNum: this.props.pageNum + 1,
      pageSize: this.props.pageSize,
      createTimeStart: this.props.createTimeStart,
      createTimeEnd: this.props.createTimeEnd,
      deviceTypeCode: this.props.deviceTypeCode,
      defectTypeCode: this.props.defectTypeCode,
      handleUser: this.props.userName,
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
          <Button onClick={()=>this.onFilterShowChange('defectLevel')}>
            缺陷级别{showFilter==='defectLevel'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <span>
            <Switch onChange={this.onUserSelect} /><span>我参与的</span>
          </span>
        </div>
        <div className={styles.filterBox}>
          {showFilter==='time' && <DateFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='stationType' && <StationTypeFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='stationName' && <StationsFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} listQueryParams={listQueryParams} />}
          {showFilter==='defectLevel' && <DefectLevelFilter {...this.props} listQueryParams={listQueryParams} />}
        </div>
        <FilteredItems {...this.props} listQueryParams={listQueryParams} />
      </div>
    );
  }

}

export default DefectTable;