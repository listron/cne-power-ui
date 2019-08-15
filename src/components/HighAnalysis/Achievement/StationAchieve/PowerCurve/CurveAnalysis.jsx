import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Tooltip } from 'antd';
import searchUtil from '../../../../../utils/searchUtil';
import DevicesChart from './DevicesChart';
import DevicesCheckTime from './DevicesCheckTime';
import DevicesAep from './DevicesAep';
import DevicesPsd from './DevicesPsd';
import MonthsChart from './MonthsChart';
import MonthsSelector from './MonthsSelector';
import MonthsAep from './MonthsAep';
import MonthsPsd from './MonthsPsd';
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

  getAllMonths = (startTime, endTime) => {
    if (moment(startTime).isBefore(endTime, 'day') || moment(startTime).isSame(endTime, 'day')) {
      let configTime = moment(startTime);
      const allMonths = [configTime.format('YYYY-MM')];
      while(configTime.isBefore(endTime, 'M')){
        configTime = configTime.add(1, 'M');
        allMonths.push(configTime.format('YYYY-MM'));
      }
      return allMonths;
    }
    return [];
  }

  queryAllCharts = (infoStr) => { // 页面所有chart请求。
    const searchParam = this.getSearchParam(infoStr);
    const { startTime, endTime, deviceFullcodes = [] } = searchParam;
    const curveDevicesTime = moment(startTime).format('YYYY-MM');
    const defaultDevice = deviceFullcodes[0];
    const monthParam = {
      ...searchParam,
      deviceFullcodes: [defaultDevice],
    };
    const deviceParam = {
      ...searchParam,
      startTime: curveDevicesTime,
      endTime: curveDevicesTime,
    };
    const rangeMonths = this.getAllMonths(startTime, endTime);
    this.props.changeStore({
      curveDeviceFullcode: defaultDevice,
      curveDevicesTime, // 邻比分析设备选中时间
      curveAllMonths: rangeMonths,
      curveCheckedMonths: rangeMonths,
    });
    this.props.getCurveDevices(deviceParam);
    this.props.getCurveDevicesAep(deviceParam);
    this.props.getCurveDevicesPsd(deviceParam);
    this.props.getCurveMonths(monthParam);
    this.props.getCurveMonthAep(monthParam);
    this.props.getCurveMonthPsd(monthParam);
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

  render() {
    const { active } = this.props;
    const curveDevices = {
      actual: [1, 2, 3, 4, 5].map(e => ({
        deviceName: `${e}风机`,
        deviceFullcode: `M${e}M${e * e}M${e + 10}`,
        modeName: `M${e}fe_Fe`,
        devicePowerInfoVos: [1, 2, 3, 4].map(m => ({
          power: e * 4,
          windSpeed: e * (10 + e) + m * e,
        })),
      })),
      theory: [{
        modeName: 'M2fe_Fe',
        devicePowerInfoVos: [1, 2, 3, 4].map(e => ({
          power: e * 3,
          windSpeed: e * (10 + e) + e,
        })),
      }],
    };
    // const curveMonths = {
    //   actual: [1, 2, 3, 4, 5].map(e => ({
    //     calcDate: `2019-0${e}`,
    //     devicePowerInfoVos: [1, 2, 3, 4].map(m => ({
    //       power: e * 4,
    //       windSpeed: e * (10 + e) + m * e,
    //     })),
    //   })),
    //   theory: [{
    //     modeName: 'M2fe_Fe',
    //     devicePowerInfoVos: [1, 2, 3, 4].map(e => ({
    //       power: e * 4,
    //       windSpeed: e * (10 + e) + e,
    //     })),
    //   }],
    // };
    const curveDevicesAep = [1, 2, 3, 4, 5, 6].map(e => ({
      deviceName: `${e}MMMM`,
      deviceModeName: `#12${e}-FE`,
      windSpeed: parseInt(Math.random() * 10, 10),
      aep: parseInt(Math.random() * 100, 10),
      deviceFullcode: `${e}FullCode`,
    }));
    // const curveMonthAep = [1, 2, 3, 4, 5, 6].map(e => ({
    //   windSpeed: parseInt(Math.random() * 10, 10),
    //   aep: parseInt(Math.random() * 100, 10),
    //   efficiencyDate: `2018-0${e}`,
    // }));
    const curveDevicesPsd = [1, 2, 3, 4, 5, 6].map(e => ({
      deviceName: `${e}MMMM`,
      deviceModeName: `#12${e}-FE`,
      psd: parseInt(Math.random() * 100, 10),
      deviceFullcode: `${e}FullCode`,
    }));
    // const curveMonthPsd = [1, 2, 3, 4, 5, 6].map(e => ({
    //   psd: parseInt(Math.random() * 100, 10),
    //   efficiencyDate: `2019-0${e}`,
    // }));
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
            <DevicesChart {...this.props} curveDevices={curveDevices} />
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
            <MonthsChart {...this.props} />
            <MonthsSelector {...this.props} />
            <div className={styles.indicatorDetails}>
              <MonthsAep {...this.props} />
              <MonthsPsd {...this.props} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default CurveAnalysis;

