import React from 'react';
import PropTypes from 'prop-types';
import StationSelect from '@components/Common/StationSelect';
import { Switch, DatePicker, Select } from 'antd';
import styles from './meter.scss';

const { MonthPicker } = DatePicker;
const { Option } = Select;

export default class MeterSearch extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    stations: PropTypes.array,
    theme: PropTypes.string,
    deviceTypes: PropTypes.array,
    selectedStation: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      operatorValue: [],
    };
  }

  selectStation = selectedStation => {
    console.log(selectedStation, 'selectedStation');
  };

  startChange = (date, dateString) => {
    console.log(date, dateString);
  };

  endChange = (date, dateString) => {
    console.log(date, dateString);
  };

  handleChangeOperator = value => {
    console.log(value, 'value');
    (value.length === 0 || value.length === 1) && this.setState({operatorValue: value});
  };

  onChange = checked => {
    console.log(checked, 'checked');
  };

  render() {
    const { operatorValue } = this.state;
    const { params, stations, theme, selectedStation } = this.props;
    return (
      <div className={styles.searchStyle}>
        <div className={styles.searchLeft}>
          <div className={styles.stationBox}>
            <span>电站名称</span>
            <StationSelect
              classNameStyle={`${styles.selectModalIcon}`}
              style={{ width: '200px' }}
              multiple={true}
              stationShowNumber={true}
              data={stations}
              onOK={this.selectStation}
              value={selectedStation}
              holderText="请输入关键字快速查询"
              theme={theme}
            />
          </div>
          <div className={styles.monthBox}>
            <span className={styles.monthTitleName}>结算月份</span>
            <MonthPicker style={{width: 100}} onChange={this.startChange} placeholder="开始月份" />
            <span className={styles.betweenIcon}>~</span>
            <MonthPicker style={{width: 100}} onChange={this.endChange} placeholder="结束月份" />
          </div>
          <div className={styles.operatorBox}>
            <span>执行人</span>
            <div className={styles.operatorWrap}>
              <Select
                maxTagCount={1}
                placeholder="请输入关键字"
                style={{width: 120, height: 32}}
                dropdownMatchSelectWidth={true}
                mode="multiple"
                value={operatorValue}
                dropdownClassName={styles.searchSelect}
                onChange={this.handleChangeOperator}
              >
                <Option key="1" value="1" >1111111111</Option>
                <Option key="1" value="2" >2222222222</Option>
              </Select>
              <i className={'iconfont icon-search'} />
            </div>
          </div>
        </div>
        <div className={styles.searchRight}>
          <Switch defaultChecked onChange={this.onChange} />
          <span>只看我参与的</span>
        </div>
      </div>
    );
  }
}
