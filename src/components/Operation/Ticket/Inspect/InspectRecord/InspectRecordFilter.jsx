import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Radio, Checkbox } from 'antd';
import DeviceTypeFilter from '../../Defect/DefectFilter/DeviceTypeFilter';
import DateFilter from './DateFilter';
import styles from './inspectRecord.scss';
import FilterItemValue from './FilterItemValue.jsx';
import moment from 'moment';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InspectRecordFilter extends Component {
  static propTypes = {
    inspectStatusStatistics: PropTypes.object,
    stations: PropTypes.object,

    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    createTimeStart: PropTypes.string,
    createTimeEnd: PropTypes.string,

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
  //筛选巡检人员的
  onChange = (value) => {
    this.props.onChangeFilter({
      inspectUserId: value.join(',')
    });
  }
  //筛选巡检人员的全部，和取消
  onReset = () => {
    this.props.onChangeFilter({
      inspectUserId: ''
    });
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
    const CheckboxGroup = Checkbox.Group;
    const { inspectTimeStart, inspectTimeEnd, inspectUserId } = this.props;
    //巡检人员的筛选
    const inspectPersonList = [{ inspectUserName: '陈一', inspectUserId: '1' }, { inspectUserName: '王二', inspectUserId: '2' }, { inspectUserName: '张三', inspectUserId: '3' }, { inspectUserName: '小四', inspectUserId: '4' }];
    const options = inspectPersonList.map((item, i) => ({
      label: item.inspectUserName,
      value: item.inspectUserId
    }));
    const inspectPersonArray = inspectUserId === '' ? [] : inspectUserId.split(',');


    return (
      <div className={styles.inspectFilter}>
        <div className={styles.topSearch}>
          <span className={styles.text}>筛选条件</span>
          <Button onClick={() => this.onFilterShowChange('recordTime')}>
            记录时间{showFilter === 'recordTime' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>

          <Button onClick={() => this.onFilterShowChange('inspectUserName')}>
            参与人名称{showFilter === 'inspectUserName' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Button onClick={() => this.onFilterShowChange('inspectStatus')}>
            巡检状态{showFilter === 'inspectStatus' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>
          <Button onClick={()=>this.onFilterShowChange('deviceType')}>
          设备类型{showFilter==='deviceType'?<Icon type="up" />:<Icon type="down" />}
        </Button>

        </div>
        <div className={styles.filterBox}>
          {showFilter === 'recordTime' && <DateFilter {...this.props} />}
          {showFilter === 'inspectUserName' &&
            <div className={styles.inspectUserFilter}>
              <span onClick={this.onReset} className={inspectUserId === '' ? styles.selected : styles.all}>不限</span>
              <CheckboxGroup options={options} value={inspectPersonArray} defaultValue={['1']} onChange={this.onChange} />
            </div>}
          {showFilter === 'inspectStatus' && <div></div>}
          {showFilter==='deviceType' && <DeviceTypeFilter {...this.props} />}
        </div>
        <FilterItemValue {...this.props} inspectPersonList={inspectPersonList} />

      </div>
    );
  }

}

export default InspectRecordFilter;
// {showFilter === 'startTime' &&
// <DatePicker
// disabledDate={this.disabledStartDate}
// value={inspectTimeStart ? moment(inspectTimeStart) : null}
// placeholder="开始时间"
// onChange={this.onStartChange}
// />
// }
// {showFilter === 'endTime' &&
// <DatePicker
// disabledDate={this.disabledEndDate}
// value={inspectTimeEnd ? moment(inspectTimeEnd) : null}
// placeholder="截止时间"
// onChange={this.onEndChange}
// />
// }
