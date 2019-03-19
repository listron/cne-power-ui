import React,{Component} from 'react';
import styles from './scatterDiagram.scss';
import { Select, DatePicker, Button, message } from 'antd';
import PropTypes from 'prop-types';
import path from '../../../../constants/path';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';
import moment from 'moment';

const { APIBasePath } = path.basePaths;
const { monitor } = path.APISubPaths;
const { Option } = Select;
const { RangePicker } = DatePicker;

class ScatterDiagramSearch extends Component{
  static propTypes = {
    stations: PropTypes.array,
    queryParam: PropTypes.object,
    listParam: PropTypes.object,
    pointsInfo: PropTypes.array,
    changeScatterDiagramStore: PropTypes.func,
    getPoints: PropTypes.func,
    getChartScatterDiagram: PropTypes.func,
    getListScatterDiagram: PropTypes.func,
    downLoadFile: PropTypes.func,
  };

  selectStation = (selectedStationInfo) => { // 选择电站
    const { changeScatterDiagramStore, queryParam } = this.props;
    changeScatterDiagramStore({
      deviceTypeCode: '101',
      queryParam:{
        ...queryParam,
        stationCode: selectedStationInfo,
        deviceFullCode: null,
        xPointCode: null,
        yPointCode: null,
      },
      pointsInfo: [],
    })
  }

  selectedDevice = (devices) => { // 选择设备
    const { getPoints, changeScatterDiagramStore, queryParam } = this.props;
    getPoints({ deviceFullCode: devices });
    changeScatterDiagramStore({
      queryParam: {
        ...queryParam,
        deviceFullCode: devices,
        xPointCode: null,
        yPointCode: null,
      }
    })
  }

  xSelectPoints = (xPointCode) => { // 选择x轴测点
    const { changeScatterDiagramStore, queryParam  } = this.props;
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        xPointCode,
      }
    })
  }
  
  ySelectPoints = (yPointCode) => { // 选择y轴测点
    const { changeScatterDiagramStore, queryParam  } = this.props;
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        yPointCode,
      }
    })
  }

  timeChange = (timeMoment) => { // 选择时间
    const { changeScatterDiagramStore, queryParam  } = this.props;
    const [ startTime, endTime ] = timeMoment;
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        startTime,
        endTime,
      }
    })
  }

  searchPointList = () => { // 测点查询
    const { listParam, queryParam, getListScatterDiagram, getChartScatterDiagram } = this.props;
    getListScatterDiagram({
      queryParam,
      listParam,
    })
    getChartScatterDiagram({
      queryParam
    })
  }

  exportPointList = () => { // 导出表格
    const { downLoadFile, queryParam } = this.props;
    const url = `${APIBasePath}${monitor.exportScatterDiagram}`;
    const { startTime, endTime, stationCode, deviceFullCode } = queryParam;
    const stationInfo = stationCode[0] || {};
    const deviceInfo = deviceFullCode[0] || {};
    const timeZone = moment().zone() / (-60);
    
    downLoadFile({ 
      url,
      fileName: `${startTime}至${endTime}散点图数据`,
      params: {
        ...queryParam,
        stationCode: stationInfo.stationCode,
        deviceFullCode: deviceInfo.deviceCode,
        startTime: moment(startTime).utc().format(),
        endTime: moment(endTime).utc().format(),
        timeZone,
      },
    })
  }

  render(){
    const { stations, queryParam, pointsInfo } = this.props;
    const { stationCode, deviceFullCode, xPointCode, yPointCode, startTime, endTime } = queryParam;
    const selectedStation = stationCode[0] || {};
    return(
      <div className={styles.scatterDiagramSearch}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站选择</span>
            <StationSelect 
              holderText={'请选择'}
              // data={typeof(selectStationType) === 'number' ? stations.filter(e => e.stationType === selectStationType) : stations}
              data={stations.filter(e => e.stationType === 0)}
              onOK={this.selectStation}
              value={stationCode}
            />
          </div>
          <div className={styles.deviceSelect}>
            <span className={styles.text}>设备选择</span>
            <DeviceSelect 
              holderText={'请选择'}
              disabled={!selectedStation.stationCode}
              stationCode={selectedStation.stationCode}
              value={deviceFullCode}
              deviceTypeCode={101}
              multiple={false}
              deviceShowNumber={true}
              style={{ width: '198px', minWidth: '183px' }}
              onChange={this.selectedDevice} 
            />
            
          </div>
          <div className={styles.timeSelect}>
            <span className={styles.text}>时间</span>
            <RangePicker
              allowClear={false}
              format="YYYY-MM-DD HH:mm"
              showTime
              disabledDate={(current) => current > moment()}
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
              disabled={pointsInfo.length === 0}
            >
              {pointsInfo.filter(e => e !== xPointCode).map(e => {
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
              disabled={pointsInfo.length === 0}
            >
              {pointsInfo.filter(e => e !== yPointCode).map(e => {
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div>
          <div className={styles.rightHandle}>
            <Button className={styles.searchInfo} onClick={this.searchPointList}>查询</Button>
            {/* <Button className={styles.exportPoint} onClick={this.exportPointList} disabled={dataList.length === 0}>导出</Button> */}
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterDiagramSearch;