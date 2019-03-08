import React, { Component } from "react";
import styles from "./performanceAnalysisFilter.scss";
import moment from 'moment';
import { Select, Switch, DatePicker } from 'antd';
import StationSelect from "../../../../components/Common/StationSelect";
import { monitordataFormat } from "../../../../utils/utilFunc";
class PerformanceAnalysisFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      startTime: null,
      timeType: 'last30'
    }
  }
  componentDidMount() {
    const { stations, contrastSwitch, stationCode, deviceTypeCode, changePerformanceAnalysisStore, getDeviceModels, getDeviceModelother, getEleLineCode, getPerformance } = this.props;
    const initStations = stations.length > 0 && stations.filter(e => e.stationType === 1)[0];
    let firstStationCode = stations.length > 0 ? initStations.stationCode : '';
    let startDate = moment(moment()).startOf('month').format('YYYY-MM-DD');
    let endDate = moment(moment()).endOf('month').format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate,
      stationCode: firstStationCode
    });
    //获取设备型号
    getDeviceModels({
      stationCode: firstStationCode,
    });
    //获取集电线路
    if (firstStationCode) {
      getEleLineCode({
        stationCode: firstStationCode,
        deviceTypeCode: 302,
      })
    }
    //获取两种逆变器的所有数据
    getPerformance({ stationCode: firstStationCode, startDate, endDate, deviceTypeCode, })

  }
  componentWillReceiveProps(nextProps) {
    const { stations, changePerformanceAnalysisStore, getEleLineCode, getPerformance, getDeviceModels, startDate, deviceTypeCode, endDate, deviceModels } = this.props;
    const initStations = (nextProps.stations).length > 0 && (nextProps.stations).filter(e => e.stationType === 1)[0];
    if (stations.length === 0 && nextProps.stations.length !== 0) {
      const newStationCode = nextProps.stationCode ? nextProps.stationCode : initStations.stationCode;
      changePerformanceAnalysisStore({ stationCode: newStationCode })
      //获取设备型号
      getDeviceModels({
        stationCode: newStationCode,
      });
      //获取集电线路
      getEleLineCode({
        stationCode: newStationCode,
        deviceTypeCode: 302,
      })
      //获取数据
      getPerformance({ stationCode: newStationCode, startDate, endDate, deviceTypeCode, })
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
  
  onCalendarChange = (dates) => {
    if (dates.length === 1) {
      this.start = dates[0].format('YYYY-MM-DD');
    } else {
      this.start = null;
    }
  }
 
  //对比时间选择
  onChangeContrastTime = (value, dateString) => {
    const { stationCode, deviceTypeCode, startDate, endDate, deviceModeTypeCode, electricLineCode, targetTabs } = this.props;
    const prams = { stationCode, startDate, endDate, contrastStartDate, contrastEndDate, deviceTypeCode, deviceModeTypeCode, electricLineCode };
    
    let contrastStartDate = moment(dateString).startOf('month').format('YYYY-MM-DD')
    let contrastEndDate = moment(dateString).endOf('month').format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      contrastStartDate,
      contrastEndDate,
    });
    if (targetTabs === '1') {
      this.props.getPerformanceContrast({ ...prams, contrastStartDate, contrastEndDate })
    } else {
      this.props.getFaultContrast({ ...prams, contrastStartDate, contrastEndDate })
    }

  }
  onCalendarChangeContrast = (selectTime, b, c, d) => {

    if (selectTime.length === 1) {
      this.setState({
        startTime: selectTime[0].format('YYYY-MM-DD'),
      })
    } else if (selectTime.length === 2 || this.props.contrastStartDate === false) {
      this.setState({
        startTime: null
      })
    }
  }
  //不可选时间
  disabledDate = (current) => {
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    } else {
      return current && current > moment().endOf('day')
    }
  }
  //选择电站
  stationSelected = (stationSelect) => {
    const { startDate, endDate } = this.props;
    const deviceTypeCode = [201, 206];
    const stationCode = stationSelect[0].stationCode;
  
    this.props.changePerformanceAnalysisStore({ stationCode, startDate, endDate, contrastEndDate: null, contrastSwitch: false, targetTabs: '1',eleDeviceModels:[], eleLineCodeData: [], electricLineCode: null, deviceModeCode: null, deviceModeTypeCode: null, timeType: 'last30' })
  
    this.props.getEleLineCode({
      stationCode,
      deviceTypeCode: 302,
    })
    this.props.getPerformance({ stationCode, startDate, endDate, deviceTypeCode, })
  };
  //选择设备类型,此处不可选设备类型
  selectDeviceType = (value) => {
  }
  //选择设备型号
  selectDeviceModel = (value) => {
    const { stationCode, contrastSwitch, changePerformanceAnalysisStore, getPerformanceContrast, getEleLineCode, startDate, endDate, deviceModeCode, contrastStartDate, contrastEndDate, getPerformance, electricLineCode, targetTabs } = this.props;
    const deviceModeTypeCode = value && Number(value.split('__')[0]);
    const deviceTypeCode = value ? [Number(value.split('__')[1])] : [201, 206];
    const prams = { stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode }
    changePerformanceAnalysisStore({
      deviceModeCode: value,
      deviceModeTypeCode: deviceModeTypeCode,
      deviceTypeCode,
    })
    if (contrastSwitch) {
      if (targetTabs === '1') {
        this.props.getPerformanceContrast({ ...prams, contrastStartDate, contrastEndDate })
      } else {
        this.props.getFaultContrast({ ...prams, contrastStartDate, contrastEndDate })
      }
    } else {
      if (targetTabs === '1') {
        this.props.getPerformance({ ...prams })
      } else {
        this.props.getFault({ ...prams })
      }
    }
  }
  //选择集电线路
  selectEleLine = (value) => {
    const { stationCode, changePerformanceAnalysisStore, startDate, endDate, getPerformance, electricLineCode, contrastStartDate, contrastEndDate, deviceModeTypeCode, deviceTypeCode, contrastSwitch, getPerformanceContrast, targetTabs } = this.props;
    const prams = { stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode: value }
    changePerformanceAnalysisStore({
      electricLineCode: value,
      deviceModeCode:null

    })
    this.props.getEleDeviceData({
      deviceFullCode: value
    })
    if (contrastSwitch) {
      if (targetTabs === '1') {
        this.props.getPerformanceContrast({ ...prams, contrastStartDate, contrastEndDate })
      } else {
        this.props.getFaultContrast({ ...prams, contrastStartDate, contrastEndDate })
      }
    } else {
      if (targetTabs === '1') {
        this.props.getPerformance({ ...prams })
      } else {
        this.props.getFault({ ...prams })
      }
    }
  }
  //switch开关
  contrastSwitch = (checked) => {
    const { getPerformance, getFault, changePerformanceAnalysisStore, stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode, targetTabs } = this.props;
    const params = { stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode }
    if (checked) {
      changePerformanceAnalysisStore({ contrastSwitch: checked })
    } else {
      changePerformanceAnalysisStore({ contrastSwitch: checked, contrastStartDate: '', contrastEndDate: '' })

      if (targetTabs === '1') {
        getPerformance({ ...params })
      } else {
        getFault({ ...params })
      }
    }
  }
  //不可选择的时间
  disabledTime = (startTime) => current => {
    const { timeType } = this.state;
    const { startDate, endDate, contrastStartDate } = this.props;
    let begin = moment(startDate);
    let end = moment(endDate);
    let number = end.diff(begin, 'days');
    if (!startTime) {
      return false
    } else {
      const enableDate = moment(startTime).subtract(number, 'day').format('YYYY-MM-DD');
      const testDate = moment(startTime).add(number, 'day').format('YYYY-MM-DD');
      if (current.format('YYYY-MM-DD') === enableDate || current.format('YYYY-MM-DD') === testDate) {
        return false;
      } else {
        return true;
      }
    }
  }
  timeSelectMonth = (date, dateString) => {
    const { stationCode, deviceTypeCode, deviceModeTypeCode, electricLineCode, targetTabs } = this.props;
    const startDate = moment(dateString).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(dateString).endOf('month').format('YYYY-MM-DD');
    const prams = { stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode }
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate,
      contrastSwitch: false,
      contrastStartDate: '',
      contrastEndDate: '',
    });
    if (targetTabs === '1') {
      this.props.getPerformance({ ...prams })
    } else {
      this.props.getFault({ ...prams })
    }
  }
  render() {
    const { Option } = Select;
    const { RangePicker, MonthPicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';
    const { stationCode, stations, deviceTypeCode, deviceTypes, timeType, contrastSwitch, contrastStartDate, contrastEndDate, deviceModeCode, deviceModeTypeCode, deviceModels, deviceModelOther, eleLineCodeData, electricLineCode,eleDeviceModels } = this.props;
    const { showFilter, startTime } = this.state;
    // const eleLineCodeDisable = eleLineCodeData.length === 0;
    let station = stationCode ? stations.filter(e => `${e.stationCode}` === `${stationCode}`) : '';
    return (
      <div className={styles.performanceSearch}>
        <div className={styles.conditionalQuery}>
          <span className={styles.searchText}>条件查询</span>
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            holderText="请选择电站名称"
            value={station.length > 0 ? station : []}
            onChange={this.stationSelected}
          />
          <MonthPicker
            defaultValue={moment(moment(), 'YYYY-MM')}
            format={'YYYY-MM'}
            style={{ width: 230, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelectMonth}
            disabledDate={this.disabledDate}
            allowClear={false}
          />
          <Switch className={styles.switch} onChange={this.contrastSwitch} checked={contrastSwitch} />
          <span className={styles.switchText}>对比同期</span>
          {contrastSwitch ? <MonthPicker
            format={'YYYY-MM'}
            style={{ width: 230, marginLeft: 15, marginRight: 15 }}
            disabledDate={this.disabledDate}
            onCalendarChange={this.onCalendarChangeContrast}
            onChange={this.onChangeContrastTime}
            placeholder={'请选择年月'}
          /> : ''}
        </div>
        <div className={styles.equipmentSelection}>
          <span className={styles.equipmentText}>设备选择</span>
          <Select placeholder="请选择设备类型" onChange={this.selectDeviceType} value={null} >
            <Option key={null} value={null}>{'逆变器'}</Option>
          </Select>
          <Select className={styles.modelSelect} onChange={this.selectEleLine} value={electricLineCode} placeholder="请选择集电线路">
            <Option key={null} value={null}>{'全部集电线路'}</Option>
            {eleLineCodeData.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceId} value={e.deviceFullcode}>{e.deviceName}</Option>
            })}
          </Select>
          <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号" disabled={eleDeviceModels.length===0}>
            <Option key={null} value={null}>{'全部设备型号'}</Option>
            {eleDeviceModels.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeName} value={`${e.deviceModeCode}__${e.deviceTypeCode}`}>{e.deviceModeName}</Option>
            })}
          </Select>
        </div>
      </div>
    )
  }
}

export default PerformanceAnalysisFilter;
