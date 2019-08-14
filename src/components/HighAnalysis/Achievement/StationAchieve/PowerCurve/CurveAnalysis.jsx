import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import DevicesChart from './DevicesChart';
import DevicesCheckTime from './DevicesCheckTime';
import DevicesAep from './DevicesAep';
import DevicesPsd from './DevicesPsd';
import styles from './curve.scss';

class CurveAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
    curveTopStringify: PropTypes.string,
    curveDeviceFullcode: PropTypes.string,
    modeDevices: PropTypes.array,
    location: PropTypes.object,
    getCurveDevices: PropTypes.func,
    getCurveDevicesAep: PropTypes.func,
    getCurveDevicesPsd: PropTypes.func,
    getCurveMonths: PropTypes.func,
    getCurveMonthAep: PropTypes.func,
    getCurveMonthPsd: PropTypes.func,
    changeStore: PropTypes.func,
  }

  componentDidMount(){
    const { curveTopStringify, location } = this.props;
    const { search } = location;
    const infoStr = searchUtil(search).getValue('station');
    const originLoad = infoStr && !curveTopStringify; // // 初次加载
    const pageBack = curveTopStringify && infoStr && infoStr !== curveTopStringify; // 其他两个页面修改路径信息后返回
    if (originLoad || pageBack) {
      this.props.changeStore({ curveTopStringify: infoStr });
      this.queryAllCharts(infoStr);
    }
  }

  componentWillReceiveProps(nextProps){
    const nextLocation = nextProps.location;
    const nextSearch = nextLocation.search || '';
    const nextModeDevices = nextProps.modeDevices;
    const nextCurvecode = nextProps.curveDeviceFullcode;
    const { curveTopStringify, modeDevices } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    if (infoStr && infoStr !== curveTopStringify) { // 搜索信息有变
      this.props.changeStore({ curveTopStringify: infoStr });
      this.queryAllCharts(infoStr);
    }
    if (nextCurvecode && modeDevices.length === 0 && nextModeDevices.length > 0) { // 得到设备信息时, 若已选设备, 存储设备名
      let curveDeviceName;
      nextModeDevices.some(e => {
        const { children = [] } = e || e;
        return children.some(m => {
          const findCurveCode = nextCurvecode === m.value;
          findCurveCode && (curveDeviceName = m.label);
          return findCurveCode;
        });
      });
      this.props.changeStore({ curveDeviceName });
    }
  }

  queryAllCharts = (infoStr) => { // 页面所有chart请求。
    const searchParam = this.getSearchParam(infoStr);
    const { startTime, endTime, deviceFullcodes = [] } = searchParam;
    const curveDevicesTime = moment(startTime).format('YYYY-MM');
    const defaultDevice = deviceFullcodes[0];
    const monthParam = {
      ...searchParam,
      startTime: curveDevicesTime,
      endTime: curveDevicesTime,
      deviceFullcodes: [defaultDevice],
    };
    const rangeMonths = [];
    if (moment(startTime) < moment(endTime)) { // 将开始开始 -> 结束按月生成数组.
      // do{
      //   const 
      //   rangeMonths.push(moment(startTime).format('YYYY-MM'));
      // }while(moment(rangeMonths[rangeMonths.length - 1]) < moment(endTime));
    }
    // while(rangeMonths[rangeMonths.length - 1] < moment(endTime)){
    //   rangeMonths.push(moment(startTime).add(1, 'm'));
    // }
    this.props.changeStore({
      curveDeviceFullcode: defaultDevice, // 选中的设备信息 {deviceFullcode, deviceName} todo 
      curveDevicesTime, // 邻比分析设备选中时间
      curveEachMonths: rangeMonths.map(e => e.format('YYYY-MM')), // todo 添加环比分析各月时间
    });
    this.props.getCurveDevices(monthParam);
    this.props.getCurveDevicesAep(monthParam);
    this.props.getCurveDevicesPsd(monthParam);
    this.props.getCurveMonths(searchParam);
    this.props.getCurveMonthAep(searchParam);
    this.props.getCurveMonthPsd(searchParam);
  }

  getSearchParam = (infoStr) => {
    const searchParam = JSON.parse(infoStr) || {};
    return {
      stationCodes: [searchParam.searchCode],
      deviceFullcodes: searchParam.searchDevice,
      startTime: searchParam.searchDates[0],
      endTime: searchParam.searchDates[1],
    };
  }

  selectDevice = ({ deviceFullcode, deviceName }) => {
    this.props.changeStore({
      curveDeviceFullcode: deviceFullcode,
      curveDeviceName: deviceName,
    });
    console.log({ deviceFullcode, deviceName }) // todo 请求下方三个图。
  }

  render() {
    const { active } = this.props;
    // MonthsChart  // MonthsAep  // MonthsPsd // MonthsSelector
    const curveDevicesAep = [1, 2, 3, 4, 5, 6].map(e => ({
      deviceName: `${e}MMMM`,
      deviceModeName: `#12${e}-FE`,
      windSpeed: parseInt(Math.random() * 10, 10),
      aep: parseInt(Math.random() * 100, 10),
      deviceFullcode: `${e}FullCode`,
    }));
    const curveDevicesPsd = [1, 2, 3, 4, 5, 6].map(e => ({
      deviceName: `${e}MMMM`,
      deviceModeName: `#12${e}-FE`,
      psd: parseInt(Math.random() * 100, 10),
      deviceFullcode: `${e}FullCode`,
    }));
    return (
      <div className={`${styles.curveAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <section className={styles.curveAllDevice}>
          <h3 className={styles.header}>
            <span className={styles.headerText}>功率曲线邻比分析</span>
            <Tooltip title="功率曲线所用的均为清洗后的数据" placement="topRight">
              <span className={styles.headerTip}>i</span>
            </Tooltip>
          </h3>
          <div className={styles.content}>
            <DevicesChart selectDevice={this.selectDevice} />
            <DevicesCheckTime {...this.props} />
            <div className={styles.indicatorDetails}>
              <DevicesAep {...this.props} curveDevicesAep={curveDevicesAep} />
              <DevicesPsd {...this.props} curveDevicesPsd={curveDevicesPsd} />
            </div>
          </div>
        </section>
        <section className={styles.curveEachMonth}>
          <h3 className={styles.header}>
            <span className={styles.headerText}>功率曲线环比分析</span>
            <Tooltip title="功率曲线所用的均为清洗后的数据" placement="topRight">
              <span className={styles.headerTip}>i</span>
            </Tooltip>
          </h3>
          <div className={styles.content}>
            <div >chart图</div>
            <div checkEachMonths={this.checkEachMonths}>参数选择</div>
            <div>chart图两个</div>
          </div>
        </section>
      </div>
    );
  }
}

export default CurveAnalysis;

