import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defect.scss';
import FilterConditions from '@components/Common/FilterConditions/FilterCondition';
import Search from 'antd/lib/input/Search';
import FilterCondition from '@components/Common/FilterConditions/FilterCondition';

class DefectSearch extends Component {
  static propTypes = {
    theme: PropTypes.string,
    listParams: PropTypes.object,
    stations: PropTypes.array,
  };

  constructor(props, context) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  filterConditionChange = () => {

  }

  render() {
    const { theme, stations, listParams, deviceTypes } = this.props;
    const { stationType, stationCodes, defectSource, defectLevel, deviceTypeCode, defectTypeCode, createTimeStart, createTimeEnd, handleUser } = listParams;
    return (
      <div className={`${styles.seacrchCont} ${styles[theme]}`}>
        <FilterConditions
          onChange={this.filterConditionChange}
          theme={theme}
          option={[
            {
              name: ' 发生时间',
              type: 'time',
              typeName: 'rangeTimes',
            },
            {
              name: '电站类型',
              type: 'stationType',
              typeName: 'stationType',
            },
            {
              name: '电站名称',
              type: 'parentCheckBox',
              typeName: 'stationCodes',
              rules: ['stationName', 'stationCode'],
              parentName: 'provinceName',
              data: stations,
            },
            {
              name: '设备类型',
              type: 'multipleType',
              typeName: 'deviceTypeCode',
              rules: ['deviceTypeName', 'deviceTypeCode'],
              data: deviceTypes,
            },
            {
              name: '缺陷级别',
              type: 'defectLevel',
              typeName: 'defectLevel',
            },
            {
              name: '缺陷类型',
              type: 'parentCheckBox',
              typeName: 'defectTypeCode',
              parentName: 'parentName',
              rules: ['name', 'id'],
              data: defectTypeList,
            },
            {
              type: 'defectSource',
              typeName: 'defectSource',
            },
            {
              name: '我参与的',
              type: 'switch',
              typeName: 'join',
            },
          ]}
          value={{ stationType, stationCodes, defectSource, defectLevel, deviceTypeCode, defectTypeCode, rangeTimes: [createTimeStart, createTimeEnd], join: handleUser }}
        />
      </div>
    );
  }
}

export default DefectSearch;
