import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './filterCondition.scss';
import { Tabs, Checkbox } from 'antd';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

/** 
 *  1 stationCodes 必填 选中的电站的stationCodes []
 *  2 stations 必填 该用户下所用的电站
 *  3 onChangeFilter 返回的函数
*/
class StationFilter extends Component {
  static propTypes = {
    stationCodes: PropTypes.array,
    stations: PropTypes.array,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all'
    };
  }

  onChangeStation = (checkedValue, provinceItem) => {
    const { stationCodes } = this.props;
    const provinceStation = provinceItem.map(e => e.stationCode)
    const newStationCode = stationCodes.filter(code => {
      return provinceStation.findIndex(station => station === code) === -1
    }).concat(checkedValue);
    this.props.onChangeFilter({
      stationCodes: newStationCode
    });
  }

  onChangeProvince = (key) => {
    if (key === 'all') {
      this.props.onChangeFilter({
        stationCodes: []
      });
    }
    this.setState({
      activeKey: key
    });
  }

  onCheckAll(e, data) { // 全部点击
    const checkedValue = data.map(item => item.stationCode);
    const stationCodeArr = this.props.stationCodes;
    let stationArray, newStationCode;
    if (e.target.checked) {
      stationArray = stationCodeArr.concat(checkedValue);
      newStationCode = Array.from(new Set(stationArray));
    } else {
      stationArray = stationCodeArr.filter(item => checkedValue.indexOf(item) === -1);
      newStationCode = stationArray;
    }
    this.props.onChangeFilter({
      stationCodes: newStationCode
    });
  }

  getCheckAll(data) { // 当前是否是选中
    const checkedOption = data.map(item => item.stationCode);
    const stationCodeArr = this.props.stationCodes;
    let result = true;
    checkedOption.forEach(element => {
      if (stationCodeArr.indexOf(element) === -1) {
        result = false;
        return;
      }
    });
    return result;
  }


  renderProvince(stationData) {
    const stationCodes = this.props.stationCodes;
    const stationCodeArr = stationCodes || [];
    return stationData.map((provinceItem, index) => {
      const options = provinceItem.map(station => {
        return {
          label: station.stationName,
          value: station.stationCode,
        };
      });
      const items = provinceItem.filter(station => {
        return stationCodeArr.findIndex(code => code === station.stationCode) > -1;
      });
      const value = items.map(item => {
        return item.stationCode
      });
      return (
        <TabPane tab={provinceItem[0].provinceName} key={index}>
          <Checkbox
            className={styles.allCheck}
            onChange={(e) => this.onCheckAll(e, provinceItem)}
            checked={this.getCheckAll(provinceItem)}
          >全部
          </Checkbox>
          <CheckboxGroup
            options={options}
            value={value}
            onChange={(checkedValue) => this.onChangeStation(checkedValue, provinceItem)}>
          </CheckboxGroup>
        </TabPane>
      );
    })
  }



  render() {
    const { stations, stationCodes } = this.props;
    const { activeKey } = this.state;
    let provinceCode = [...new Set(stations.map(e => e.provinceCode))]
    let provinceStation = provinceCode.map(e => {
      return stations.filter((item, index) => {
        if (item.provinceCode === e) {
          return item
        }
      })
    })
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