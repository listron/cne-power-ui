import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './alarmFilter.scss';
import { Tabs, Checkbox } from 'antd';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;


class StationFilter extends Component {
  static propTypes = {
    stationCode: PropTypes.string,
    stations: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all'
    };
  }

  onChangeStation = (checkedValue) => {
    const stationArray = this.props.stationCode.split(',').concat(checkedValue);
    const stationCode = Array.from(new Set(stationArray)).join(',');
    this.props.onChangeFilter({
      stationCode
    });
  }

  onChangeStationType = (key) => {
    if(key === 'all') {
      this.props.onChangeFilter({
        stationCode: ''
      });
    }
    this.setState({
      activeKey: key
    })
  }

  onCheckAll(e, data) {
    const checkedValue = data.map(item=>data.get('stationCode').toString()).toJS();
    let stationCode = this.props.stationCode.split(',');
    let stationArray, stationCode;
    if(e.target.Checked) {
      stationArray = stationCode.concat(checkedValue);
      stationCode = Array.from(new Set(stationArray)).join(',');   
    } else {
      stationArray = stationCode.filter(item => checkedValue.indexOf(item)===-1);
      stationCode = stationArray.join(',');
    }
    this.props.onChangeFilter({
      stationCode
    });
  }

  getCheckAll(data) {
    const checkedOption = data.map(item=>data.get('stationCode').toString()).toJS();
    const stationCode = this.props.stationCode.split(',');
    const result = Array.from(new Set(stationCode.concat(checkedOption)));
    if(result.length === stationCode.length - checkedOption.length) {
      return true;
    } else {
      return false;
    }
  }

  renderTypeStation(provinceData, data) {
    const stationCode = this.props.stationCode.split(',');
    const stationList = provinceData.map((provinceItem, index) => {
      return (
        <div className={styles.provinceItem} key={index}>
          <span>{provinceItem.getIn([0, 'provinceName'])}</span>
          <CheckboxGroup 
            options={provinceItem.map(station=>{
              return {
                label: station.get('stationName'),
                value: station.get('stationCode').toString()
              };
            }).toJS()}
            value={provinceItem.filter(station=>{
              return stationCode.find(code=>code===station.get('stationCode').toString());
            }).toJS()} 
            onChange={this.onChangeStation}></CheckboxGroup>
        </div>
      );
    });
    return (
      <div className={styles.stationTab}>
        <Checkbox onChange={(e)=>this.onCheckAll(e, data)} checked={this.getCheckAll(data)}>全部</Checkbox>
        {stationList}
      </div>
    )
  }


  render() {
    const { stations } = this.props;
    const { activeKey } = this.state;
    const windStation = stations.filter(item=>{
      return item.get('stationType') === 0;
    });
    const pvStation = stations.filter(item=>{
      return item.get('stationType') === 1;
    });
    const windProvinceStation = windStation.groupBy(item=>item.get('provinceCode'));
    const pvProvinceStation = pvStation.groupBy(item=>item.get('provinceCode'));

    return (
      <div className={styles.stationFilter}>
        <Tabs onChange={this.onChangeStationType} activeKey={activeKey} >
          <TabPane tab="不限" key="all">
            {null}
          </TabPane>
          <TabPane tab="风电" key="wind">
            {this.renderTypeStation(windProvinceStation, windStation)}
          </TabPane>
          <TabPane tab="光伏" key="pv">
            {this.renderTypeStation(pvProvinceStation, pvStation)}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default StationFilter;