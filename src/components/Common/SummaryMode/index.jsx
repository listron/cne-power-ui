
import React from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import { Radio, Button, Select, Icon } from 'antd';
import styles from './styles.scss';
import SelectModal from './Modal'
import { stationsByArea } from '../../../utils/utilFunc';
import { commonAction } from '../../../containers/alphaRedux/commonAction';


const Option = Select.Option;
/* 
汇总方式选择共用控件。
参数：
1.组件接收参数
  modeStyle: ,
  list 目前似乎并不需要传入参数，后期确定需求可优化
2.接收必填的组件输出函数onChange = (modeObj)=>{}输出modeObj格式同上;
3.可选参数输入showStatus ,showArea(默认true) , showStation(默认true), showModal(默认true),showWind(默认true),showFault; 均为bool
4.可选展示参数timerText: string; 默认'汇总方式'
*/

// TODO: 如果无特殊情况，可进行合并
// const defaultObj = {
//   area: 'stations',
//   station: 'stations',
//   modal: 'deviceTypes',
//   wind: 'stations',
// }

class TimeSelectReport extends React.Component {

  static propTypes = {
    modeText: PropTypes.string,
    modeStyle: PropTypes.string,
    showArea: PropTypes.bool,
    showStation: PropTypes.bool,
    showModal: PropTypes.bool,
    showWind: PropTypes.bool,
    showFault: PropTypes.bool,
    showStatus: PropTypes.bool,
    onChange: PropTypes.func,
    style: PropTypes.object,
    list: PropTypes.array,
    stations: PropTypes.array,
    deviceTypes: PropTypes.array,
  }

