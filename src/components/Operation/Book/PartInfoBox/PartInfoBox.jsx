import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import DetailPartsInfo from "./DetailPartsInfo";
import CopyParts from "./CopyParts";
import { Button, Table, Tree, Upload, message } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import path from '../../../../constants/path';
import Cookie from 'js-cookie';
const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

class PartInfoBox extends React.Component {
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    downLoadFile: PropTypes.func,
    allStationBaseInfo: PropTypes.array,
    deviceComList: PropTypes.array,
    stationCode: PropTypes.string,
    detailPartsRecord: PropTypes.object,

  }
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectStation: [],
      showDetailParts: false,
      detailPartsInfo: {},
      showCopyParts: false,
    }
  }
  selectStation = (stations) => {
    const { getDeviceTypeList, changePartInfoStore } = this.props;
    let stationCode = stations.length > 0 && stations[0].stationCode;
    getDeviceTypeList({
      stationCode,
    })
    changePartInfoStore({
      stationCode,
    })
    this.setState({
      selectStation: stations
    })

  }
  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('You can only upload Excel file!');
    }
    return isExcel;
  }
  exportparts = () => {
    const { downLoadFile, stationCode } = this.props;
    const url = `${APIBasePath}${operation.exportParts}`;
    downLoadFile({
      url,
      fileName: `导出电站组件.xlsx`,
      params: {
        stationCode
      },
    })
  }
  addPartsInfo = () => {
    this.props.changePartInfoStore({ showPage: 'add' })
  }
  editParts = (record) => {
    this.props.changePartInfoStore({ showPage: 'edit', detailPartsRecord: record })
  }
  showDetailParts = (record) => {
    this.setState({
      showDetailParts: true,
      detailPartsInfo: record
    })

  }
  cancleDetailModal = () => {
    this.setState({
      showDetailParts: false
    })
  }

  copyComponent = () => {
    this.setState({
      showCopyParts: true
    })
  }
  closeComParts=()=>{
    this.setState({
      showCopyParts: false
    })
  }
  render() {
    const { allStationBaseInfo, deviceComList, stationCode, } = this.props;

    let { selectStation, showDetailParts, detailPartsInfo,showCopyParts } = this.state;
    let stationName = selectStation.length > 0 && selectStation[0].stationName;

    const testData = [{
      stationName: '电站名称',
      deviceName: '上级设备',
      partsName: '部件名称',
      assetsName: '资产结构',
      assetsId: '资产配置',
      manufactorCode: '厂家号',
      manufactorName: '厂家',
      modeId: '组件型号',
      partsModeName: '部件型号',
      madeName: '制造商',
      supplierName: '供货商',
      batchNumber: '批次号',
    }]

    const columns = [
      {
        title: '部件名称',
        dataIndex: 'partsName',
        render: (text, record, index) => <span className={styles.comName} title={text} onClick={() => this.showDetailParts(record)} >{text}</span>
      }, {
        title: '部件型号',
        dataIndex: 'partsModeName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '资产结构',
        dataIndex: 'assetsName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '厂家',
        dataIndex: 'manufactorName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '制造商',
        dataIndex: 'madeName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '供货商',
        dataIndex: 'supplierName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '操作',
        render: (text, record, index) => {
          return (<div>
            <span title="编辑" className="iconfont icon-edit" onClick={() => this.editParts(record)}></span>
            <span title="删除" className="iconfont icon-del" onClick={() => this.deleteParts(record)}></span>
          </div>)
        }
      },
    ];
    // const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.operation.exportParts}?stationCode=${stationCode}`;
    const downloadTemplet = `${path.basePaths.originUri}${path.APISubPaths.system.downloadDeviceTemplet}`;
    // const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.importUserBatch;
    const url = `${APIBasePath}${operation.importParts}`;
    const authData = Cookie.get('authData') || null;
    const uploadProps = {
      showUploadList: false,
      name: 'file',
      action: url,
      headers: { 'Authorization': 'bearer ' + ((authData && authData !== 'undefined') ? JSON.parse(authData) : '') },
      beforeUpload: this.beforeUpload,
      data: {
        stationCode: this.props.stationCode,
      },
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.code === '10000') {
            message.success(`${info.file.name} 导入完成`);
            //请求数据，把导入的组件刷新出来。
          } else {
            message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 导入失败，请重新导入.`);
        }
      },
    };
    return (
      <div className={styles.partInfoBox}>
        <div className={styles.title}>
          <div className={styles.checkStation}>
            电站选择
          <StationSelect
              data={allStationBaseInfo}
              onOK={this.selectStation}
              holderText="请选择电站"
              value={allStationBaseInfo.filter(e => e.stationCode === stationCode)}
            />
          </div>
          <div>
            <Upload {...uploadProps} className={styles.exportInfo}>
              <Button className={styles.exportInfo} onClick={this.showModal}>批量导入文件</Button>
            </Upload>
            <Button disabled={false} className={styles.exportInfo} onClick={this.exportparts}  >导出</Button>
            <Button className={styles.exportInfo} href={downloadTemplet} download={downloadTemplet} target="_blank"  >下载部件导入模板</Button>
          </div>

        </div>
        <div className={styles.conatainer}>
          <div className={styles.leftTree}>
            {stationName ? stationName : '请选择电站选择'}
          </div>
          <div className={styles.right}>
            <div className={styles.addParts}>
              <Button onClick={this.addPartsInfo} className={styles.plusButton} icon="plus"  >添加</Button>
              <Button className={styles.copyCom} onClick={this.copyComponent} >复制</Button>
            </div>
            <Table
              loading={false}
              // dataSource={deviceComList}
              dataSource={testData}
              columns={columns}
              pagination={false}
              locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
            />

          </div>
        </div>
        {showDetailParts && <DetailPartsInfo {...this.props} detailPartsInfo={detailPartsInfo} showDetailParts={showDetailParts} cancleDetailModal={this.cancleDetailModal} />}
        {showCopyParts&&<CopyParts {...this.props} closeComParts={this.closeComParts} showCopyParts={showCopyParts} />}
      </div>
    )
  }
}
export default (PartInfoBox)