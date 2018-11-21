import React, { Component } from "react";
import styles from "./performanceAnalysisFilter.scss";
import moment from 'moment';
import { Select, Switch, DatePicker } from 'antd';

import StationSelect from "../../../../components/Common/StationSelect";

class PerformanceAnalysisFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
    }
  }
  componentDidMount() {
    const { stations, contrastSwitch, stationCode, deviceTypeCode, endDate, startDate,  changePerformanceAnalysisStore, getDeviceModels,getDeviceModelother, getEleLineCode,getPerformance } = this.props;
    const prams = {
      stationCode,
      startDate,
      endDate,
      deviceTypeCode
    }
    stations && stations.length > 0 ? changePerformanceAnalysisStore({ stationCode: stations[0].stationCode.toString() }) : console.log('no_stations');
    //把最近三十天的值存起来
    let startTime = moment().subtract(30, 'days').hour(0).minute(0).second(0).format('YYYY-MM-DD');
    let endTime = moment().format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      startTime,
      endTime
    });
    //获取电站下的设备类型
    this.props.getStationDeviceTypes({stationCodes:stations[0].stationCode})
    //获取设备型号
    getDeviceModels({
      stationCode:stationCode,
      // deviceTypeCode:'206'
    });
    // getDeviceModelother({
    //   stationCode:stationCode,
    //   deviceTypeCode:'201'
    // });
    //获取集电线路的设备
    getEleLineCode({
      stationCode: 1,
      deviceTypeCode: 206,
    })
    getPerformance({ ...prams })


  }
  componentWillReceiveProps(nextProps) {
    const { stations, changePerformanceAnalysisStore } = this.props;
    if (stations.length === 0 && nextProps.stations.length !== 0) {
      changePerformanceAnalysisStore({ stationCode: nextProps.stations[0].stationCode.toString() })
    }
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
  //选择时间
  onChangeDuration = (value) => {
    let startTime, endTime;
    if (value === 'other') {
      this.onFilterShowChange('timeSelect');
    }
    if (value === 'today') {
      startTime = moment().format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else if (value === 'yesterday') {
      startTime = moment().subtract(1, 'days').format('YYYY-MM-DD');
      endTime = moment().subtract(1, 'days').format('YYYY-MM-DD');
    } else if (value === 'last7') {
      startTime = moment().subtract(7, 'days').format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    } else if (value === 'last30') {
      startTime = moment().subtract(30, 'days').format('YYYY-MM-DD');
      endTime = moment().format('YYYY-MM-DD');
    }
    this.props.changePerformanceAnalysisStore({
      startTime,
      endTime,
      contrastSwitch:false
    });

  }
  onCalendarChange = (dates) => {
    if (dates.length === 1) {
      this.start = dates[0].format('YYYY-MM-DD');
    } else {
      this.start = null;
    }
  }
  //其他时间选择
  onChangeTime = (value, dateString) => {
    let startTime = dateString[0];
    let endTime = dateString[1];
    this.props.changePerformanceAnalysisStore({
      startTime,
      endTime,
      contrastSwitch:false
    });
  }
  //对比时间选择
  onChangeContrastTime = (value, dateString) => {
    let contrastStartDate = dateString[0];
    let contrastEndDate = dateString[1];
    this.props.changePerformanceAnalysisStore({
      contrastStartDate,
      contrastEndDate,
    });
  }
  //不可选时间
  disabledDate = (current) => {
    // console.log(current);
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    } else {
      return current && current > moment().endOf('day')
    }
  }
  //选择电站
  stationSelected = (stationSelect) => {
    const stationCode = stationSelect[0].stationCode;
    this.props.changePerformanceAnalysisStore({ stationCode ,contrastSwitch:false})
  
  };
  //选择设备类型
  selectDeviceType = (value) => {
    const { getStationDeviceModel, stationCode ,deviceTypeCode} = this.props;
    getStationDeviceModel({
      stationCode,
      deviceTypeCode
    })
  }
  //选择设备型号
  selectDeviceModel = (value) => {
    console.log(value);
    const { changePerformanceAnalysisStore } = this.props;
    changePerformanceAnalysisStore({
      deviceModeTypeCode:value,
      contrastSwitch:false
    })
  }
  //选择集电线路
  selectEleLine= (value) => {
    console.log(value);
    const { changePerformanceAnalysisStore } = this.props;
    changePerformanceAnalysisStore({
      electricLineCode:value,
      contrastSwitch:false
    })
  }
  //switch开关
  contrastSwitch = (checked) => {
    const { contrastSwitch, changePerformanceAnalysisStore } = this.props;
    changePerformanceAnalysisStore({ contrastSwitch: checked })
  }
  disabledTime = (current) => {
    const { startTime, endTime } = this.props;
    const start = moment(startTime);
    const end = moment(endTime);
    const endOf = moment(endTime).add(1, 'day')
    //不可选，当时大于的时候包含等于。比如大于20号的时候，20时候也会不可选。
    if (startTime === endTime) {
      return current < start || current > endOf
    } else {
      return start > current || endOf < current;
    }

  }
  render() {
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY/MM/DD';
    const { stationCode, stations, deviceTypeCode,deviceTypes, contrastSwitch, contrastStartDate, contrastEndDate, deviceModeCode,deviceModeTypeCode, deviceModels,deviceModelOther, eleLineCodeData,electricLineCode } = this.props;
   
    const { showFilter } = this.state;
    let station = stationCode ? stations.filter(e => `${e.stationCode}` === `${stationCode}`) : '';
    // console.log(stationCode, deviceModels,eleLineCodeData);
    // console.log(contrastStartDate, contrastEndDate);
    console.log(deviceModels,deviceModelOther);
    return (
      <div className={styles.performanceSearch}>
        <div className={styles.conditionalQuery}>
          <span className={styles.searchText}>条件查询</span>
          <StationSelect
            data={stations}
            holderText="请选择电站名称"
            value={station.length > 0 ? station : []}
            onChange={this.stationSelected}
          />
          <Select className={styles.duration} style={{ width: 120 }} defaultValue={'last30'} onChange={this.onChangeDuration}>
            <Option value="today">今天</Option>
            <Option value="yesterday">昨天</Option>
            <Option value="last7">最近7天</Option>
            <Option value="last30">最近30天</Option>
            <Option value="other">其他时间段</Option>
          </Select>
          <Switch className={styles.switch} onChange={this.contrastSwitch} checked={contrastSwitch} />
          <span className={styles.switchText}>对比同期</span>
          {contrastSwitch ? <RangePicker
            // defaultValue={[moment().startOf('day').subtract(1, 'month'), moment()]}
            disabledDate={this.disabledTime}
            onChange={this.onChangeContrastTime}
            format={dateFormat}
          /> : ''
          }

        </div>
        {showFilter !== '' && <div className={styles.filterBox}>
          {
            showFilter === 'timeSelect' &&
            <div className={styles.datePicker}><RangePicker
              showTime={false}
              disabledDate={this.disabledDate}
              onCalendarChange={this.onCalendarChange}
              format="YYYY-MM-DD"
              placeholder={['开始时间', '结束时间']}
              onChange={this.onChangeTime}
            // ranges={{ '今天': [moment().startOf('day'), moment()], '昨天': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')], '最近一周': [moment().startOf('day').subtract(1, 'weeks'), moment()] }}
            />
            </div>
          }
        </div>}
        <div className={styles.equipmentSelection}>
          <span className={styles.equipmentText}>设备选择</span>
          <Select placeholder="请选择设备类型" onChange={this.selectDeviceType} defaultValue={deviceTypeCode} >
            <Option  value={206}>逆变器</Option>
            {deviceTypes.map(e => {
              if (!e) { return null; }
              if(e.deviceTypeCode==='201'){
                return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              }
              if(e.deviceTypeCode==='206'){
                return <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              }

             
            })} 
          </Select>
          <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeTypeCode} placeholder="请选择设备型号">
            <Option key={null} value={null}>{'全部设备型号'}</Option>
            {deviceModelOther.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeName} value={e.deviceModeCode}>{e.deviceModeName}</Option>
            })}
            {deviceModels.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeName} value={e.deviceModeCode}>{e.deviceModeName}</Option>
            })}
            
          </Select>
          <Select className={styles.modelSelect} onChange={this.selectEleLine} value={electricLineCode} placeholder="请选择集电线路">
            <Option key={null} value={null}>{'全部集电线路'}</Option>
            {eleLineCodeData.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceId} value={e.deviceId}>{e.deviceName}</Option>
            })}
          </Select>
        </div>
      </div>
    )
  }
}

export default PerformanceAnalysisFilter;