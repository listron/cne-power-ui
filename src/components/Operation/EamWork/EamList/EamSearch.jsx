import React from 'react';
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import StationSelect from '@components/Common/StationSelect';

import styles from './eam.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default class EamSearch extends React.Component {
  static propTypes = {
    selectedStation: PropTypes.array,
    theme: PropTypes.string,
  };

  // 电站名称
  selectStation = () => {};

  // 工单类型
  handleTypeChange = () => {

  };

  // 创建时间
  handleTimeChange = () => {

  };

  render() {
    const { selectedStation, theme } = this.props;
    return (
      <div className={styles.searchStyle}>
        <div className={styles.stationBox}>
          <span>电站名称</span>
          <StationSelect
            classNameStyle={`${styles.selectModalIcon}`}
            style={{ width: '200px' }}
            multiple={true}
            stationShowNumber={true}
            data={[]}
            onOK={this.selectStation}
            value={selectedStation}
            holderText="请输入关键字快速查询"
            theme={theme}
          />
        </div>
        <div className={styles.workType}>
          <span>工单类型</span>
          <Select defaultValue="0" style={{ width: 200 }} onChange={this.handleTypeChange}>
            <Option value="0">全部</Option>
            <Option value="1">缺陷工单</Option>
            <Option value="2">故障工单</Option>
          </Select>
        </div>
        <div className={styles.creatTime}>
          <span>创建时间</span>
          <Select defaultValue="5" style={{ width: 200 }} onChange={this.handleTimeChange}>
            <Option value="1">今天</Option>
            <Option value="2">昨天</Option>
            <Option value="3">最近7天</Option>
            <Option value="4">最近30天</Option>
            <Option value="5">其他时间段</Option>
          </Select>
        </div>
        <div className={styles.otherTime}>
          <RangePicker
            style={{ width: 240 }}
          />
        </div>
      </div>
    );
  }
}
