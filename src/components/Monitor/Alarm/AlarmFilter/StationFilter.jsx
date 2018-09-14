import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './alarmFilter.scss';
import { Tabs, Checkbox } from 'antd';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;


class StationFilter extends Component {
  static propTypes = {
    stationCode: PropTypes.array,
    stations: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all'
    };
  }

  onChangeStation = (checkedValue, provinceCode) => {
    const { stations, stationCode } = this.props;
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toJS()[provinceCode];
    const newStationCode = stationCode.filter(code => {
      return provinceStation.findIndex(station => station.stationCode.toString() === code) === -1
    }).concat(checkedValue);
    this.props.onChangeFilter({
      stationCode: newStationCode
    });
  }

  onChangeProvince = (key) => {
    if(key === 'all') {
      this.props.onChangeFilter({
        stationCode: []
      });
    }
    this.setState({
      activeKey: key
    })
  }

  onCheckAll(e, data) {
    const checkedValue = data.map(item=>item.get('stationCode').toString()).toJS();
    let stationCode = this.props.stationCode;
    let stationArray;
    if(e.target.checked) {
      stationArray = stationCode.concat(checkedValue);
      stationCode = Array.from(new Set(stationArray));   
    } else {
      stationArray = stationCode.filter(item => checkedValue.indexOf(item)===-1);
      stationCode = stationArray;
    }
    this.props.onChangeFilter({
      stationCode
    });
  }

  getCheckAll(data) {
    const checkedOption = data.map(item=>item.get('stationCode').toString()).toJS();
    const stationCode = this.props.stationCode;
    let result = true;
    checkedOption.forEach(element => {
      if(stationCode.indexOf(element) === -1) {
        result = false;
        return;
      }
    });
    return result;
  }

  renderProvince(stationData) {
    const stationCode = this.props.stationCode;
    return stationData.map(provinceItem => {
      const options = provinceItem.map(station=>{
        return {
          label: station.get('stationName'),
          value: station.get('stationCode').toString()
        };
      }).toJS();
      const items = provinceItem.filter(station=>{
        return stationCode.findIndex(code=>code===station.get('stationCode').toString()) > -1;
      });
      const value = items.map(item => {
        return item.get('stationCode').toString()
      }).toJS();
      return (
        <TabPane tab={provinceItem.getIn([0,'provinceName'])} key={provinceItem.getIn([0,'provinceCode']).toString()}>
          <Checkbox onChange={(e)=>this.onCheckAll(e, provinceItem)} checked={this.getCheckAll(provinceItem)}>全部</Checkbox>
          <CheckboxGroup 
            options={options}
            value={value} 
            onChange={(checkedValue)=>this.onChangeStation(checkedValue, provinceItem.getIn([0,'provinceCode']).toString())}>
          </CheckboxGroup>
        </TabPane>
      );
    });
  }


  render() {
    const { stations } = this.props;
    const { activeKey } = this.state;
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toList();

    return (
      <div className={styles.stationFilter}>
        <Tabs onChange={this.onChangeProvince} activeKey={activeKey} animated={false} >
          <TabPane tab="不限" key="all">
            {null}
          </TabPane>
          {this.renderProvince(provinceStation)}
        </Tabs>
      </div>
    );
  }
}

export default StationFilter;