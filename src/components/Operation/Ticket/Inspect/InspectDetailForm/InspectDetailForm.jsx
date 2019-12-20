import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InspectBasicInfo from '../InspectBasicInfo/InspectBasicInfo';
import InspectTimeLine from '../InspectTimeLine/InspectTimeLine';
import WarningTip from '../../../../Common/WarningTip';
import styles from './inspectDetailForm.scss';

import { Icon, Button, Modal } from 'antd';
import InspectAddAbnormal from '../InspectAddAbnormal/InspectAddAbnormal';
import InspectAbnormal from '../InspectAbnormal/InspectAbnormal';
import Immutable from 'immutable';


const confirm = Modal.confirm;
class InspectDetailForm extends Component {
  static propTypes = {
    inspectDetail: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onCloseInspectDetail: PropTypes.func,
    transformDefect: PropTypes.func,
    onDeleteAbnormal: PropTypes.func,
    changeInspectStore: PropTypes.func,
    getInspectOrbit: PropTypes.func,
    getInspectDetailRecord: PropTypes.func,
    getStationDeviceTypes: PropTypes.func,
    getInspectStandard: PropTypes.func,
    getInspectUsers: PropTypes.func,
    inspectStandard: PropTypes.object,
    setInspectCheck: PropTypes.func,
    onChangeShowContainer: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      abnormalIds: Immutable.fromJS([]),
      showWarningTip: false,
      warningTipText: '',
    };
  }

  onTransformDefect = () => {
    const { abnormalIds } = this.state;
    const inspectId = this.props.inspectDetail.get('inspectId');
    if (abnormalIds.size > 0) {
      confirm({
        title: '确定将选定的异常设备转为工单?',
        onOk: () => {
          this.props.transformDefect({
            inspectId: inspectId,
            abnormalIds: abnormalIds.toJS().join(','),
          });
          this.setState({
            abnormalIds: Immutable.fromJS([]),
          });
        },
      });
    }
  }

  onSelectItem = (abnormalId, checked) => {
    let abnormalIds = this.state.abnormalIds;
    if (checked) {
      abnormalIds = abnormalIds.push(abnormalId);
    } else {
      const index = abnormalIds.findIndex((item) => {
        return item === abnormalId;
      });
      abnormalIds = abnormalIds.delete(index);
    }
    this.setState({
      abnormalIds: abnormalIds,
    });
  }

  onInspectCheck = () => {
    const inspectId = this.props.inspectDetail.get('inspectId');
    confirm({
      title: '确定验收此巡检工单?',
      onOk: () => {
        this.props.setInspectCheck({
          inspectId: inspectId,
        });
      },
    });
  }

  onCancelEdit = () => {
    this.setState({
      showWarningTip: true,
      warningTipText: '退出后信息无法保存!',
    });
  }

  onCancelWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
  }

  onConfirmWarningTip = () => {
    this.setState({
      showWarningTip: false,
    });
    this.props.onCloseInspectDetail({ container: 'list' });
  }

  renderForm() {
    const status = this.props.inspectDetail.get('inspectStatus');
    const rightHandler = localStorage.getItem('rightHandler');
    const checkInspectRight = rightHandler && rightHandler.split(',').includes('workExamine_inspection_check');
    const abnormalIds = this.state.abnormalIds;
    if (status === "2") {
      return (
        <InspectAddAbnormal {...this.props} onSelectItem={this.onSelectItem} onTransformDefect={this.onTransformDefect} abnormalIds={this.state.abnormalIds} />
      )
    } else if (status === "3") {
      return (
        <div className={styles.checkInspect}>
          <div className={styles.title}>
            <div className={styles.border}></div>
            <div className={styles.text}>巡检处理</div>
            <div className={styles.border}></div>
          </div>
          <Button className={styles.transferBtn} onClick={this.onTransformDefect} disabled={abnormalIds.size === 0}>转工单</Button>
          <div style={{ color: '#353535' }}>

          </div>
          {checkInspectRight && <Button className={styles.checkBtn} onClick={this.onInspectCheck}>验收</Button>}
          <div style={{ color: '#353535' }}></div>
        </div>
      )
    }
    return null;

  }

  renderTitle() {
    const status = this.props.inspectDetail.get('inspectStatus');
    if (status === '2') {
      return '执行巡检';
    } else if (status === '3') {
      return '验收巡检';
    }
    return '缺陷详情';

  }

  render() {
    const { inspectDetail, onChangeShowContainer, changeInspectStore, getInspectDetailRecord, getInspectUsers, getInspectOrbit, getStationDeviceTypes } = this.props;
    //console.log(inspectDetail.toJS());
    const progressData = inspectDetail.get('processData');
    const inspectId = inspectDetail.get('inspectId');
    const stationCode = inspectDetail.get('stationCode');
    const trackCount = inspectDetail.get('trackCount');
    const recordCount = inspectDetail.get('recordCount');
    // console.log(stationCode);
    // //是为了把此工单里的设备名以及设备code进行组装，传到巡检记录详情里供筛选框使用
    // const deviceTypeCodes = inspectDetail.get('deviceTypeCodes') && inspectDetail.get('deviceTypeCodes').split(',');
    // const deviceTypeNames = inspectDetail.get('deviceTypeNames') && inspectDetail.get('deviceTypeNames').split(',');
    // let inspectDeviceType = [];
    // if (deviceTypeCodes) {
    //   for (let i = 0; i < deviceTypeCodes.length; i++) {
    //     inspectDeviceType.push({ "deviceTypeCodes": deviceTypeCodes[i], "deviceTypeNames": deviceTypeNames[i] })
    //   }
    // }

    const status = inspectDetail.get('inspectStatus');
    const { showWarningTip, warningTipText } = this.state;

    return (
      <div className={styles.detailWrap}>
        {showWarningTip && <WarningTip style={{ marginTop: '250px', width: '210px', height: '88px' }} onCancel={this.onCancelWarningTip} onOK={this.onConfirmWarningTip} value={warningTipText} />}
        <div className={styles.inspectDetail}>
          <div className={styles.header}>
            <div className={styles.text}>{this.renderTitle()}</div>
            <div className={styles.action}>
              <i className="iconfont icon-last" onClick={this.props.onPrev} />
              <i className="iconfont icon-next" onClick={this.props.onNext} />
              <Icon type="arrow-left" className={styles.backIcon} onClick={this.onCancelEdit} />
            </div>
          </div>
          <div className={styles.content} >
            <div className={styles.left} >
              <div className={styles.basic} >
                <InspectBasicInfo basicInfo={inspectDetail} />
              </div>
              <div className={styles.abnormal} >
                <InspectAbnormal
                  abnormalItems={inspectDetail.get('abnormalData')}
                  status={inspectDetail.get('inspectStatus')}
                  onDeleteAbnormal={this.props.onDeleteAbnormal}
                  getInspectStandard={this.props.getInspectStandard}
                  inspectDetail={this.props.inspectDetail}
                  inspectStandard={this.props.inspectStandard}
                  selectedIds={this.state.abnormalIds}
                  onSelectItem={this.onSelectItem}
                />
              </div>
            </div>
            <div className={styles.right} >
              <div className={styles.timeLines}>
                <InspectTimeLine
                  processData={progressData}
                  status={status}
                  deviceTypeName={inspectDetail.get('deviceTypeNames')}
                  abnormalItems={inspectDetail.get('abnormalData')}
                  onChangeShowContainer={onChangeShowContainer}
                  getInspectDetailRecord={getInspectDetailRecord}
                  changeInspectStore={changeInspectStore}
                  inspectId={inspectId}
                  getInspectUsers={getInspectUsers}
                  stationCode={stationCode}
                  getStationDeviceTypes={getStationDeviceTypes}
                  getInspectOrbit={getInspectOrbit}
                  recordCount={recordCount}
                  trackCount={trackCount}
                />
              </div>
              <div className={styles.form} >
                {this.renderForm()}
              </div>
            </div>
          </div>
        </div>


      </div>

    );
  }
}

export default InspectDetailForm;
