import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InspectBasicInfo from '../InspectBasicInfo/InspectBasicInfo';
import TimeLines from '../../../../Common/TimeLines';
import styles from './inspectDetailForm.scss';

import { Icon, Button, Modal } from 'antd';
import InspectAddAbnormal from '../InspectAddAbnormal/InspectAddAbnormal';
import InspectAbnormal from '../InspectAbnormal/InspectAbnormal';
import Immutable from 'immutable';

const confirm = Modal.confirm;
class InspectDetailForm extends Component {
  static propTypes={
    inspectDetail: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onCloseInspectDetail: PropTypes.func,
    deviceTypes: PropTypes.object,
    stationCode: PropTypes.string,
    defectTypes: PropTypes.object,
    getDefectTypes: PropTypes.func,
    transformDefect: PropTypes.func,
    finishInspect: PropTypes.func,
    addInspectAbnormal: PropTypes.func,
    loadDeviceTypeList: PropTypes.func,
    loadDeviceAreaList: PropTypes.func,
    loadDeviceList: PropTypes.func,
    deviceTypeItems: PropTypes.object,
    deviceAreaItems: PropTypes.object,
    deviceItems: PropTypes.object,
    onDeleteAbnormal: PropTypes.func,
    getInspectStandard: PropTypes.func,
    inspectStandard: PropTypes.object,
  }

  constructor(props){
    super(props);
    this.state={
      disabled: false,
      abnormalIds: Immutable.fromJS([]),
      tipColor: "#999",
    }
  }

  onTransformDefect = () => {
    let inspectId = this.props.inspectDetail.get('inspectId');
    if(this.state.abnormalIds.size > 0){
      confirm({
        title: '确定将选定的异常设备转为工单?',
        onOk: () => {
          this.props.transformDefect({
            inspectId: inspectId,
            abnormalIds: this.state.abnormalIds.toJS().join(','),
          })
          this.setState({
            abnormalIds: Immutable.fromJS([]),
          })
        },
        onCancel: () => {
        },
      })
    } else {
      this.setState({
        tipColor : "#c80000",
      })
    }
    
  }

  onSelectItem = (abnormalId, checked) => {
    let abnormalIds = this.state.abnormalIds;
    if(checked) {
      abnormalIds = abnormalIds.push(abnormalId);
    } else {
      let index = abnormalIds.findIndex((item) => {
        return item === abnormalId;
      });
      abnormalIds = abnormalIds.delete(index);
    }
    this.setState({
      abnormalIds: abnormalIds
    });
  }

  onInspectCheck = () => {
    let inspectId = this.props.inspectDetail.get('inspectId');
    var that = this;
    confirm({
      title: '确定验收此巡检工单?',
      onOk() {
        that.props.setInspectCheck({
          inspectId: inspectId,
        })
      },
      onCancel() {
      },
    })
  }

  renderForm(){
    let status = this.props.inspectDetail.get('inspectStatus');
    const rightHandler = localStorage.getItem('rightHandler');
    const checkInspectRight = rightHandler && rightHandler.includes('workExamine_inspection_check');
    if(status === "2"){
      return (
        <InspectAddAbnormal
          deviceTypes={this.props.deviceTypes}
          defectTypes={this.props.defectTypes}
          getDefectTypes={this.props.getDefectTypes}
          finishInspect={this.props.finishInspect}
          addInspectAbnormal={this.props.addInspectAbnormal}
          onCloseInspectDetail={this.props.onCloseInspectDetail}
          inspectDetail={this.props.inspectDetail}
          deviceTypeItems={this.props.deviceTypeItems}
          deviceAreaItems={this.props.deviceAreaItems}
          deviceItems={this.props.deviceItems}
          loadDeviceTypeList={this.props.loadDeviceTypeList}
          loadDeviceAreaList={this.props.loadDeviceAreaList}
          loadDeviceList={this.props.loadDeviceList}
        />
      )
    } else if(status === "3"){
      return (
        <div>
          <div>
            <Button type="primary" onClick={this.onTransformDefect} disabled={this.state.disabled} >转工单</Button>
            <div style={{color:this.state.tipColor}}>（请先选择设备，灰色背景为不可选）</div>
          </div>
          {checkInspectRight && <div>
            <Button type="primary" onClick={this.onInspectCheck} >验收</Button>
            <div>（确认验收，请点击按钮）</div>
          </div>}
        </div>
      )
    } else {
      return null;
    }
  }

  render(){
    let { inspectDetail } = this.props;
    let progressData = inspectDetail.get('processData');  
    return (
      <div className={styles.inspectDetail} >
        <div className={styles.header} >
          <Icon type="up" onClick={this.props.onPrev} />
          <Icon type="down" onClick={this.props.onNext} />
          <Icon type="close" onClick={this.props.onCloseInspectDetail} />
        </div>
        <div className={styles.content} >
          <div className={styles.left} >
            <div className={styles.basic} >
              <InspectBasicInfo basicInfo={inspectDetail} />
            </div>
            <div className={styles.abnormal} >
              <InspectAbnormal 
                abnormalItems={inspectDetail.get('abnormalData')}
                status={inspectDetail.get("inspectStatus")}
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
              <TimeLines processData={progressData} status={inspectDetail.get("inspectStatus")} />
            </div>
            <div className={styles.form} >
              {this.renderForm()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InspectDetailForm;
