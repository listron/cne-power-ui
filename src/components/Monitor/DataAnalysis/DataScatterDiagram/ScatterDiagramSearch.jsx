import React,{Component} from 'react';
import styles from './scatterDiagram.scss';
import { Select } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import DeviceSelect from '../../../Common/DeviceSelect';

const { Option } = Select;

class ScatterDiagramSearch extends Component{
  render(){
    const {queryParam, selectStationType, stations, deviceTypeCode, stationDeviceTypes} = this.props;
    const {stationCode, deviceFullCode} = queryParam;
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
          <div className={styles.typeSelect}>
            <span className={styles.text}>选择设备类型</span>
            <Select
              style={{ width: '200px' }}
              value={deviceTypeCode}
              placeholder="选择设备类型"
              disabled={stationDeviceTypes.length === 0}
            >
              {stationDeviceTypes.map(e => (
                <Option key={e.deviceTypeCode} value={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              ))}
            </Select>
          </div>
          {/* <div className={styles.deviceSelect}>
            <span className={styles.text}>选择设备</span>
            <DeviceSelect 
            disabled={!deviceTypeCode}
            stationCode={stationCode}
            value={deviceFullCode}
            deviceTypeCode={deviceTypeCode}
            multiple={true}
            style={{ width: 'auto', minWidth: '198px' }}
            />
          </div> */}
        </div>
      </div>
    )
  }
}

export default ScatterDiagramSearch;