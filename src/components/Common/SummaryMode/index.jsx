
import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Select, Icon } from 'antd';
import styles from './styles.scss';
import SelectModal from './Modal';
// import { stationsByArea } from '../../../utils/utilFunc';
// import { commonAction } from '../../../containers/alphaRedux/commonAction';

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
    modeStyle: 'wind',
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
    };
  }
  onModeChange = (e) => {//选择查询类型
    const modeStyle = e.target.value;
    const params = { modeStyle, list: [] };
    this.setState({ ...params });
    this.props.onChange({ ...params });
  }
  onModalHandelOK = (v) => {
    this.setState({
      visiableModal: false,
      list: v,
    });
    this.props.onChange({ modeStyle: this.state.modeStyle, list: v });
  }
  hideModal = () => {
    this.setState({ visiableModal: false });
  }

  showModal = () => {
    this.setState({ visiableModal: true });
  }
  datanum = (data, deviceDataType) => {//必传，三级总数据，用于计算型号和风机设备的总个数
    const deviceDataName = deviceDataType === 'mode' ? 'deviceModeData' : 'deviceData';
    let num = 0;
    data.forEach((e, i) => {
      e.stationData.forEach((item, index) => {
        num += item[deviceDataName].length;
      });
    });
    return num;
  }
  stationNum = (data = []) => {
    let stationNum = 0;
    data.forEach((e, i) => {
      stationNum += e.stationData.length;
    });
    return stationNum;
  }
  maxTagPlaceholder = () => {
    const { regionStationDevice = [], stationDevicemode = [], regionStation = [], region = [] } = this.props;
    const modeNum = this.datanum(stationDevicemode, 'mode');
    const deviceNum = this.datanum(regionStationDevice, 'device');
    // let stationNum = 0;
    // regionStation.forEach((e, i) => {
    //   stationNum += e.stationData.length;
    // });
    const stationNum = this.stationNum(regionStation);
    let count = 0;
    if (this.state.modeStyle === 'status') {
      count = modeNum;
    } else if (this.state.modeStyle === 'station') {
      count = stationNum;
    } else if (this.state.modeStyle === 'modal') {
      count = modeNum;
    } else if (this.state.modeStyle === 'area') {
      count = this.props.region.length;
    } else if (this.state.modeStyle === 'wind') {
      count = deviceNum;
    } else if (this.state.modeStyle === 'fault') {
      count = deviceNum;
    }
    return (<div>已选{this.state.list.length}/{count}
      <span onClick={this.clearList}><Icon type="close" /></span>
    </div>);
  }
  clearList = () => {
    this.setState({ list: [] });
    this.props.onChange({ modeStyle: this.state.modeStyle, list: [] });
  }
  handleChange = (v) => {
    const { region } = this.props;
    const regionName = region.map((e, i) => (e.regionName));
    const isAll = v && v.filter((e, i) => (e === 'all')).length;
    const checkedLength = v.length < region.length + 1;
    if (isAll) {
      if (checkedLength) {
        this.setState({ list: regionName });
        this.props.onChange({ modeStyle: this.state.modeStyle, list: regionName });
      } else {
        this.setState({ list: [] });
        this.props.onChange({ modeStyle: this.state.modeStyle, list: [] });
      }
    } else {
      this.setState({ list: v });
      this.props.onChange({ modeStyle: this.state.modeStyle, list: v });
    }

  }
  dataFormater = (data, deviceDataType) => {//必传，三级总数据，是要选择的最底层的code,name
    const test2 = [];
    let deviceDataName = deviceDataType === 'mode' ? 'deviceModeData' : 'deviceData',
      selectCode = deviceDataType === 'mode' ? 'deviceModeCode' : 'deviceCode',
      selectName = deviceDataType === 'mode' ? 'deviceModeName' : 'deviceName';
    data.forEach((e, i) => {
      const test3 = [];
      e.stationData.forEach((item, index) => {
        const test4 = [];
        item[deviceDataName].forEach((value, key) => {
          test4.push({
            ...value,
            key: `${value[selectCode]}_${item.stationCode}`,
            title: value[selectName],
          });
        });
        test3.push({
          ...item,
          key: item.stationCode,
          title: item.stationName,
          children: test4,
        });
      });
      test2.push({
        ...e,
        key: e.regionName,
        title: e.regionName,
        children: test3,
      });
    });
    return test2;
  }
  render() {
    const { modeText, showArea, showStation, showModal, showWind, style, stations, deviceTypes, showStatus, showFault, regionStationDevice, stationDevicemode, regionStation, region } = this.props;
    const { modeStyle, list, visiableModal, areaList } = this.state;
    const modeData = this.dataFormater(stationDevicemode, 'mode');
    const windDeviceData = this.dataFormater(regionStationDevice, 'device');
    const modeNum = this.datanum(stationDevicemode, 'mode');
    const deviceNum = this.datanum(regionStationDevice, 'device');
    const stationNum = this.stationNum(regionStation);
    const stationData = [];
    regionStation.forEach((e, i) => {
      const stationChild = [];
      e.stationData.forEach((item, index) => {
        stationChild.push({
          ...item,
          key: item.stationCode,
          title: item.stationName,
        });
      });
      stationData.push({
        ...e,
        key: e.regionName,
        title: e.regionName,
        children: stationChild,
      });
    });
    const stationArr = regionStation.map((e, i) => e.stationData);
    const stationList = stationArr.length && stationArr.reduce((p, c) => (p.concat(c)));
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
          modeStyle === 'status' && <div style={{ position: 'relative' }}>
            <span onClick={this.showModal}>
              <Select
                mode="multiple"
                placeholder="选择设备状态"
                value={list}
                onChange={this.handleChange}
                style={{ width: '164px' }}
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
            </span>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={modeData}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
              dataNum={modeNum}
            />
          </div>
        }
        {
          modeStyle === 'area' && <Select
            mode="multiple"
            placeholder="选择区域"
            value={list}
            onChange={this.handleChange}
            style={{ width: '164px' }}
            maxTagCount={0}
            maxTagPlaceholder={this.maxTagPlaceholder}
            filterOption={filterOption}
          >
            {/* 
            {areaList && areaList.map((e) => {
              return <Option key={e.key}>{e.title}</Option>
            })} 
          */}
            <Option key={'all'}>全部区域</Option>
            {
              region && region.map((e, i) => {
                return <Option key={e.regionName}>{e.regionName}</Option>;
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
              style={{ width: '164px' }}
              maxTagCount={0}
              maxTagPlaceholder={this.maxTagPlaceholder}
              filterOption={filterOption}
            >
              {stationList && stationList.map((e) => {
                return <Option key={e.stationCode}>{e.stationName}</Option>;
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
              dataNum={stationNum}
            />
          </div>
        }
        {
          modeStyle === 'modal' && <div style={{ position: 'relative' }} >

            <span onClick={this.showModal}>
              <Select
                mode="multiple"
                placeholder="选择型号"
                value={list}
                onChange={this.handleChange}
                style={{ width: '164px' }}
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
            </span>

            <SelectModal
              {...this.props}
              list={list}
              sourceData={modeData}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
              dataNum={modeNum}
            />
          </div>
        }
        {
          modeStyle === 'wind' && <div style={{ position: 'relative' }}>
            <span onClick={this.showModal}>
              <Select
                mode="multiple"
                placeholder="选择风机"
                value={list}
                onChange={this.handleChange}
                style={{ width: '164px' }}
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
            </span>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={windDeviceData}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
              dataNum={deviceNum}
            />
          </div>
        }
        {
          modeStyle === 'fault' && <div style={{ position: 'relative' }}>
            <span onClick={this.showModal}>
              <Select
                mode="multiple"
                placeholder="选择故障"
                value={list}
                onChange={this.handleChange}
                style={{ width: '164px' }}
                maxTagCount={0}
                maxTagPlaceholder={this.maxTagPlaceholder}
                filterOption={filterOption}
                open={false}
              >
                {areaList && areaList.map((e) => {
                  return <Option key={e.key}>{e.title}</Option>;
                })}
              </Select>
            </span>
            <SelectModal
              {...this.props}
              list={list}
              sourceData={windDeviceData}
              handleOK={this.onModalHandelOK}
              visiable={visiableModal}
              hideModal={this.hideModal}
              showModal={this.showModal}
              dataNum={deviceNum}
            />
          </div>
        }
      </div >
    );
  }

}


export default (TimeSelectReport);

