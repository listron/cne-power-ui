import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './partInfo.scss';
import { partInfoAction } from './partInfoAction';

import PartInfoBox from '../../../../../components/Operation/Book/PartInfoBox/PartInfoBox';
import TransitionContainer from '../../../../../components/Common/TransitionContainer';
import DeviceSide from '../../../../../components/Operation/Book/DeviceManage/DeviceSide';
import { commonAction } from '../../../../alphaRedux/commonAction';

import PropTypes from 'prop-types';
import Cookie from 'js-cookie';

class PartInfo extends Component {
  static propTypes = {

    changePartInfoStore: PropTypes.func,
    resetPartInfoStore: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    const { enterpriseId, getStationOfEnterprise } = this.props;
    getStationOfEnterprise({ enterpriseId }); // 请求用户所在企业的所有企业
  }
  componentWillUnmount() {

  }

  queryTargetData = (value) => {
    this.props.changeTab(value)
  }

  render() {

    const {
      selectType, stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod, showPage
    } = this.props;
    console.log('selectType: ', selectType);
    const queryParams = {
      stationCode, deviceTypeCode, deviceModeCode, pageNum, pageSize, sortField, sortMethod
    }
    return (
      <div className={styles.deviceManageContainer}>
        {selectType === 'partInfo' && <div className={styles.deviceManage}>
          <div className={styles.deviceManageMain}>
            <div className={styles.allStationTitle} >
              <p className={selectType === 'deviceInfo' ? styles.activeStation : ''} onClick={() => { this.queryTargetData('deviceInfo') }}>设备信息</p>
              <p className={selectType === 'partInfo' ? styles.activeStation : ''} onClick={() => { this.queryTargetData('partInfo') }}>组件信息</p>
            </div>
            <div className={styles.deviceManageContent}>
             <PartInfoBox {...this.props} />
            </div>
          </div>
          <TransitionContainer
            show={showPage !== 'list'}
            onEnter={this.onToggleSide}
            onExited={this.onToggleSide}
            timeout={500}
            effect="side"
          >
            <DeviceSide {...this.props} queryParams={queryParams} showSidePage={''} onShowSideChange={this.onShowSideChange} />
          </TransitionContainer>
        </div>
        }
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  enterpriseId: Cookie.get('enterpriseId'),
  ...state.operation.partInfo.toJS(),
  stations: state.common.get('stations').toJS(),
  selectType: state.operation.deviceManage.get('selectType'),
 
});

const mapDispatchToProps = (dispatch) => ({
  changePartInfoStore: payload => dispatch({ type: partInfoAction.changePartInfoStore, payload }),
  resetPartInfoStore: payload => dispatch({ type: partInfoAction.resetPartInfoStore, payload }),
  getDeviceTypeList: payload => dispatch({ type: partInfoAction.getDeviceTypeList, payload }),
  getDeviceComList: payload => dispatch({ type: partInfoAction.getDeviceComList, payload }),
  addPartInfo: payload => dispatch({ type: partInfoAction.addPartInfo, payload }),
  editPartInfo: payload => dispatch({ type: partInfoAction.editPartInfo, payload }),
  getDetailPartInfo: payload => dispatch({ type: partInfoAction.getDetailPartInfo, payload }),
  deletePartInfo: payload => dispatch({ type: partInfoAction.deletePartInfo, payload }),
  getStationOfEnterprise: params => dispatch({
    type: commonAction.getStationOfEnterprise,
    payload: {
      params,
      actionName: partInfoAction.changePartInfoStore,
      resultName: 'allStationBaseInfo'
    }
  }),
  downLoadFile: payload => dispatch({
    type: commonAction.downLoadFile,
    payload: {
      ...payload,
      actionName: partInfoAction.changePartInfoStore,
    }
  })
});

export default connect(mapStateToProps, mapDispatchToProps)(PartInfo);
