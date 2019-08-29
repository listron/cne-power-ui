import React, { Component } from 'react';
import { Select, AutoComplete } from 'antd';
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
*/

class StationSelectContrast extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    // holderText: PropTypes.bool,
    holderText: PropTypes.string,
    value: PropTypes.array,
    data: PropTypes.array,
    disabledStation: PropTypes.array,
    onChange: PropTypes.func,
    onOK: PropTypes.func,
    style: PropTypes.object,
  }
  static defaultProps = {
    multiple: false,
    holderText: '输入关键字快速查询',
    disabled: false,
    data: [],
    value: [],
    disabledStation: [],
  }
  constructor(props) {
    super(props);
    this.state = {
      stationModalShow: false,
      checkedStations: props.value,
      checkedStationName: props.value.map(e => e.stationName),
      filteredSelectedStation: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    const { data, value } = nextProps;
    if (data && data.length > 0 && value && value.length === 2) {
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
      checkedStationName,
      checkedStations: stations,
      stationModalShow: false,
    }, () => this.onOK(stations));

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
    const { data } = this.props;
    const checkedStations = data.filter(e => stations.includes(e.stationName));
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
    const { data, multiple, holderText, disabledStation, disabled, theme = 'light' } = this.props;
    const { checkedStationName, stationModalShow, filteredSelectedStation, checkedStations } = this.state;
    return (
      <div className={`${styles.stationSelect} ${styles[theme]}`} style={this.props.style}>
        <Select
          mode="multiple"
          disabled={disabled}
          style={{ width: '100%' }}
          placeholder={holderText}
          onChange={this.selectStation}
          value={checkedStationName}
          className={styles.stationSelectMainInput}
        >

        </Select>
        <StationSelectModal
          multiple={multiple}
          disabled={disabled}
          disabledStation={disabledStation}
          checkedStations={checkedStations}
          data={data}
          handleOK={this.onModalHandelOK}
          stationModalShow={stationModalShow}
          hideStationModal={this.hideStationModal}
          showStationModal={this.showStationModal}
          theme={theme}
        />
      </div>
    );

  }
}
export default StationSelectContrast;
