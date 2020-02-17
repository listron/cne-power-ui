import React, { Component } from 'react';
import { Select, AutoComplete, message } from 'antd';
import StationSelectModal from './StationSelectModal';
import styles from './style.scss';
import PropTypes from 'prop-types';
const Option = Select.Option;
/*
  电站选择组件：
  参数:
  1. 必填 - 电站基本信息数组(data),包含信息如下：
    [{
      commissioningDate:"2012-04-15T00:00:00"
      enterpriseId:"1"
      isConnected:false
      isWork:true
      latitude:"42.269351000000"
      longitude:"121.361496000000"
      orderNO:21102
      provinceCode:11            //必传
      provinceName:"辽宁"        //必传
      ratio:"0.30"
      stationCode:35           //必传
      stationId:"07392334-41ee-46f3-9385-e0617bd79433"       //必传
      stationName:"阜西古力本皋"  //必传
      stationPower:"49.50"
      stationType:10              //必传
      stationUnitCount:33
      subCompany:"辽宁分公司"
      timeZone:8
      version:4436
      weaId:null
      zoneCode:10
      zoneName:"辽宁"
    }]
  2. 必填 - 输出信息:this.props.onOK(selectedStationArray)为data中筛选的一个或多个，this.props.onChange(form表单用若有会同时触发)

  3. 选填 - 电站选择是否多选: multiple, 选填，默认为单选(false)。
  4. 选填 - 组件生成时默认已选中的电站(value)(value形式与data相同[object])
  5. 选填 - 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  6. 选填 - holderText: string, 可选填，当用户未选择电站时的占位提示文字。
  7. 选填 - disabledStation指定的不可选电站codes数组 - int[] ; 默认为[]
  8. 选填 - disabled: bool; 默认false， 传入true值时组件为禁用状态。
  9. 选填 - oneStyleOnly : bool; 默认为false，用于控制用户是否只能选一种类型的电站(默认都可以)。
  10. 选填- stationShowNumber:bool; 默认是false，展示具体的电站名称  传入为true时，显示: 已选电站 已选电站数量/所有电站数量
  11. 选填 - stationShowNumber为true时, selectsStationText 对stationShowNumber的补充,用于手动自定义展示已选电站文本 - todo
  12.当电站类型为风或光这种单一电站数据类型，（就是没有头部的电站类型选择时）并且电站选择模式为多选时会有全选功能
  13  filterStations:[] 单独筛选的功能 [350,56]
*/

