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
    option: PropTypes.object,
    onChangeFilter: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'all',
    };
  }

  onChangeStation = (checkedValues, provinceItem) => {
    const { option = {} } = this.props;
    option.checkedValue = [...new Set([...option.checkedValue, ...checkedValues])];
    this.props.onChangeFilter({ option });
  }




  onChangeProvince = (key) => {
    if (key === 'all') {
      this.props.onChangeFilter({
        stationCodes: [],
      });
    }
    this.setState({
      activeKey: key,
    });
  }

  // onCheckAll(e, data) { // 全部点击
  //   const checkedValue = data.map(item => item.stationCode);
  //   const stationCodeArr = this.props.stationCodes;
  //   let stationArray, newStationCode;
  //   if (e.target.checked) {
  //     stationArray = stationCodeArr.concat(checkedValue);
  //     newStationCode = Array.from(new Set(stationArray));
  //   } else {
  //     stationArray = stationCodeArr.filter(item => checkedValue.indexOf(item) === -1);
  //     newStationCode = stationArray;
  //   }
  //   this.props.onChangeFilter({
  //     stationCodes: newStationCode,
  //   });
  // }

  getCheckAll(data) { // 当前是否是选中
    const checkedOption = data.map(item => item.stationCode);
    const { checkedValue = [] } = this.props;
    let result = true;
    checkedOption.forEach(element => {
      if (checkedValue.indexOf(element) === -1) {
        result = false;
        return;
      }
    });
    return result;
  }


  renderProvince(stationData) {
    const { option = {} } = this.props;
    const { checkedValue = [] } = option;
    return stationData.map((provinceItem, index) => {
      const optionArr = provinceItem.map(station => {
        return {
          label: station.stationName,
          value: station.stationCode,
        };
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
            options={optionArr}
            value={checkedValue}
            onChange={(e) => this.onChangeStation(e, provinceItem)}>
          </CheckboxGroup>
        </TabPane>
      );
    });
  }



  render() {
    const { option = {} } = this.props;
    const { data = [], checkedValue } = option;
    const { activeKey } = this.state;
    const provinceCode = [...new Set(data.map(e => e.provinceCode))];
    const provinceStation = provinceCode.map(e => {
      return data.filter((item, index) => {
        if (item.provinceCode === e) {
          return item;
        }
      });
    });


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
