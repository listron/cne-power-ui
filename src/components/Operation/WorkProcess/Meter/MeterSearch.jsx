import React from 'react';
import PropTypes from 'prop-types';
import StationSelect from '@components/Common/StationSelect';
import { Switch, DatePicker, Select } from 'antd';
import moment from 'moment';
import styles from './meter.scss';

const { MonthPicker } = DatePicker;
const { Option } = Select;

const monthFormat = 'YYYY-MM';

export default class MeterSearch extends React.Component {
  static propTypes = {
    listParams: PropTypes.object,
    stations: PropTypes.array,
    selectedStation: PropTypes.array,
    theme: PropTypes.string,
    getMeterList: PropTypes.func,
    changeStore: PropTypes.func,
    participantList: PropTypes.array,
    operatorValue: PropTypes.array,
  };

  selectStation = selectedStation => {
    const { getMeterList, changeStore, listParams } = this.props;
    // 选中电站
    const stationCodes = selectedStation.map(cur => cur.stationCode);
    changeStore({
      selectedStation: stationCodes,
    });
    // 调用抄表列表接口
    getMeterList({
      ...listParams,
      stationCodes,
    });
  };

  startChange = (date, dateString) => {
    const { getMeterList, listParams } = this.props;
    // 调用抄表列表接口
    getMeterList({
      ...listParams,
      startSettleMonth: dateString,
    });
  };

  endChange = (date, dateString) => {
    const { getMeterList, listParams } = this.props;
    // 调用抄表列表接口
    getMeterList({
      ...listParams,
      endSettleMonth: dateString,
    });
  };

  handleChangeOperator = value => {
    const { getMeterList, listParams, changeStore } = this.props;
    if((value.length === 0 || value.length === 1)) {
      // 选中执行人
      changeStore({
        operatorValue: value,
      });
      // 调用抄表列表接口
      getMeterList({
        ...listParams,
        operName: value.toString(),
      });
    }
  };

  onChange = checked => {
    const { getMeterList, listParams } = this.props;
    // 调用抄表列表接口
    getMeterList({
      ...listParams,
      isMy: checked ? 1 : null,
    });
  };

  render() {
    const { operatorValue } = this.props;
    const {
      stations,
      theme,
      selectedStation,
      participantList,
      listParams: {
        isMy,
        startSettleMonth,
        endSettleMonth,
      },
    } = this.props;
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
            <MonthPicker value={startSettleMonth ? moment(startSettleMonth, monthFormat) : startSettleMonth} style={{width: 100}} onChange={this.startChange} placeholder="开始月份" />
            <span className={styles.betweenIcon}>~</span>
            <MonthPicker value={endSettleMonth ? moment(endSettleMonth, monthFormat) : endSettleMonth} style={{width: 100}} onChange={this.endChange} placeholder="结束月份" />
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
                {participantList.map(cur => {
                  return (
                    <Option key={cur.userId} title={cur.userFullname || cur.username} value={cur.userFullname || cur.username} >{cur.userFullname || cur.username}</Option>
                  );
                })}
              </Select>
              <i className={'iconfont icon-search'} />
            </div>
          </div>
        </div>
        <div className={styles.searchRight}>
          <Switch checked={isMy === 1} onChange={this.onChange} />
          <span>只看我参与的</span>
        </div>
      </div>
    );
  }
}
