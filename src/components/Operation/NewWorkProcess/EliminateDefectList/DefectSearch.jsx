import React from 'react';
import PropTypes from 'prop-types';
import StationSelect from '@components/Common/StationSelect';
import { Switch, Select } from 'antd';
import styles from './listPage.scss';
const { Option } = Select;


export default class DefectSearch extends React.Component {
  static propTypes = {
    listParams: PropTypes.object,
    stations: PropTypes.array,
    selectedStation: PropTypes.array,
    theme: PropTypes.string,
    participantList: PropTypes.array,
    operatorValue: PropTypes.array,
  };

  selectStation = selectedStations => {
    console.log(selectedStations);
  };

  handleChangeOperator = value => {
    console.log(value);
  };

  onMineChange = checked => {
    console.log(checked);
  };

  render() {
    const { operatorValue = [] } = this.props;
    const {
      stations = [],
      theme = 'light',
      selectedStation = [],
      participantList = [],
      listParams = {},
    } = this.props;
    const { isMy } = listParams || {};
    return (
      <div className={styles.defectSearch}>
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
          <Switch checked={isMy === 1} onChange={this.onMineChange} />
          <span>只看我参与的</span>
        </div>
      </div>
    );
  }
}
