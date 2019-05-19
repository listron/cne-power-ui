import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import { Button, Table, Tree,Upload } from 'antd';
import StationSelect from '../../../Common/StationSelect';
import path from '../../../../constants/path';
import Cookie from 'js-cookie';
const { APIBasePath } = path.basePaths;
const { operation } = path.APISubPaths;

class PartInfoBox extends React.Component {
  constructor(props, context) {
    super(props, context)
  }
  selectStation = (stations) => {
    const { getDeviceTypeList, queryParams, changePartInfoStore } = this.props;
    getDeviceTypeList({
      stationCode: stations[0].stationCode,
    })
    changePartInfoStore({
      stationCode: stations[0].stationCode,
    })

  }
  beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    if (!isExcel) {
      message.error('You can only upload Excel file!');
    }
    return isExcel;
  }
  exportparts=()=>{
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
  render() {
    const { allStationBaseInfo, deviceComList ,stationCode} = this.props;
    console.log('allStationBaseInfo: ', allStationBaseInfo);
    const columns = [
      {
        title: '部件名称',
        dataIndex: 'partsName',
        render: (text) => <span title={text}>{text}</span>
      }, {
        title: '部件型号',
        dataIndex: 'partsModeName',
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
      },
    ];
    // const downloadHref = `${path.basePaths.APIBasePath}${path.APISubPaths.operation.exportParts}?stationCode=${stationCode}`;
    const downloadTemplet = `${path.basePaths.originUri}${path.APISubPaths.system.downloadDeviceTemplet}`;
    // const url = Path.basePaths.APIBasePath + Path.APISubPaths.system.importUserBatch;
    const url = `${APIBasePath}${operation.importParts}`;
    const authData = Cookie.get('authData') || null;
    const uploadProps = {
      showUploadList:false,
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
            value={allStationBaseInfo.filter(e=>e.stationCode === stationCode)}
          />
          </div>
         
          <div>
            
            <Upload {...uploadProps} className={styles.exportInfo}>
            <Button className={styles.exportInfo} onClick={this.showModal}>批量导入文件</Button>
            </Upload>
            <Button disabled={false} className={styles.exportInfo}  onClick={this.exportparts}  >导出</Button>
            <Button className={styles.exportInfo} href={downloadTemplet} download={downloadTemplet} target="_blank"  >下载部件导入模板</Button>
          </div>

        </div>
        <div className={styles.conatainer}>
          <div className={styles.leftTree}>
            请选择电站
          </div>
          <div className={styles.right}>
            <div className={styles.addParts}>
              <Button onClick={this.addPartsInfo} className={styles.plusButton} icon="plus"  >添加</Button>
              <Button className={styles.copyCom}  >复制</Button>
            </div>
            <Table
              loading={false}
              dataSource={deviceComList}
              columns={columns}
              pagination={false}
              locale={{ emptyText: <img width="223" height="164" src="/img/nodata.png" /> }}
            />

          </div>
        </div>
      </div>
    )
  }
}
export default (PartInfoBox)