class StationSelect extends Component {
  static propTypes = {
    theme: PropTypes.string,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    oneStyleOnly: PropTypes.bool,
    stationShowNumber: PropTypes.bool,
    // holderText: PropTypes.bool,
    holderText: PropTypes.string,
    value: PropTypes.array,
    data: PropTypes.array,
    disabledStation: PropTypes.array,
    onChange: PropTypes.func,
    onOK: PropTypes.func,
    style: PropTypes.object,
    deviceShowNumber: PropTypes.bool,
  }
  static defaultProps = {
    multiple: false,
    oneStyleOnly: false,
    holderText: '输入关键字快速查询',
    disabled: false,
    stationShowNumber: false,
    data: [],
    disabledStation: [],
    theme: 'light',
    filterStations: [],
  }
  constructor(props) {
    super(props);
    const checkedStations = props.value || [];
    this.state = {
      stationModalShow: false,
      checkedStations,
      checkedStationName: checkedStations.map(e => e.stationName),
      filteredSelectedStation: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { data, value } = nextProps;
    if (data && data.length > 0 && value && value.length >= 0) {
      this.setState({
        checkedStations: nextProps.value,
        checkedStationName: nextProps.value.map(e => e.stationName),
      });
    }
  }
  onOK = (stations) => {
    const { onChange, onOK } = this.props;
    onOK && onOK(stations);
    onChange && onChange(stations);
  }
  onModalHandelOK = (stations) => {
    const checkedStationName = stations.map(e => e.stationName);
    this.setState({
      stationModalShow: false,
      checkedStationName,
      checkedStations: stations,
    });
    this.onOK(stations);
  }
  onSelect = (stationName) => {
    const { data } = this.props;
    const checkedStations = data.filter(e => e.stationName === stationName);
    const checkedStationName = checkedStations.map(e => e.stationName);
    this.setState({
      checkedStationName,
      checkedStations,
    });
    this.onOK(checkedStations);
  }
  hideStationModal = () => {
    this.setState({
      stationModalShow: false,
    });
  }
  handleSearch = (text) => {
    const { data, disabledStation } = this.props;
    const filteredSelectedStation = data.filter(
      e => !disabledStation.includes(e.stationCode) // 剔除禁选电站
    ).filter(
      e => e.stationName.indexOf(text) >= 0
    );
    this.setState({
      checkedStationName: [text],
      filteredSelectedStation,
    });
  }
  selectStation = (stations) => {//stations:选中的电站名称数组
    const { data, oneStyleOnly } = this.props;
    const checkedStations = [];
    stations.forEach(item => { data.forEach(e => e.stationName === item && checkedStations.push(e)); });
    if (oneStyleOnly) { // 只能选择一种类型电站
      const stationTypeSet = new Set();
      checkedStations.forEach(e => { stationTypeSet.add(e.stationType); });
      if (stationTypeSet.size > 1) { // 选择了多种类型电站
        message.error('请选择同为风电或光伏的电站!');
        return;
      }
    }
    const checkedStationName = stations;
    this.setState({
      stationModalShow: false,
      checkedStationName,
      checkedStations,
    });
    this.onOK(checkedStations);
  }

  showStationModal = () => {
    !this.props.disabled && this.setState({
      stationModalShow: true,
    });
  }

  render() {
    const { data, multiple, holderText, disabledStation, disabled, oneStyleOnly, stationShowNumber, theme = 'dark', filterStations, filterSwitch } = this.props;
    const { checkedStationName, stationModalShow, filteredSelectedStation, checkedStations } = this.state;
    const deviceShow = checkedStations.length > 0 && stationShowNumber && {
      maxTagCount: 0,
      maxTagPlaceholder: `已选电站${checkedStations.length}/${data.length}`,
    } || {};
    return (
      <div className={`${styles.stationSelect} ${styles[theme]}`} style={this.props.style}>
        <span ref="part" />
        {multiple ? <Select
          mode="multiple"
          disabled={disabled}
          style={{ width: '100%' }}
          placeholder={holderText}
          onChange={this.selectStation}
          value={checkedStationName}
          className={styles.stationSelectMainInput}
          {...deviceShow}
          getPopupContainer={() => this.refs.part}
        >
          {data.filter(e => !disabledStation.includes(e.stationCode)).map(e => (
            <Option key={e.stationName}>{e.stationName}</Option>
          ))}
        </Select> : <AutoComplete
          disabled={disabled}
          style={{ width: '100%' }}
          onSearch={this.handleSearch}
          onSelect={this.onSelect}
          value={checkedStationName}
          placeholder={holderText}
          getPopupContainer={() => this.refs.part}
        >
            {filteredSelectedStation.map((e) => (<Option key={e.stationName}>{e.stationName}</Option>))}
          </AutoComplete>}
        <StationSelectModal
          multiple={multiple}
          oneStyleOnly={oneStyleOnly}
          disabled={disabled}
          disabledStation={disabledStation}
          checkedStations={checkedStations}
          data={data}
          handleOK={this.onModalHandelOK}
          stationModalShow={stationModalShow}
          hideStationModal={this.hideStationModal}
          showStationModal={this.showStationModal}
          filterStations={filterStations}
          filterSwitch={filterSwitch}
        />
      </div>
    );

  }
}
export default StationSelect;
