import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Switch, Icon, Radio } from 'antd';
import DateFilter from './DateFilter';
import StationTypeFilter from './StationTypeFilter';
import StationFilter from './StationFilter';
import DeviceTypeFilter from './DeviceTypeFilter';
import DefectLevelFilter from './DefectLevelFilter';
import DefectTypeFilter from './DefectTypeFilter';
import FilteredItems from './FilteredItems';
import styles from './filterCondition.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class FilterCondition extends Component {
  static propTypes = {
    stations: PropTypes.object,//电站列表
    defectTypes: PropTypes.object,//缺陷类型列表
    deviceTypes: PropTypes.object,//设备类型列表 
    stationType: PropTypes.string,
    stationCodes: PropTypes.string, 
    defectLevel: PropTypes.string,	  
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string, 
    deviceTypeCode: PropTypes.string,
    defectTypeCode: PropTypes.string,
    handleUser: PropTypes.string,
    username: PropTypes.string,
    status: PropTypes.string,
    onChangeFilter: PropTypes.func,
    defectStatusStatistics: PropTypes.object
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
    const { username } = this.props;
    this.props.onChangeFilter({
      handleUser: value ? username : ''
    });
  }

  onChangeTab = (e) => {
    this.props.onChangeFilter({
      status: e.target.value
    });
  }
  
  render() {
    const { showFilter } = this.state;
    const { stations } = this.props;
    const isOneType = stations.groupBy(item=>item.get('stationType')).size === 1;
    return (
      <div className={styles.defectFilter}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          <Button onClick={()=>this.onFilterShowChange('time')}>
            发生时间{showFilter==='time'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          {!isOneType && <Button onClick={()=>this.onFilterShowChange('stationType')}>
            电站类型{showFilter==='stationType'?<Icon type="up" />:<Icon type="down" />}
          </Button>}
          <Button onClick={()=>this.onFilterShowChange('stationName')}>
            电站名称{showFilter==='stationName'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('deviceType')}>
            设备类型{showFilter==='deviceType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('defectLevel')}>
            缺陷级别{showFilter==='defectLevel'?<Icon type="up" />:<Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('defectType')}>
            缺陷类型{showFilter==='defectType'?<Icon type="up" />:<Icon type="down" />}
          </Button>
        </div>
        {/* 删选的组件  */}
        {/* <div className={styles.filterBox}>
          {showFilter==='time' && <DateFilter {...this.props} />}
          {showFilter==='stationType' && <StationTypeFilter {...this.props} />}
          {showFilter==='stationName' && <StationFilter {...this.props} />}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} />}
          {showFilter==='defectLevel' && <DefectLevelFilter {...this.props} />}
          {showFilter==='defectType' && <DefectTypeFilter {...this.props} />}
        </div>       */}
        {/* 删选条件 */}
        {/* <FilteredItems {...this.props} /> */}
      </div>
    );
  }

}

export default FilterCondition;