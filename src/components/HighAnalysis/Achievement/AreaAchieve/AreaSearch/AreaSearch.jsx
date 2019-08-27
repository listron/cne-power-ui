

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, DatePicker, Cascader } from 'antd';
import moment from 'moment';
import styles from './areaSearch.scss';
import searchUtil from '../../../../../utils/searchUtil';
import AreaStation from '../../../../Common/AreaStation';
import AutoSelect from '../../../../Common/AutoSelect';
const { RangePicker } = DatePicker;

// 禁止选择时间
const disabledDate = current => current && current > moment().subtract(2, 'days');

export default class AreaSearch extends Component {

  static propTypes = {
    location: PropTypes.object,
    areaStation: PropTypes.array,
    quotaInfo: PropTypes.array,
    modesInfo: PropTypes.array,
    getModesInfo: PropTypes.func,
    history: PropTypes.object,
    changeStore: PropTypes.func,
    dataName: PropTypes.string,
    queryParamsFunc: PropTypes.func,
  };

  constructor(props){
    super(props);
    const { search } = props.history.location;
    const groupInfoStr = searchUtil(search).getValue('area');

    const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
    const defaultEndTime = moment().subtract(2, 'days').format('YYYY-MM-DD');
    const defaultStartTime = moment(defaultEndTime).subtract(1, 'year').format('YYYY-MM-DD');
    this.state = {
      groupInfoStr,
      searchCode: groupInfo.searchCode,
      stations: groupInfo.stations || [],
      modes: groupInfo.modes || [],
      dates: groupInfo.dates || [defaultStartTime, defaultEndTime],
      quota: groupInfo.quota || [],
      modesInfo: groupInfo.modesInfo || [],
    };
  }

  componentDidMount() {
    const { searchCode } = this.state;
    searchCode && this.props.getModesInfo({ stationCodes: searchCode});
  }

  componentWillReceiveProps(nextProps){
    // 得到区域数据 ==> 请求机型 areaStation
    const { areaStation, modesInfo, quotaInfo } = nextProps;
    const { groupInfoStr } = this.state;
    const preArea = this.props.areaStation;
    const preDevice = this.props.modesInfo;
    const preQuota = this.props.quotaInfo;
    if (!groupInfoStr && preArea.length === 0 && areaStation.length > 0) { // 路径无参数时 得到电站数据
      this.propsAreaStationChange(areaStation);
    }
    if (!groupInfoStr && preDevice.length === 0 && modesInfo.length > 0 && !groupInfoStr) { // 路径无参数时  得到机型数据
      this.propsModeDevicesChange(modesInfo);
    }
    if (!groupInfoStr && preQuota.length === 0 && quotaInfo.length > 0 && !groupInfoStr) { // 路径无参数时  得到指标
      this.propsQuotaChange(quotaInfo);
    }
    // 判断选中区域之后机型数据变化
    if(JSON.stringify(preDevice) && JSON.stringify(preDevice) !== JSON.stringify(modesInfo)) {
      const modes = this.getAllDeviceCodes(modesInfo);
      this.setState({
        modes,
        modesInfo,
      });
    }
  }

  propsAreaStationChange = (areaStation = []) => { // 得到电站信息.
    const { stations = [] } = areaStation[0] || {};
    const firstStation = stations.map(cur => {
      return cur.stationCode;
    });
    this.props.getModesInfo({ stationCodes: firstStation });
    if (!this.state.searchCode) { // 路径无数据 => 存入state待请求.
      this.setState({
        searchCode: firstStation,
        stations: [areaStation[0]],
      });
    }
  };

  propsModeDevicesChange = (modeDevices) => { // 得到电站下机型信息;
    const { searchCode, dates, quota, stations } = this.state;
    const modes = this.getAllDeviceCodes(modeDevices);
    if (quota.length > 0) { // 已有指标
      this.historyChange(searchCode, modes, dates, quota, stations, modeDevices);
    } else { // 存入state, 得到quota时再请求
      this.setState({ modes, modesInfo: modeDevices});
    }
  };

  propsQuotaChange = (quotaInfo) => { // 得到指标
    const { searchCode, modes, dates, modesInfo, stations } = this.state;
    // 第一个指标作为数据
    const firstType = quotaInfo[0] || {};
    const quotas = firstType.children || [];
    const firstQuota = quotas[0] || {};
    const quota = [firstType.value, firstQuota.value];
    if (modes.length > 0) {
      this.historyChange(searchCode, modes, dates, quota, stations, modesInfo);
    } else { // 存入, 待设备得到再请求
      this.setState({ quota });
    }
  };

