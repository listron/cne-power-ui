import React, { Component } from 'react';
import { Select ,AutoComplete  } from 'antd';
import StationSelectModal from './StationSelectModal'
import styles from './style.scss';
import PropTypes from 'prop-types';
const Option = Select.Option;
/*
  电站选择组件：
  必须参数:
  1. 电站选择是否多选: multiple, 选填，默认为单选(false)。
  2. 组件生成时默认已选中的电站(value)(value形式与data相同[object])
  3. 电站基本信息数组(data),包含信息如下：
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
  3. 传递下来的style值，可选填，用于控制筛选组件总体样式 {width:'500px'}
  4. 输出信息:this.props.onOK(selectedStationArray)为data中筛选的一个或多个，this.props.onChange(form表单用若有会同时触发)
*/

class StationSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.array,
    data: PropTypes.array,
    onChange: PropTypes.func,
    onOK: PropTypes.func,
    style: PropTypes.object
  }
  static defaultProps = {
    multiple: false,
    data: [],
  }
  constructor(props) {
    super(props);
    this.state = {
      stationModalShow: false,
      checkedStations: [],
      checkedStationName: [],
      filteredSelectedStation: [],
    }
  }
  componentWillReceiveProps(nextProps){
    const { data, value } = nextProps;
    if( data && data.length > 0 && value && value.length >= 0){
      this.setState({
        checkedStations: nextProps.value,
        checkedStationName: nextProps.value.map(e=>e.stationName),
      })
    }
  }
  onOK = (stations) => {
    const { onChange,onOK } = this.props
    onOK && onOK(stations);
    onChange && onChange(stations);
  }
  onModalHandelOK = (stations) => {
    const checkedStationName = stations.map(e=>e.stationName);
    this.setState({
      stationModalShow: false,
      checkedStationName,
      checkedStations:stations
    })
    this.onOK(stations)
  }
  onSelect = (stationName) =>{
    const { data } = this.props;
    const checkedStations = data.filter(e=>e.stationName===stationName);
    const checkedStationName = checkedStations.map(e=>e.stationName);
    this.setState({
      checkedStationName,
      checkedStations
    })
    this.onOK(checkedStations)
  }
  hideStationModal = () => {
    this.setState({
      stationModalShow: false,
    })
  }
  handleSearch = (text) => {
    const { data } = this.props;
    let filteredSelectedStation = data.filter(e=>e.stationName.indexOf(text) >= 0)
    this.setState({
      checkedStationName:[text],
      filteredSelectedStation
    })
  }
  selectStation = (stations) => {//stations:选中的电站名称数组
    const { data } = this.props;
    const checkedStations = data.filter(e=>stations.includes(e.stationName))
    const checkedStationName = stations
    this.setState({
      stationModalShow: false,
      checkedStationName,
      checkedStations
    })
    this.onOK(checkedStations)
  }
  
  showStationModal = () => {
    this.setState({
      stationModalShow: true,
    })
  }

  render() {
    const { data, multiple } = this.props;
    const { checkedStationName, stationModalShow, filteredSelectedStation } = this.state;
    return (
      <div className={styles.stationSelect} style={this.props.style}>
        {multiple ? <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="输入关键字快速查询"
          onChange={this.selectStation}
          value={checkedStationName}
          className={styles.stationSelectMainInput}
        >
          {data.map(e=>(<Option key={e.stationName}>{e.stationName}</Option>))}
        </Select>:<AutoComplete
          style={{ width: '100%' }}
          onSearch={this.handleSearch}
          onSelect={this.onSelect}
          value={checkedStationName}
          placeholder="输入关键字快速查询"
        >
          {filteredSelectedStation.map((e) => (<Option key={e.stationName}>{e.stationName}</Option>))}
        </AutoComplete>}
        <StationSelectModal 
          multiple={multiple}
          data={data} 
          handleOK={this.onModalHandelOK}
          stationModalShow={stationModalShow}
          hideStationModal={this.hideStationModal} 
          showStationModal={this.showStationModal}
        />
      </div>
    )
    
  }
}
export default StationSelect;