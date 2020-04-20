import React, { Component } from 'react';
import { Button, Select } from 'antd';
import styles from './planMain.scss';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';
import CneInputSearch from '@components/Common/Power/CneInputSearch';

const Option = Select.Option;

class planSearch extends Component {
  static propTypes = {
    sortMethod: PropTypes.string,
    planYearList: PropTypes.array,
    changePlanStore: PropTypes.func,
    planYear: PropTypes.any,
    keyword: PropTypes.string,
    getPlanList: PropTypes.func,
    sortField: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  selectYear = (e) => { // 选择年份选择
    this.props.changePlanStore({ planYear: e });
    this.planList({ year: e });
  };

  doSearch = (str) => { // 请求搜索条件
    this.planList({ keyword: str });
  }

  clearSearch = () => { // 清除搜素条件
    this.planList({ keyword: '' });
  }

  planList = (params) => { // 请求列表
    const { getPlanList, sortField, sortMethod, planYear, keyword } = this.props;
    getPlanList({
      sortField,
      sortMethod,
      year: planYear,
      // stationCodes: stationCodes.length > 0 ? stationCodes : null,
      pageNum: 1,
      pageSize: 10,
      keyword: keyword,
      ...params,
    });
  }

  render() {
    const { planYearList, planYear } = this.props;
    return (
      <div className={styles.planSearch}>
        <div>
          <span className={styles.year}>年份选择</span>
          <Select style={{ width: 105 }} onChange={this.selectYear} placeholder="--" value={planYear}>
            {planYearList.map((year, index) => {
              return <Option value={`${year}`} key={year} selected>{year}</Option>;
            })}
          </Select>
        </div>
        <div className={styles.topLeft} >
          <CneInputSearch
            placeholder="电站类型／区域／电站名称"
            onSearch={this.doSearch}
            clearSearch={this.clearSearch}
          />
        </div>

      </div>
    );
  }
}

export default planSearch;
