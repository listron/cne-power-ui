import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {Select, Button} from 'antd';


class DeviceName extends Component {
  static propTypes = {
    stationName: PropTypes.string,
    deviceType: PropTypes.string,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onChangeType: PropTypes.func,
    onChangeArea: PropTypes.func,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {

    };
    
  }

  

  render() {
    return (
      <div>
        
      </div>
    );
  }

}

export default DeviceName;