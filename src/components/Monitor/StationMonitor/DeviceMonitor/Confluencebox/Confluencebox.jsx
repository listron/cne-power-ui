import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Confluencebox extends Component {
  static propTypes = {
    match: PropTypes.object,
    getMonitorDeviceData: PropTypes.func,
  }

  componentDidMount(){
    const { deviceCode, deviceTypeCode,stationCode } = this.props.match.params
    this.props.getMonitorDeviceData({
      stationCode,
      deviceCode,
      deviceTypeCode
    })
  }

  render(){
    return (
      <div>
        <h1>汇流箱汇流，嘎嘎嘎嘎嘎</h1>
        <Button>
          <Link to="/hidden/monitorDevice/73/203/112233445566">汇流箱汇流，嘎嘎嘎嘎嘎去气象站</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/206/112233445566">汇流箱汇流，嘎嘎嘎嘎嘎去组串逆变器</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/304/112233445566">汇流箱汇流，嘎嘎嘎嘎嘎去箱变</Link>
        </Button>
      </div>
    ) 
  }
}

export default Confluencebox;

