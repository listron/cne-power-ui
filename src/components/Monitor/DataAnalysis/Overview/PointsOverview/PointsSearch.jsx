


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AutoSelect from '@components/Common/AutoSelect';
import styles from './point.scss';

class PointsSearch extends PureComponent{
  static propTypes = {
    pointParam: PropTypes.object,
    pointConnectedDevices: PropTypes.array,
    pointList: PropTypes.array,
    pointsCheckedList: PropTypes.array,
    deviceChanged: PropTypes.func,
    pointsChanged: PropTypes.func,
  }

  deviceCheck = (deviceList = []) => {
    const { deviceCode } = deviceList[0] || {};
    this.props.deviceChanged(deviceCode);
  }

  pointsCheck = (points = []) => {
    this.props.pointsChanged(points.map(e => e.value));
  }

  render(){
    const { pointConnectedDevices, pointList, pointsCheckedList, pointParam } = this.props;
    const { deviceFullcode } = pointParam;
    return(
      <div className={styles.middleSearch}>
        <span className={styles.deviceText}>设备名称</span>
        <div>
          {pointList.map(e => (
            <span key={e.value}>{e.name}</span>
          ))}
        </div>
        <AutoSelect
          data={[{
            value: 'devices',
            label: '设备',
            children: pointConnectedDevices,
          }]}
          value={pointsCheckedList}
          onChange={this.deviceCheck}
          style={{width: '200px', marginRight: '8px'}}
          maxTagCount={0}
        />
        <span className={styles.pointText}>测点</span>
        <AutoSelect
          data={[{
            value: 'points',
            label: '测点',
            children: pointList,
          }]}
          value={[deviceFullcode]}
          onChange={this.pointsCheck}
          style={{width: '200px', marginRight: '8px'}}
          maxTagCount={0}
        />
      </div>
    );
  }
}


export default PointsSearch;