  historyChange = (searchCode, modes, dates, quota, stations, modesInfo) => { // 切换路径 => 托管外部进行请求
    const { location, history } = this.props;
    const { search } = location;
    const newSearch = searchUtil(search).replace({area: JSON.stringify({
        searchCode, modes, dates, quota, stations, modesInfo,
      })}).stringify();
    history.push(`/analysis/achievement/analysis/area?${newSearch}`);
  };

  getAllDeviceCodes = (modeDevices = []) => { // 解析所有机型得到codes数组
    const codes = [];
    modeDevices.forEach(e => {
      const { children = [] } = e || {};
      children.forEach(m => {
        codes.push(m.value);
      });
    });
    return codes;
  };

  onAreaChange = (info) => {
    const { changeStore } = this.props;
    const stations = [];
    info.forEach(e => {
      const tmp = e.stations || [];
      tmp.forEach(m => stations.push(m.stationCode));
    });
    this.setState({
      stations: info,
      searchCode: stations,
      modes: [],
    }, () => {
      changeStore({
        modesInfo: [],
      });
      this.props.getModesInfo({ stationCodes: stations});
    });
  };

  onModelChange = (modes) => {
    this.setState({ modes: modes.map(e => e.value) });
  };

  onDateChange = ([], [start, end]) => this.setState({ dates: [start, end] });

  onQuotaChange = (quota) => {
    this.setState({ quota });
  };

  queryCharts = () => {
    // 组合state参数, 发起history.push操作。
    const { searchCode, modes, dates, quota, stations, modesInfo } = this.state;
    const { changeStore } = this.props;
    changeStore({
      timeStatus: '2', // 日月年
      dataIndex: '', // 选中信息
      selectStationCode: [], // 选中电站信息
      selectTime: '', // 选中时间
      dataName: '', // 保存选择区域名称
    });
    this.historyChange(searchCode, modes, dates, quota, stations, modesInfo);
  };

  resetCharts = () => {
    const { groupInfoStr } = this.state;
    const { dataName, queryParamsFunc, changeStore } = this.props;
    // 判断如果选中过区域或时间可以重置图表
    if(dataName !== '') {
      const groupInfo = groupInfoStr ? JSON.parse(groupInfoStr) : {};
      changeStore({
        dataIndex: '', // 保存点击的下标
        selectStationCode: [], // 保存单选区域的信息
        selectTime: '', // 保存选择时间
        dataName: '', // 保存选择区域名称
      });
      queryParamsFunc(groupInfo);
    }
  };

  render() {
    const {
      areaStation,
      modesInfo,
      quotaInfo,
      dataName,
    } = this.props;
    const { modes, dates, quota, stations } = this.state;
    const stationsValue = [];
    stations && stations.forEach(cur => {
      const { stations = [] } = cur || {};
      stations.forEach(item => {
        stationsValue.push(item.stationCode);
      });
    });
    return (
      <div className={styles.topSearch}>
        <div>
          <span>选择区域</span>
          <AreaStation
            mode="region"
            data={areaStation}
            value={stations}
            onChange={this.onAreaChange}
          />
        </div>
        <div>
          <span>选择机型</span>
          <AutoSelect
            style={{width: '150px'}}
            data={modesInfo}
            value={modes}
            maxTagCount={0}
            onChange={this.onModelChange}
          />
        </div>
        <div>
          <span>选择时间</span>
          <RangePicker
            allowClear={false}
            value={[moment(dates[0]), moment(dates[1])]}
            onChange={this.onDateChange}
            style={{width: '220px'}}
            disabledDate={disabledDate}
          />
        </div>
        <div>
          <span>选择指标</span>
          <Cascader
            allowClear={false}
            style={{width: '150px'}}
            options={quotaInfo}
            placeholder="请选择"
            onChange={this.onQuotaChange}
            popupClassName={styles.cascaderBox}
            value={quota}
          />
        </div>
        <div>
          <Button style={{marginRight: '20px'}} onClick={this.queryCharts}>查询</Button>
          <Button disabled={dataName === ''} onClick={this.resetCharts}>恢复图表</Button>
        </div>
      </div>
    );
  }
}
