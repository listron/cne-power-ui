

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker, Cascader } from 'antd';
import styles from './groupStyle.scss';
import AreaStation from '../../../Common/AreaStation';
import AutoSelect from '../../../Common/AutoSelect';
const { RangePicker } = DatePicker;

const stationData = [{
  regionName: '山东',
  stations:	[{
    stationCode: 56,
    stationName: '山东平原',
  }, {
    stationCode: 560,
    stationName: '烟台电站',
  }],
}, {
  regionName: '河北',
  stations:	[{
    stationCode: 360,
    stationName: '阳光',
  }],
}];

const modesInfo = [{
  value: 1001123142,
  label: '金风科技',
  children: [{
    value: 'M12011M221M13',
    label: 'SD-13',
    children: [{
      value: 'M12#1',
      label: 'M12#1',
    }],
  }, {
    value: 'M12011M221M11',
    label: 'SD-11',
  }],
}, {
  value: 10011231445,
  label: '湘电',
  children: [{
    value: 'M35011M221M221',
    label: 'XD-221',
  }, {
    value: 'M35011M221M222',
    label: 'XD-222',
  }],
}];

const quotaInfo = [

];

class GroupSearch extends Component {

  static propTypes = {
    // areaStation: PropTypes.array,
    // quotaInfo: PropTypes.array,
  }
  
  constructor(props){
    super(props);
    console.log(props)
    this.state = {
      areas: [],
      modes: [],
      dates: [],
      quota: [],
    }
  }

  componentWillReceiveProps(nextProps){

  }

  onAreaChange = (areaInfo) => {
    console.log(areaInfo);
  }

  onModelChange = (a, b, c, d) => {
    console.log(a, b, c, d);
  }

  onDateChange = (a, b, c, d) => {
    console.log(a, b, c, d);
  }

  onQuotaChange = (a, b, c, d) => {
    console.log(a, b, c, d);
  }

  queryCharts = () => {
    console.log('请求');
  }

  resetCharts = () => {
    console.log('重置');
  }

  render() {
    // const { areaStation, modesInfo, quotaInfo } = this.props;
    return (
      <div className={styles.topSearch}>
        <div>
          <span>选择区域</span>
          <AreaStation data={stationData} onChange={this.onAreaChange} />
        </div>
        <div>
          <span>选择机型</span>
          <AutoSelect data={modesInfo} onChange={this.onModelChange} />
        </div>
        <div>
          <span>选择时间</span>
          <RangePicker onChange={this.onDateChange} style={{width: '200px'}} />
        </div>
        <div>
          <span>选择指标</span>
          <Cascader
            style={{width: '150px'}}
            options={quotaInfo}
            onChange={this.onQuotaChange}
          />
        </div>
        <div>
          <Button onClick={this.queryCharts}>查询</Button>
          <Button onClick={this.resetCharts}>恢复图表</Button>
        </div>
      </div>
    );
  }
}

export default GroupSearch;
