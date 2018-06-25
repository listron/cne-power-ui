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
    processData: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onCloseInspectDetail: PropTypes.func,
    form: PropTypes.object,
    getDeviceTypeList: PropTypes.func,
    deviceTypeList: PropTypes.object,
    stationCode: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state={

    }
    
  }

  componentDidMount(){

    this.props.getDeviceTypeList({
      stationCodes: this.props.inspectDetail.get('stationCode')
    })
  }

  renderForm(){
    let status = this.props.inspectDetail.get('inspectStatus');
    
    if(status === "2"){
      return (
        <InspectAddAbnormal  
          onCloseInspectDetail={this.props.onCloseInspectDetail}
          deviceTypeList={this.props.deviceTypeList}
          stationCode={this.props.stationCode}
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
