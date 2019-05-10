import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import styles from "./assetsConfig.scss";
import CommonBreadcrumb from '../../../../components/Common/CommonBreadcrumb';
import { assetConfigAction } from './assetsConfigAction';
import { commonAction } from '../../../../containers/alphaRedux/commonAction';
import Footer from '../../../../components/Common/Footer';
import AssetStructure from '../../../../components/Operation/Book/AssetConfigBox/AssetStructure/AssetStructure';
import DeviceFactory from '../../../../components/Operation/Book/AssetConfigBox/DeviceFactory/DeviceFactory';
import DeviceMode from '../../../../components/Operation/Book/AssetConfigBox/DeviceMode/DeviceMode';


class AssetsConfig extends Component {
  static propTypes = {
    resetAssetConfigStore: PropTypes.func,
    changeAssetConfigStore: PropTypes.func,
    selectType: PropTypes.string,

  }
  constructor(props, context) {
    super(props, context)
  }
  componentDidMount() {
    this.props.getAssetTree()
  }

  queryTargetData = (activeKey) => { //头部tab切换
    const { changeAssetConfigStore, } = this.props;
    changeAssetConfigStore({ selectType: activeKey, });
  }

  render() {
    const { selectType } = this.props;
    const breadCrumbData = {
      breadData: [
        {
          name: '资产配置',
        }
      ],
    };
    return (
      <div className={styles.containerDiv}>
        <CommonBreadcrumb  {...breadCrumbData} style={{ marginLeft: '38px' }} />
        <div className={styles.containerBg}>
          <div className={styles.container}>
            <div className={styles.allStationTitle} >
              <p className={selectType === 'assetStructure' ? styles.activeStation : ''} onClick={() => { this.queryTargetData('assetStructure') }}>资产结构</p>
              <p className={selectType === 'deviceFactory' ? styles.activeStation : ''} onClick={() => { this.queryTargetData('deviceFactory') }}>设备厂家</p>
              <p className={selectType === 'deviceMode' ? styles.activeStation : ''} onClick={() => { this.queryTargetData('deviceMode') }}>设备型号</p>
            </div>
            {selectType === 'assetStructure' && <AssetStructure {...this.props} />}
            {selectType === 'deviceFactory' && <DeviceFactory {...this.props} />}
            {selectType === 'deviceMode' && <DeviceMode {...this.props} />}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    ...state.operation.assetsConfig.toJS(),
    stations: state.common.get('stations').toJS(),
    deviceTypes: state.common.get('deviceTypes').toJS(),
    stationTypeCount: state.common.get('stationTypeCount'),

  }
}
const mapDispatchToProps = (dispatch) => ({
  changeAssetConfigStore: payload => dispatch({ type: assetConfigAction.changeAssetConfigStore, payload }),
  resetAssetConfigStore: payload => dispatch({ type: assetConfigAction.resetAssetConfigStore, payload }),
  getAssetTree: payload => dispatch({ type: assetConfigAction.getAssetTree, payload }),// 台账生产资产树
  getNodeDetail: payload => dispatch({ type: assetConfigAction.getNodeDetail, payload }),// 台账生产资产树节点详情
  addAssetNode: payload => dispatch({ type: assetConfigAction.addAssetNode, payload }),//台账增加生产资产节点
  deleteAssetNode: payload => dispatch({ type: assetConfigAction.deleteAssetNode, payload }),//台账删除生产资产树
  editAssetNode: payload => dispatch({ type: assetConfigAction.editAssetNode, payload }),//台账编辑生产资产节点
  getDeviceFactorsList: payload => dispatch({ type: assetConfigAction.getDeviceFactorsList, payload }),//获取设备厂家列表
  addDeviceFactors: payload => dispatch({ type: assetConfigAction.addDeviceFactors, payload }),//新建设备厂家
  editDeviceFactors: payload => dispatch({ type: assetConfigAction.editDeviceFactors, payload }),//编辑设备厂家
  deleteDeviceFactors: payload => dispatch({ type: assetConfigAction.deleteDeviceFactors, payload }),//删除设备厂家
  getDeviceModesList: payload => dispatch({ type: assetConfigAction.getDeviceModesList, payload }),//获取设备型号列表
  addDeviceModes: payload => dispatch({ type: assetConfigAction.addDeviceModes, payload }),//新建设备型号
  editDeviceModes: payload => dispatch({ type: assetConfigAction.editDeviceModes, payload }),//编辑设备型号
  deleteDeviceModes: payload => dispatch({ type: assetConfigAction.deleteDeviceModes, payload }),//删除设备型号

})
export default connect(mapStateToProps, mapDispatchToProps)(AssetsConfig)
