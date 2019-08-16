import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
// import CurveAnalysis from '../../../../components/HighAnalysis/Achievement/StationAchieve/PowerCurve/CurveAnalysis';
import AreaStation from '../../../../components/Common/AreaStation';
import AutoSelect from '../../../../components/Common/AutoSelect';
import { stopStatusAction } from './stopStatusReducer';
import { Button, DatePicker } from 'antd';
import styles from './stop.scss';
const { RangePicker } = DatePicker;

class StopStatus extends Component {

  static propTypes = {
    areaStation: PropTypes.array,
    modeDevices: PropTypes.array,
    deviceCodes: PropTypes.array,
    stationCode: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    getDevices: PropTypes.func,
    changeStore: PropTypes.func,
  }

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){

  }

  onStationChange = ([regionName, stationCode, stationName]) => {
    this.props.changeStore({ stationCode, modeDevices: [] });
    this.props.getDevices({ stationCode });
  }

  onDeviceChange = (deviceCodes) => {
    this.props.changeStore({ deviceCodes });
  }

  onDateChange = (momentInfo, [startTime, endTime]) => {
    this.props.changeStore({ startTime, endTime });
  }

  goSearch = () => {
    const { stationCode, deviceCodes, startTime, endTime } = this.props;
    console.log(stationCode, deviceCodes, startTime, endTime);
  }

  render() {
    const { areaStation, stationCode, modeDevices, deviceCodes, startTime, endTime } = this.props;
    return (
      <div className={styles.stop}>
        <div className={styles.searchPart}>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择电站</span>
            <AreaStation
              data={areaStation}
              value={stationCode ? [stationCode] : []}
              onChange={this.onStationChange}
              mode="station"
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择设备</span>
            <AutoSelect
              data={modeDevices}
              value={deviceCodes.map(e => e.value)}
              onChange={this.onDeviceChange}
              style={{width: '150px'}}
              maxTagCount={0}
            />
          </div>
          <div className={styles.eachParts}>
            <span className={styles.text}>选择时间</span>
            <RangePicker
              value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
              onChange={this.onDateChange}
              allowClear={false}
              style={{width: '220px'}}
            />
          </div>
          <Button onClick={this.goSearch} className={styles.search}>查询</Button>
        </div>
        <div>
          停机状态分析
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.highAanlysisReducer.achieveStop.toJS(),
  areaStation: state.highAanlysisReducer.achieveLayout.get('areaStation').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeStore: payload => dispatch({ type: stopStatusAction.changeStore, payload }),
  getDevices: payload => dispatch({ type: stopStatusAction.getDevices, payload }),
  getStopStatus: payload => dispatch({ type: stopStatusAction.getStopStatus, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StopStatus);

