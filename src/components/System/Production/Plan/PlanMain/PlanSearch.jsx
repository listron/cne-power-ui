import React, {Component} from 'react';
import { Button,Select} from 'antd';
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
    stationCodes: PropTypes.array,
    planYearList: PropTypes.array,
    changePlanStore: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      dateValue: '',
      stationCodes: [],
      selectStation :[],
    }
  }

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
    let {stationCodes,dateValue} = this.state;
    const params = {
      year: dateValue || this.props.planYearList[0],
      stationCodes: stationCodes.length > 0 ? stationCodes: null,
      sortField: this.props.sortField,
      sortMethod: this.props.sortMethod,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    };
    this.props.getPlanList(params)
  };

  selectYear=(e)=>{
    this.setState({dateValue:e})
    this.props.changePlanStore({planYear: e});
  };

  render() {
    const {stations,planYearList} = this.props;
    const {selectStation,dateValue}=this.state;
    const currentYear=new Date().getFullYear().toString();
    const index=planYearList.indexOf(currentYear);
    const defaultValue=dateValue || (index >-1 ? currentYear : planYearList[0])
    return (
      <div className={styles.planSearch}>
        <div>
          <span className={styles.year}>年份选择</span>
          <Select style={{width: 105}} onChange={this.selectYear} placeholder="--" value={defaultValue}>
            {planYearList.map((year,index) => {
              return <Option value={String(year)} key={year} selected>{year}</Option>
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
    )
  }
}

export default planSearch;
