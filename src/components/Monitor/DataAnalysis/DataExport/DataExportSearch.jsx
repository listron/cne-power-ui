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
    devicePointIds: PropTypes.array,
    dataTypes: PropTypes.array,
    timeZone: PropTypes.string,
    pointsSeleted: PropTypes.array,
    pointInfo: PropTypes.array,
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
      queryParams: {
        ...queryParams,
        stationCode,
        deviceFullCodes: [],
        devicePointIds: [],
        pointsSeleted: [],
      },
      deviceTypeCode: null,
    });
  }

  selectDeviceType = (deviceTypeCode) => { // 选择设备类型
    const { changeDataExportStore, queryParams } = this.props;
    changeDataExportStore({
      queryParams:{
        ...queryParams,
        deviceFullCodes: [],
        devicePointIds: [],
        pointsSeleted: [],
      },
      deviceTypeCode,
    })
  }

  selectedDevice = (devices) => { // 选择设备名称
    const { changeDataExportStore, queryParams, getPointInfo } = this.props;
    const { timeInterval } = queryParams;
    changeDataExportStore({
      queryParams:{
        ...queryParams,
        deviceFullCodes: devices,
        devicePointIds: [],
        pointsSeleted: [],
      }
    })
    getPointInfo({
      deviceFullCodes: devices,
      timeInterval,
    });
  }

  startChange = (startTime) => { // 选择开始时间
    const { queryParams, changeDataExportStore } = this.props;
    const { endTime } = queryParams
    if (moment().isBefore(startTime, 's')) {
      startTime = moment()
    }else if(endTime.isBefore(startTime,'s')){
      startTime = moment(endTime)
    }
    changeDataExportStore({
      queryParams: {
        ...queryParams,
        startTime
      }
    })
  }

  endChange = (endTime) => { // 选择结束时间
    const { queryParams, changeDataExportStore } = this.props;
    const { startTime } = queryParams;
    if(moment().isBefore(endTime, 's')) {
      endTime = moment()
    }else if(endTime.isBefore(startTime, 's')){
      endTime = moment(startTime)
    }
    changeDataExportStore({
      queryParams: {
        ...queryParams,
        endTime
      }
    })
  }

  createTimeArr = (start, end) => {
    let timeArr = [];
    for (let i = start; i < end; i += 1) {
      timeArr.push(i);
    }
    return timeArr;
  }

  disabledStartDate = (date) => { // 不可选的开始日期。
    const { queryParams } = this.props;
    const { endTime } = queryParams;
    if (endTime) {
      return moment().isBefore(date,'D') || endTime.isBefore(date,'D') // || date.isBefore(disableStart, 'D');
    }
  }

  disabledEndDate = (date) => {
    const { queryParams } = this.props;
    const { startTime } = queryParams;
    if (startTime) {
      return moment().isBefore(date,'D') || date.isBefore(startTime,'D') // || date.isAfter(disableEnd, 'D');
    }
  }

  selectTimeSpace = (interval) => { // 间隔时间选择
    const { queryParams, changeDataExportStore, recordedMinuteStart, recordedMinuteEnd, getPointInfo, pointsSeleted } = this.props;
    const { timeInterval, deviceFullCodes } = queryParams;
    const tmpQueryParam = {
      ...queryParams,
      deviceFullCodes: deviceFullCodes.slice(0, 2),
      timeInterval: interval,
    };
    if (interval === 3) { // 由秒级数据切换至10min数据
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
    } else if (timeInterval === 3) { // 10min数据切换至秒级数
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
      changeDataExportStore({ queryParams: {
        ...queryParams,
        timeInterval: interval,
      }});
    }
  }

  changeDataType = (dataTypes) => { // 选择数据类型
    const { changeDataExportStore, queryParams } = this.props;
    changeDataExportStore({
      queryParams:{
        ...queryParams,
        dataTypes
      }
    })
  }

  maxTagPlaceholderTen = () => { // 数据间隔为10->显示数据类型已选数和总数
    const { queryParams } = this.props;
    const { dataTypes = [] } = queryParams;
    if (dataTypes.length > 0) {
      return <div>已选{dataTypes.length}/4</div>
    }
  }

  maxTagPlaceholderFive = () => { // 数据间隔为5->显示数据类型已选数和总数
    const { queryParams } = this.props;
    const { dataTypes = [] } = queryParams;
    if (dataTypes.length > 0) {
      return <div>已选{dataTypes.length}/1</div>
    }
  }

  reset = () => { // 重置
    const { changeDataExportStore, queryParams } = this.props;
    changeDataExportStore({
      queryParams: {
        ...queryParams,
        stationCode: null,
        deviceFullCodes: [],
        devicePointIds: [],
        timeInterval: null, 
        startTime: moment().subtract(1, 'month').startOf('day'),
        endTime: moment().subtract(1, 'month').endOf('day'), 
        dataTypes: [],
        timeZone: null,
      },
      deviceTypeCode: '', 
      pointsSeleted: [],
      pointInfo: [],
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
    const { getDataExport, queryParams, deviceTypeCode } = this.props;
    this.setState({
      showWarningTip: false
    })

    getDataExport({
      deviceTypeCode,
      queryParams: {
        ...queryParams,
        timeZone: moment().zone() / (-60),
      }
    })
  }

  cancelWarningTip = () => { // 取消
    this.setState({
      showWarningTip: false
    })
  }

  render(){
    const { showWarningTip, warningTipText } = this.state;
    const { stations, stationDeviceTypes, deviceTypeCode, queryParams, intervalInfo } = this.props;
    const { timeInterval, deviceFullCodes, startTime, endTime, stationCode, dataTypes, devicePointIds } = queryParams;
    const deviceFullCodesStatus = deviceFullCodes.length > 0;
    const devicePointCodesStatus = devicePointIds.length > 0;
    const dataTypesStatus = dataTypes.length > 0;
    const showGenerateBtn = !!stationCode && !!deviceTypeCode && deviceFullCodesStatus && devicePointCodesStatus && !!timeInterval && dataTypesStatus;
    const showResetBtn = !!stationCode || !!deviceTypeCode || deviceFullCodesStatus || devicePointCodesStatus || !!timeInterval || dataTypesStatus;
    
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
              value={stationCode?stationCode:[]}
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
              disabledDate={this.disabledStartDate}
              allowClear={false}
              showToday={false}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={startTime}
              placeholder="开始时间"
              onChange={this.startChange}
            />
          </div>

          <div className={styles.endSelect}>
            <span className={styles.text}>结束时间</span>
            <DatePicker
              disabledDate={this.disabledEndDate}
              allowClear={false}
              showToday={false}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={endTime}
              placeholder="结束时间"
              onChange={this.endChange}
            />
          </div>

          <div className={styles.intervalSelect}>
            <span className={styles.text}>数据间隔</span>
            <Select
              placeholder="请选择"
              onChange={this.selectTimeSpace}
              // value={!timeInterval ? undefined : timeInterval}
            >
              {intervalInfo.map(e => (
                <Option className={styles.intervalText} key={e} value={e}>{e === 3 ? '10分钟' : (e === 2 ? '5秒' : '1秒')}</Option>
              ))}
            </Select>
          </div>

          <div className={styles.dataTypes}>
            <span className={styles.text}>数据类型</span>
            {timeInterval === 3 ?
              <Select
                onChange={this.changeDataType}
                mode="multiple"
                placeholder="可多选"
                value={dataTypes}
                style={{ width: '198px' }}
                maxTagCount={0}
                maxTagPlaceholder={this.maxTagPlaceholderTen}
                filterOption={[]}
              >
                <Option value="1" key="1">平均值</Option>
                <Option value="2" key="2">最大值</Option>
                <Option value="3" key="3">最小值</Option>
                <Option value="4" key="4">瞬时值</Option>
              </Select> :
              <Select
                onChange={this.changeDataType}
                mode="multiple"
                placeholder="可多选"
                value={dataTypes}
                style={{ width: '198px' }}
                maxTagCount={0}
                maxTagPlaceholder={this.maxTagPlaceholderFive}
                filterOption={[]}
              >
                <Option value="4" key="4">瞬时值</Option>
              </Select>
              }
            </div>
          </div>
          <div className={styles.dataExportBottom}>
            {showResetBtn ?
             <Button className={styles.reset} onClick={this.reset}>重置</Button>
            : ''}
             <Button className={styles.generate} onClick={this.generate} disabled={!showGenerateBtn}>生成任务</Button>
          </div>
        </div>
    )
  }
}

export default DataExportSearch