
import React, { Component } from 'react';
import { Dropdown, Icon, Button, Checkbox } from 'antd';
import styles from './style.scss';
import PropTypes from 'prop-types';
const CheckboxGroup = Checkbox.Group;

class StationDropdown extends Component {
  static propTypes = {
    holderText: PropTypes.string,
    mode: PropTypes.string,
    data: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }

  constructor(props){
    super(props);
    const { value = [], data } = props;
    this.state = {
      visible: false,
      checkedList: (data.length > 0 && value.length > 0) ? value : [],
    };
  }

  componentWillReceiveProps(nextProps){
    const { value, data } = this.props;
    const nextValue = nextProps.value;
    const nextData = nextProps.data;
    const isGataGet = data.length === 0 && nextData.length > 0 && value[0];
    const needUpdateValue = nextData.length > 0 && this.isSetDiff(
      this.getStationSet(value),
      this.getStationSet(nextValue),
    );
    if (isGataGet || needUpdateValue) {
      this.setState({ // value变化时, state同步
        checkedList: nextValue,
      });
    }
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

  createRegions = (data = []) => {
    const { mode } = this.props;
    return (
      <ul className={styles.regionBox}>
        {mode === 'all' && <li className={styles.region} onClick={this.onAllRegions}>全部区域</li>}
        {data.map(e => (
          <li className={styles.region} key={e.regionName}>
            <span>{e.regionName}</span>
            <Icon type="right"/>
            {this.createStations(e)}
          </li>
        ))}
      </ul>
    );
  };

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
    const { data, mode } = this.props;
    const { checkedList } = this.state;
    const curAllStation = this.getStations(data, regionName); // 当前区域下所有电站。
    const listInfo = curAllStation.filter(e => list.includes(e.stationName));
    let newChecked = [];
    if (mode === 'all') { // 多区域
      let hasCheckedRegion = false;
      newChecked = checkedList.map(e => {
        if (e.regionName === regionName) {
          hasCheckedRegion = true;
          return { regionName, stations: listInfo };
        }
        return e;
      });
      !hasCheckedRegion && newChecked.push({ regionName, stations: listInfo });
    } else {// 单区域 => 清空已选中的别的区域。
      newChecked = [{ regionName, stations: listInfo }]; // 直接替换当前
    }
    this.setState({ checkedList: newChecked });
  }

  onAllCheck = ({ checked }, regionName) => {
    const { checkedList } = this.state;
    const { data, mode } = this.props; // mode = all // 多区域 region // 单区域
    const stations = this.getStations(data, regionName);
    let newChecked = [];
    if (mode === 'all') { // 多区域
      let hasCheckedRegion = false;
      newChecked = checkedList.map(e => {
        if (e.regionName === regionName) {
          hasCheckedRegion = true;
          return checked ? { regionName, stations } : { regionName, stations: [] };
        }
        return e;
      });
      !hasCheckedRegion && checked && newChecked.push({ regionName, stations });
    } else { // 单区域
     checked && (newChecked = [{ regionName, stations }]);
    }
    this.setState({ checkedList: newChecked });
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
    const totalStations = this.getStationSet(data);
    const checkedStations = this.getStationSet(checkedList);
    const { mode } = this.props; // mode = all // 多区域 region // 单区域
    if (totalStations.size === checkedStations.size) {
      return '全部区域';
    }
    // 全部区域
    if (mode === 'all') {
      const textArr = []; // 选中的区域数量
      let textNum = 0; // 选中的电站数量
      checkedList.forEach(cur => {
        if(cur.stations && cur.stations.length > 0){
          textArr.push(cur);
          textNum += cur.stations.length;
        }
      });
      return `已选${textArr.length}个区域-${textNum}个电站`;
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

