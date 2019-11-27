import React from 'react';
import PropTypes from 'prop-types';
import styles from './inspect.scss';
import FilterCondition from '../../../Common/FilterConditions/FilterCondition';

class InspectSearch extends React.Component {
  static propTypes = {
    getInspectList: PropTypes.func,
    params: PropTypes.object,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
  }
  constructor(props, context) {
    super(props, context);
  }
  filterCondition = (options) => {
    const { rangeTime, stationType, stationCodes, deviceTypeCode } = options;
    const createTimeStart = rangeTime[0] ? rangeTime[0] : '';
    const createTimeEnd = rangeTime[1] ? rangeTime[1] : '';
    const { getInspectList, params } = this.props;
    getInspectList({
      ...params,
      createTimeStart,
      createTimeEnd,
      stationType: stationType ? stationType : '',
      stationCodes: stationCodes.length ? stationCodes : '',
      deviceTypeCode: deviceTypeCode.length ? deviceTypeCode.join(',') : '',
      pageNum: 1,
    });
  }
  render() {
    const { stations, deviceTypes, params } = this.props;
    const { createTimeStart, createTimeEnd, stationType, stationCodes, deviceTypeCode } = params;
    return (
      <div className={styles.searchStyle}>
        <FilterCondition
          onChange={this.filterCondition}
          option={[
            {
              name: '创建时间',
              type: 'time',
              typeName: 'rangeTime',
            },
            {
              name: '电站类型',
              type: 'stationType',
              typeName: 'stationType',
            },
            {
              name: '电站名称',
              type: 'stationName',
              typeName: 'stationCodes',
              data: stations,
            },
            {
              name: '设备类型',
              type: 'multipleType',
              typeName: 'deviceTypeCode',
              data: deviceTypes,
              rules: ['deviceTypeName', 'deviceTypeCode'],
            },

          ]}
          value={{ rangeTimes: [createTimeStart, createTimeEnd], stationType, stationCodes, deviceTypeCode }}
        />
      </div>
    );
  }
}
export default (InspectSearch);
