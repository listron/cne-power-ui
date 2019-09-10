import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FilterCondition from './FilterCondition';

class filterConditionCase extends Component {
  static propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    onChangeFilter: PropTypes.func,
  }

  constructor() {
    super();
  }


  render() {
    const stations = [], theme = 'light', defectTypeList = [], deviceTypes = [];
    return (
      <div>
        <FilterCondition
          onChange={this.filterConditionChange}
          theme={theme}
          option={[
            {
              name: ' 发生时间',
              type: 'time',
              typeName: 'time',
            },
            {
              name: ' 结束时间',
              type: 'rangeTime',
              typeName: 'rangeTime',
            },
            {
              name: '电站类型',
              type: 'stationType',
              typeName: 'stationType',
            },
            {
              name: '设备类型',
              type: 'multipleType',
              typeName: 'deviceTypeCode',
              rules: ['deviceTypeName', 'deviceTypeCode'],
              data: deviceTypes,
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
              name: '我参与的',
              type: 'switch',
              typeName: 'join',
              disabled: true,
            },
          ]}
        // value={{ stationType, stationCodes, deviceTypeCode, time, rangeTime, join: handleUser }}
        />

      </div>
    );
  }

}

export default filterConditionCase;
