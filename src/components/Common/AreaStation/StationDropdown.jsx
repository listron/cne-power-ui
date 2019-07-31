
import React, { Component } from 'react';
import { Dropdown, Icon, Button, Checkbox } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';
const CheckboxGroup = Checkbox.Group;

class StationDropdown extends Component {
  static propTypes = {
    holderText: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props){
    super(props);
    this.state = {
      visible: false,
      checkedList: props.value,
    };
  }

  componentWillReceiveProps(nextProps){
    const { value } = this.props;
    const nextValue = nextProps.value;
    const preStations = this.getStationSet(value);
    const nextStations = this.getStationSet(nextValue);
    const needUpdateValue = this.isSetDiff(preStations, nextStations);
    needUpdateValue && this.setState({ // value变化时, state同步
      checkedList: nextValue,
    });
  }

  isSetDiff = (a, b) => { // 比价两个电站codes的set集。
    if(a.size !== b.size) {
      return true;
    }
    const hasDiff = Array.from(a).find(code => !b.has(code));
    return hasDiff;
  }

  getStationSet = (data = []) => { // 电站源数据
    const stationSet = new Set();
    data.forEach(e => {
      const eachStations = e.stations || [];
      eachStations.forEach(m => stationSet.add(m.stationCode));
    });
    return stationSet;
  }

  createRegions = (data = []) => (
    <ul className={styles.regionBox}>
      <li className={styles.region} onClick={this.onAllRegions}>全部区域</li>
      {data.map(e => (
        <li className={styles.region} key={e.regionName}>
          <span>{e.regionName}</span>
          <Icon type="right" />
          {this.createStations(e)}
        </li>
      ))}
    </ul>
  )

  getStations = (data = [], regionName) => {
    const tmpInfo = data.find(e => e.regionName === regionName) || {};
    const stations = tmpInfo.stations || [];
    return stations;
  }

  createStations = ({regionName, stations = [] }) => {
    const { data } = this.props;
    const { checkedList } = this.state;
    const curChecked = this.getStations(checkedList, regionName); // 当前区域选中电站
    const allStation = this.getStations(data, regionName); // 当前区域全部电站
    const allCheck = curChecked.length === allStation.length; // 是否全选中。
    return (
      <div className={styles.stations}>
        <Checkbox
          indeterminate={curChecked.length > 0 && !allCheck}
          onChange={({ target }) => this.onAllCheck(target, regionName)}
          checked={allCheck}
          className={styles.all}
        >
          全部选择
        </Checkbox>
        <CheckboxGroup
          className={styles.group}
          options={stations.map(e => e.stationName)}
          value={curChecked.map(e => e.stationName)}
          onChange={(list) => this.onStationCheck({ regionName, list })}
        />
      </div>
    );
  }

  onStationCheck = ({ regionName, list }) => { // 如果后续设计要求允许跨区域选择，在此处判定然后确定是否清空其他区域数据即可。
    const { data } = this.props; // 可能是跨区域选择 => 清空已选中的别的区域。
    const curAllStation = this.getStations(data, regionName); // 当前区域下所有电站。
    const stations = curAllStation.filter(e => list.includes(e.stationName));
    const checkedList = [{ regionName, stations }]; // 直接替换当前
    this.setState({ checkedList });
  }

  onAllCheck = ({ checked }, regionName) => {
    let checkedList = [];
    const { data } = this.props;
    if (checked) {
      const stations = this.getStations(data, regionName); // 全选区域下所有
      checkedList = [{ regionName, stations }];
    }
    this.setState({ checkedList });
  }

  onAllRegions = () => { // 全部区域选择
    const { onChange, data } = this.props;
    this.setState({
      visible: false,
      checkedList: data,
    });
    onChange(data);
  }

  showDropdown = () => {
    this.setState({ visible: true });
  }

  onVisibleChange = (visible) => {
    const { checkedList } = this.state;
    if (!visible) { // 完成选择，关闭弹框并输出数据。
      this.props.onChange(checkedList);
      this.setState({ visible });
    }
  }

  getCheckedText = (data, checkedList) => { // 允许多区域时, 该函数需调整展示
    if(checkedList.length === data.length) { // 允许多区域时, 该函数需调整展示为判定两者调用getStationSet比较
      return '全部区域';
    }
    const textArr = checkedList.map(e => {
      const { regionName, stations } = e || {};
      const totalNum = this.getStations(data, regionName).length;
      return `${regionName}-${stations.length}/${totalNum}个电站`;
    });
    return textArr.join(' ');
  }

  render() {
    const { data, holderText } = this.props;
    const { visible, checkedList } = this.state;
    const regions = this.createRegions(data);
    console.log(checkedList)
    return (
      <Dropdown overlay={regions} trigger={['click']} visible={visible} onVisibleChange={this.onVisibleChange}>
        <Button className={styles.multipleButton} onClick={this.showDropdown}>
          {checkedList.length > 0 && data.length > 0 ? <span className={styles.values}>
            {this.getCheckedText(data, checkedList)}
          </span> : <span className={styles.holder}>
            {holderText}
          </span>}
          <Icon type="down" className={styles.icon} />
        </Button>
      </Dropdown>
    );
  }
}
export default StationDropdown;

