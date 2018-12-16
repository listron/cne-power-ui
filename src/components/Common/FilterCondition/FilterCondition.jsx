import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Switch, Icon } from 'antd';
import DateFilter from './DateFilter';
import StationTypeFilter from './StationTypeFilter';
import StationFilter from './StationFilter';
import DeviceTypeFilter from './DeviceTypeFilter';
import BelongMatrixs from './BelongMatrixs';
import DefectLevelFilter from './DefectLevelFilter';
import DefectSourceFilter from './DefectSourceFilter';
import DefectTypeFilter from './DefectTypeFilter';
import FilteredItems from './FilteredItems';
import styles from './filterCondition.scss';

/** 
 * 1 type
 *    time   发生时间
      stationType  电站类型
      stationName  电站名称
      deviceType   设备类型
      defectLevel  缺陷级别
      defectType   缺陷类型
      defectSource  缺陷来源
      belongMatrixs  所属方阵
      myJoin  我参与的
 * 2 stations type=stationType || type=stationName 必填 其他为选填
 * 3 deviceTypes type=deviceType  必填 其他为选填
 * 4 defectTypes type=defectType   必填 其他为选填 
 * 5 defectLevelName  type=defectType  选填 缺陷级别分类 如果没有填 默认为 A／B／C
 * 6 defectSourceName  type=defectSource  选填 缺陷来源分类 如果没有填 默认为 '上报','巡检','告警', '预警',
 * 7 onChange 回调函数 
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
    matrixList: PropTypes.array, // 方阵列表
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
      belongMatrixs: [],//所属方阵
      handleUser: [], // 操作人
    };
  }

  onFilterShowChange = (filterText) => { //筛选出应该展示哪一个
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

  onUserSelect = (value) => { //  用户的切换
    const { username, onChange } = this.props;
    onChange && onChange({ handleUser: value ? username : '' })
  }


  onChangeFilter = (change) => { // 条件筛选的之后结果
    this.setState((state) => {
      return {
        state,
        ...change
      }
    })
    const { onChange } = this.props;
    onChange && onChange({ ...change })
  }

  getDefaultName = (type) => {  //匹配
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
      case 'myJoin': result = '参与的'; break;
    }
    return result
  }



  render() {
    const { showFilter, createTimeStart, createTimeEnd, stationType, stationCodes, defectLevel, defectSource, deviceTypeCode, defectTypeCode, belongMatrixs } = this.state;
    const { stations, option, deviceTypes, defectTypes, defectSourceName, defectLevelName, matrixList, username } = this.props;

    const defectTypesArr = defectTypes || [];
    const stationsArr = stations || [];
    const deviceTypesArr = deviceTypes || []
    const matrixListArr = matrixList || []
    const windStations = stations.map(e => e.stationType === 0);
    const pvStations = stations.map(e => e.stationType === 1)
    const hasSelectStation = windStations.length > 0 && pvStations.length > 0
    return (
      <div className={styles.filterCondition}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          {
            option && option.map((item, index) => {
              if (item === 'stationType') { // 该设备下之后一种电站 不显示电站类型
                return (hasSelectStation && <Button onClick={() => this.onFilterShowChange(item)} key={index}>
                  {this.getDefaultName(item)}{showFilter === 'stationType' ? <Icon type="up" /> : <Icon type="down" />}
                </Button>)
              }
              if (item === 'myJoin') {
                return (<div key={index}>
                  <Switch onChange={this.onUserSelect} /><span>我参与的</span>
                </div>)
              }
              return (<Button onClick={() => this.onFilterShowChange(item)} key={index} >
                {this.getDefaultName(item)}{showFilter === item ? <Icon type="up" /> : <Icon type="down" />}
              </Button>)
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
            <DefectTypeFilter
              defectTypes={defectTypesArr}
              defectTypeCode={defectTypeCode}
              onChangeFilter={this.onChangeFilter}

            />}
          {showFilter === 'belongMatrixs' &&
            <BelongMatrixs
              matrixList={matrixListArr}
              belongMatrixs={belongMatrixs}
              onChangeFilter={this.onChangeFilter}
            />}
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