import React,{Component} from 'react';
import styles from './scatterDiagram.scss';
import { Select, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';

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
  };


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
        xPoint: [],
        yPoint: [],
      }
    })
  }

  selectedDevice = (devices) => { // 选择设备
    const { getPointInfo, changeScatterDiagramStore, queryParam } = this.props;
    changeScatterDiagramStore({
      queryParam: {
        ...queryParam,
        deviceFullCode: devices,
        xPoint: [],
        yPoint: [],
      }
    })
    getPointInfo({ 
      deviceFullCode: devices,
     });
    
  }

  // timeChange = () => { // 选择时间

  // }

  // scatterDiagramDataFetch = () => {
  //   const { changeScatterDiagramStore, queryParam } = this.props;
  //   const { devicePoint } = queryParam;
  //   if (devicePoint.length > 0) {
      
  //   }
  // }

  // selectPoints = (value) => { // 选择x轴测点
  //   const { changeScatterDiagramStore,devicePointCode } = this.props;
  //   changeScatterDiagramStore({
  //     devicePointCode: value,
  //   })
  // }

  render(){
    const { queryParam, stations, deviceTypeCode } = this.props;
    const { stationCode, deviceFullCode, startTime, endTime, xPoint, yPoint } = queryParam;
    return(
      <div className={styles.scatterDiagramSearch}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>选择电站</span>
            <StationSelect 
            data={stations}
            onOK={this.selectStation}
            value={stations.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div className={styles.deviceSelect}>
            <span className={styles.text}>选择设备</span>
            <DeviceSelect 
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
          {/* <div className={styles.xPointSelect}>
            <span className={styles.text}>x轴测点</span>
            <Select className={styles.pointSelect} onChange={this.selectPoints} value={deviceFullCode} placeholder="请选择x轴测点" disabled={!deviceFullCode}>
              <Option key={''} value={''}>{'全部测点'}</Option>
              {xPoint.map(e=>{
                if(!e){ return null; }
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div>
          <div className={styles.xPointSelect}>
            <span className={styles.text}>y轴测点</span>
            <Select className={styles.pointSelect} onChange={this.selectPoints} value={deviceFullCode} placeholder="请选择y轴测点" disabled={!deviceFullCode}>
              <Option key={''} value={''}>{'全部测点'}</Option>
              {yPoint.map(e=>{
                if(!e){ return null; }
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div> */}
        </div>
      </div>
    )
  }
}

export default ScatterDiagramSearch;