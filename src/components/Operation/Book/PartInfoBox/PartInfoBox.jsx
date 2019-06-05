import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import DetailPartsInfo from "./DetailPartsInfo";
import DeviceTree from "./DeviceTree";
import CopyParts from "./CopyParts";
import { Button, Table, Upload, message } from "antd";
import StationSelect from "../../../Common/StationSelect";
import path from "../../../../constants/path";
import moment from "moment";
import Cookie from "js-cookie";
const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

class PartInfoBox extends React.Component {
  static propTypes = {
    changePartInfoStore: PropTypes.func,
    getDevicePartInfo: PropTypes.func,
    deletePartInfo: PropTypes.func,
    getDetailPartInfo: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    downLoadFile: PropTypes.func,
    getPartsAssetTree: PropTypes.func,
    getPartsFactorsList: PropTypes.func,
    allStationBaseInfo: PropTypes.array,
    deviceComList: PropTypes.array,
    stationCode: PropTypes.any,
    detailPartsRecord: PropTypes.object,
    stationName: PropTypes.string,
    deviceCode: PropTypes.string
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDetailParts: false,
      detailPartsInfo: {},
      showCopyParts: false
    };
  }
  selectStation = stations => {
    const { getDeviceTypeList, changePartInfoStore } = this.props;
    let stationCode = stations.length > 0 && stations[0].stationCode;
    let stationName = stations.length > 0 && stations[0].stationName;

    getDeviceTypeList({
      stationCode,
      deviceCode: "",
      type: "0"
    });
    changePartInfoStore({
      stationCode,
      stationName
    });
  };
  beforeUpload = file => {
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";
    if (!isExcel) {
      message.error("You can only upload Excel file!");
    }
    return isExcel;
  };
  exportparts = () => {
    const { downLoadFile, stationCode } = this.props;
    const url = `${APIBasePath}${operation.exportParts}`;
    downLoadFile({
      url,
      fileName: `导出电站组件.xlsx`,
      params: {
        stationCode,
        nowTime: moment()
          .utc()
          .format()
      }
    });
  };
  addPartsInfo = () => {
    const {
      getPartsAssetTree,
      stationCode,
      allStationBaseInfo,
      getPartsFactorsList,
      deviceCode
    } = this.props;
    let deviceTypeCode = deviceCode.split("M")[1];
    let stationInfo = allStationBaseInfo.filter(
      (e, i) => e.stationCode === stationCode
    );
    let { stationType } = stationInfo[0];

    this.props.changePartInfoStore({ showPage: "add" });
    getPartsAssetTree({
      //资产树
      stationType,
      assetsParentId: "0"
    });
    getPartsFactorsList({
      // deviceTypeCode: 202,
      deviceTypeCode: deviceTypeCode,
      orderField: "1",
      orderMethod: "desc"
    });
  };
  editParts = record => {
    const {
      getPartsAssetTree,
      stationCode,
      allStationBaseInfo,
      getPartsFactorsList,
      deviceCode
    } = this.props;
    let deviceTypeCode = deviceCode.split("M")[1];
    let stationInfo = allStationBaseInfo.filter(
      (e, i) => e.stationCode === stationCode
    );
    let { stationType } = stationInfo[0];
    getPartsAssetTree({
      //资产树
      stationType,
      assetsParentId: "0"
    });
    getPartsFactorsList({
      // deviceTypeCode: 202,
      deviceTypeCode: deviceTypeCode,
      orderField: "1",
      orderMethod: "desc"
    });

    this.props.changePartInfoStore({
      showPage: "edit",
      detailPartsRecord: record
    });
  };
  deleteParts = record => {
    this.props.deletePartInfo({
      partsId: record.partsId
    });
  };
  showDetailParts = record => {
    this.setState({
      showDetailParts: true
      // detailPartsInfo: record
    });
    this.props.getDetailPartInfo({
      partsId: record.partsId
    });
  };
  cancleDetailModal = () => {
    this.setState({
      showDetailParts: false
    });
  };

  copyComponent = () => {
    const { getDevicePartInfo, deviceCode } = this.props;
    this.setState({
      showCopyParts: true
    });
    getDevicePartInfo({
      deviceFullcode: deviceCode,
      orderField: "1",
      orderMethod: "desc"
    });
  };
  closeComParts = () => {
    this.setState({
      showCopyParts: false
    });
  };
  render() {
    const {
      allStationBaseInfo,
      deviceComList,
      stationCode,
      stationName,
      deviceCode
    } = this.props;
    let { showDetailParts, showCopyParts } = this.state;
    let disableClick = !(stationCode && deviceCode);

    const columns = [
      {
        title: "部件名称",
        dataIndex: "partsName",
        render: (text, record, index) => (
          <span
            className={styles.comName}
            title={text}
            onClick={() => this.showDetailParts(record)}
          >
            {text}
          </span>
        )
      },
      {
        title: "部件型号",
        dataIndex: "partsModeName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "资产结构",
        dataIndex: "assetsName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "厂家",
        dataIndex: "manufactorName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "制造商",
        dataIndex: "madeName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "供货商",
        dataIndex: "supplierName",
        render: text => <span title={text}>{text}</span>
      },
      {
        title: "操作",
        render: (text, record, index) => {
          return (
            <div>
              <span
                title="编辑"
                className="iconfont icon-edit"
                onClick={() => this.editParts(record)}
              />
              <span
                title="删除"
                className="iconfont icon-del"
                onClick={() => this.deleteParts(record)}
              />
            </div>
          );
        }
      }
    ];
    const downloadTemplet = `${path.basePaths.originUri}${
      path.APISubPaths.operation.downloadPartInfoTemplet
    }`;
    const url = `${APIBasePath}${operation.importParts}`;
    const authData = Cookie.get("authData") || null;
    const uploadProps = {
      showUploadList: false,
      name: "file",
      action: url,
      headers: {
        Authorization:
          "bearer " +
          (authData && authData !== "undefined" ? JSON.parse(authData) : "")
      },
      beforeUpload: this.beforeUpload,
      data: {
        stationCode: this.props.stationCode,
        nowTime: moment()
          .utc()
          .format()
      },
      onChange: info => {
        if (info.file.status === "done") {
          if (info.file.response.code === "10000") {
            message.success(`${info.file.name} 导入完成`);
            //请求数据，把导入的组件刷新出来。
          } else {
            message.error(info.file.response.message);
          }
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} 导入失败，请重新导入.`);
        }
      }
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
              value={allStationBaseInfo.filter(
                e => e.stationCode === stationCode
              )}
            />
          </div>
          <div>
            <Upload {...uploadProps} className={styles.exportInfo}>
              <Button
                className={styles.exportInfo}
                disabled={!stationCode}
                onClick={this.showModal}
              >
                批量导入文件
              </Button>
            </Upload>
            <Button
              disabled={false}
              className={styles.exportInfo}
              disabled={!stationCode}
              onClick={this.exportparts}
            >
              导出
            </Button>
            <Button
              className={styles.exportInfo}
              href={downloadTemplet}
              download={downloadTemplet}
              target="_blank"
            >
              下载部件导入模板
            </Button>
          </div>
        </div>
        <div className={styles.conatainer}>
          <div className={styles.leftTree}>
            {stationName ? stationName : "请选择电站选择"}
            {stationName ? <DeviceTree {...this.props} /> : ""}
          </div>
          <div className={styles.right}>
            <div className={styles.addParts}>
              <Button
                onClick={this.addPartsInfo}
                disabled={disableClick}
                className={disableClick ? styles.noColor : styles.plusButton}
                icon="plus"
              >
                添加
              </Button>
              <Button
                className={disableClick ? styles.noColor : styles.copyCom}
                disabled={disableClick}
                onClick={this.copyComponent}
              >
                复制
              </Button>
            </div>
            <Table
              loading={false}
              dataSource={deviceComList}
              columns={columns}
              pagination={false}
              locale={{
                emptyText: (
                  <img width="223" height="164" src="/img/nodata.png" />
                )
              }}
            />
          </div>
        </div>
        {showDetailParts && (
          <DetailPartsInfo
            {...this.props}
            showDetailParts={showDetailParts}
            cancleDetailModal={this.cancleDetailModal}
          />
        )}
        {showCopyParts && (
          <CopyParts
            {...this.props}
            closeComParts={this.closeComParts}
            showCopyParts={showCopyParts}
          />
        )}
      </div>
    );
  }
}
export default PartInfoBox;