  static defaultProps = {
    modeText: '汇总方式',
    showArea: true,
    showStatus: true,
    showStation: true,
    showModal: true,
    showWind: true,
    showFault: true,
    modeStyle: 'wind',
    list: [],
    visiableModal: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      modeStyle: props.modeStyle,
      list: props.list,
      areaList: stationsByArea(props.stations)
      // optionList: props[defaultObj[props.modeStyle]]
    }
  }
  componentDidMount(){
    this.props.getRegionStationDevice()
    this.props.getStationDevicemode()
    this.props.getRegionStation()
    this.props.getRegion()
  }

  onModeChange = (e) => {//选择查询类型
    const modeStyle = e.target.value;
    const params = { modeStyle, list: [] };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }
  onSearch = () => {
    const params = { modeStyle: this.state.modeStyle, list: this.state.list };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }
  onModalHandelOK = (v) => {
    console.log(v)
    this.setState({
      visiableModal: false,
      list: v
    })
  }
  hideModal = () => {
    this.setState({ visiableModal: false })
  }

  showModal = () => {
    this.setState({ visiableModal: true });
  }
  maxTagPlaceholder = () => {
    let count = 0;
    if (this.state.modeStyle === 'status') {
      count = this.state.areaList.length
    } else if (this.state.modeStyle === 'station') {
      count = this.props.stations.length
    } else if (this.state.modeStyle === 'modal') {
      count = this.props.deviceTypes.length
    } else if (this.state.modeStyle === 'area') {
      count = this.state.areaList.length
    } else if (this.state.modeStyle === 'wind') {
      count = this.props.stations.length
    } else if (this.state.modeStyle === 'fault') {
      count = this.state.areaList.length
    }
    return <div>已选{this.state.list.length}/{count}<span onClick={this.clearList}><Icon type="close" /></span></div>
  }
  clearList = () => {
    this.setState({ list: [] });
  }
  handleChange = (v) => {
    this.setState({ list: v });
  }
  render() {
    const { modeText, showArea, showStation, showModal, showWind, style, stations, deviceTypes, showStatus, showFault,regionStationDeviceData,stationDevicemodeData,regionStationData,regionData } = this.props;
    console.log('regionStationDeviceData,stationDevicemodeData,regionStationData,regionData : ', regionStationDeviceData,stationDevicemodeData,regionStationData,regionData );
    // console.log('stations: ', stations);
    const { modeStyle, list, visiableModal, areaList } = this.state;
    console.log('areaList: ', areaList);
    const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    return (
      <div className={styles.timeSelect} style={style}>
        <div className={styles.textStyle}>{modeText}</div>
        <div className={styles.buttonStyle}>
          <Radio.Group buttonStyle="solid" onChange={this.onModeChange} value={modeStyle} >
            {showStatus && <Radio.Button value="status" >设备状态</Radio.Button>}
            {showModal && <Radio.Button value="area" >区域</Radio.Button>}
            {showStation && <Radio.Button value="station">电站</Radio.Button>}
            {showArea && <Radio.Button value="modal">型号</Radio.Button>}
            {showWind && <Radio.Button value="wind">风机</Radio.Button>}
            {showFault && <Radio.Button value="fault" >故障</Radio.Button>}
          </Radio.Group>
        </div>
        {
          modeStyle === 'status' && <Select
            mode="multiple"
            placeholder="选择设备状态"
            value={list}
            onChange={this.handleChange}
            style={{ width: '200px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
          >
            {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })}
          </Select>
        }
        {
          modeStyle === 'area' && <Select
            mode="multiple"
            placeholder="选择区域"
            value={list}
            onChange={this.handleChange}
            style={{ width: '200px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
          >
            {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })}
          </Select>
        }
        {
          modeStyle === 'station' && <div style={{ position: 'relative' }}>
            <Select
              mode="multiple"
              placeholder="选择电站"
              value={list}
              onChange={this.handleChange}
              style={{ width: '200px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
            >
              {stations && stations.map((e) => {
                return <Option key={e.stationCode}>{e.stationName}</Option>
              })}
            </Select>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={areaList}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
            />
          </div>
        }
        {
          modeStyle === 'modal' && <div style={{ position: 'relative' }}>
            <Select
              mode="multiple"
              placeholder="选择型号"
              value={list}
              onChange={this.handleChange}
              style={{ width: '200px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
            >
              {deviceTypes && deviceTypes.map((e) => {
                return <Option key={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              })}
            </Select>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={areaList}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
            />
          </div>
        }
        {
          modeStyle === 'wind' && <div style={{ position: 'relative' }}>
            <Select
              mode="multiple"
              placeholder="选择风机"
              value={list}
              onChange={this.handleChange}
              style={{ width: '200px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
            >
              {stations && stations.map((e) => {
                return <Option key={e.stationCode}>{e.stationName}</Option>
              })}
            </Select>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={areaList}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
            />
          </div>
        }
        {
          modeStyle === 'fault' && <Select
            mode="multiple"
            placeholder="选择故障"
            value={list}
            onChange={this.handleChange}
            style={{ width: '200px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
          >
            {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })}
          </Select>
        }
        <Button className={styles.btn} onClick={this.onSearch}>查询</Button>
        <Button onClick={this.onSearch}>导出</Button>
      </div >
    )
  }

}
const mapStateToProps = (state) => ({
  regionData: state.common.get('regionData').toJS(),
  regionStationData: state.common.get('regionStationData').toJS(),
  stationDevicemodeData: state.common.get('stationDevicemodeData').toJS(),
  regionStationDeviceData: state.common.get('regionStationDeviceData').toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  changeCommonStore: payload => dispatch({ type: commonAction.CHANGE_COMMON_STORE, payload }),
  getRegion: params => dispatch({ //获取用户权限的电站区域
    type: commonAction.getRegion,
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'regionData',
    }
  }),
  getRegionStation: params => dispatch({ // //获取用户权限的电站区域下的电站
    type: commonAction.getRegionStation,
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'regionStationData',
    }
  }),
  getStationDevicemode: params => dispatch({ //获取用户权限的电站区域下的电站下的对应型号
    type: commonAction.getStationDevicemode,
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'stationDevicemodeData',
    }
  }),
  getRegionStationDevice: params => dispatch({ //获取用户权限的电站区域下电站下的对应设备
    type: commonAction.getRegionStationDevice,
    payload: {
      params,
      actionName: commonAction.GET_COMMON_FETCH_SUCCESS,
      resultName: 'regionStationDeviceData',
    }
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelectReport) 

