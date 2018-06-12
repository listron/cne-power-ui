import React, { Component } from 'react';
import { Icon, Input, Select  } from 'antd';
import StationSelectModal from './StationSelectModal'
import styles from './style.scss';
import PropTypes from 'prop-types';
const Option = Select.Option;
/*
  电站选择组件：
  必须参数:
  1. 电站选择是否多选: multiple, 选填，默认为单选(false)。
  2. 电站基本信息数组(value),包含信息如下：
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
  3. 输出信息:this.props.onChange(selectedStationArray)为value中筛选的一个或多个
*/

class StationSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    value: PropTypes.array,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    multiple: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      stationModalShow: false,
      checkedStations: [],
      checkedStationName:[],
    }
  }
  showStationModal = () => {
    this.setState({
      stationModalShow: true,
    })
  }
  hideStationModal = () => {
    this.setState({
      stationModalShow: false,
    })
  }
  selectStation = (stations) => {//stations:选中的电站名称数组
    const { value } = this.props;
    const checkedStations = value.filter(e=>stations.includes(e.stationName))
    this.setState({
      stationModalShow: false,
      checkedStationName: stations,
      checkedStations
    })
    this.props.onChange(checkedStations)
  }

  render() {
    const { value } = this.props;
    const { checkedStationName, stationModalShow } = this.state;
    return (
      <div className={styles.stationSelect}>
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="输入关键字快速查询"
          onChange={this.selectStation}
          value={checkedStationName}
        >
          {value.map(e=>(<Option key={e.stationName}>{e.stationName}</Option>))}
        </Select>
        <StationSelectModal 
          value={value} 
          stationModalShow={stationModalShow}
          selectStation={this.selectStation} 
          hideStationModal={this.hideStationModal} 
          showStationModal={this.showStationModal}
        />
      </div>
    )
    
  }
}
export default StationSelect;