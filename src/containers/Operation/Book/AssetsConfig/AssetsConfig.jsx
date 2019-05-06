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
              <p className={selectType === 'assetStructure' && styles.activeStation} onClick={()=>{this.queryTargetData('assetStructure')}}>资产结构</p>
              <p className={selectType === 'deviceFactory' && styles.activeStation} onClick={()=>{this.queryTargetData('deviceFactory')}}>设备厂家</p>
              <p className={selectType === 'deviceMode' && styles.activeStation} onClick={()=>{this.queryTargetData('deviceMode')}}>设备型号</p>
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
  getAssetConfigList: payload => dispatch({ type: assetConfigAction.getAssetConfigList, payload }),


})
export default connect(mapStateToProps, mapDispatchToProps)(AssetsConfig)
