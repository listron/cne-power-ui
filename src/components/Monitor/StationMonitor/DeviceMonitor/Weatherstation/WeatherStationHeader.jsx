import React from 'react';
import { deviceStatusArray } from '../../../../../constants/stationBaseInfo';
import styles from '../eachDeviceMonitor.scss';
// import PropTypes from 'prop-types';

const WeatherStationHeader = ({ deviceDetail }) => {
  const { deviceStatus } = deviceDetail;
  const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
  return (
    <div className={styles.deviceMonitorHeader} >
      <div className={styles.deviceName}>
        <span className={styles.weatherStationName}>{deviceDetail.deviceName}</span>
        <span className={styles.status} >设备状态: { deviceStatusInfo && deviceStatusInfo.statusName || ''}</span>
      </div>
    </div>
  )
}
// class WeatherStationHeader extends Component {

//   static propTypes = {
//     deviceDetail: PropTypes.object,
//   }

//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { deviceDetail } = this.props;
//     const { deviceStatus } = deviceDetail;
//     const deviceStatusInfo = deviceStatusArray.find(e=>parseInt(e.statusCode) === parseInt(deviceStatus));
//     return (
//       <div className={styles.deviceMonitorHeader} >
//         <div className={styles.deviceName}>
//           <span className={styles.weatherStationName}>{deviceDetail.deviceName}</span>
//           <span className={styles.status} >设备状态: { deviceStatusInfo && deviceStatusInfo.statusName || ''}</span>
//         </div>
//       </div>
//     )
//   }
// }
export default WeatherStationHeader;