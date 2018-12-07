import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Switch, Icon, Radio } from 'antd';
import DateFilter from './DateFilter';
import StationTypeFilter from './StationTypeFilter';
import StationFilter from './StationFilter';
import DeviceTypeFilter from './DeviceTypeFilter';
import DefectLevelFilter from './DefectLevelFilter';
import DefectSourceFilter from './DefectSourceFilter';
import DefectTypeFilter from './DefectTypeFilter';
import FilteredItems from './FilteredItems';
import styles from './filterCondition.scss';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/** 
 * 1 stations 判断电站类型和电站名称
 * 2 deviceType 判断设备类型
 * 3 defectType 缺陷类型
 * 4 defectLevelName 选填 缺陷级别分类
 * 5 defectSourceName 选填 缺陷来源分类
*/
class FilterCondition extends Component {
  static propTypes = {
    stations: PropTypes.array,//电站列表
    defectTypes: PropTypes.array,//缺陷类型列表
    deviceTypes: PropTypes.array,//设备类型列表 
    stationType: PropTypes.array,
    stationCodes: PropTypes.array,
    defectLevel: PropTypes.array,
    defectLevelName: PropTypes.array,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.array,
    defectTypeCode: PropTypes.array,
    defectSourceName: PropTypes.array,
    handleUser: PropTypes.string,
    username: PropTypes.string,
    onChange: PropTypes.func,
    option: PropTypes.array,// 需要的方式
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      createTimeEnd: '', //结束时间
      createTimeStart: '', //  开始时间
      stationType: '2', // 电站类型
      stationCodes: [], //所选电站
      defectLevel: [], //缺陷级别
      defectSource: [], // 缺陷来源
      deviceTypeCode: [], // 设备类型
      defectTypeCode: [],//缺陷类型
    };
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

  onChangeFilter = (change) => {
    this.setState((state) => {
      return {
        state,
        ...change
      }
    })
    const { onChange } = this.props;
    onChange && onChange({ ...change })
  }

  getDefaultName = (type) => {
    let result = "";
    switch (type) {
      case 'time': result = '发生时间'; break;
      case 'stationType': result = '电站类型'; break;
      case 'stationName': result = '电站名称'; break;
      case 'deviceType': result = '设备类型'; break;
      case 'defectLevel': result = '缺陷级别'; break;
      case 'defectType': result = '缺陷类型'; break;
      case 'defectSource': result = '缺陷来源'; break;
      case 'belongMatrixs': result = '所属方阵'; break;
    }
    return result
  }



  render() {
    const { showFilter, createTimeStart, createTimeEnd, stationType, stationCodes, defectLevel, defectSource, deviceTypeCode, defectTypeCode } = this.state;
    const { stations, option, deviceTypes, defectTypes, defectSourceName, defectLevelName } = this.props;
    const defectTypesArr = defectTypes || [];
    const stationsArr = stations || [];
    const deviceTypesArr = deviceTypes || []
    // const isOneType = stations.groupBy(item=>item.get('stationType')).size === 1;
    const isOneType = false;
    return (
      <div className={styles.filterCondition}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          {
            option.map((item, index) => {
              if (item === 'stationType') { // 该设备下之后一种电站 不显示电站类型
                return (!isOneType && <Button onClick={() => this.onFilterShowChange(item)} key={index}>
                  {this.getDefaultName(item)}{showFilter === 'stationType' ? <Icon type="up" /> : <Icon type="down" />}
                </Button>)
              } else {
                return (<Button onClick={() => this.onFilterShowChange(item)} key={index} >
                  {this.getDefaultName(item)}{showFilter === item ? <Icon type="up" /> : <Icon type="down" />}
                </Button>)
              }
            })
          }
        </div>
        {/* 删选的组件  */}
        <div className={styles.filterBox}>
          {showFilter === 'time' &&
            <DateFilter
              onChangeFilter={this.onChangeFilter}
              createTimeStart={createTimeStart}
              createTimeEnd={createTimeEnd}
            />}
          {showFilter === 'stationType' &&
            <StationTypeFilter
              stationType={stationType}
              onChangeFilter={this.onChangeFilter}
            />}
          {showFilter === 'stationName' &&
            <StationFilter
              stationCodes={stationCodes}
              onChangeFilter={this.onChangeFilter}
              stations={stationsArr}
            />}
          {showFilter === 'defectLevel' &&
            <DefectLevelFilter
              defectLevel={defectLevel}
              onChangeFilter={this.onChangeFilter}
              defectLevelName={defectLevelName}
            />}

          {showFilter === 'defectSource' &&
            <DefectSourceFilter
              defectSource={defectSource}
              onChangeFilter={this.onChangeFilter}
              defectSourceName={defectSourceName}
            />}

          {showFilter === 'deviceType' &&
            <DeviceTypeFilter
              deviceTypes={deviceTypesArr}
              deviceTypeCode={deviceTypeCode}
              onChangeFilter={this.onChangeFilter}
            />}
          {showFilter === 'defectType' &&
            <DefectTypeFilter {...this.props}
              defectTypes={defectTypesArr}
              defectTypeCode={defectTypeCode}
              onChangeFilter={this.onChangeFilter}
            />}
          {/* {showFilter === 'squareMatrix' &&
            <DefectTypeFilter {...this.props}
              defectTypes={defectTypesArr}
              defectTypeCode={defectTypeCode}
              onChangeFilter={this.onChangeFilter}
            />} */}
        </div>
        {/* 删选条件 */}
        <FilteredItems
          {...this.state}
          stations={stationsArr}
          deviceTypes={deviceTypesArr}
          defectTypes={defectTypesArr}
          onChangeFilter={this.onChangeFilter}
          defectSourceName={defectSourceName}
        />
      </div>
    );
  }

}

export default FilterCondition;