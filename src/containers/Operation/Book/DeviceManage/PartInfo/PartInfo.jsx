import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './partInfo.scss';
import { partInfoAction } from './partInfoAction';

import TransitionContainer from '../../../../../components/Common/TransitionContainer';
import DeviceSide from '../../../../../components/System/Station/DeviceManage/DeviceSide';

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
             这是页面容器
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
  ...state.operation.partInfo.toJS(),
  stations: state.common.get('stations').toJS(),
  selectType: state.operation.deviceManage.get('selectType'),
});

const mapDispatchToProps = (dispatch) => ({
  changePartInfoStore: payload => dispatch({ type: partInfoAction.changePartInfoStore, payload }),
  resetPartInfoStore: payload => dispatch({ type: partInfoAction.resetPartInfoStore, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(PartInfo);
