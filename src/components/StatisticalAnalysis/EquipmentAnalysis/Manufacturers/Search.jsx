import React, { Component } from "react";
import styles from "./manufacturers.scss";
import PropTypes from 'prop-types';
import { Select, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import StationSelect from "../../../Common/StationSelect";
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Search extends Component {
  static propTypes = {
    stations: PropTypes.array,
    manufacturerList: PropTypes.array,
    devicemodeList: PropTypes.array,
    deviceData: PropTypes.array,
    getManufacturer: PropTypes.func,
    getDevicemode: PropTypes.func,
    getDevicecontrast: PropTypes.func,
    stationCode: PropTypes.array,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    deviceTypeCode: PropTypes.string,
    manufacturerMode: PropTypes.string,
    manufacturerModes: PropTypes.array,
  }

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {  
    this.getDevice()
  }

  getDevice=(value)=>{ // 获取筛选之后的厂家型号
    const { stationCode, startDate, endDate, deviceTypeCode, manufacturerModes } = this.props;
    const params={stationCode, startDate, endDate, deviceTypeCode, manufacturerModes}
    this.props.getDevicecontrast({...params, ...value});
  }

  changeType = (value) => { // 改变厂家型号
    this.getDevice({ manufacturerMode:value})
  }

  stationSelected=(value)=>{ // 电站选择
    const stationCodes=[];
    value.forEach(e => {stationCodes.push(e.stationCode)  });
    this.getDevice({ stationCode:stationCodes})
  }

  


  render() {
    const { stations, deviceData, manufacturerMode } = this.props;
    console.log('manufacturerList', deviceData)
    const treeData = deviceData.map(e => {
      return {
        title: e.manufacturerModeName,
        value: e.manufacturerModeData,
        key: e.manufacturerModeData,
      }
    })
    const treeProps = {
      treeData: treeData,
      treeCheckable: true,
      filterTreeNode: false,
      searchPlaceholder: null,
      style: {
        width: 198,
      },
    }
    const currentYearDay = moment().year() + '/01/01';
    return (
      <div className={styles.search}>
        <div className={styles.condition}>
          <span>条件查询</span>
          <Select defaultValue="206" style={{ width: 200, marginLeft: 15 }}  >
            <Option value="206">逆变器</Option>
          </Select>
          <RangePicker
            defaultValue={[moment(currentYearDay, 'YYYY-MM-DD'), moment(moment(), 'YYYY-MM-DD')]}
            format={'YYYY-MM-DD'}
            style={{ width: 200, marginLeft: 15, marginRight: 15 }}
          />
          <StationSelect
            data={stations.filter(e => e.stationType === 1)}
            holderText={"全部电站"}
            multiple={true}
            // value={station.length > 0 ? station : []}
            onChange={this.stationSelected}
          />
        </div>
        <div className={styles.antherCondition}>
          <span>厂家型号</span>
          <Select defaultValue="厂家" style={{ width: 200, marginLeft: 15 }} onChange={this.changeType}
          >
            <Option value="manufacturer">按厂家</Option>
            <Option value="deviceMode">按型号</Option>
          </Select>
          <TreeSelect {...treeProps}
            dropdownClassName={styles.treeDeviceTypes}
            placeholder={manufacturerMode==='manufacturer'?'全部厂家':'全部型号'}
            style={{ width: 200, marginLeft: 15 }} />
        </div>

      </div>
    )
  }
}

export default Search