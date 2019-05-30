import React from "react";
import PropTypes from "prop-types";
import styles from "./partInfoBox.scss";
import { Modal } from 'antd';

class DetailPartsInfo extends React.Component {
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    cancleDetailModal: PropTypes.func,
    detailPartsInfo: PropTypes.object,
    showDetailParts: PropTypes.bool,
  }
  constructor(props, context) {
    super(props, context)
  }
  handleCancel = () => {
    this.props.cancleDetailModal()
  }
  baseFun = (detailPartsInfo) => {
    let baseArray = [
      { name: '电站名称', value: detailPartsInfo.stationName, },
      { name: '上级设备', value: detailPartsInfo.deviceCode, },
      { name: '部件名称', value: detailPartsInfo.partsName, },
      { name: '部件型号', value: detailPartsInfo.partsModeName, },
      { name: '厂家', value: detailPartsInfo.manufactorName, },
      { name: '批次号', value: detailPartsInfo.batchNumber, },

    ];
    return baseArray
  }
  assetFun = (detailPartsInfo) => {
    let assetArray = [
      { name: '资产结构', value: detailPartsInfo.assetsName, },
      { name: '制造商', value: detailPartsInfo.madeName, },
      { name: '供货商', value: detailPartsInfo.supplierName, },
      { name: '创建时间', value: detailPartsInfo.creatTime, },
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
    let { showDetailParts, detailPartsInfo } = this.props;

    let baseInfo = this.baseFun(detailPartsInfo);
    let assetInfo = this.assetFun(detailPartsInfo);
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