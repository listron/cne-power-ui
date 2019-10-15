import React, { Component } from 'react';
import { Button, Select } from 'antd';
import styles from './planMain.scss';
import PropTypes from 'prop-types';
import StationSelect from '../../../../Common/StationSelect';

const Option = Select.Option;

class planSearch extends Component {
  static propTypes = {
    stations: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    getPlanList: PropTypes.func,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    planYearList: PropTypes.array,
    changePlanStore: PropTypes.func,
    planYear: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      stationCodes: [],
      selectStation: [],
    };
  }

  stationSelected = (rest) => {
    const stationCodes = rest.map((item, index) => {
      return item.stationCode;
    });
    this.setState({
      selectStation: rest,
      stationCodes: stationCodes,
    });
  };

  selectValue = () => {
    const { stationCodes } = this.state;
    const params = {
      year: this.props.planYear,
      stationCodes: stationCodes.length > 0 ? stationCodes : null,
      sortField: this.props.sortField,
      sortMethod: this.props.sortMethod,
      pageNum: 1,
      pageSize: 10,
    };
    this.props.getPlanList(params);
  };

  selectYear = (e) => {
    this.props.changePlanStore({ planYear: e });
  };

  render() {
    const { stations, planYearList, planYear } = this.props;
    const { selectStation } = this.state;
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
        <div className={styles.topLeft}>
          <label className={styles.station}>电站选择</label>
          <StationSelect
            data={stations.toJS()}
            multiple={true}
            value={selectStation}
            onChange={this.stationSelected}
          />
        </div>
        <Button className={styles.searchButton} onClick={this.selectValue}>查询</Button>
      </div>
    );
  }
}

export default planSearch;
