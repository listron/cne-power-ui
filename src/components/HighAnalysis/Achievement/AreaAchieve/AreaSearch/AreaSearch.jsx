

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker, Cascader } from 'antd';
import moment from 'moment';
import styles from './areaSearch.scss';
import searchUtil from '../../../../../utils/searchUtil';
import AreaStation from '../../../../Common/AreaStation';
import AutoSelect from '../../../../Common/AutoSelect';
const { RangePicker } = DatePicker;

export default class AreaSearch extends Component {

  static propTypes = {
    location: PropTypes.object,
    areaStation: PropTypes.array,
    quotaInfo: PropTypes.array,
    modesInfo: PropTypes.array,
  };

  constructor(props){
    super(props);
    const { search } = props.location;
    const groupInfoStr = searchUtil(search).getValue('area');
    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    this.state = {
      stations: groupInfo.stations || [],
      modes: groupInfo.modes || [],
      dates: groupInfo.dates || [],
      quota: groupInfo.quota || [],
    };
  }

  componentWillReceiveProps(nextProps){
    // 得到区域数据 ==> 请求机型 areaStation

    // 区域, 机型, 时间, 指标, 四个由无到有的那刻 => 自动请求数据 history.push(...)。
  }

  onAreaChange = (info) => {
    const stations = [];
    info.forEach(e => {
      const tmp = e.stations || [];
      tmp.forEach(m => stations.push(m.stationCode));
    });
    this.setState({ stations });
    // 重新请求机型数据
  };

  onModelChange = (modes) => this.setState({ modes: modes.map(e => e.value) });

  onDateChange = ([], [start, end]) => this.setState({ dates: [start, end] });

  onQuotaChange = (quota) => {
    this.setState({ quota });
  };

  queryCharts = () => {
    // 组合state参数, 发起history.push操作。
    console.log('请求');
  };

  resetCharts = () => {
    console.log('重置');
  };

  render() {
    const {
      areaStation,
      modesInfo,
      quotaInfo,
    } = this.props;
    const { stations, modes, dates, quota } = this.state;
    return (
      <div className={styles.topSearch}>
        <div>
          <span>选择区域</span>
          <AreaStation mode="region" data={areaStation} value={stations} onChange={this.onAreaChange} />
        </div>
        <div>
          <span>选择机型</span>
          <AutoSelect style={{width: '150px'}} data={modesInfo} value={modes} onChange={this.onModelChange} />
        </div>
        <div>
          <span>选择时间</span>
          <RangePicker
            allowClear={false}
            value={[moment(dates[0]), moment(dates[1])]}
            onChange={this.onDateChange}
            style={{width: '220px'}}
          />
        </div>
        <div>
          <span>选择指标</span>
          <Cascader
            allowClear={false}
            style={{width: '150px'}}
            options={quotaInfo}
            onChange={this.onQuotaChange}
            value={quota}
          />
        </div>
        <div>
          <Button style={{marginRight: '20px'}} onClick={this.queryCharts}>查询</Button>
          <Button onClick={this.resetCharts}>恢复图表</Button>
        </div>
      </div>
    );
  }
}
