import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stationFilter.scss';
import { Tabs, Checkbox } from 'antd';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;


class StationFilter extends Component {
  static propTypes = {
    stationCodes: PropTypes.string,
    stations: PropTypes.object,
    onChangeFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all',
    };
  }

  onChangeStation = (checkedValue, provinceCode) => {
    const { stations, stationCodes } = this.props;
    const stationCodeArr = stationCodes === '' ? [] : stationCodes.split(',');
    const provinceStation = stations.groupBy(item=>item.get('provinceCode')).toJS()[provinceCode];
    const newStationCode = stationCodeArr.filter(code => {
      return provinceStation.findIndex(station => station.stationCode.toString() === code) === -1;
    }).concat(checkedValue);
    this.props.onChangeFilter({
      stationCodes: newStationCode.join(','),
    });
  };

  onChangeProvince = (key) => {
    if(key === 'all') {
      this.props.onChangeFilter({
        stationCodes: '',
      });
    }
    this.setState({
      activeKey: key,
    });
  };

  onCheckAll(e, data) {
    const checkedValue = data.map(item=>item.get('stationCode').toString()).toJS();
    const stationCodes = this.props.stationCodes;
    const stationCodeArr = stationCodes === '' ? [] : stationCodes.split(',');
    let stationArray, newStationCode;
    if(e.target.checked) {
      stationArray = stationCodeArr.concat(checkedValue);
      newStationCode = Array.from(new Set(stationArray));
    } else {
      stationArray = stationCodeArr.filter(item => checkedValue.indexOf(item)===-1);
      newStationCode = stationArray;
    }
    this.props.onChangeFilter({
      stationCodes: newStationCode.join(','),
    });
  }

  getCheckAll(data) {
    const checkedOption = data.map(item=>item.get('stationCode').toString()).toJS();
    const stationCodes = this.props.stationCodes;
    const stationCodeArr = stationCodes === '' ? [] : stationCodes.split(',');
    let result = true;
    checkedOption.forEach(element => {
      if(stationCodeArr.indexOf(element) === -1) {
        return result = false;
      }
    });
    return result;
  }

  renderProvince(stationData) {
    const stationCodes = this.props.stationCodes;
    const stationCodeArr = stationCodes === '' ? [] : stationCodes.split(',');
    return stationData.map((provinceItem, index) => {
      const options = provinceItem.map(station=>{
        return {
          label: station.get('stationName'),
          value: station.get('stationCode').toString(),
        };
      }).toJS();
      const items = provinceItem.filter(station=>{
        return stationCodeArr.findIndex(code=>code===station.get('stationCode').toString()) > -1;
      });
      const value = items.map(item => {
        return item.get('stationCode').toString();
      }).toJS();
      return (
        <TabPane tab={provinceItem.getIn([0, 'provinceName'])} key={index}>
          <Checkbox
            className={styles.allCheck}
            onChange={(e)=>this.onCheckAll(e, provinceItem)}
            checked={this.getCheckAll(provinceItem)}
          >全部
          </Checkbox>
          <CheckboxGroup
            options={options}
            value={value}
            onChange={(checkedValue)=>this.onChangeStation(checkedValue, provinceItem.getIn([0, 'provinceCode']) && provinceItem.getIn([0, 'provinceCode']).toString())}>
          </CheckboxGroup>
        </TabPane>
      );
    });
  }


  render() {
    const { stations } = this.props;
    const { activeKey } = this.state;
    const provinceStation = stations.filter(e => e.get('stationType') === 0).groupBy(item=>item.get('provinceCode')).toList();
    return (
      <div className={styles.stationFilter}>
        <Tabs onChange={this.onChangeProvince} activeKey={activeKey} animated={false}>
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
