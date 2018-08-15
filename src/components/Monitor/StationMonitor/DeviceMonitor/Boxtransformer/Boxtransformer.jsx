import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Boxtransformer extends Component {
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
        <h1>箱变开始！准备发电赚钱了</h1>
        <Button>
          <Link to="/hidden/monitorDevice/73/203/112233445566">箱变哈哈去气象站</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/206/112233445566">箱变直接去去组串逆变器</Link>
        </Button>
        <Button>
          <Link to="/hidden/monitorDevice/73/202/112233445566">相伴箱变走走走去汇流箱</Link>
        </Button>
      </div>
    )
  }
}

export default Boxtransformer;

