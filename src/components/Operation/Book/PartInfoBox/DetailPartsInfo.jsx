import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import { Modal } from 'antd';

class DetailPartsInfo extends React.Component {
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    cancleDetailModal: PropTypes.func,
    detailPartInfo: PropTypes.object,
    showDetailParts: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context)
  }
  handleCancel = () => {
    this.props.cancleDetailModal()
  }
  baseFun = (detailPartInfo) => {
    let baseArray = [
      { name: '电站名称', value: detailPartInfo.stationName, },
      { name: '上级设备', value: detailPartInfo.deviceName, },
      { name: '部件名称', value: detailPartInfo.partsName, },
      { name: '部件型号', value: detailPartInfo.partsModeName, },
      { name: '厂家', value: detailPartInfo.manufactorName, },
      { name: '批次号', value: detailPartInfo.batchNumber, },

    ];
    return baseArray
  }
  assetFun = (detailPartInfo) => {
    let assetArray = [
      { name: '资产结构', value: detailPartInfo.assetsName, },
      { name: '制造商', value: detailPartInfo.madeName, },
      { name: '供货商', value: detailPartInfo.supplierName, },
      { name: '创建时间', value: detailPartInfo.createTime, },
    ];
    return assetArray
  }
  detailInfoPart=(infoArray)=> {
    
    return (
      <div className={styles.detailPartsinfoBox}>
        <div className={styles.infoPart}>
          {infoArray.map(e => {
            let value;
            if (e.value || e.value === 0) {
              value = e.value;
            } else {
              value = '--'
            }
            return (<div key={e.name} className={styles.eachInfo}>
              <div className={styles.infoName}>{e.name}</div>
              <div className={styles.infoValue}
                title={`${value}${e.unit || ''}`}
              >{`${value}${e.unit || ''}`}</div>
            </div>)
          })}
        </div>
      </div>
    )
  }
  render() {
    let { showDetailParts, detailPartInfo } = this.props;
    console.log('detailPartInfo: ', detailPartInfo);

    let baseInfo = this.baseFun(detailPartInfo);
    let assetInfo = this.assetFun(detailPartInfo);
    return (
      <div>
        <Modal
          title="部件详情"
          visible={showDetailParts}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          centered={true}
          mask={false}
          footer={null}
          closable
          maskClosable={false}
        >
          {this.detailInfoPart(baseInfo)}
          {this.detailInfoPart(assetInfo)}
        
        </Modal>
      </div>
    )
  }
}
export default (DetailPartsInfo)