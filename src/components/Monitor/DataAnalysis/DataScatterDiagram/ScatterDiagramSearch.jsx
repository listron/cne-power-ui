import React,{Component} from 'react';
import styles from './scatterDiagram.scss';
import { Select, DatePicker, Button } from 'antd';
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
    scatterDiagramList: PropTypes.object,
    scatterDiagramType: PropTypes.string,
    changeScatterDiagramStore: PropTypes.func,
    getPoints: PropTypes.func,
    getChartScatterDiagram: PropTypes.func,
    getListScatterDiagram: PropTypes.func,
    downLoadFile: PropTypes.func,
  };

  state = {
    disableDateFun: (current) => current > moment(),
  }

  selectStation = (selectedStationInfo) => { // 选择电站
    const { changeScatterDiagramStore, queryParam } = this.props;
    changeScatterDiagramStore({
      deviceTypeCode: '101',
      queryParam:{
        ...queryParam,
        stationCode: selectedStationInfo,
        deviceFullCode: [],
        xPoint: null,
        yPoint: null,
      },
    })
  }

  selectedDevice = (devices) => { // 选择设备
    const { getPoints } = this.props;
    getPoints({ deviceFullCode: devices }); // x,y 测点记录要存储。若设备下有上次选择的测点，则默认选中。
  }

  xSelectPoints = (xPoint) => { // 选择x轴测点并存储。下次用户更新设备时，若有，则默认选中。
    const { changeScatterDiagramStore, queryParam  } = this.props;
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        xPoint,
      }
    })
  }
  
  ySelectPoints = (yPoint) => { // 选择y轴测点并存储。下次用户更新设备时，若有，则默认选中。
    const { changeScatterDiagramStore, queryParam  } = this.props;
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        yPoint,
      }
    })
  }

  calendarChange = (rangeMoments) => {
    if (rangeMoments.length === 1) {
      this.setState({ // 时间跨度不超过3个月
        disableDateFun: (current) => {
          const maxTime = moment(rangeMoments[0]).add(3, 'months');
          const minTime = moment(rangeMoments[0]).subtract(3, 'months');
          return current > moment() || current > maxTime || current < minTime;
        }
      })
    } else {
      this.setState({
        disableDateFun: (current) => current > moment(),
      })
    }
  }

  openChange = (status) => {
    !status && this.setState({ // 重置不可选日期为今日以前。
      disableDateFun: (current) => current > moment(),
    })
  } 

  timeChange = (timeMoment) => { // 选择时间
    const { changeScatterDiagramStore, queryParam  } = this.props;
    const [ startTime, endTime ] = timeMoment;
    const preStartTime = queryParam.startTime;
    const preEndTime = queryParam.endTime;
    if (startTime - preStartTime === 0 && endTime - preEndTime === 0) { // 未进行时间改变
      return;
    }
    if (startTime.isSame(preStartTime, 'd') && endTime.isSame(preEndTime, 'd')) { // 正在进行时间选择
      changeScatterDiagramStore({
        queryParam:{
          ...queryParam,
          startTime,
          endTime,
        }
      })     
    } else { // 进行的是日期选择
      const isToday  = endTime.isSame(moment(), 'd'); // 今天则用当前时间
      changeScatterDiagramStore({
        queryParam: {
          ...queryParam,
          startTime: startTime.startOf('d'),
          endTime: isToday ? moment() : endTime.startOf('d'),
        }
      })
    }
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
      fileName: `${stationInfo.stationName}-${deviceInfo.deviceName}-${startTime}散点图数据`,
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
    const { disableDateFun } = this.state;
    const { stations, queryParam, pointsInfo, scatterDiagramList, scatterDiagramType } = this.props;
    const { dataList = [] } = scatterDiagramList;
    const { stationCode, deviceFullCode, xPoint, yPoint, startTime, endTime } = queryParam;   
    const selectedStation = stationCode[0] || {};
    return(
      <div className={styles.scatterDiagramSearch}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>电站选择</span>
            <StationSelect 
              holderText={'请选择'}
              data={stations.filter(e => e.stationType === 0)}
              onOK={this.selectStation}
              value={stationCode}
              disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
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
              onChange={this.timeChange}
              onCalendarChange={this.calendarChange}
              onOpenChange={this.openChange}
              disabledDate={disableDateFun}
              value={[startTime, endTime]}
              renderExtraFooter={() => (
                <span className={styles.infoTip}>选择时间段须3个月内</span>
              )}
            />
          </div>
          <div className={styles.xPointSelect}>
            <span className={styles.text}>X轴测点</span>
            <Select
              showSearch
              className={styles.pointSelect}
              placeholder="请选择"
              disabled={deviceFullCode.length === 0}
              value={xPoint}
              optionFilterProp="children"
              onChange={this.xSelectPoints}
              filterOption={(text, option) => option.props.children.toLowerCase().indexOf(text.toLowerCase()) >= 0}
            >
             {pointsInfo.filter(e => e.devicePointCode !== yPoint).map(e => {
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
            })}
          </Select>
          </div>
          <div className={styles.xPointSelect}>
            <span className={styles.text}>Y轴测点</span>
            <Select
            showSearch
            className={styles.pointSelect}
            placeholder="请选择"
            disabled={deviceFullCode.length === 0}
            value={yPoint}
            optionFilterProp="children"
            onChange={this.ySelectPoints}
            filterOption={(text, option) => option.props.children.toLowerCase().indexOf(text.toLowerCase()) >= 0}
          >
           {pointsInfo.filter(e => e.devicePointCode !== xPoint).map(e => {
              return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
            })}
          </Select>
          </div>
          <div className={styles.rightHandle}>
            <Button type="default" className={styles.searchInfo} onClick={this.searchPointList} disabled={!xPoint || !yPoint}>查询</Button>
            {scatterDiagramType === 'list' &&<Button  type="default" className={styles.exportPoint} onClick={this.exportPointList} disabled={dataList.length === 0 }>导出</Button> }
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterDiagramSearch;