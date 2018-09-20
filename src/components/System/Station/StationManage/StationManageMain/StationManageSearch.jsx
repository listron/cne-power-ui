

import React, { Component } from 'react';
import { Input, Button, Radio } from 'antd';
import styles from './stationMain.scss';
import PropTypes from 'prop-types';


class StationManageSearch extends Component {
  static propTypes = {
    stationType: PropTypes.string,
    regionName: PropTypes.string,
    stationName: PropTypes.string,
    queryListParams: PropTypes.object, // 所有上级传下来用于请求表格的参数集合对象
    getStationList: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      regionNameState: '',
      stationNameState: '',
    }
  }

  onStationTypeSelect = (e) => {
    const { getStationList, queryListParams } = this.props;
    getStationList({
      ...queryListParams,
      stationType: e.target.value,
      pageNum: 1,
    })
  }

  onRegionChange = (e) => {
    this.setState({
      regionNameState: e.target.value,
    })
  }

  onStationNameChange = (e) => {
    this.setState({
      stationNameState: e.target.value,
    })
  }

  searchStationList = () => { // 区域，电站名查询
    const { queryListParams, getStationList } = this.props;
    const { regionNameState, stationNameState } = this.state;
    getStationList({
      ...queryListParams,
      regionName: regionNameState,
      stationName: stationNameState,
      pageNum: 1,
    })
  }

  resetSearchInfo = () => { // 重置
    const { queryListParams, getStationList } = this.props;
    this.setState({
      regionNameState: '',
      stationNameState: '',
    })
    getStationList({
      ...queryListParams,
      regionName: '',
      stationName: '',
      pageNum: 1,
    })
  }

  render(){
    const { regionName, stationName, stationType} = this.props;
    const showResetButton = regionName || stationName;
    const { regionNameState, stationNameState } = this.state;
    return (
      <div className={styles.stationSearch}>
        <div className={styles.typeSearch}>
          <span className={styles.title}>电站类型</span>
          <Radio.Group value={stationType} onChange={this.onStationTypeSelect}>
            <Radio.Button value={""} className={styles.eachButton}>全部</Radio.Button>
            <Radio.Button value={"0"} className={styles.eachButton}>风电</Radio.Button>
            <Radio.Button value={"1"} className={styles.eachButton}>光伏</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles.inputSearch}>
          <span className={styles.area}>区域</span>
          <Input className={styles.searchInput} placeholder="请输入..." onChange={this.onRegionChange} value={regionNameState} />
          <span className={styles.name}>电站名称</span>
          <Input className={styles.searchInput} placeholder="请输入..." onChange={this.onStationNameChange} value={stationNameState} />
          <Button onClick={this.searchStationList} className={styles.searchButton}>查询</Button>
          {showResetButton && <span onClick={this.resetSearchInfo} className={styles.searchReset}>重置</span>}
        </div>
      </div>
    )
  }
}

export default StationManageSearch;
