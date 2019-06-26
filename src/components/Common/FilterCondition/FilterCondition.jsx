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
import AlarmLevelFilter from './AlarmLevelFilter';
import WarningStatusFilter from './WarningStatusFilter';
import AlarmTypeFilter from './AlarmTypeFilter';
import RangeDateFilter from './RangeDateFilter';
import RangeEndTimeFilter from './RangeEndTimeFilter';
import DocketType from './DocketType';
import styles from './filterCondition.scss';

/** 
 * 1 option  选项  array  option=['time','stationType']
 *    time   发生时间         createTimeStart="2018-12-21" createTimeEnd="2018-12-29" 
      stationType  电站类型   返回的结果是 stationType ''不限 '0'风电 '1' 光伏  如果规定为2 需要手动在传参数的时候进行修改
      stationName  电站名称   返回的结果是 stationCodes=['360','380']
      deviceType   设备类型   返回的结果是 deviceTypeCode=['','']
      defectLevel  缺陷级别   返回的结果是 defectLevel=['1','2','3'], 一级／二级／三级 或者 A级 B级 C级
      defectType   缺陷类型   返回的结果是 defectTypeCode=['24','25']
      defectSource  缺陷来源  返回的结果是 defectSource=['0','1','2','3'] 0 告警 1 手动／上报 2 巡检 3 预警
      belongMatrixs  所属方阵 返回的结果是 belongMatrixs=['233','234'] 根据所选，用的是后台返回的所属方阵的编码
      warnLevel  告警级别     返回的结果是 warningLevel=['1','2','3','4']   一级／二级／三级/四级
      warnStatus  处理结果     返回的结果是 warningStatus=['1','2','3']   自动解除／手动接触／转工单
      warnType 告警类型       返回的结果是 warningConfigName=["事件告警"]  目前为止只有事件告警
      myJoin  我参与的        返回的结果是 handleUser='cneadmin'  当前用户
      rangeTime 发生时间      返回的结果是  rangTime=["2018-12-05T16:00:00.367Z","2019-01-15T15:59:59.367Z"]  utc时间
      endTime 结束时间      返回的结果是  endTime=["2018-12-05T16:00:00.367Z","2019-01-15T15:59:59.367Z"]  utc时间
 * 2 stations type=stationType || type=stationName 必填 其他为选填
 * 3 deviceTypes type=deviceType  必填 其他为选填
 * 4 defectTypes type=defectType   必填 其他为选填 
 * 5 defectLevelName  type=defectType  选填 缺陷级别分类 如果没有填 默认为 A／B／C
 * 6 defectSourceName  type=defectSource  选填 缺陷来源分类 如果没有填 默认为 '上报','巡检','告警', '预警',
 * 7 warnLevelName type=warnLevel 选填  高级级别  默认为 ['一级','二级','三级','四级']
 * 8 matrixList  所属方阵的列表
 * 9 onChange 回调函数 
 * 10 defaultValue 如果需要记录初始值，则需要传该参数  参数是选填的 需要什么参数，传什么参数
 * defaultValue={
 *    createTimeStart:'',  开始时间
 *    createTimeEnd:'',    结束时间
      stationType:'',      电站类型
      stationCodes:[],     电站编码
      deviceTypeCode:[],   设备类型
      defectLevel:[],      缺陷级别
      defectTypeCode:[],   缺陷类型
      defectSource:[],     缺陷来源
      belongMatrixs:[],    所属方阵
      warningLevel:[],     高级级别
      warningStatus:[],     处理结果
      warningConfigName:[],告警类型
      rangTime:[],         发生时间
      endTime:[],         结束时间
      handleUser:''        处理人
 * }
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
    warningLevelName: PropTypes.array, // 告警级别名字
    warningStatusName: PropTypes.array, // 处理结果的名字
    warningLevel: PropTypes.array, // 告警级别
    warningStatus: PropTypes.array, // 处理结果
    defaultValue: PropTypes.object, // 默认数据
    docketTypeList: PropTypes.array, // 两票
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      createTimeEnd: props.defaultValue && props.defaultValue.createTimeEnd || '', //结束时间
      createTimeStart: props.defaultValue && props.defaultValue.createTimeStart || '', //  开始时间
      stationType: props.defaultValue && props.defaultValue.stationType || '', // 电站类型
      stationCodes: props.defaultValue && props.defaultValue.stationCodes || [], //所选电站
      defectLevel: props.defaultValue && props.defaultValue.defectLevel || [], //缺陷级别
      defectSource: props.defaultValue && props.defaultValue.defectSource || [], // 缺陷来源
      deviceTypeCode: props.defaultValue && props.defaultValue.deviceTypeCode || [], // 设备类型
      defectTypeCode: props.defaultValue && props.defaultValue.defectTypeCode || [],//缺陷类型
      belongMatrixs: props.defaultValue && props.defaultValue.belongMatrixs || [],//所属方阵
      handleUser: props.defaultValue && props.defaultValue.handleUser || [], // 操作人
      warningLevel: props.defaultValue && props.defaultValue.warningLevel || [],//告警级别
      warningStatus: props.defaultValue && props.defaultValue.warningStatus || [],//
      warningConfigName: props.defaultValue && props.defaultValue.warningConfigName || [],//告警类型
      rangTime: props.defaultValue && props.defaultValue.rangTime || [],// 时间段
      endTime: props.defaultValue && props.defaultValue.endTime || [],// 结束时间段
      handleUser: props.defaultValue && props.defaultValue.handleUser || '',
      docketTypes: props.defaultValue && props.defaultValue.docketTypes || [],// 两票类型
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
      case 'alarmLevel': result = '告警级别'; break;
      case 'warningLevel': result = '预警级别'; break;
      case 'warningStatus': result = '处理结果'; break;
      case 'alarmType': result = '告警类型'; break;
      case 'myJoin': result = '参与的'; break;
      case 'rangeTime': result = '发生时间'; break;
      case 'endTime': result = '结束时间'; break;
      case 'docketType': result = '两票类型'; break;
      default: result = ""; break;
    }
    return result
  }



  render() {
    const { showFilter, createTimeStart, createTimeEnd, stationType, stationCodes, defectLevel, defectSource, deviceTypeCode, defectTypeCode, belongMatrixs, warningLevel, warningStatus, warningConfigName, rangTime, handleUser, endTime,docketTypes } = this.state;
    const { stations = [], option, deviceTypes = [], defectTypes = [], defectSourceName, defectLevelName, matrixList = [], username, warningLevelName, warningStatusName, docketTypeList = [] } = this.props;
    const windStations = stations.map(e => e.stationType === 0);
    const pvStations = stations.map(e => e.stationType === 1)
    const hasSelectStation = windStations.length > 0 && pvStations.length > 0;
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
                  <Switch onChange={this.onUserSelect} defaultChecked={!!handleUser} /><span>我参与的</span>
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
          {showFilter === 'rangeTime' &&
            <RangeDateFilter
              onChangeFilter={this.onChangeFilter}
              rangTime={rangTime}
            />}
          {showFilter === 'endTime' &&
            <RangeEndTimeFilter
              onChangeFilter={this.onChangeFilter}
              endTime={endTime}
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
              stations={stations}
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
              deviceTypes={deviceTypes}
              deviceTypeCode={deviceTypeCode}
              onChangeFilter={this.onChangeFilter}
            />}
          {showFilter === 'defectType' &&
            <DefectTypeFilter
              defectTypes={defectTypes}
              defectTypeCode={defectTypeCode}
              onChangeFilter={this.onChangeFilter}

            />}
          {showFilter === 'belongMatrixs' &&
            <BelongMatrixs
              matrixList={matrixList}
              belongMatrixs={belongMatrixs}
              onChangeFilter={this.onChangeFilter}
            />}
          {(showFilter === 'alarmLevel' || showFilter === 'warningLevel') &&
            <AlarmLevelFilter
              warningLevel={warningLevel}
              onChangeFilter={this.onChangeFilter}
              warningLevelName={warningLevelName}
            />}
          {showFilter === 'warningStatus' &&
            <WarningStatusFilter
              warningStatus={warningStatus}
              onChangeFilter={this.onChangeFilter}
              warningStatusName={warningStatusName}
            />}
          {showFilter === 'alarmType' &&
            <AlarmTypeFilter
              warningConfigName={warningConfigName}
              onChangeFilter={this.onChangeFilter}
            />}
          {showFilter === 'docketType' &&
            <DocketType
              docketTypeList={docketTypeList}
              docketTypes={docketTypes}
              onChangeFilter={this.onChangeFilter}
            />}

        </div>
        {/* 删选条件 */}
        <FilteredItems
          {...this.state}
          stations={stations}
          deviceTypes={deviceTypes}
          defectTypes={defectTypes}
          docketTypeList={docketTypeList}
          onChangeFilter={this.onChangeFilter}
          defectSourceName={defectSourceName}
          defectLevelName={defectLevelName}
        />
      </div>
    );
  }

}

export default FilterCondition;