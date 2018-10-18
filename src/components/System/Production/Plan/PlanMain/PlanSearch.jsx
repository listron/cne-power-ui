import React, {Component} from 'react';
import {Input, Button, DatePicker} from 'antd';
import styles from './planMain.scss';
import PropTypes from 'prop-types';
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';

const {MonthPicker, RangePicker} = DatePicker;

class planSearch extends Component {
  static propTypes = {
    stations: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    getPlanList: PropTypes.func,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    stationCodes: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      dateValue: '2018',
      stationCodes: [],
      selectStation :[],
    }
  }

  onPanelChange = (value, mode) => {
    let data = new Date(value._d).getFullYear()
    this.setState({open: false, dateValue: data})
  };

  onOpenChange = () => {
    this.setState({open: true})
  };

  stationSelected = (rest) => {
    const stationCodes = rest.map((item, index) => {
      return item.stationCode
    });
    this.setState({
      selectStation:rest,
      stationCodes: stationCodes
    });
  };


  selectValue = () => {
    let {stationCodes} = this.state;
    const params = {
      year: this.state.dateValue,
      stationCodes: stationCodes.length > 0 ? stationCodes: null,
      sortField: this.props.sortField,
      sortMethod: this.props.sortMethod,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    };
    this.props.getPlanList(params)
  };


  render() {
    const {stations} = this.props;
    const {selectStation}=this.state;
    const dateFormat = 'YYYY';
    return (
      <div className={styles.planSearch}>
        <div>
          <span className={styles.year}>年份选择</span>
          <DatePicker
            defaultValue={moment('2015', dateFormat)}
            format={dateFormat}
            mode='year'
            open={this.state.open}
            // value={this.state.dateValue?moment(this.state.dateValue, dateFormat):''}
            onOpenChange={this.onOpenChange}
            onPanelChange={(value, mode) => (this.onPanelChange(value, mode))}
          />
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
    )
  }
}

export default planSearch;
