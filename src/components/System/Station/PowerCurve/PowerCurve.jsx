import React, { Component } from 'react';
import { Select, Table, Button, Upload, message } from 'antd';
import PropTypes from 'prop-types';
import styles from './powerCurve.scss'
import StationSelect from '../../../Common/StationSelect';
import CommonPagination from '../../../Common/CommonPagination';
import TransitionContainer from '../../../Common/TransitionContainer';
import PowerCurveChart from './PowerCurveChart';
import path from '../../../../constants/path';
import Cookie from 'js-cookie';
import { handleRight } from '@utils/utilFunc';

import SingleStationImportFileModel from '../../../Common/SingleStationImportFileModel';

const Option = Select.Option;
class PowerCurve extends Component {
  static propTypes = {
    changePlanStore: PropTypes.func,
    getPowerList: PropTypes.func,
    getDeviceModel: PropTypes.func,
    changePowerCurveStore: PropTypes.func,
    getPowercurveDetail: PropTypes.func,
    downloadCurveExcel: PropTypes.func,
    downloadStandardCurveExcel: PropTypes.func,
    importCurveExcel: PropTypes.func,
    planData: PropTypes.array,
    sortField: PropTypes.string,
    sortMethod: PropTypes.string,
    deviceModeCode: PropTypes.any,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalNum: PropTypes.number,
    powerList: PropTypes.array,
    deviceModels: PropTypes.array,
    stations: PropTypes.array,
    powercurveDetail: PropTypes.array,
    stationCode: PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectStation: [],// 选择的电站
      selectedRowKeys: [], // 导出选择的列数
      visible: false,// 功率曲线图表是否显示
      air: '', // 空气密度类型
      downloadData: [], // 导出的信息
      fileList: [],
      uploading: false, // 下载
    }
  }

  componentWillMount() {// 初始加载列表
    const { getPowerList, sortField, sortMethod, pageNum, pageSize, stationCode, deviceModeCode } = this.props
    getPowerList({
      stationCode,
      deviceModeCode,
      sortField,
      sortMethod,
      pageNum,
      pageSize,
    })
  }


  onSelectChange = (keys, record) => {
    this.setState({
      selectedRowKeys: keys,
      downloadData: record,
    });
  }

  onPaginationChange = ({ currentPage, pageSize }) => {//分页器
    const { stationCode, deviceModeCode, sortField, sortMethod } = this.props;
    const param = { stationCode, deviceModeCode, sortField, sortMethod, pageNum: currentPage, pageSize, }
    this.getPowerList(param);
    this.props.changePowerCurveStore({ pageNum: currentPage, pageSize })
  };

  onShowDetail = (record) => { //展示功率曲线图
    this.setState({
      visible: true,
      air: record.airDensityType
    })
    const air = ['现场空气密度', '标准空气密度'];
    this.props.getPowercurveDetail({
      stationCode: record.stationCode,
      deviceModeCode: record.deviceModeCode,
      airDensityType: air.findIndex((e) => e === record.airDensityType) + 1,
    })
  }

  getPowerList = (param) => { // 请求数据
    const { sortField, sortMethod, pageNum, pageSize, stationCode, deviceModeCode } = param;
    this.props.getPowerList({
      stationCode,
      deviceModeCode,
      sortField,
      sortMethod,
      pageNum,
      pageSize,
    })
  }

  getUpdatePointList=(rest)=>{
    const {file,selectedStation,WarningTipStatus}=rest;
    if(WarningTipStatus){
      const formData=new FormData();
      formData.append('file',file.originFileObj);
      formData.append('onImport',WarningTipStatus==='ok'?1:0);
      formData.append('stationCode',selectedStation.stationCode);
      this.props.importCurveExcel({formData})
    }else{
      const { stationCode, deviceModeCode, sortField, sortMethod,pageNum,pageSize } = this.props;
      const param = { stationCode, deviceModeCode, sortField, sortMethod, pageNum, pageSize, }
      this.getPowerList(param);
    }
  }


  stationSelected = (rest) => { // 电站选择之后
    const { sortField, sortMethod, pageNum, pageSize } = this.props;
    const selectStaion = rest.length > 0 ? rest[0].stationCode : ''
    this.props.changePowerCurveStore({ stationCode: selectStaion })
    this.props.getDeviceModel({
      stationCode: selectStaion,
      deviceTypeCode: '101',
    });
    const param = { stationCode: selectStaion, deviceModeCode: "", sortField, sortMethod, pageNum, pageSize, }
    this.getPowerList(param)
    this.setState({
      selectStation: rest,
      selectModle: null,
    })
  }


  deviceTypeCodeChange = (value) => {  // 风机型号的选择
    const { sortField, sortMethod, pageNum, pageSize, stationCode, deviceModels } = this.props;
    const selectDevice = deviceModels.filter(e => e.deviceModeName === value);
    const param = { stationCode, deviceModeCode: value ? selectDevice[0].deviceModeCode : '', sortField, sortMethod, pageNum, pageSize, }
    this.props.changePowerCurveStore({ deviceModeCode: value ? selectDevice[0].deviceModeCode : '' })
    this.getPowerList(param);
    this.setState({
      selectModle: value,
    })
  }

  handelClose = (e) => { // 关闭按钮
    this.setState({ visible: e })
  }


  tableChange = (pagination, filter, sorter) => {// 点击表头 排序
    const sortField = this.sortField(sorter.field);
    let ascend = "";
    sorter.field === 'airDensityType' ? ascend = sorter.order === 'ascend' ? 'DESC' : 'ASC' || '' : ascend = sorter.order === 'ascend' ? 'ASC' : 'DESC' || ''; //空气密度类型 需要反着来 现场和标准的原因 
    const { stationCode, deviceModeCode, pageNum, pageSize } = this.props;
    const param = { stationCode, deviceModeCode, sortField, sortMethod: ascend, pageNum, pageSize, }
    this.getPowerList(param);
    this.props.changePowerCurveStore({ sortField, sortMethod: ascend })
  };

  sortField(sortField) {
    let result = "";
    switch (sortField) {
      case 'deviceModeName': return result = 'device_mode_name'; break;
      case 'airDensityType': return result = 'air_density_type'; break;
      case 'airDensity': return result = 'air_density'; break;
      case 'stationName': return result = 'station_name'; break;
    }
    return result
  }

  downloadPowerExcel = () => {
    const { downloadData } = this.state;
    let stationCode = [], deviceModeCode = [], airDensityType = [];
    downloadData.length === 0 && message.info('请选择需要导出的数据');
    if (downloadData.length > 0) {
      downloadData.forEach((item) => {
        stationCode.push(item.stationCode);
        deviceModeCode.push(item.deviceModeCode);
        airDensityType.push(item.airDensityType === '现场空气密度' ? 1 : 2);
      })
      this.props.downloadCurveExcel({ stationCode, deviceModeCode, airDensityType })
      this.setState({
        selectedRowKeys: [],
        downloadData: [],
      })
    }
  }

  linkClick = () => { // 点击下载模版
    this.props.downloadStandardCurveExcel()
  }


  render() {
    const { stations, deviceModels, powerList, pageSize, pageNum, totalNum, powercurveDetail, loading } = this.props;
    const { selectStation, selectedRowKeys, visible, air, selectModle } = this.state;
    const powerCurveOperation = handleRight('station_powercurve_operate');
    const dataSource = powerList.map((item, index) => ({ ...item, key: index, airDensityType: item.airDensityType === 1 ? '现场空气密度' : '标准空气密度' }));
    const columns = [
      {
        title: '风机型号',
        dataIndex: 'deviceModeName',
        key: 'deviceModeName',
        sorter: true,
      },
      {
        title: '空气密度类型',
        dataIndex: 'airDensityType',
        key: 'airDensityType',
        sorter: true,
      },
      {
        title: '空气密度',
        dataIndex: 'airDensity',
        key: 'airDensity',
        sorter: true,
      },
      {
        title: '电站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        sorter: true,
      },
      {
        title: '查看',
        className: styles.look,
        render: (text, record) => (
          <span>
            <i className="iconfont icon-look" onClick={() => { this.onShowDetail(record) }} />
          </span>
        )
      }
    ]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const downloadHref = `${path.basePaths.originUri}/template/PowerCurve.xlsx`;
    return (
      <div className={styles.PowerCurve}>

        <div className={styles.contentMain} >
          <div className={styles.selectSearth}>
            <span>条件查询</span>
            <StationSelect
              data={stations.length > 0 && stations.filter(e => e.stationType === 0) || []}
              holderText={"电站名称"}
              value={selectStation}
              onChange={this.stationSelected}
              className={styles.stationSelect}
            />
            <Select
              style={{ width: 198 }}
              onChange={this.deviceTypeCodeChange}
              disabled={selectStation.length > 0 ? false : true} placeholder={'风机型号'}
              className={styles.deviceModeName}
              value={selectModle}
            >
              <Option key={null} value={null}>{'全部风机型号'}</Option>
              {deviceModels.length > 0 && deviceModels.map(e => {
                return <Option value={e.deviceModeName} key={e.deviceModeName}>{e.deviceModeName}</Option>
              })}
            </Select>

          </div>
          {powerCurveOperation ?
          <div className={styles.Button}>
            <Button href={downloadHref}  target="_blank" className={styles.download} > 下载导入模板</Button>
            <SingleStationImportFileModel
              data={stations.length > 0 && stations.filter(e => e.stationType === 0) || []}
              uploadPath={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importPowercurve}`}
              uploaderName={'功率曲线'}
              uploadExtraData={['stationCode']}
              upLoadOutExtraData={{'onImport':null}}
              loadedCallback={this.getUpdatePointList}
              hasExistedJudge={true}
            />
            <Button type="default" onClick={this.downloadPowerExcel} className={styles.export} > 导出</Button>
          </div> : <div></div>}
          <div className={styles.PowerCurveTable}>
            <div className={styles.pagination}>
              <CommonPagination pageSize={pageSize} currentPage={pageNum} total={totalNum}
                onPaginationChange={this.onPaginationChange} />
            </div>
            <Table
              loading={loading}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              rowSelection={rowSelection}
              onChange={this.tableChange}
              locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
            />
          </div>
        </div>
        <TransitionContainer
          show={visible}
          timeout={500}
          effect="side"
        >
          <PowerCurveChart PowerCurveChart={powercurveDetail.length > 0 && powercurveDetail[0] || []} handelClose={this.handelClose} air={air} />
        </TransitionContainer>
      </div>
    )
  }
}

export default PowerCurve;
