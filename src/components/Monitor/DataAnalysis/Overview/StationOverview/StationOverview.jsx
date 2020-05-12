


import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './station.scss';
import StationList from './StationList';
import StationDates from './StationDates';
import CommonSearch from '../CommonSearch';
import searchUtil from '@utils/searchUtil';


class StationOverview extends PureComponent{
  static propTypes = {
    theme: PropTypes.string,
    history: PropTypes.object,
    stations: PropTypes.array,
    stationDatesRate: PropTypes.array,
    stationTopData: PropTypes.object,
    stationUnix: PropTypes.number,
    stationParam: PropTypes.object,
    changeOverviewStore: PropTypes.func,
    getOverviewStation: PropTypes.func,
    getOverviewDates: PropTypes.func,
  }

  componentDidMount(){
    const { stationDatesRate } = this.props;
    const { stationCode, deviceTypeCode, month } = this.getStationInfo();
    if (stationCode && deviceTypeCode && stationDatesRate.length === 0) { // 路径有参数, 但页内无数据 => 参数传入并请求数据
      const stationParam = { stationCode, deviceTypeCode, month };
      this.props.changeOverviewStore({ stationParam });
      this.props.getOverviewStation({ // 电站信息;
        stationCode,
        pageKey: 'station',
      });
      // this.props.getOverviewDates(stationParam);
    }
  }

  componentWillReceiveProps(nextProps){
    const { stationTopData, stationUnix, stationParam, history } = nextProps;
    const preStationUnix = this.props.stationUnix;
    if (stationUnix !== preStationUnix) { // 得到最新得stationTopData
      const { deviceTypes = [] } = stationTopData || {};
      const { deviceTypeCode = 101 } = deviceTypes.find(e => [101, 201, 206].includes(e.deviceTypeCode)) || {};
      const queryParam = {
        stationCode: stationParam.stationCode,
        deviceTypeCode, // 按默认设备类型进自动填入进行数据请求,
        month: stationParam.month || moment().subtract(1, 'day').format('YYYY-MM'), // 默认昨天所属月
      };
      const { pathname, search } = history.location;
      const newSearch = searchUtil(search).replace({
        station: JSON.stringify(queryParam),
      }).stringify();
      history.push(`${pathname}?${newSearch}`); // 替换station信息
      this.props.changeOverviewStore({ stationParam: queryParam }); // 并将请求数据存入reducer
      this.props.getOverviewDates(queryParam);
    }
  }

  getStationInfo = () => { // 路径信息中获取电站页相关信息
    const { history } = this.props;
    const { search } = history.location;
    const stationStr = searchUtil(search).getValue('station') || '';
    let stationInfo = {};
    try{
      stationInfo = JSON.parse(stationStr);
    } catch(err){ null; }
    return stationInfo;
  }

  stationChanged = ({ stationCode }) => { // 电站切换 => 请求电站信息
    const { stationParam } = this.props;
    const newStationParam = {
      ...stationParam,
      stationCode,
      deviceTypeCode: null, // 取消设备类型选择
    };
    this.props.changeOverviewStore({
      stationParam: newStationParam,
      stationDatesRate: [], // 清空日期数据
    });
    this.props.getOverviewStation({
      stationCode,
      pageKey: 'station',
    });
  }

  deviceTypeChanged = (deviceTypeCode) => { // 设备类型切换
    const { stationParam } = this.props;
    const queryParam = {
      ...stationParam,
      deviceTypeCode,
    };
    this.props.changeOverviewStore({
      stationParam: { ...queryParam },
      stationDatesRate: [], // 清空日期数据
    });
    this.props.getOverviewDates({ ...queryParam });
  }

  render(){
    const { stationParam, stationTopData, stations, theme } = this.props;
    const { stationCode, deviceTypeCode } = stationParam;
    return(
      <div className={`${styles.station} ${styles[theme]}`}>
        { !stationCode && !deviceTypeCode && <StationList {...this.props} />}
        {
          stationCode && <div>
            <div className={styles.topSearch}>
              <CommonSearch
                stations={stations}
                stationCode={stationCode}
                topData={stationTopData}
                deviceTypeCode={deviceTypeCode}
                onStationChange={this.stationChanged}
                onTypeChange={this.deviceTypeChanged}
                theme={theme}
              />
            </div>
            <StationDates {...this.props} />
          </div>
        }
      </div>
    );
  }
}

export default StationOverview;
