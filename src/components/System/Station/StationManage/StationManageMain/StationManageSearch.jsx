

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

  onStationTypeSelect = (e) => {
    console.log(e.target.value);
    const { enterpriseId, getStationList } = this.props;
    // getStationList({ enterpriseId })
  }

  onAreaChange = (e) => {
    console.log(e.target.value);
  }

  onStationNameChange = (e) => {
    console.log(e.target.value);
  }

  searchStationList = () => {
    console.log('根据条件查询列表')
  }

  resetSearchInfo = () => {
    console.log('重置查询条件')
  }

  render(){
    return (
      <div>
        <Radio.Group onChange={this.selectStationType}>
          <Radio.Button value="large">全部</Radio.Button>
          <Radio.Button value="default">风电</Radio.Button>
          <Radio.Button value="small">光伏</Radio.Button>
        </Radio.Group>
        <div>
          <span>区域</span>
          <Input placeholder="请输入..." onChange={this.onAreaChange} />
          <span>电站名称</span>
          <Input placeholder="请输入..." onChange={this.onStationNameChange} />
          <Button onClick={this.searchStationList}>查询</Button>
          <Button onClick={this.resetSearchInfo}>重置</Button>
        </div>
      </div>
    )
  }
}

export default StationManageSearch;
