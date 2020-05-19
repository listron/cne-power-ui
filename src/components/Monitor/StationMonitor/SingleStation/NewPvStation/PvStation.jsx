

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PvStationTop from './PvStationTop';
import PvStationHeader from './PvStationHeader';
import PvDevice from './PvDevice';
import styles from './pvStation.scss';
import moment from 'moment';
import TransitionContainer from '../../../../Common/TransitionContainer';
import DetailCharts from './DetailCharts/DetailCharts';
import DeviceList from './DeviceList/DeviceList';

class PvStation extends Component {
  static propTypes = {
    changeSingleStationStore: PropTypes.func,
    location: PropTypes.object,
    match: PropTypes.object,
    deviceTypeCode: PropTypes.string,
    stationCode: PropTypes.string,
    resetSingleStationStore: PropTypes.func,
    getPvSingleStation: PropTypes.func,
    getCapabilityDiagram: PropTypes.func,
    getOperatorList: PropTypes.func,
    getWeatherList: PropTypes.func,
    getWorkList: PropTypes.func,
    getStationList: PropTypes.func,
    singleStationData: PropTypes.object,
    monitorPvUnit: PropTypes.object,
    workList: PropTypes.object,
    monthplanpower: PropTypes.func,
    getNewDeviceTypeFlow: PropTypes.func,
    getSketchmap: PropTypes.func,
    getPvMonitorPower: PropTypes.func,
    theme: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      hiddenStationList: false,
      queryFirst: true,
    };
  }

  componentDidMount() {
    const { stationCode } = this.props.match.params;
    const stationType = '1';
    const { search } = this.props.location;
    const tmpSearchData = search.replace('?', '').split('&').filter(e => e); //  search拆分验证是否有指定展示列表
    const searchData = tmpSearchData.map(e => {
      const subData = e.split('=');
      return { [subData[0]]: subData[1] };
    });
    const deviceTypeInfo = searchData.find(e => e.showPart > 0);
    if (deviceTypeInfo) {
      this.props.changeSingleStationStore({ deviceTypeCode: deviceTypeInfo.showPart });
    } else {
      this.props.changeSingleStationStore({ deviceTypeCode: '1' });
    }

    this.getOnceData(stationCode, stationType);
    this.getTenSeconds(stationCode, stationType);
  }


  componentWillReceiveProps(nextProps) {
    const { stationCode } = this.props.match.params;
    const nextStationCode = nextProps.match.params.stationCode;
    const nextStationType = '1';
    if (nextStationCode !== stationCode) {
      clearTimeout(this.timeOutId);
      this.getTenSeconds(nextStationCode, nextStationType);
      this.getOnceData(nextStationCode, nextStationType);
      this.props.changeSingleStationStore({ deviceTypeCode: '1' });
      this.singelDeatil(nextStationCode);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
    this.props.resetSingleStationStore();
  }

  getTenSeconds = (stationCode, stationType) => { // 1min请求一次数据 单电站 工单列表  天气情况 
    this.props.getPvSingleStation({ stationCode });
    this.timeOutId = setTimeout(() => {
      this.getTenSeconds(stationCode, stationType);
    }, 60000);
  }

  getOnceData = (stationCode, stationType) => { // 只请求一次数据
    const startTime = moment().subtract(1, 'days').format('YYYY-MM-DD'); // 查询昨天开始的未来7天的数据
    this.props.getWeatherList({ stationCode, dateReport: startTime }); // 天气
    this.props.getWorkList({
      stationCode,
      startTime: moment().set({ 'hour': 0, 'minute': 0, 'second': 0 }).utc().format(),
      endTime: moment().utc().format(),
    });
    this.props.getNewDeviceTypeFlow({ stationCode, stationType }); //获取设备类型流程图
    this.props.getOperatorList({ stationCode, roleId: '4,5' }); // 运维人员
  }

  getPowerDataTenMin = (value) => { // 默认请求intervalTime = 0 的日数据
    const { stationCode, intervalTime = 0 } = value;
    let startTime = moment().subtract(30, 'day').format('YYYY-MM-DD');// 默认是6天前;
    let endTime = moment().subtract(1, 'day').format('YYYY-MM-DD');
    if (intervalTime === 1) {
      startTime = moment().startOf('year').format('YYYY-MM-DD');
      endTime = moment().endOf('year').format('YYYY-MM-DD');
    } else if (intervalTime === 2) {
      startTime = moment().subtract(5, 'year').startOf('year').format('YYYY-MM-DD');
    }
    this.props.changeSingleStationStore({ powerData: [] });
    this.props.getPvMonitorPower({ stationCode, intervalTime, startTime, endTime });
  }

  getDeviceTypeFlow = (deviceTypeFlow, list = []) => { // 流程图
    deviceTypeFlow.forEach(e => {
      if (!(list.some(item => item.deviceTypeCode === e.code))) {
        list.push({
          deviceTypeCode: e.code,
          deviceTypeName: e.name,
          key: e.code,
        });
        if (e.parents) {
          this.getDeviceTypeFlow(e.parents, list);
        }
      }
    });
    return list;
  }

  singelDeatil = (stationCode) => { // 右侧单电站详情数据
    this.props.getCapabilityDiagram({ // 出力图
      stationCode,
      stationType: '1',
      startTime: moment().startOf('day').utc().format(),
      endTime: moment().endOf('day').utc().format(),
    });
    this.getPowerDataTenMin({ stationCode, stationType: '1' }); // 发电量
    this.props.monthplanpower({ stationCode }); // 月累计与计划发电量
  }

  detailShow = () => { // 查看详情
    this.setState({ detailVisible: true });
    const { stationCode } = this.props.match.params;
    const { queryFirst } = this.state;
    if (queryFirst) {
      this.singelDeatil(stationCode);
      this.setState({ queryFirst: false });
    }
  }

  hiddenStationList = () => {
    this.setState({
      hiddenStationList: true,
    });
  }

  detailHide = (value) => { // 关闭详情
    this.setState(value);
  }

  render() {
    const { singleStationData, editData, monitorPvUnit, deviceTypeFlow, theme } = this.props;
    const deviceTypeList = this.getDeviceTypeFlow([deviceTypeFlow]);
    const { detailVisible } = this.state;
    const { stationCode } = this.props.match.params;
    const { alarmNum } = singleStationData;
    return (
      <div className={`${styles.pvStationWrap} ${styles[theme]}`}>
        <div className={styles.pvStation} >
          <PvStationTop {...this.props} stationCode={stationCode} hiddenStationList={this.state.hiddenStationList} theme={theme} />
          <div className={styles.pvCenter}>
            <PvStationHeader
              singleStationData={singleStationData}
            editData={editData}
            stationCode={stationCode}
            monitorPvUnit={monitorPvUnit}
              theme={theme} />
            <div className={styles.deviceListWrap}>
            <PvDevice {...this.props} />
            <div className={styles.deviceList} > <DeviceList {...this.props} deviceTypeList={deviceTypeList} /> </div>
          </div>
            <div onClick={this.detailShow} className={styles.detailShow}>
            <i className={`iconfont icon-go2 ${styles.show}`} />
            <span className={styles.detailShowfont}>查看电站概况</span>
          </div>
          </div>
          </div>
        <TransitionContainer
          show={detailVisible}
          timeout={500}
          effect="side"
        >
          <DetailCharts
            alarmNum={alarmNum}
            workList={this.props.workList}
            detailChange={this.detailHide}
            {...this.props}
            theme={theme}
            detailVisible={detailVisible}
            getPowerDataTenMin={this.getPowerDataTenMin}
          />
        </TransitionContainer>
      </div>

    );
  }
}

export default PvStation;
