import React from "react";
import PropTypes from "prop-types";
import { Select } from 'antd';
import CommonPagination from "../../../Common/CommonPagination/index";
import StationSelect from "../../../Common/StationSelect/index";
import DeviceAccountTable from "./DeviceAccountTable/DeviceAccountTable";

import styles from "./deviceAccountBox.scss";

const { Option } = Select;

export default class DeviceAccountBox extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    stations: PropTypes.array,
    regionList: PropTypes.array,
    stationsManufactorsList: PropTypes.array,
    deviceModeList: PropTypes.array,
    getRegion: PropTypes.func,
    getStationsManufactorsList: PropTypes.func,
    getDeviceModeList: PropTypes.func,
    getDeviceAccountList: PropTypes.func,
    deviceAccountList: PropTypes.object,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    regionName: PropTypes.string,
    stationCodes: PropTypes.array,
    manufactorId: PropTypes.string,
    modeId: PropTypes.string,
    orderField: PropTypes.string,
    orderMethod: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      regionOption: "", // 电站区域
      stationCodesOption: "", // 电站
      manufactorsOption: "", // 厂家
      modeOption: "", // 设备型号
    };
  }

  componentDidMount() {
    const { getRegion, getDeviceAccountList } = this.props;
    const params = {
      regionName: "",
      stationCodes: [],
      manufactorId: "",
      modeId: "",
      deviceTypeCode: "",
      assetIds: [],
      orderField: "",
      orderMethod: "",
      pageNum: 1,
      pageSize: 10
    };
    // 接口
    getRegion();
    getDeviceAccountList(params);
  }

  // 分页
  onPaginationChange = ({ currentPage, pageSize }) => {
    const {
      getDeviceAccountList,
      regionName,
      stationCodes,
      manufactorId,
      modeId,
      orderField,
      orderMethod
    } = this.props;
    const params = {
      regionName,
      stationCodes,
      manufactorId,
      modeId,
      deviceTypeCode: "",
      assetIds: [],
      orderField,
      orderMethod,
      pageNum: currentPage,
      pageSize: pageSize
    };
    // 接口
    getDeviceAccountList(params);
  };

  // 区域
  handleRegionChange = (value) => {
    const { getDeviceAccountList } = this.props;
    const params = {
      regionName: value,
      stationCodes: [],
      manufactorId: "",
      modeId: "",
      deviceTypeCode: "",
      assetIds: [],
      orderField: "",
      orderMethod: "",
      pageNum: 1,
      pageSize: 10
    };
    this.setState({
      regionOption: value,
      stationCodesOption: "", // 电站
      manufactorsOption: "", // 厂家
      modeOption: "", // 设备型号
    }, () => {
      // 接口
      getDeviceAccountList(params);
    });
  };

  // 选择电站
  selectStation = (value) => {
    const {
      getStationsManufactorsList,
      getDeviceAccountList,
      regionName
    } = this.props;
    // 厂家列表
    const paramsManufactors = {
      stationCodes: [`${value[0].stationCode}`]
    };
    // table列表
    const paramsList = {
      regionName,
      stationCodes: [`${value[0].stationCode}`],
      manufactorId: "",
      modeId: "",
      deviceTypeCode: "",
      assetIds: [],
      orderField: "",
      orderMethod: "",
      pageNum: 1,
      pageSize: 10
    };
    this.setState({
      stationCodesOption: `${value[0].stationCode}`,
      manufactorsOption: "", // 厂家
      modeOption: "", // 设备型号
    }, () => {
      // 接口
      getDeviceAccountList(paramsList);
      getStationsManufactorsList(paramsManufactors);
    });
  };

  // 厂家
  handleManufactorsChange = (value) => {
    const {
      getDeviceModeList,
      getDeviceAccountList,
      regionName,
      stationCodes
    } = this.props;
    // 设备型号列表
    const paramsMode = {
      manufactorId: value,
      modeOption: "", // 设备型号
    };
    // table列表
    const paramsList = {
      regionName,
      stationCodes,
      manufactorId: value,
      modeId: "",
      deviceTypeCode: "",
      assetIds: [],
      orderField: "",
      orderMethod: "",
      pageNum: 1,
      pageSize: 10
    };
    this.setState({
      manufactorsOption: value
    }, () => {
      // 接口
      getDeviceAccountList(paramsList);
      getDeviceModeList(paramsMode);
    });
  };

  // 设备型号
  handleDeviceModeChange = (value) => {
    const {
      getDeviceAccountList,
      regionName,
      stationCodes,
      manufactorId
    } = this.props;
    // table列表
    const params = {
      regionName,
      stationCodes,
      manufactorId,
      modeId: value,
      deviceTypeCode: "",
      assetIds: [],
      orderField: "",
      orderMethod: "",
      pageNum: 1,
      pageSize: 10
    };
    this.setState({
      modeOption: value, // 设备型号
    }, () => {
      getDeviceAccountList(params);
    });
  };

  // 筛选区域下的电站
  regionStationFilter = () => {
    const { regionOption } = this.state;
    const { stations } = this.props;
    let arr = [];
    // 选了区域在筛选
    if (regionOption) {
      // 在区域下的电站
      arr = stations.filter(cur =>
        cur.regionName === regionOption && cur.stationType === 0
      )
    }
    return arr;
  };

  render() {
    const {
      stations,
      regionList,
      stationsManufactorsList,
      deviceModeList,
      deviceAccountList: {
        pageCount
      },
      pageSize,
      pageNum
    } = this.props;
    const { regionOption, stationCodesOption, manufactorsOption, modeOption } = this.state;
    // 区域
    const regionItem = regionList && regionList.map(cur => {
      return <Option key={cur.regionName} value={cur.regionName}>{cur.regionName}</Option>;
    });
    // 厂家
    const manufactorsItem = stationsManufactorsList && stationsManufactorsList.map(cur => {
      return <Option key={cur.manufactorId} value={cur.manufactorId}>{cur.manufactorName}</Option>;
    });
    // 是否有数据
    const deviceList = deviceModeList && deviceModeList[0] && deviceModeList[0].modeDatas && deviceModeList[0].modeDatas;
    // 设备型号
    const deviceModeItem = deviceList.map(cur => {
      return <Option key={cur.modeId} value={cur.modeId}>{cur.modeName}</Option>;
    });
    return (
      <div className={styles.deviceAccountBox}>
        <div className={styles.deviceAccountSearch}>
          <span>筛选条件</span>
          <Select
            placeholder="请选择区域"
            style={{ width: 140, paddingTop: "3px", margin: "0 10px" }}
            onChange={this.handleRegionChange}
          >
            {regionItem}
          </Select>
          <StationSelect
            disabled={regionOption === ""}
            data={this.regionStationFilter()}
            style={{ width: '200px' }}
            holderText="请输入电站名称"
            value={stations.filter(e => e.stationCode === Number(stationCodesOption))}
            onOK={this.selectStation}
            disabledStation={stations.filter(e => e.isConnected === 0).map(e => e.stationCode)}
          />
          <Select
            value={manufactorsOption === "" ? undefined : manufactorsOption}
            disabled={stationCodesOption === ""}
            placeholder="请选择厂家"
            style={{ width: 180, paddingTop: "3px", marginLeft:"10px" }}
            onChange={this.handleManufactorsChange}
          >
            {manufactorsItem}
          </Select>
          <Select
            value={modeOption === "" ? undefined : modeOption}
            disabled={manufactorsOption === ""}
            placeholder="请选择设备型号"
            style={{ width: 180, paddingTop: "3px", marginLeft:"10px" }}
            onChange={this.handleDeviceModeChange}
          >
            {deviceModeItem}
          </Select>
        </div>
        <div className={styles.deviceAccountPage}>
          <CommonPagination pageSize={pageSize} currentPage={pageNum} total={pageCount} onPaginationChange={this.onPaginationChange} />
        </div>
        <DeviceAccountTable {...this.props} />
      </div>
    )
  }
}
