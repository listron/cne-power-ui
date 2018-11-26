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

const Option = Select.Option;
class PowerCurve extends Component {
  static propTypes = {
    changePlanStore: PropTypes.func,
    getPowerList: PropTypes.func,
    getDeviceModel: PropTypes.func,
    changePowerCurveStore: PropTypes.func,
    getPowercurveDetail: PropTypes.func,
    downloadCurveExcel: PropTypes.func,
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
      selectStation: [],
      selectedRowKeys: [],
      visible: false,
      air: '',
      downloadData: [],
      fileList: [],
      uploading:false,
    }
  }

  componentWillMount(){// 初始加载列表
    const {getPowerList,sortField,sortMethod,pageNum,pageSize,stationCode,deviceModeCode}=this.props
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

  onPowerUpload = ({file, fileList}) => { // 导入功率曲线
    this.setState({
      uploading: true,
      fileList,
    })
    if (file.status !== 'uploading') {
      // console.log(file, fileList);
      this.setState({
        uploading: false,
      })
    }
    if (file.status === 'done' && file.response && file.response.code === '10000') {
      message.success(`${file.name} 文件上传成功`);
      this.setState({fileList: []});
      const { stationCode, deviceModeCode, sortField, sortMethod, pageNum, pageSize}=this.props
      const param = { stationCode, deviceModeCode, sortField, sortMethod, pageNum, pageSize }
      this.getPowerList(param); //上传成功后，重新请求列表数据
    }else if(file.status === 'done' && (!file.response || file.response.code !== '10000')){
      message.error(`${file.name} 文件上传失败: ${file.response.message},请重试!`);
    }else if (file.status === 'error') {
      message.error(`${file.name} 文件上传失败,请重试!`);
    }
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


  stationSelected = (rest) => { // 电站选择之后
    const { sortField, sortMethod, pageNum, pageSize } = this.props
    this.props.changePowerCurveStore({ stationCode: rest[0].stationCode })
    this.props.getDeviceModel({
      stationCode: rest[0].stationCode,
      deviceTypeCode: '101',
    });
    const param = { stationCode: rest[0].stationCode, deviceModeCode: "", sortField, sortMethod, pageNum, pageSize, }
    this.getPowerList(param)
    this.setState({
      selectStation: rest[0],
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
    downloadData.length === 0 && message.info('请选择需要导出的数据');
    let stationCode = [], deviceModeCode = [], airDensityType = [];
    downloadData.length > 0 && downloadData.forEach((item) => {
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

  beforeUploadStation = (file) => { // 上传前的校验
    const validType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // 暂时不兼容xls : 'application/vnd.ms-excel'
    const validFile = validType.includes(file.type);
    if (!validFile) {
      message.error('只支持上传excel文件!');
    }
    return !!validFile
  }


  


  render() {
    const { stations, deviceModels, powerList, pageSize, pageNum, totalNum, powercurveDetail, loading } = this.props;
    const { selectStation, selectedRowKeys, visible, air, selectModle,fileList,uploading } = this.state;
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
    const authData = Cookie.get('authData') || null;
    return (
      <div className={styles.PowerCurve}>
        <div className={styles.contentMain} >
          <div className={styles.selectSearth}>
            <span>条件查询</span>
            <StationSelect
              data={stations.length > 0 && stations.filter(e => e.stationType === 0) || []}
              holderText={"电站名称"}
              value={[selectStation]}
              onChange={this.stationSelected}
              className={styles.stationSelect}
            />
            <Select
              style={{ width: 198 }}
              onChange={this.deviceTypeCodeChange}
              disabled={deviceModels.length > 0 ? false : true} placeholder={'风机型号'}
              className={styles.deviceModeName}
              value={selectModle}
            >
              <Option key={null} value={null}>{'全部风机型号'}</Option>
              {deviceModels.length > 0 && deviceModels.map(e => {
                return <Option value={e.deviceModeName} key={e.deviceModeName}>{e.deviceModeName}</Option>
              })}
            </Select>

          </div>
          <div className={styles.Button}>
            <Button href={downloadHref} download={downloadHref} target="_blank" className={styles.download} > 下载导入模版</Button>
            <Upload
              action={`${path.basePaths.APIBasePath}${path.APISubPaths.system.importPowercurve}`}
              className={styles.uploadStation}
              onChange={this.onPowerUpload}
              headers={{ 'Authorization': 'bearer ' + JSON.parse(authData) }}
              beforeUpload={this.beforeUploadStation}
              data={(file) => ({ file })}
              showUploadList={false}
              fileList={fileList}
            >
              <Button type="default" loading={uploading}> 导入</Button>
            </Upload>

            <Button type="default" onClick={this.downloadPowerExcel} className={styles.export} > 导出</Button>
          </div>
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
