import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import FilterConditions from '@components/Common/FilterConditions/FilterCondition';
import ParticipantSearch from './ParticipantSearch';
import { Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class DefectSearch extends Component {
  static propTypes = {
    theme: PropTypes.string,
    listParams: PropTypes.object,
    stations: PropTypes.array,
    defectTypes: PropTypes.array,
    deviceTypes: PropTypes.array,
    getDefectList: PropTypes.func,
    defectStatusStatistics: PropTypes.object,
    participantList: PropTypes.array,
    username: PropTypes.string,
  };

  constructor(props, context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  filterConditionChange = (value) => { // 筛选条件进行查找消缺
    const { listParams, username } = this.props;
    const { join, rangeTimes, defectCategory, defectTypeCode, ...restValue } = value;
    const [createTimeStart, createTimeEnd] = rangeTimes;
    // const initDefectTypeCode = defectCategory.length > 0 && defectCategory.includes('device') ? defectTypeCode : ['0'];
    this.props.getDefectList({ ...listParams, ...restValue, createTimeStart, createTimeEnd, handleUser: join && username || '' });
  }


  onChangeStatus = (e) => { //  修改状态进行查找消缺
    const { listParams } = this.props;
    const status = e.target.value;
    this.props.getDefectList({ ...listParams, status });
  }

  joinChange = (value) => { // 参与人进行查找消缺
    const { listParams, getDefectList } = this.props;
    getDefectList({ ...listParams, ...value });
  }

  render() {
    const { theme, stations, listParams, defectTypes, deviceTypes, defectStatusStatistics, participantList } = this.props;
    const { stationType, stationCodes, defectSource, deviceTypeCode, defectTypeCode, createTimeStart, createTimeEnd, handleUser, handleUserList, status, defectCategory } = listParams;
    const defectTypeTab = [];
    defectTypes.forEach(e => { e.list && e.list.length > 0 && defectTypeTab.push(...e.list); });
    let defectTypeList = [];
    defectTypeTab.map(e => {
      e.list && e.list.length > 0 && e.list.forEach((lastItem) => {
        lastItem.parentName = e.name;
      });
      defectTypeList = e.list && [...defectTypeList, ...e.list] || [...defectTypeList];
    });
    const defectTypeArr = [{ label: '设备缺陷', value: 'device' }, { label: '其他缺陷', value: 'other' }];
    const options = [
      { name: '发生时间', type: 'time', typeName: 'rangeTimes' },
      { name: '电站类型', type: 'stationType', typeName: 'stationType' },
      { name: '电站名称', type: 'stationName', typeName: 'stationCodes', data: stations },
      { name: '设备类型', type: 'multipleType', typeName: 'deviceTypeCode', rules: ['deviceTypeName', 'deviceTypeCode'], data: deviceTypes },
      { name: '缺陷分类', type: 'multipleType', typeName: 'defectCategory', data: defectTypeArr },
      { name: '缺陷类型', type: 'parentCheckBox', typeName: 'defectTypeCode', parentName: 'parentName', rules: ['name', 'id'], data: defectTypeList },
      { name: '缺陷来源', type: 'defectSource', typeName: 'defectSource' },
      { name: '我参与的', type: 'switch', typeName: 'join' },
    ];
    const { submitNum = 0, examineNum = 0, executeNum = 0, checkNum = 0 } = defectStatusStatistics;
    return (
      <div className={`${styles.seacrchCont} ${styles[theme]}`}>
        <FilterConditions
          onChange={this.filterConditionChange}
          theme={theme}
          option={options}
          value={{ rangeTimes: [createTimeStart, createTimeEnd], stationType, stationCodes, deviceTypeCode, defectSource, defectTypeCode, join: handleUser, defectCategory }}
        />
        <div className={`${styles.statusGroup}`}>
          <div className={styles.text}>状态</div>
          <RadioGroup onChange={this.onChangeStatus} defaultValue="" value={status}>
            <RadioButton value="">全部</RadioButton>
            <RadioButton value="0">{`待提交  ${submitNum}`}</RadioButton>
            <RadioButton value="1">{`待审核  ${examineNum}`}</RadioButton>
            <RadioButton value="2">{`执行中  ${executeNum}`}</RadioButton>
            <RadioButton value="3">{`待验收  ${checkNum}`}</RadioButton>
            <RadioButton value="4">{'已完成'}</RadioButton>
          </RadioGroup>
        </div>
        <ParticipantSearch
          tab={'defect'}
          participantList={participantList}
          onChange={this.joinChange}
          handleUserList={handleUserList}
          theme={theme}
        />
      </div>
    );
  }
}

export default DefectSearch;
