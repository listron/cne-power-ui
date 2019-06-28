import React, { Component } from 'react';
import styles from './dataExport.scss';
import { Select, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import WarningTip from './WarningTip/index';
import PointSelect from './PointSelect';
import moment from 'moment';
import { message, Button } from 'antd';

const { Option } = Select;

class DataExportSearch extends Component{
  static propTypes = {
    stations: PropTypes.array,
    deviceTypeCode: PropTypes.number, // 选中的设备类型
    stationCode: PropTypes.number, 
    stationDeviceTypes: PropTypes.array, // 电站下可选设备类型
    getAvailableDeviceType: PropTypes.func,
    changeDataExportStore: PropTypes.func,
    queryParams: PropTypes.object,
    filterDevices: PropTypes.array,
    intervalInfo: PropTypes.array, // 可选时间间隔
    recordedMinuteStart: PropTypes.object,
    getPointInfo: PropTypes.func,
    getDataExport: PropTypes.func,
    recordedMinuteEnd: PropTypes.object,
    devicePointCodes: PropTypes.array,
    dataType: PropTypes.array,
    timeZone: PropTypes.string,
  };

  constructor(props){
    super(props);
    this.state = {
      pointModal: false,
      showWarningTip: false,
      warningTipText: '数据生成需要一段时间，成功后，需要回到本页面点击下载到本地',
      inputEdited: false,
      dataTypeLength:'',
    }
  }

  componentDidUpdate(prevProps){
    const { queryParams, changeDataExportStore, filterDevices } = this.props;
    const prevDevices = prevProps.filterDevices;
    if (prevDevices.length === 0 && filterDevices.length > 0) { // 得到初始设备数据
      changeDataExportStore({
        queryParams: {
          ...queryParams,
          deviceFullCodes: filterDevices.slice(0,100), // 默认选中全部设备
        }
      });
      this.selectedDevice(filterDevices.slice(0,100));
    } else if (
      prevDevices.length > 0
        && filterDevices.length > 0
        && prevDevices[0].deviceCode !== filterDevices[0].deviceCode
    ) { // 设备数据切换
      changeDataExportStore({
        queryParams: {
          ...queryParams,
          deviceFullCodes: filterDevices.slice(0,100), // 默认选中全部设备
        }
      });
      this.selectedDevice(filterDevices.slice(0,100))
    }
  }

  selectStation = (selectedStationInfo) => { // 电站选择。
    const { getAvailableDeviceType, changeDataExportStore, queryParams } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getAvailableDeviceType({ stationCode });
    changeDataExportStore({ 
      deviceTypeCode: null,
      queryParams: {
        ...queryParams,
        stationCode,
        deviceFullCodes: [],
        devicePoints: [],
      },
    });
  }

  selectDeviceType = (deviceTypeCode) => { // 选择设备类型
    const { changeDataExportStore, queryParams } = this.props;
    changeDataExportStore({
      deviceTypeCode,
      queryParams:{
        ...queryParams,
        deviceFullCodes: [],
        devicePoints: [],
      }
    })
  }

  selectedDevice = (devices) => { // 选择设备名称
    const { changeDataExportStore, queryParams, getPointInfo } = this.props;
    const { timeInterval } = queryParams;
    changeDataExportStore({
      queryParams:{
        ...queryParams,
        deviceFullCodes: devices,
        devicePoints: [],
      }
    })
    getPointInfo({
      deviceFullCodes: devices,
      timeInterval,
    });
  }

  startChange = (startTime) => { // 选择开始时间
    const { queryParams } = this.props;
    const { endTime } = queryParams
    if (moment().isBefore(startTime, 's')) {
      startTime = moment();
    }else if(endTime.isBefore(startTime,'s')){
      startTime = moment(endTime)
    }
    this.exportDataFetch({startTime});
  }

  endChange = (endTime) => { // 选择结束时间
    const { queryParams } = this.props;
    const { startTime } = queryParams;
    if(moment().isBefore(endTime, 's')) {
      endTime = moment();
    }else if(endTime.isBefore(startTime, 's')){
      endTime = moment(startTime)
    }
    this.exportDataFetch({endTime});
  }

  createTimeArr = (start, end) => {
    let timeArr = [];
    for (let i = start; i < end; i += 1) {
      timeArr.push(i);
    }
    return timeArr;
  }

  disableStartDate = (date) => { // 不可选的开始日期。
    const { queryParams } = this.props;
    const { endTime } = queryParams;
    return moment().isBefore(date,'D') || endTime.isBefore(date,'D') // || date.isBefore(disableStart, 'D');
  }
  
  disableStartTime = (time) => {
    const { queryParams } = this.props;
    const { endTime } = queryParams;
    if (endTime.isSame(time, 'd')){ // 同一天，不可大于结束时间
      const endHour = endTime.hour();
      const endMinute = endTime.minute();
      const endSecond = endTime.second();
      const disabledHours = this.createTimeArr(endHour + 1, 24);
      const disabledMinutes = this.createTimeArr(time.hour() === endHour? endMinute + 1 : 60, 60);
      const disabledSeconds = this.createTimeArr((time.hour() === endHour && time.minute() === endMinute)? endSecond : 60, 60);
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
        disabledSeconds: () => disabledSeconds,
      }
    }
    return;
  }

  disableEndDate = (date) => {
    const { queryParams } = this.props;
    const { startTime } = queryParams;
    return moment().isBefore(date,'D') || date.isBefore(startTime,'D') // || date.isAfter(disableEnd, 'D');
  }

  disableEndTime = (time) => {
    const { queryParams } = this.props;
    const { startTime } = queryParams;
    if (startTime.isSame(time, 'd')){ // 同一天，不可大于结束时间
      const startHour = startTime.hour();
      const startMinute = startTime.minute();
      const startSecond = startTime.second();
      const disabledHours = this.createTimeArr(0, startHour);
      const disabledMinutes = this.createTimeArr(0, time.hour() === startHour? startMinute : 0);
      const disabledSeconds = this.createTimeArr(0, (time.hour() === startHour && time.minute() === startMinute)? startSecond + 1 : 0);
      return {
        disabledHours: () => disabledHours,
        disabledMinutes: () => disabledMinutes,
        disabledSeconds: () => disabledSeconds,
      }
    }
    return;
  }

  selectTimeSpace = (interval) => { // 间隔时间选择
    const { queryParams, changeDataExportStore, recordedMinuteStart, recordedMinuteEnd, getPointInfo } = this.props;
    const { timeInterval, deviceFullCodes } = queryParams;
    const tmpQueryParam = {
      ...queryParams,
      deviceFullCodes: deviceFullCodes.slice(0, 2),
      timeInterval: interval,
      devicePoints: [],
    }
    if (interval === 10) { // 由秒级数据切换至10min数据
      changeDataExportStore({
        queryParams: {
          ...tmpQueryParam,
          startTime: recordedMinuteStart,
          endTime: recordedMinuteEnd,
        },
      });
      getPointInfo({
        deviceFullCodes,
        timeInterval: interval,
      });
    } else if (timeInterval === 10) { // 10min数据切换至秒级数
      message.info('请重新选择设备和时间');
      changeDataExportStore({
        queryParams: {
          ...tmpQueryParam,
          startTime: moment().subtract(1, 'month').startOf('month'),
          endTime: moment().subtract(1, 'month').endOf('month'),
        },
      });
      getPointInfo({
        deviceFullCodes: deviceFullCodes.slice(0, 2),
        timeInterval: interval,
      });
    } else { // 秒级数据( 1s与5s)切换
      this.historyDataFetch({ timeInterval });
    }
  }

  exportDataFetch = (params) => {
    const { changeDataExportStore, queryParams } = this.props;
    const { devicePoints } = queryParams;
    const tmpPayload = { queryParams: {
      ...queryParams,
      ...params
    }}
    const { startTime, endTime, timeInterval } = tmpPayload.queryParams;
    const tmpAllowedEnd = timeInterval === 10 ? moment(endTime).subtract(1, 'M') : moment(endTime).subtract(1, 'd');
    if (startTime.isBefore(tmpAllowedEnd, 's')) {
      message.error(`${timeInterval === 10 ? '时间选择范围不可超过1个月' : '时间选择范围不可超过1天'}`);
      changeDataExportStore(tmpPayload);
    }else if (devicePoints.length > 0) { // 已选测点，重新请求
      changeDataExportStore(tmpPayload);
    }else{ // 未选时间，暂存信息
      changeDataExportStore(tmpPayload);
    }
  }

  changeDataTypes = (dataType) => { // 选择数据类型
    console.log('dataType: ', dataType);
    const { changeDataExportStore } = this.props;
    changeDataExportStore({
      dataType
    })
  }

  maxTagPlaceholder = () => { // 显示数据类型已选数和总数
    const { dataType = [] } = this.props;
    if (dataType.length > 0) {
      return <div>已选{this.state.checkedDevice.length}/{ dataType.length}</div>
    }
  }

  reset = () => { // 重置
    const { getDataExport, queryParams, deviceTypeCode, devicePointCodes, dataType } = this.props;
    getDataExport({
      ...queryParams,
      stationCode: null,
      deviceFullCodes: [],
      devicePoints: [],
      timeInterval: 10, 
      startTime: moment().subtract(1, 'month').startOf('day'),
      endTime: moment().subtract(1, 'month').endOf('day'),
      deviceTypeCode: '', 
      devicePointCodes: [], 
      dataType: [],
      timeZone: null
    })
  }

  generate = () => { // 生成任务
    const { inputEdited } = this.state;
    
    if(!inputEdited){
      this.setState({
        showWarningTip: true,
      })
    }
  }

  confirmWarningTip = () => { // 确定
    const { getDataExport, queryParams, deviceTypeCode, devicePointCodes, dataType, timeZone} = this.props;
    console.log('dataType: ', dataType);

    this.setState({
      showWarningTip: false
    })

    getDataExport({
      queryParams,
      deviceTypeCode, 
      devicePointCodes, 
      dataType,
      timeZone: moment().zone() / (-60),
    })
  }

  cancelWarningTip = () => { // 取消
    this.setState({
      showWarningTip: false
    })
  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    const { stations, stationDeviceTypes, deviceTypeCode, queryParams, intervalInfo, dataType } = this.props;
    console.log('dataType: ', dataType);
    const { timeInterval, deviceFullCodes, startTime, endTime, stationCode } = queryParams;
    return (
      <div className={styles.dataExportSearch}>
        <div className={styles.dataExportTop}>
          {showWarningTip && <WarningTip onCancel={this.cancelWarningTip} onOK={this.confirmWarningTip} value={warningTipText} />}
          <div className={styles.stationSearch}>
            <span className={styles.text}>电站名称</span>
            <StationSelect 
              holderText={'请输入关键字快速查询'}
              data={stations}
              onOK={this.selectStation}
              value={stationCode}
              disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
            />
          </div>

          <div className={styles.deviceTypeSearch}>
            <span className={styles.text}>设备类型</span>
            <Select
                style={{ width: '200px' }}
                onChange={this.selectDeviceType}
                value={deviceTypeCode}
                placeholder="请选择设备类型"
                disabled={stationDeviceTypes.length === 0}
              >
                {stationDeviceTypes.map(e => (
                  <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
                ))}
              </Select>
          </div>

          <div className={styles.deviceNameSearch}>
            <span className={styles.text}>设备名称</span>
            <DeviceSelect
              disabled={!deviceTypeCode}
              stationCode={stationCode}
              value={deviceFullCodes}
              deviceTypeCode={deviceTypeCode}
              multiple={true}
              // max={timeInterval === 10 ? 5 : 2}
              deviceShowNumber={true}
              style={{ width: 'auto', minWidth: '198px' }}
              onChange={this.selectedDevice}
            />
          </div>

          <div className={styles.pointsNameSearch}>
            <span className={styles.text}>测点名称</span>
            <PointSelect {...this.props} />
          </div>

          <div className={styles.startSelect}>
            <span className={styles.text}>开始时间</span>
            <DatePicker
              allowClear={false}
              showToday={false}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.startChange}
              value={startTime}
              disabledDate={this.disableStartDate}
              disabledTime={this.disableStartTime}
              dropdownClassName={styles.exportRangeDropdown}
              renderExtraFooter={() => (
                <span className={styles.infoTip}>
                  {timeInterval === 10 ? '时间选择范围不可超过1个月' : '时间选择范围不可超过1天'}
                </span>
              )}
              showTime
           />
          </div>

          <div className={styles.endSelect}>
              <span className={styles.text}>结束时间</span>
              <DatePicker 
                allowClear={false}
                showToday={false}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={this.endChange}
                value={endTime}
                disabledDate={this.disableEndDate}
                disabledTime={this.disableEndTime}
                dropdownClassName={styles.exportRangeDropdown}
                renderExtraFooter={() => (
                  <span className={styles.infoTip}>
                    {timeInterval === 10 ? '时间选择范围不可超过1个月' : '时间选择范围不可超过2天'}
                  </span>
                )}
                showTime
              />
            </div>

            <div className={styles.intervalSelect}>
              <span className={styles.text}>数据间隔</span>
              <Select
                onChange={this.selectTimeSpace}
                value={timeInterval}
                placeholder="数据间隔时间"
              >
                {intervalInfo.map(e => (
                  <Option key={e} value={e}>{e === 10 ? '10分钟' : `${e}秒`}</Option>
                ))}
              </Select>
            </div>

            <div className={styles.dataTypes}>
              <span className={styles.text}>数据类型</span>
                <Select
                  onChange={this.changeDataTypes}
                  mode="multiple"
                  placeholder="选择数据类型"
                  value={dataType}
                  style={{ width: '198px' }}
                  // maxTagCount={0}
                  // maxTagPlaceholder={this.maxTagPlaceholder}
                  // filterOption={[]}
                  // open={false}
                >
                  <Option value="1" key="1">平均值</Option>
                  <Option value="2" key="2">最大值</Option>
                  <Option value="3" key="3">最小值</Option>
                  <Option value="4" key="4">瞬时值</Option>
                </Select>
            </div>
          </div>
          <div className={styles.dataExportBottom}>
             <Button className={styles.reset} onClick={this.reset}>重置</Button>
             <Button className={styles.generate} onClick={this.generate}>生成任务</Button>
          </div>
        </div>
    )
  }
}

export default DataExportSearch