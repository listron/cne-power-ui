import React, { Component } from 'react';
import styles from './performanceAnalysisFilter.scss';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Select, Switch, DatePicker } from 'antd';
import StationSelect from '../../../../components/Common/StationSelect';
import { monitordataFormat } from '../../../../utils/utilFunc';
const { MonthPicker } = DatePicker;
class PerformanceAnalysisFilter extends Component {

  static propTypes = {
    getPerformanceContrast: PropTypes.func,
    getFaultContrast: PropTypes.func,
    getPerformance: PropTypes.func,
    getFault: PropTypes.func,
    changePerformanceAnalysisStore: PropTypes.func,
    stations: PropTypes.array,
    deviceTypeCode: PropTypes.array,
    getDeviceModels: PropTypes.func,
    getEleLineCode: PropTypes.func,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    deviceModels: PropTypes.array,
    stationCode: PropTypes.any,
    getEleDeviceData: PropTypes.func,
    contrastSwitch: PropTypes.bool,
    contrastEndDate: PropTypes.string,
    deviceModeTypeCode: PropTypes.number,
    electricLineCode: PropTypes.string,
    targetTabs: PropTypes.string,
    contrastStartDate: PropTypes.string,
    theme: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
      startTime: null,
      timeType: 'last30',
    };
  }
  componentDidMount() {
    const { stations, getDeviceModels, getEleLineCode } = this.props;
    const initStations = stations.length > 0 && stations.filter(e => e.stationType === 1)[0];
    const firstStationCode = stations.length > 0 ? initStations.stationCode : '';
    const startDate = moment(moment()).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(moment()).endOf('month').format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate,
      stationCode: firstStationCode,
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
      });
    }
    //获取两种逆变器的所有数据
    this.getData({ stationCode: firstStationCode, startDate, endDate });

  }

  componentWillReceiveProps(nextProps) {
    const { changePerformanceAnalysisStore, getEleLineCode, getDeviceModels } = this.props;
    const { stations, stationCode } = nextProps;
    const initStations = stations.length > 0 && stations.filter(e => e.stationType === 1)[0];
    if (this.props.stations.length === 0 && stations.length !== 0) {
      const newStationCode = stationCode ? stationCode : initStations.stationCode;
      changePerformanceAnalysisStore({ stationCode: newStationCode });
      //获取设备型号
      getDeviceModels({
        stationCode: newStationCode,
      });
      //获取集电线路
      getEleLineCode({
        stationCode: newStationCode,
        deviceTypeCode: 302,
      });
      //获取数据
      this.getData({ stationCode: newStationCode });
    }
  }

  onChangeContrastTime = (value, dateString) => { // 对比时间选择
    const contrastStartDate = moment(dateString).startOf('month').format('YYYY-MM-DD');
    const contrastEndDate = moment(dateString).endOf('month').format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      contrastStartDate,
      contrastEndDate,
    });
    this.getContrastData({ contrastStartDate, contrastEndDate });
  }

  onCalendarChangeContrast = (selectTime) => { //时间的设置
    if (selectTime.length === 1) {
      this.setState({ startTime: selectTime[0].format('YYYY-MM-DD') });
    } else if (selectTime.length === 2 || this.props.contrastStartDate === false) {
      this.setState({ startTime: null });
    }
  }

  getData = (values) => { // 获取普通的数据
    const { stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode, targetTabs } = this.props;
    const params = { stationCode, startDate, endDate, deviceTypeCode, deviceModeTypeCode, electricLineCode };
    if (targetTabs === '1') {
      this.props.getPerformance({ ...params, ...values });
    } else {
      this.props.getFault({ ...params, ...values });
    }
  }

  getContrastData = (values) => { // 获取对比周期的数据
    const { stationCode, startDate, endDate, contrastStartDate, contrastEndDate, deviceTypeCode, deviceModeTypeCode, electricLineCode, targetTabs } = this.props;
    const params = { stationCode, startDate, endDate, contrastStartDate, contrastEndDate, deviceTypeCode, deviceModeTypeCode, electricLineCode };
    if (targetTabs === '1') {
      this.props.getPerformanceContrast({ ...params, ...values });
    } else {
      this.props.getFaultContrast({ ...params, ...values });
    }
  }


  disabledDate = (current) => { // 不可选时间
    if (this.start) {
      const end = moment(this.start).add(30, 'days');
      return current > moment.min(moment().endOf('day'), end);
    }
    return current && current > moment().endOf('day');

  }

  stationSelected = (stationSelect) => { // 选择电站
    const deviceTypeCode = [201, 206];
    const stationCode = stationSelect[0].stationCode;
    this.props.changePerformanceAnalysisStore({
      stationCode,
      contrastEndDate: null,
      contrastSwitch: false,
      targetTabs: '1',
      eleDeviceModels: [],
      eleLineCodeData: [],
      electricLineCode: null,
      deviceModeCode: null,
      deviceModeTypeCode: null,
      timeType: 'last30',
    });
    this.props.getEleLineCode({
      stationCode,
      deviceTypeCode: 302,
    });
    this.getData({ stationCode, deviceTypeCode, deviceModeTypeCode: null, electricLineCode: null });
  };

  timeSelectMonth = (date, dateString) => { // 时间的选择
    const startDate = moment(dateString).startOf('month').format('YYYY-MM-DD');
    const endDate = moment(dateString).endOf('month').format('YYYY-MM-DD');
    this.props.changePerformanceAnalysisStore({
      startDate,
      endDate,
      contrastSwitch: false,
      contrastStartDate: '',
      contrastEndDate: '',
    });
    this.getData({ startDate, endDate });
  }

  selectDeviceType = (value) => { // 选择设备类型,此处不可选设备类型
  }

  selectEleLine = (value) => { // 选择集电线路
    const { changePerformanceAnalysisStore, contrastSwitch, getEleDeviceData } = this.props;
    const deviceModeTypeCode = null;
    const deviceTypeCode = [201, 206];
    changePerformanceAnalysisStore({
      electricLineCode: value,
      deviceModeTypeCode,
      deviceModeCode: null,
      deviceTypeCode,
    });
    getEleDeviceData({ deviceFullCode: value });
    if (contrastSwitch) {
      this.getContrastData({ electricLineCode: value, deviceModeTypeCode, deviceTypeCode });
    } else {
      this.getData({ electricLineCode: value, deviceModeTypeCode, deviceTypeCode });
    }
  }

  selectDeviceModel = (value) => { // 选择设备型号
    const { contrastSwitch, changePerformanceAnalysisStore } = this.props;
    const deviceModeTypeCode = value && Number(value.split('__')[0]);
    const deviceTypeCode = value ? [Number(value.split('__')[1])] : [201, 206];
    changePerformanceAnalysisStore({
      deviceModeCode: value,
      deviceModeTypeCode: deviceModeTypeCode,
      deviceTypeCode,
    });
    if (contrastSwitch) {
      this.getContrastData({ deviceModeTypeCode, deviceTypeCode });
    } else {
      this.getData({ deviceModeTypeCode, deviceTypeCode });
    }
  }

  contrastSwitch = (checked) => { // switch开关
    const { changePerformanceAnalysisStore } = this.props;
    if (checked) {
      changePerformanceAnalysisStore({ contrastSwitch: checked });
    } else {
      changePerformanceAnalysisStore({ contrastSwitch: checked, contrastStartDate: '', contrastEndDate: '' });
      // this.getData({deviceTypeCode:[201,206]}) 不确定需求
    }
  }

  disabledTime = (startTime) => current => { //不可选择的时间
    const { startDate, endDate } = this.props;
    const begin = moment(startDate);
    const end = moment(endDate);
    const number = end.diff(begin, 'days');
    if (!startTime) {
      return false;
    }
    const enableDate = moment(startTime).subtract(number, 'day').format('YYYY-MM-DD');
    const testDate = moment(startTime).add(number, 'day').format('YYYY-MM-DD');
    if (current.format('YYYY-MM-DD') === enableDate || current.format('YYYY-MM-DD') === testDate) {
      return false;
    }
    return true;


  }


  render() {
    const { Option } = Select;
    const { stationCode, stations, contrastSwitch, deviceModeCode, eleLineCodeData, electricLineCode, eleDeviceModels, theme } = this.props;
    const station = stationCode ? stations.filter(e => `${e.stationCode}` === `${stationCode}`) : '';
    return (
      <div className={`${styles.performanceSearch} ${styles[theme]}`}>
        <span ref="performanceSearch" />
        <div className={styles.conditionalQuery}>
          <span className={styles.searchText}>条件查询</span>
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            holderText="请选择电站名称"
            value={station.length > 0 ? station : []}
            onChange={this.stationSelected}
            theme={theme}
          />
          <MonthPicker
            defaultValue={moment(moment(), 'YYYY-MM')}
            format={'YYYY-MM'}
            style={{ width: 200, marginLeft: 15, marginRight: 15 }}
            onChange={this.timeSelectMonth}
            disabledDate={this.disabledDate}
            allowClear={false}
            getCalendarContainer={() => this.refs.performanceSearch}
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
            getCalendarContainer={() => this.refs.performanceSearch}
          /> : ''}
        </div>
        <div className={styles.equipmentSelection}>
          <span className={styles.equipmentText}>设备选择</span>
          <Select
            placeholder="请选择设备类型"
            onChange={this.selectDeviceType}
            value={null}
            getPopupContainer={() => this.refs.performanceSearch}>
            <Option key={null} value={null}>{'逆变器'}</Option>
          </Select>
          <Select
            className={styles.modelSelect}
            onChange={this.selectEleLine}
            value={electricLineCode}
            placeholder="请选择集电线路"
            getPopupContainer={() => this.refs.performanceSearch}>
            <Option key={null} value={null}>{'全部集电线路'}</Option>
            {eleLineCodeData.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceId} value={e.deviceFullcode}>{e.deviceName}</Option>;
            })}
          </Select>
          <Select
            className={styles.modelSelect}
            onChange={this.selectDeviceModel}
            value={deviceModeCode}
            placeholder="请选择设备型号"
            disabled={eleDeviceModels.length === 0}
            getPopupContainer={() => this.refs.performanceSearch}>
            <Option key={null} value={null}>{'全部设备型号'}</Option>
            {eleDeviceModels.map(e => {
              if (!e) { return null; }
              return <Option key={e.deviceModeName} value={`${e.deviceModeCode}__${e.deviceTypeCode}`}>{e.deviceModeName}</Option>;
            })}
          </Select>
        </div>
      </div>
    );
  }

}

export default PerformanceAnalysisFilter;
