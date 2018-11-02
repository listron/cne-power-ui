import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Switch, Icon, Radio, DatePicker } from 'antd';
import StationFilter from '../../Defect/DefectFilter/StationFilter';
import DeviceTypeFilter from '../../Defect/DefectFilter/DeviceTypeFilter';
import styles from './inspectRecord.scss';
import FilterItemValue from './FilterItemValue.jsx';
import moment from 'moment';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InspectRecordFilter extends Component {
  static propTypes = {
    inspectStatusStatistics: PropTypes.object,
    stations: PropTypes.object,
    deviceTypes: PropTypes.object,//设备类型列表
    stationType: PropTypes.string,
    stationCodes: PropTypes.string,
    timeInterval: PropTypes.string,
    status: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    sort: PropTypes.string,
    hasAbnormal: PropTypes.bool,
    username: PropTypes.string,
    handleUser: PropTypes.string,
    inspectTimeStart: PropTypes.string,
    inspectTimeEnd: PropTypes.string,
    onChangeFilter: PropTypes.func,
    defectStatusStatistics: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      showFilter: '',
    };
  }
  onStartChange = (date, dateString) => {
    this.props.onChangeFilter({
      inspectTimeStart: dateString,
    });
  }
  onEndChange = (date, dateString) => {
    this.props.onChangeFilter({
      inspectTimeEnd: dateString
    });
  }
  onFilterShowChange = (filterText) => {
    const { showFilter } = this.state;
    if (showFilter === filterText) {
      this.setState({
        showFilter: ''
      })
    } else {
      this.setState({
        showFilter: filterText
      })
    }
  }

  disabledStartDate = (current) => {
    const inspectTimeEnd = this.props.inspectTimeEnd;
    if (inspectTimeEnd && current) {
      return current.valueOf() > moment(inspectTimeEnd);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const inspectTimeStart = this.props.inspectTimeStart;
    if (inspectTimeStart && current) {
      return current.valueOf() < moment(inspectTimeStart).valueOf();
    }
    return false;
  }


  render() {
    const { showFilter } = this.state;
    const { stations, inspectStatusStatistics, handleUser, hasAbnormal, username, onChangeFilter } = this.props;
    const { inspectTimeStart, inspectTimeEnd } = this.props;
    const inProcessNum = '';
    // const inProcessNum = inspectStatusStatistics.get("executeNum");
    const waitCheckNum = '';
    // const waitCheckNum = inspectStatusStatistics.get("checkNum");

    return (
      <div className={styles.inspectFilter}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          <Button onClick={() => this.onFilterShowChange('startTime')}>
            开始时间{showFilter === 'startTime' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Button onClick={() => this.onFilterShowChange('endTime')}>
            结束时间{showFilter === 'endTime' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Button onClick={() => this.onFilterShowChange('inspectUserName')}>
            参与人名称{showFilter === 'inspectUserName' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Button onClick={() => this.onFilterShowChange('inspectStatus')}>
            巡检状态{showFilter === 'inspectStatus' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>

        </div>
        <div className={styles.filterBox}>
          {showFilter === 'startTime' &&
            <DatePicker
              disabledDate={this.disabledStartDate}
              value={inspectTimeStart ? moment(inspectTimeStart) : null}
              placeholder="开始时间"
              onChange={this.onStartChange}
            />
          }
          {showFilter === 'endTime' &&
            <DatePicker
              disabledDate={this.disabledEndDate}
              value={inspectTimeEnd ? moment(inspectTimeEnd) : null}
              placeholder="截止时间"
              onChange={this.onEndChange}
            />
          }
          {showFilter === 'inspectUserName' && <StationFilter {...this.props} />}
          {showFilter === 'inspectStatus' && <DeviceTypeFilter {...this.props} />}
        </div>
        <FilterItemValue {...this.props} />

      </div>
    );
  }

}

export default InspectRecordFilter;
