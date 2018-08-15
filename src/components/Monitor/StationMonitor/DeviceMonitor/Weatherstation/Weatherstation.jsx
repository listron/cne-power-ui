import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Weatherstation extends Component {
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
        <h1>气象站气象站，我们的气象站！</h1>
        <Button>
          <Link to="/hidden/monitorDevice/73/206/112233445566">气象站去组串逆变器</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/202/112233445566">气象站去汇流箱</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/304/112233445566">气象站去箱变</Link>
        </Button>
      </div>
    )
  }
}

export default Weatherstation;

