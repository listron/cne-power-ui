

import React, { Component } from 'react';
import { Input, Button ,DatePicker} from 'antd';
import styles from './planMain.scss';
import PropTypes from 'prop-types';
const { MonthPicker, RangePicker } = DatePicker;
import moment from 'moment';
import StationSelect from '../../../../Common/StationSelect';
class planSearch extends Component {
  static propTypes = {
    stations: PropTypes.object,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    getPlanList: PropTypes.func,
    sortField:PropTypes.string,
    sort:PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state = {
      open:false,
      dateValue:'2018',
      stationCode:[]
    }
  }

  onPanelChange=(value,mode)=>{
    let data=new Date(value._d).getFullYear()
    this.setState({open:false,dateValue:data})
  };

  onOpenChange=()=>{
    this.setState({open:true})
  };

  stationSelected=(rest)=>{
    const stationCode=rest.map((item,index)=>{
      return item.stationCode
    });
    this.setState({stationCode:stationCode})
  };

  selectValue=()=>{
    const params = {
      year: this.state.dateValue,
      stationCodes: this.state.stationCode,
      sortField: this.props.sortField,
      sortMethod: this.props.sort,
      pageNum: this.props.pageNum,
      pageSize: this.props.pageSize,
    };
    this.props.getPlanList(params)
  }
  render(){
    const {stations}=this.props;
    const dateFormat = 'YYYY';
    return (
      <div className={styles.planSearch}>
        <div>
          <span>时间选择</span>
          <DatePicker
            defaultValue={moment('2015', dateFormat)}
            format={dateFormat}
            mode='year'
            open={this.state.open}
            focus={this.focus}
            value={moment(this.state.dateValue, dateFormat)}
            onOpenChange={this.onOpenChange}
            onPanelChange={(value,mode)=>(this.onPanelChange(value,mode))}
          />
        </div>
        <div>
          <label htmlFor="label">电站选择</label>
          <StationSelect
            data={stations.toJS()}
            multiple={true}
            onChange={this.stationSelected}
            id="label"
          />
        </div>
        <Button className={styles.searchButton} onClick={this.selectValue}>下一步</Button>
      </div>
    )
  }
}

export default planSearch;
