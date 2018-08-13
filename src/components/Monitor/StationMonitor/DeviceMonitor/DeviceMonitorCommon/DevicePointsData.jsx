import React, { Component } from 'react';
import CommonPagination from '../../../../Common/CommonPagination';
import styles from './deviceMonitorStatistics.scss';
import PropTypes from 'prop-types';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

class DevicePointsData extends Component {
  static propTypes = {
    devicePointData: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    const { devicePointData } = this.props;
    let pointListGroup = [],startIndex = 0;
    do{
      let eachPointGroup = devicePointData.slice(startIndex, startIndex + 10);
      startIndex += 10;
      pointListGroup.push(eachPointGroup);
    }while(startIndex < devicePointData.length)

    return (
      <div className={styles.pointDataList} >
        {pointListGroup.map(e=>(<div>
          {e.map(eachPoints => (<div>
            <span>{eachPoints.devicePointName}</span>
            <span>{eachPoints.devicePointValue} {eachPoints.devicePointUnit || ''}</span>
          </div>))}
        </div>))}
      </div>
    )
  }
  
}

export default DevicePointsData;