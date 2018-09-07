

import React, { Component } from 'react';
import { Input, Button, Radio } from 'antd';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';


class StationManageSearch extends Component {
  static propTypes = {
    stationType: PropTypes.number,
    regionName: PropTypes.string,
    stationName: PropTypes.string,
    queryListParams: PropTypes.object, // 所有上级传下来用于请求表格的参数集合对象
    getStationList: PropTypes.func,
    changeStationManageStore: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      regionName: '',
      stationName: '',
    }
  }

  onStationTypeSelect = (e) => {
    const { getStationList, queryListParams } = this.props;
    getStationList({
      ...queryListParams,
      stationType: e.target.value
    })
  }

  onRegionChange = (e) => {
    this.setState({
      regionName: e.target.value,
    })
  }

  onStationNameChange = (e) => {
    this.setState({
      stationName: e.target.value,
    })
  }

  searchStationList = () => { // 区域，电站名查询
    const { queryListParams, getStationList } = this.props;
    const { regionName, stationName } = this.state;
    getStationList({
      ...queryListParams,
      regionName,
      stationName,
    })
  }

  resetSearchInfo = () => { // 重置
    const { queryListParams, getStationList } = this.props;
    this.setState({
      regionName: '',
      stationName: '',
    })
    getStationList({
      ...queryListParams,
      regionName: '',
      stationName: '',
    })
  }

  showStationDetail = () => { // 返回详情页
    this.props.changeStationManageStore({
      showPage: 'detail',
    })
  }

  render(){
    const { regionName, stationName, stationType} = this.props;
    const showResetButton = regionName || stationName;
    return (
      <div>
        <Radio.Group value={stationType} onChange={this.onStationTypeSelect}>
          <Radio.Button value={2}>全部</Radio.Button>
          <Radio.Button value={0}>风电</Radio.Button>
          <Radio.Button value={1}>光伏</Radio.Button>
        </Radio.Group>
        <Button onClick={this.showStationDetail}>测试去详情按钮</Button>
        <div>
          <span>区域</span>
          <Input placeholder="请输入..." onChange={this.onRegionChange} />
          <span>电站名称</span>
          <Input placeholder="请输入..." onChange={this.onStationNameChange} />
          <Button onClick={this.searchStationList}>查询</Button>
          {showResetButton && <Button onClick={this.resetSearchInfo}>重置</Button>}
        </div>
      </div>
    )
  }
}

export default StationManageSearch;
