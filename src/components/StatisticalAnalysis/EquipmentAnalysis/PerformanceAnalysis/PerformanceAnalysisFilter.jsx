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
      isRun: false,
    }
  }
  componentDidMount() {
    const { stations, contrastSwitch, stationCode, deviceTypeCode, changePerformanceAnalysisStore, getDeviceModels, getDeviceModelother, getEleLineCode, getPerformance } = this.props;
    // console.log( stations);
    stations && stations.length > 0 ? changePerformanceAnalysisStore({ stationCode: stations[0].stationCode }) : console.log('no_stations');
    let firstStationCode = stations.length > 0 ? stations[0].stationCode : '';
    //把最近三十天的值存起来
    let startDate = moment().subtract(30, 'days').hour(0).minute(0).second(0).format('YYYY-MM-DD');
    let endDate = moment().format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate
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
    if (stations.length === 0 && nextProps.stations.length !== 0) {
      changePerformanceAnalysisStore({ stationCode: nextProps.stations[0].stationCode })
      //获取设备型号
      getDeviceModels({
        stationCode: nextProps.stations[0].stationCode,
      });
      //获取集电线路
      getEleLineCode({
        stationCode: nextProps.stations[0].stationCode,
        deviceTypeCode: 302,
      })
      //获取数据
      getPerformance({ stationCode: nextProps.stations[0].stationCode, startDate, endDate, deviceTypeCode, })
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
    const { stationCode, deviceTypeCode, deviceModeTypeCode, electricLineCode } = this.props;
    let startDate, endDate;
    if (value === 'other') {
      this.onFilterShowChange('timeSelect');
    }
    if (value === 'today') {
      startDate = moment().format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    } else if (value === 'yesterday') {
      startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
      endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
    } else if (value === 'last7') {
      startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    } else if (value === 'last30') {
      startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    }
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate,
      contrastSwitch: false,
      timeType: value
    });
    this.props.getPerformance({ stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode })

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
    const { stationCode, deviceTypeCode } = this.props;
    let startDate = dateString[0];
    let endDate = dateString[1];
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate,
      contrastSwitch: false
    });
    this.props.getPerformance({ stationCode, startDate, endDate, deviceTypeCode, })
  }
  //对比时间选择
  onChangeContrastTime = (value, dateString) => {
    const { stationCode, deviceTypeCode, startDate, endDate, deviceModeTypeCode, electricLineCode } = this.props;
    let contrastStartDate = dateString[0];
    let contrastEndDate = dateString[1];
    this.props.changePerformanceAnalysisStore({
      contrastStartDate,
      contrastEndDate,
    });
    this.props.getPerformanceContrast({ stationCode, startDate, endDate, contrastStartDate, contrastEndDate, deviceTypeCode, deviceModeTypeCode, electricLineCode })
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
    const deviceTypeCode = [201, 206];
    const stationCode = stationSelect[0].stationCode;
    let startDate = moment().subtract(30, 'days').hour(0).minute(0).second(0).format('YYYY-MM-DD');
    let endDate = moment().format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({ stationCode, startDate, endDate, contrastSwitch: false, targetTabs: '1', eleLineCodeData: [], electricLineCode: null, deviceModeCode: null, deviceModeTypeCode: null, timeType: 'last30' })
    this.props.getDeviceModels({
      stationCode: stationCode,
    });
    this.props.getPerformance({ stationCode, startDate, endDate, deviceTypeCode, })
    this.props.getEleLineCode({
      stationCode,
      deviceTypeCode: 302,
    })

  };
  //选择设备类型,此处不可选设备类型
  selectDeviceType = (value) => {

  }
  //选择设备型号
  selectDeviceModel = (value) => {
    const { stationCode, contrastSwitch, changePerformanceAnalysisStore, getPerformanceContrast, getEleLineCode, startDate, endDate, deviceModeCode, contrastStartDate, contrastEndDate, getPerformance } = this.props;
    const deviceModeTypeCode = value && Number(value.split('__')[0]);
    const deviceTypeCode = value && [Number(value.split('__')[1])];

    changePerformanceAnalysisStore({
      deviceModeCode: value,
      deviceModeTypeCode: deviceModeTypeCode,
      targetTabs: '1',
      deviceTypeCode,
    })
    contrastSwitch ? getPerformanceContrast({ stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, contrastStartDate, contrastEndDate }) :
      getPerformance({ stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, contrastStartDate, contrastEndDate, })
  }
  //选择集电线路
  selectEleLine = (value) => {
    const { stationCode, changePerformanceAnalysisStore, startDate, endDate, getPerformance, electricLineCode, contrastStartDate, contrastEndDate, deviceModeTypeCode, deviceTypeCode, contrastSwitch, getPerformanceContrast } = this.props;
    changePerformanceAnalysisStore({
      electricLineCode: value,
      targetTabs: '1'
    })
    contrastSwitch ? getPerformanceContrast({ stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, contrastStartDate, contrastEndDate, electricLineCode: value }) : getPerformance({ stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, contrastStartDate, contrastEndDate, electricLineCode: value })
  }
  //switch开关
  contrastSwitch = (checked) => {
    const { getPerformance, changePerformanceAnalysisStore, stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode } = this.props;
    if (checked) {
      changePerformanceAnalysisStore({ contrastSwitch: checked })
    } else {
      changePerformanceAnalysisStore({ contrastSwitch: checked, contrastStartDate: '', contrastEndDate: '' })
      getPerformance({ stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode })
    }
  }
  //不可选择的时间
  disabledTime = (current, a, b, c) => {
     console.log(current,a,b,c,'bukexuanshijian');
    const { startDate, endDate, contrastStartDate } = this.props;
    const start = moment(startDate);
    const end = moment(endDate);
    const endOf = moment(endDate).add(1, 'day')
    // 不可选，当时大于的时候包含等于。比如大于20号的时候，20时候也会不可选。
    if (startDate === endDate) {
      return current < start || current > endOf
    } else {
      return start > current || endOf < current;
    }
    if (!current) {
      return false
    } else {
      const end = moment().add(7, 'days').format('YYYY-MM-DD');
      const end2 = moment().subtract(5, 'days').format('YYYY-MM-DD');
       return  !current.isSame(end,'day')|| !current.isSame(end2,'day')
    }

    // if (!contrastStartDate) {
    //   return false
    // } else if (contrastStartDate) {
    //   const testTime = contrastStartDate.add(7, 'days').format('YYYY-MM-DD');
    //   console.log(testTime);
    //   console.log(contrastStartDate);
    //   // this.props.changePerformanceAnalysisStore({ contrastStartDate: null })
    //   return !current.isSame(testTime, 'day')
    // }
  }
  onCalendarChange = (a, b, c, d) => {
    // console.log(a[0], b, c, d, 'riqibianhua');
    // this.props.changePerformanceAnalysisStore({ contrastStartDate: a[0] })

  }

  render() {
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';
    const { stationCode, stations, deviceTypeCode, deviceTypes, timeType, contrastSwitch, contrastStartDate, contrastEndDate, deviceModeCode, deviceModeTypeCode, deviceModels, deviceModelOther, eleLineCodeData, electricLineCode } = this.props;
    const { showFilter } = this.state;
    // const eleLineCodeDisable = eleLineCodeData.length === 0;
    let station = stationCode ? stations.filter(e => `${e.stationCode}` === `${stationCode}`) : '';
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
          <Select className={styles.duration} style={{ width: 120 }} value={timeType} onChange={this.onChangeDuration}>
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
            onCalendarChange={this.onCalendarChange}
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
          <Select placeholder="请选择设备类型" onChange={this.selectDeviceType} value={null} >
            <Option key={null} value={null}>{'逆变器'}</Option>

          </Select>
          <Select className={styles.modelSelect} onChange={this.selectDeviceModel} value={deviceModeCode} placeholder="请选择设备型号">
            <Option key={null} value={null}>{'全部设备型号'}</Option>
            {deviceModels.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeName} value={`${e.deviceModeCode}__${e.deviceTypeCode}`}>{e.deviceModeName}</Option>
            })}
            {deviceModelOther.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeName} value={`${e.deviceModeCode}__${e.deviceTypeCode}`}>{e.deviceModeName}</Option>
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