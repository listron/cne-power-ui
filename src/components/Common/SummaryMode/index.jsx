
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
    regionStationDevice: PropTypes.array,
    stationDevicemode: PropTypes.array,
    regionStation: PropTypes.array,
    region: PropTypes.array,

  }

  static defaultProps = {
    modeText: '汇总方式',
    showArea: true,
    showStatus: true,
    showStation: true,
    showModal: true,
    showWind: true,
    showFault: true,
    modeStyle: 'area',
    list: [],
    visiableModal: false,
   
  }

  constructor(props) {
    super(props);
    this.state = {
      modeStyle: props.modeStyle,
      list: props.list,
      // areaList: stationsByArea(props.stations),
      // optionList: props[defaultObj[props.modeStyle]]
      regionStationDevice: props.regionStationDevice,
      stationDevicemode: props.stationDevicemode,
      regionStation: props.regionStation,
      region: props.region,
    }
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
    console.log(v);
    this.setState({
      visiableModal: false,
      list: v
    })
    this.props.onChange({ modeStyle: this.state.modeStyle, list: v });

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
      count = 10000;
    } else if (this.state.modeStyle === 'station') {
      count = 10000;
    } else if (this.state.modeStyle === 'modal') {
      count = 10000;
    } else if (this.state.modeStyle === 'area') {
      count = this.props.region.length
    } else if (this.state.modeStyle === 'wind') {
      count = 10000;
    } else if (this.state.modeStyle === 'fault') {
      count = this.state.areaList.length
    }
    return <div>已选{this.state.list.length}/{count}<span onClick={this.clearList}><Icon type="close" /></span></div>
  }
  clearList = () => {
    this.setState({ list: [] });
  }
  handleChange = (v) => {
    console.log('v: ', v);
    this.setState({ list: v });
    this.props.onChange({ modeStyle: this.state.modeStyle, list: v })
  }
  dataFormater = (data=[], deviceDataType) => {//必传，三级总数据，是要选择的最底层的code,name
    let test2 = [];
    let deviceDataName = deviceDataType === 'mode' ? 'deviceModeData' : 'deviceData',
      selectCode = deviceDataType === 'mode' ? 'deviceModeCode' : 'deviceCode',
      selectName = deviceDataType === 'mode' ? 'deviceModeName' : 'deviceName';
    data.forEach((e, i) => {
      let test3 = [];
      e.stationData.forEach((item, index) => {
        let test4 = [];
        item[deviceDataName].forEach((value, key) => {
          test4.push({
            ...value,
            key: value[selectCode],
            title: value[selectName],
          })
        })
        test3.push({
          ...item,
          key: item.stationCode,
          title: item.stationName,
          children: test4,
        })
      })
      test2.push({
        ...e,
        key: e.regionName,
        title: e.regionName,
        children: test3
      })
    })
    return test2
  }
  render() {
    const { modeText, showArea, showStation, showModal, showWind, style, stations, deviceTypes, showStatus, showFault, regionStationDevice=[], stationDevicemode=[], regionStation=[], region=[], } = this.props;
    const { modeStyle, list, visiableModal, areaList, } = this.state;
    let modeData = this.dataFormater(stationDevicemode, 'mode');
    let windDeviceData = this.dataFormater(regionStationDevice, 'device');
    let stationData = [];
    regionStation.forEach((e, i) => {
      let stationChild = [];
      e.stationData.forEach((item, index) => {
        stationChild.push({
          ...item,
          key: item.stationCode,
          title: item.stationName,
        })
      })
      stationData.push({
        ...e,
        key: e.regionName,
        title: e.regionName,
        children: stationChild
      })
    })
    let stationArr = regionStation.map((e, i) => e.stationData);
    let stationList = stationArr.length && stationArr.reduce((p, c) => (p.concat(c)));



    // console.log('areaList: ', areaList);
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
          modeStyle === 'status' &&  <div style={{ position: 'relative' }}>
          <Select
            mode="multiple"
            placeholder="选择设备状态"
            value={list}
            onChange={this.handleChange}
            style={{ width: '160px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
            open={false}
          >
           {/*
           {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })}
          */}
          </Select>
          <SelectModal
            {...this.props}
            list={list}
            sourceData={modeData}
            handleOK={this.onModalHandelOK}
            visiable={visiableModal}
            hideModal={this.hideModal}
            showModal={this.showModal}
            />
          </div>
        }
        {
          modeStyle === 'area' && <Select
            mode="multiple"
            placeholder="选择区域"
            value={list}
            onChange={this.handleChange}
            style={{ width: '160px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
          >
            {/* 
            {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })} 
          */}
            {
              region && region.map((e, i) => {
                return <Option key={e}>{e}</Option>
              })
            }
          </Select>
        }
        {
          modeStyle === 'station' && <div style={{ position: 'relative' }}>
            <Select
              mode="multiple"
              placeholder="选择电站"
              value={list}
              onChange={this.handleChange}
              style={{ width: '160px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
            >
              {stationList && stationList.map((e) => {
                return <Option key={e.stationCode}>{e.stationName}</Option>
              })}
            </Select>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={stationData}
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
              style={{ width: '160px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
              open={false}

            >
              {/*
              {deviceTypes && deviceTypes.map((e) => {
                return <Option key={e.deviceTypeCode}>{e.deviceTypeName}</Option>
              })}
                */}
            </Select>

            <SelectModal
              {...this.props}
              list={list}
              sourceData={modeData}
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
              style={{ width: '160px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
              open={false}
            >
              {/*
              {stations && stations.map((e) => {
                return <Option key={e.stationCode}>{e.stationName}</Option>
              })}
               */}
            </Select>



            <SelectModal
              {...this.props}
              list={list}
              sourceData={windDeviceData}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
            />
          </div>
        }
        {
          modeStyle === 'fault' && <div style={{ position: 'relative' }}>
          <Select
            mode="multiple"
            placeholder="选择故障"
            value={list}
            onChange={this.handleChange}
            style={{ width: '200px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
            open={false}
          >
            {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })}
          </Select>
          <SelectModal
          {...this.props}
          list={list}
          sourceData={windDeviceData}
          handleOK={this.onModalHandelOK}
          visiable={visiableModal}
          hideModal={this.hideModal}
          showModal={this.showModal}
        />
        </div>
        }
        {/*  
        <Button className={styles.btn} onClick={this.onSearch}>查询</Button>
        <Button onClick={this.onSearch}>导出</Button>
       */}
      </div >
    )
  }

}


export default (TimeSelectReport)

