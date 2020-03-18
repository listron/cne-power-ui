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
    participantList: PropTypes.array,
    getDefectList: PropTypes.func,
  };

  selectStation = selectedStations => { // 选电站 [{stationCode, stationName}]
    const { listParams } = this.props;
    this.props.getDefectList({
      ...listParams,
      stationCodes: selectedStations.map(e => e.stationCode),
    });
  };

  handleChangeOperator = value => { // 选执行人
    const { listParams } = this.props;
    if ((value.length === 0 || value.length === 1)) {
      // 调用抄表列表接口
      this.props.getDefectList({
        ...listParams,
        operName: value.toString(),
      });
    }
  };

  onMineChange = checked => { // 是否我参与的 true false
    const { listParams } = this.props;
    this.props.getDefectList({
      ...listParams,
      isMy: checked ? 1 : 0,
    });
  };

  render() {
    const { stations = [], participantList = [], listParams } = this.props;
    const { isMy, operName, stationCodes } = listParams || {};
    const curStation = stations.filter(e => stationCodes.includes(e.stationCode));
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
              value={curStation}
              holderText="请输入关键字快速查询"
            />
          </div>
          <div className={styles.operatorBox}>
            <span>执行人</span>
            <div className={styles.operatorWrap}>
              <Select
                maxTagCount={1}
                placeholder="请输入关键字"
                style={{ width: 120, height: 32 }}
                dropdownMatchSelectWidth={true}
                mode="multiple"
                value={operName && [operName] || []}
                dropdownClassName={styles.searchSelect}
                onChange={this.handleChangeOperator}
              >
                {participantList.map(cur => {
                  return (
                    <Option
                      key={cur.userId}
                      title={cur.userFullname || cur.username}
                      value={cur.userFullname || cur.username}
                    >{cur.userFullname || cur.username}</Option>
                  );
                })}
              </Select>
              <i className={'iconfont icon-search'} />
            </div>
          </div>
        </div>
        <div className={styles.searchRight}>
          <Switch checked={!!isMy} onChange={this.onMineChange} />
          <span>只看我参与的</span>
        </div>
      </div>
    );
  }
}
