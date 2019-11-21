import React from 'react';
import PropTypes from 'prop-types';
import styles from './stationContrast.scss';
import StationSelectContrast from './StationSelectContrast';
import TimeSelect from '../../../Common/TimeSelect/TimeSelectIndex';
import StationContrastTable from './StationContrastTable';
import moment from 'moment';
class StationContrast extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    stations: PropTypes.array,
    toChangeStationContrastStore: PropTypes.func,
    getStationContrast: PropTypes.func,
    stationCode: PropTypes.array,
    dateType: PropTypes.string,
    year: PropTypes.any,
    stationContrastDetail: PropTypes.array,
    stationContrastList: PropTypes.array,
    selectedStations: PropTypes.array,
    resetStationContrastStore: PropTypes.func,
    theme: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    this.props.toChangeStationContrastStore({ year: [moment().format('YYYY')] });
  }

  componentWillUnmount() {
    this.props.resetStationContrastStore();
  }
  onTimeChange = (timeObj) => {

    const { stationCode, year, month, toChangeStationContrastStore } = this.props;
    if (timeObj.timeStyle === 'year') {
      toChangeStationContrastStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime, timeObj.endTime] });
      if (stationCode.length > 1) {
        this.props.getStationContrast({
          stationCode: stationCode,
          dateType: timeObj.timeStyle,
          year: [timeObj.startTime, timeObj.endTime],
        });
      }

    }
    if (timeObj.timeStyle === 'month') {
      toChangeStationContrastStore({ dateType: timeObj.timeStyle, year: [timeObj.startTime] });
      if (stationCode.length > 1) {
        this.props.getStationContrast({
          stationCode: stationCode,
          dateType: timeObj.timeStyle,
          year: [timeObj.startTime],
        });
      }

    }
    if (timeObj.timeStyle === 'day') {
      const currentYear = [moment(timeObj.startTime).format('YYYY')];
      const currentMonth = +moment(timeObj.startTime).format('MM');
      toChangeStationContrastStore({ dateType: timeObj.timeStyle, year: currentYear, month: currentMonth });
      if (stationCode.length > 1) {
        this.props.getStationContrast({
          stationCode: stationCode,
          dateType: timeObj.timeStyle,
          year: currentYear,
          month: currentMonth,
        });
      }

    }


  }
  stationSelected = (stations) => {
    const { dateType, year, month } = this.props;
    this.props.toChangeStationContrastStore({
      stationCode: stations.map(e => e.stationCode),
      selectedStations: stations,
    });
    if (dateType === 'day') {
      this.props.getStationContrast({
        stationCode: stations.map(e => e.stationCode),
        dateType,
        year,
        month,
      });
    } else {
      this.props.getStationContrast({
        stationCode: stations.map(e => e.stationCode),
        dateType,
        year,
      });
    }
  }




  render() {
    const { stations, stationContrastList, selectedStations, theme } = this.props;
    const disabled = [];
    stations.forEach(e => { if (e.isConnected === 0) { disabled.push(e.stationCode); } });
    return (
      <div className={`${styles.singleStationType} ${styles[theme]}`}>
        <div className={styles.stationTimeFilter}>
          <div className={styles.leftFilter}>
            <div className={styles.stationFilter}>
              <StationSelectContrast
                data={stations.filter(e => e.stationType === 1)}
                holderText={'请输入关键字快速查询'}
                multiple={true}
                disabledStation={disabled}
                onChange={this.stationSelected}
                value={selectedStations}
                theme={theme}
              />
            </div>
            <TimeSelect timerText="" onChange={this.onTimeChange} theme={theme} />
          </div>
          <span className={styles.rightContent}>数据统计截止时间{moment().subtract(1, 'days').format('MM[月]DD[日]')}</span>
        </div>
        <div className={styles.componentContainer}>
          <div className={styles.componentContainerTip} >
            <span>电站数据</span>
            {(stationContrastList && stationContrastList.length) ? <span>点击表格数据，可查看详细</span> : ''}
          </div>
          {stationContrastList && stationContrastList.length === 0 ?
            <div className={styles.nodata} ><img src="/img/nodata.png" /></div>
            : <StationContrastTable {...this.props} />
          }
        </div>
      </div>
    );
  }
}
export default StationContrast;
