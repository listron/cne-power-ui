import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import searchUtil from '../../../../../utils/searchUtil';
import styles from './curve.scss';

class CurveAnalysis extends Component {

  static propTypes = {
    active: PropTypes.bool,
    curveTopStringify: PropTypes.string,
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
    const { curveTopStringify } = this.props;
    const infoStr = searchUtil(nextSearch).getValue('station');
    if (infoStr && infoStr !== curveTopStringify) { // 搜索信息有变
      this.props.changeStore({ curveTopStringify: infoStr });
      this.queryAllCharts(infoStr);
    }
  }

  queryAllCharts = (infoStr) => { // 页面所有chart请求。
    const searchParam = this.getSearchParam(infoStr);
    const defaultMonth = moment(searchParam.startTime).format('YYYY-MM');
    const monthParam = {
      ...searchParam,
      startTime: defaultMonth,
      endTime: defaultMonth,
    };
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

  render() {
    const { active } = this.props;
    return (
      <div className={`${styles.curveAnalysis} ${styles.eachPage} ${active ? styles.active : styles.inactive}`}>
        <section>
          <h3>
            <span>功率曲线邻比分析</span>
            <span>?</span>
          </h3>
          <div>
            <div selectDevice={this.selectDevice}>chart图</div>
            <div checkDevicesTime={this.checkDevicesTime}>月份选择</div>
            <div selectDevice={this.selectDevice}>chart图两个</div>
          </div>
        </section>
        <section>
          <h3>
            <span>功率曲线环比分析</span>
            <span>i</span>
          </h3>
          <div>
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

