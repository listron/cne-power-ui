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

  onChangeStation = (checkedValue) => {
    const stationArray = this.props.stationCode.concat(checkedValue);
    const stationCode = Array.from(new Set(stationArray));
    this.props.onChangeFilter({
      stationCode
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
    const checkedValue = data.map(item=>data.get('stationCode').toString()).toJS();
    let stationCode = this.props.stationCode;
    let stationArray;
    if(e.target.Checked) {
      stationArray = stationCode.concat(checkedValue);
      stationCode = Array.from(new Set(stationArray));   
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
      return (
        <TabPane tab={provinceItem.getIn([0,'provinceName'])} key={provinceItem.getIn([0,'provinceCode']).toString()}>
          <Checkbox onChange={(e)=>this.onCheckAll(e, provinceItem)} checked={this.getCheckAll(provinceItem)}>全部</Checkbox>
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
            onChange={this.onChangeStation}>
          </CheckboxGroup>
        </TabPane>
      )
    });
  }


  render() {
    const { stations } = this.props;
    const { activeKey } = this.state;
    const provinceStation = stations.groupBy(item=>item.get('provinceCode'));

    return (
      <div className={styles.stationFilter}>
        <Tabs onChange={this.onChangeProvince} activeKey={activeKey} >
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