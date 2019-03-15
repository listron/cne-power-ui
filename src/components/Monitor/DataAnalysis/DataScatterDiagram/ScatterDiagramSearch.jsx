import React,{Component} from 'react';
import styles from './scatterDiagram.scss';
import { Select, DatePicker, Button, message } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;

const { Option } = Select;
const { RangePicker } = DatePicker;

class ScatterDiagramSearch extends Component{
  static propTypes = {
    stations: PropTypes.array,
    deviceTypeCode: PropTypes.number, // 选中的设备类型
    queryParam: PropTypes.object,
    changeScatterDiagramStore: PropTypes.func,
    getDeviceModel: PropTypes.func,
    getPointInfo: PropTypes.func,
    selectStationType: PropTypes.number, // 选中的电站类型
    xPointList: PropTypes.array,
    yPointList: PropTypes.array,
    queryListParams: PropTypes.object, // 所有上级传下来用于请求表格的参数集合对象
    getListScatterDiagram: PropTypes.func,
  };

  constructor(props){
    super(props);
    this.state = {
     stationName: '',
     stationDeviceType: '', 
     isShow: false,
    }
  }



  selectStation = (selectedStationInfo) => { // 选择电站
    const { getDeviceModel, changeScatterDiagramStore, queryParam, deviceTypeCode } = this.props;
    const { stationCode } = selectedStationInfo[0];
    getDeviceModel({ // 设备型号
      stationCodes: stationCode,
    });
    
    changeScatterDiagramStore({
      deviceTypeCode: '101',
      queryParam:{
        ...queryParam,
        stationCode,
        deviceFullCode: [],
        devicePointCode: [],
        xPoint:[],
      }
    })
  }

  selectedDevice = (devices) => { // 选择设备
    const { getPointInfo, changeScatterDiagramStore, queryParam } = this.props;
    getPointInfo({ // 测点
      deviceFullCode: devices,
    });
    changeScatterDiagramStore({
      queryParam: {
        ...queryParam,
        deviceFullCode: devices,
        devicePointCode: '',
        xPoint: [],
        yPoint: [],
      }
    })
  }

  xSelectPoints = (value) => { // 选择x轴测点
    const { changeScatterDiagramStore, queryParam, xPointList, yPointList  } = this.props;
    const { devicePointCode } = queryParam;
    // xPointList.map(e => {
    //   if(xPointList[0].devicePointCode === yPointList[0].devicePointCode){
    //     yPointList[0] = []
    //   }
    // })
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        devicePointCode: value,
      }
    })
  }
  
  ySelectPoints = (value) => { // 选择y轴测点
    const { changeScatterDiagramStore, queryParam, xPointList, yPointList  } = this.props;
    const { devicePointCode } = queryParam;    
    yPointList.map(e => {
      if(xPointList[e].devicePointCode === yPointList[e].devicePointCode){
        xPointList[e] = []
      }
    })
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        devicePointCode: value,
      }
    })
  }

  timeChange = (timeMoment) => { // 选择时间
    this.scatterDiagramDataFetch({
      startTime: timeMoment[0],
      endTime: timeMoment[1]
    })
  }

  scatterDiagramDataFetch = (params) => {
    const { changeScatterDiagramStore, queryParam, listParam, getChartScatterDiagram, getListScatterDiagram } = this.props;
    const { xPoint, yPoint } = queryParam;
    if (xPoint && yPoint) { // 选择测点后重新请求数据
      const newQueryParam = {
        ...queryParam,
        ...params
      }
      // getChartScatterDiagram({
      //   queryParam : newQueryParam
      // })
      // getListScatterDiagram({
      //   queryParam : newQueryParam,
      //   listParam
      // })
      changeScatterDiagramStore({
        queryParam : newQueryParam,
        listParam
      })
    } else {
      changeScatterDiagramStore({ ...params })
    }
  }

  searchPointList = (selectXPoint, selectYPoint) => { // 测点查询
    const { listParam, queryParam, getListScatterDiagram, getChartScatterDiagram, xPointList, yPointList} = this.props;
    if(xPointList.length === 0 || yPointList.length.length === 0){
      message.error('请先选择测点');
      return;
    }
    const newQueryParam = {
      ...queryParam,
      xPoint: selectXPoint,
      yPoint: selectYPoint,
    }
    getListScatterDiagram({
      queryParam: newQueryParam,
      listParam,
    })
    getChartScatterDiagram({
      queryParam: newQueryParam
    })
  }

  exportPointList = () => { // 导出表格
    const { downLoadFile, queryParam, enterpriseId } = this.props;
    const url = `${APIBasePath}${monitor.exportScatterDiagram}`;
    let { startTime, endTime, deviceFullCode, xPoint, yPoint, } = queryParam;
    startTime = startTime.utc().format();
    endTime = endTime.utc().format();
    downLoadFile({ 
      url,
      fileName: `${startTime}至${endTime}散点图数据`,
      params: {
        ...queryParam,
        deviceFullCode: deviceFullCode.map(e => e.deviceCode),
        enterpriseId,
        startTime,
        endTime,
      },
    })
  }

  render(){
    const { queryParam, stations, deviceTypeCode, selectStationType, xPointList, yPointList, partScatterDiagram = {}} = this.props;
    const { stationCode, deviceFullCode, startTime, endTime, devicePointCode} = queryParam;
    const { dataList = [] } = partScatterDiagram;
    const xPointSelectDisable = xPointList.length === 0; // 显示x轴测点
    const yPointSelectDisable = yPointList.length === 0; // 显示y轴测点
    
    return(
      <div className={styles.scatterDiagramSearch}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>选择电站</span>
            <StationSelect 
            holderText={'请选择'}
            data={typeof(selectStationType) === 'number' ? stations.filter(e => e.stationType === selectStationType) : stations}
            onOK={this.selectStation}
            value={stations.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div className={styles.deviceSelect}>
            <span className={styles.text}>选择设备</span>
            <DeviceSelect 
            holderText={'请选择'}
            disabled={!deviceTypeCode}
            stationCode={stationCode}
            value={deviceFullCode}
            deviceTypeCode={deviceTypeCode}
            multiple={false}
            style={{ width: 'auto', minWidth: '198px' }}
            onChange={this.selectedDevice} 
            />
          </div>
          <div className={styles.timeSelect}>
            <span className={styles.text}>时间选择</span>
            <RangePicker
              allowClear={false}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this.timeChange}
              value={[startTime, endTime]}
            />
          </div>
          <div className={styles.xPointSelect}>
            <span className={styles.text}>X轴测点</span>
            <Select 
            className={styles.pointSelect} 
            onChange={this.xSelectPoints}  
            placeholder="请选择" 
            disabled={xPointSelectDisable}>
              <Option key={''} value={''}>{'请选择'}</Option>
              {xPointList.map(e=>{
                if(!e){ return null; }
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div>
          <div className={styles.xPointSelect}>
            <span className={styles.text}>Y轴测点</span>
            <Select 
            className={styles.pointSelect} 
            onChange={this.ySelectPoints} 
            placeholder="请选择" 
            disabled={yPointSelectDisable}>
              <Option key={''} value={''}>{'请选择'}</Option>
              {yPointList.map(e=>{
                if(!e){ return null; }
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div>
          <div className={styles.rightHandle}>
            <Button className={styles.searchInfo} onClick={this.searchPointList}>查询</Button>
            <Button className={styles.exportPoint} onClick={this.exportPointList} disabled={dataList.length === 0}>导出</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterDiagramSearch;