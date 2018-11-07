import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Radio, Checkbox, Select } from 'antd';
import DeviceTypeFilter from '../../Defect/DefectFilter/DeviceTypeFilter';
import DateFilter from './DateFilter';
import styles from './inspectRecord.scss';
import FilterItemValue from './FilterItemValue.jsx';
import moment from 'moment';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

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
    startDate: PropTypes.string,
    endDate: PropTypes.string,
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
      startDate: dateString,
    });
  }
  onEndChange = (date, dateString) => {
    this.props.onChangeFilter({
      endDate: dateString
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
      userId: value.join(',')
    });
  }
  //筛选巡检人员的全部取消
  onReset = () => {
    this.props.onChangeFilter({
      userId: ''
    });
  }
  //巡检设备类型
  onDeviceTypeChange=(value)=>{
    this.props.onChangeFilter({
      DeviceTypeId: value.join(',')
    });
  }
  //巡检设备全部取消
  onDeviceTypeReset=()=>{
    this.props.onChangeFilter({
      DeviceTypeId: ''
    });
  }
  disabledStartDate = (current) => {
    const endDate = this.props.endDate;
    if (endDate && current) {
      return current.valueOf() > moment(endDate);
    }
    return false;
  }

  disabledEndDate = (current) => {
    const startDate = this.props.startDate;
    if (startDate && current) {
      return current.valueOf() < moment(startDate).valueOf();
    }
    return false;
  }
  inspectStatusChange = (value) => {
    console.log(value);
    this.props.onChangeFilter({
      inspectStatus: value
    })
  }

  render() {
    const { showFilter } = this.state;
    const CheckboxGroup = Checkbox.Group;
    const { startDate, endDate, userId,DeviceTypeId, inspectDeviceType } = this.props;
    //巡检人员的筛选
    const inspectPersonList = [{ inspectUserName: '陈一', userId: '1' }, { inspectUserName: '王二', userId: '2' }, { inspectUserName: '张三', userId: '3' }, { inspectUserName: '小四', userId: '4' }];
    const options = inspectPersonList.map((item, i) => ({
      label: item.inspectUserName,
      value: item.userId
    }));
    const inspectPersonArray = userId === '' ? [] : userId.split(',');
    //巡检记录的设备类型
    const inspectOptions = inspectDeviceType.map((item, i) => ({
      label: item.deviceTypeNames,
      value: item.deviceTypeCodes
    }))
    const inspectDeviceArray = DeviceTypeId === '' ? [] : DeviceTypeId.split(',');
    console.log(DeviceTypeId);

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
          {/*<Button onClick={() => this.onFilterShowChange('inspectStatus')}>
            巡检状态{showFilter === 'inspectStatus' ? <Icon type="up" /> : <Icon type="down" />}
    </Button>*/}
          <Select style={{ width: 120, marginRight: '16px' }} onChange={this.inspectStatusChange} placeholder="巡检状态">
            <Option value="1">有异常</Option>
            <Option value="0">无异常</Option>
          </Select>
          <Button onClick={() => this.onFilterShowChange('deviceType')}>
            设备类型{showFilter === 'deviceType' ? <Icon type="up" /> : <Icon type="down" />}
          </Button>

        </div>
        <div className={styles.filterBox}>
          {showFilter === 'recordTime' && <DateFilter {...this.props} />}
          {showFilter === 'inspectUserName' &&
            <div className={styles.inspectUserFilter}>
              <span onClick={this.onReset} className={userId === '' ? styles.selected : styles.all}>不限</span>
              <CheckboxGroup options={options} value={inspectPersonArray} defaultValue={['1']} onChange={this.onChange} />
            </div>}
          {showFilter === 'deviceType' && 
          <div className={styles.inspectUserFilter}>
            <span onClick={this.onDeviceTypeReset} className={userId === '' ? styles.selected : styles.all}>不限</span>
            <CheckboxGroup options={inspectOptions} value={inspectDeviceArray} defaultValue={['1']} onChange={this.onDeviceTypeChange} />
          </div>}
        </div>
        <FilterItemValue {...this.props} inspectPersonList={inspectPersonList} inspectDeviceType={inspectDeviceType} />

      </div>
    );
  }

}

export default InspectRecordFilter;

