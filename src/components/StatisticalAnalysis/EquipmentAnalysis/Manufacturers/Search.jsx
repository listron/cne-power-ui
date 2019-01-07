import React, { Component } from "react";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    stations: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context)
  }


  render() {
    const { stations } = this.props;
    return (
      <div className={styles.search}>
        <div className={styles.condition}>
          <span>条件查询</span>
          <Select defaultValue="lucy" style={{ width: 120 }} disabled>
            <Option value="lucy">Lucy</Option>
          </Select>
          <RangePicker
            defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
            format={'YYYY/MM/DD'}
          />
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            holderText={"全部电站"}
            // value={station.length > 0 ? station : []}
            onChange={this.stationSelected}
          />
        </div>
        <div>

        </div>

      </div>
    )
  }
}

export default Search