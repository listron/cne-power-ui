import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InspectBasicInfo from '../InspectBasicInfo/InspectBasicInfo';
import TimeLines from '../../../../Common/TimeLines';
import styles from './inspectDetailForm.scss';

import { Icon } from 'antd';
import InspectAddAbnormal from '../InspectAddAbnormal/InspectAddAbnormal';
import InspectAbnormal from '../InspectAbnormal/InspectAbnormal';


class InspectDetailForm extends Component {
  static propTypes={
    inspectDetail: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onCloseInspectDetail: PropTypes.func,
    getDeviceTypeList: PropTypes.func,
    deviceTypes: PropTypes.array,
  }

  constructor(props){
    super(props);
    this.state={}
  }

  renderForm(){
    let status = this.props.inspectDetail.get('inspectStatus');
    console.log(this.props.inspectDetail.toJS())
    if(status === "2"){
      return (
        <InspectAddAbnormal
          inspectDetail={this.props.inspectDetail}
          deviceTypes={this.props.deviceTypes}
          getDeviceTypeList={this.props.getDeviceTypeList}
          onCloseInspectDetail={this.props.onCloseInspectDetail}
        />
      )
    } else if(status === "3"){
      return (
        <div></div>
      )
    } else {
      return null;
    }
  }

  render(){
    let inspectDetail = this.props.inspectDetail;
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
            {inspectDetail.get('abnormalData').size !== 0 && (
              <div className={styles.abnormal} >
                <InspectAbnormal abnormalItems={inspectDetail.get('abnormalData')} />
              </div>
            )}
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
