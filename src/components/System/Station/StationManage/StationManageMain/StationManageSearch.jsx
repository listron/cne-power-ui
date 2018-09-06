

import React, { Component } from 'react';
import { Input, Button, Radio } from 'antd';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';


class StationManageSearch extends Component {
  static propTypes = {
    enterpriseId: PropTypes.string,
    getStationList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {

    }
  }

  selectStationType = (value) => {
    console.log(value)
    const { enterpriseId, getStationList } = this.props;
    getStationList({ enterpriseId })
  }


  render(){
    const selectedStationType = '';
    return (
      <div>
        <Radio.Group onChange={this.selectStationType}>
          <Radio.Button value="large">全部</Radio.Button>
          <Radio.Button value="default">风电</Radio.Button>
          <Radio.Button value="small">光伏</Radio.Button>
        </Radio.Group>
        search part wwwwwww 
      </div>
    )
  }
}

export default StationManageSearch;
