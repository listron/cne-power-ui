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
        xPoint:[],
      }
    })
  }

  selectPoints = (value) => { // 选择x轴测点
    const { changeScatterDiagramStore,queryParam } = this.props;
    const {devicePointCode} = queryParam;
    if (devicePointCode.length > 0) {
      console.log(456);
    }
    changeScatterDiagramStore({
      queryParam:{
        ...queryParam,
        devicePointCode: value,
      }
    })
  }


  render(){
    const { queryParam, stations, deviceTypeCode, selectStationType, xPointList, yPointList, stationTypeCount} = this.props;
    const { stationCode, deviceFullCode, startTime, endTime, devicePointCode} = queryParam;
    console.log(selectStationType);
    
    return(
      <div className={styles.scatterDiagramSearch}>
        <div className={styles.searchPart}>
          <div className={styles.stationSelect}>
            <span className={styles.text}>选择电站</span>
            <StationSelect 
            data={typeof(selectStationType) === 'number' ? stations.filter(e => e.stationType === selectStationType) : stations}
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
          <div className={styles.xPointSelect}>
            <span className={styles.text}>x轴测点</span>
            <Select 
            className={styles.pointSelect} 
            onChange={this.selectPoints}  
            placeholder="请选择x轴测点" 
            disabled={!deviceFullCode}>
              <Option key={''} value={''}>{'全部测点'}</Option>
              {xPointList.map(e=>{
                if(!e){ return null; }
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div>
          <div className={styles.xPointSelect}>
            <span className={styles.text}>y轴测点</span>
            <Select 
            className={styles.pointSelect} 
            onChange={this.selectPoints} 
            placeholder="请选择y轴测点" 
            disabled={!deviceFullCode}>
              <Option key={''} value={''}>{'全部测点'}</Option>
              {yPointList.map(e=>{
                if(!e){ return null; }
                return <Option key={e.devicePointCode} value={e.devicePointCode}>{e.devicePointName}</Option>
              })}
            </Select>
          </div>
        </div>
      </div>
    )
  }
}

export default ScatterDiagramSearch;