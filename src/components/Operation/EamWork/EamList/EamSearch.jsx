import React from 'react';
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import StationSelect from '@components/Common/StationSelect';
import moment from 'moment';

import styles from './eam.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default class EamSearch extends React.Component {
  static propTypes = {
    selectedStation: PropTypes.array,
    theme: PropTypes.string,
    eamStationList: PropTypes.array,
    workOrderType: PropTypes.string,
    changeStore: PropTypes.func,
    getEamList: PropTypes.func,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    otherTimeFlag: PropTypes.bool,
  };

  // 电站名称
  selectStation = (selectStation) => {
    const { changeStore, getEamList, pageNum, pageSize, startTime, endTime, workOrderType } = this.props;
    changeStore({selectedStation: selectStation});
    // 获取EAM列表
    getEamList({
      workOrderType,
      startTime,
      endTime,
      pageSize,
      pageNum,
      stationNames: selectStation.map(cur => cur.stationCode),
    });
  };

  // 工单类型
  handleTypeChange = (value) => {
    const { changeStore, getEamList, pageNum, pageSize, startTime, endTime, selectedStation } = this.props;
    changeStore({workOrderType: value});
    // 获取EAM列表
    getEamList({
      workOrderType: value,
      startTime,
      endTime,
      pageSize,
      pageNum,
      stationNames: selectedStation.map(cur => cur.stationCode),
    });
  };

  // 创建时间
  handleTimeChange = (value) => {
    const { changeStore, getEamList, pageNum, pageSize, selectedStation, workOrderType } = this.props;
    // 判断是否现在其他时间选择框
    changeStore({
      otherTimeFlag: value === '5',
    });
    // 公共方法
    const commonFunc = (startTime, endTime) => {
      changeStore({
        startTime,
        endTime,
      });
      // 获取EAM列表
      getEamList({
        workOrderType,
        startTime,
        endTime,
        pageSize,
        pageNum,
        stationNames: selectedStation.map(cur => cur.stationCode),
      });
    };

    // 天数对应方法
    const paramsObj = {
      1: () => { // 今天
        const startTime = moment().format('YYYY-MM-DD 00:00:00');
        const endTime = moment().format('YYYY-MM-DD 23:59:59');
        commonFunc(startTime, endTime);
      },
      2: () => {// 昨天
        const startTime = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
        const endTime = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
        commonFunc(startTime, endTime);
      },
      3: () => {// 最近7天
        const startTime = moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00');
        const endTime = moment().format('YYYY-MM-DD 23:59:59');
        commonFunc(startTime, endTime);
      },
      4: () => {// 最近30天
        const startTime = moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00');
        const endTime = moment().format('YYYY-MM-DD 23:59:59');
        commonFunc(startTime, endTime);
      },
      5: () => {// 其他时间段
        // 重置时间
        changeStore({
          startTime: '',
          endTime: '',
        });
      },
    };
    // 调用对应的方法
    paramsObj[value]();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  onChangeTime = (value, dateString) => {
    const { getEamList, pageNum, pageSize, selectedStation, workOrderType} = this.props;
    const startTime = moment(dateString[0]).format('YYYY-MM-DD 00:00:00');
    const endTime = moment(dateString[1]).format('YYYY-MM-DD 23:59:59');
    // 获取EAM列表
    (dateString[0] && dateString[1]) && getEamList({
      workOrderType,
      startTime,
      endTime,
      pageSize,
      pageNum,
      stationNames: selectedStation.map(cur => cur.stationCode),
    });
  };

  render() {
    const { selectedStation, theme, eamStationList, workOrderType, otherTimeFlag } = this.props;
    return (
      <div className={styles.searchStyle}>
        <div className={styles.stationBox}>
          <span>电站名称</span>
          <StationSelect
            classNameStyle={`${styles.selectModalIcon}`}
            style={{ width: '200px' }}
            multiple={true}
            stationShowNumber={true}
            data={eamStationList.map(e => ({
              ...e,
              provinceCode: e.provinceName,
              stationCode: e.stationName,
            }))}
            onOK={this.selectStation}
            value={selectedStation}
            holderText="请输入关键字快速查询"
            theme={theme}
          />
        </div>
        <div className={styles.workType}>
          <span>工单类型</span>
          <Select value={workOrderType} style={{ width: 200 }} onChange={this.handleTypeChange}>
            <Option value="">全部</Option>
            <Option value="缺陷工单">缺陷工单</Option>
            <Option value="故障工单">故障工单</Option>
          </Select>
        </div>
        <div className={styles.creatTime}>
          <span>创建时间</span>
          <Select defaultValue="3" style={{ width: 200 }} onChange={this.handleTimeChange}>
            <Option value="1">今天</Option>
            <Option value="2">昨天</Option>
            <Option value="3">最近7天</Option>
            <Option value="4">最近30天</Option>
            <Option value="5">其他时间段</Option>
          </Select>
        </div>
        {otherTimeFlag && <div className={styles.otherTime}>
          <RangePicker
            format="YYYY-MM-DD"
            placeholder={['开始时间', '结束时间']}
            disabledDate={this.disabledDate}
            onChange={this.onChangeTime}
            style={{ width: 240 }}
          />
        </div>}
      </div>
    );
  }
}
