import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from '../BasicInfo/BasicInfo';
import TimeLines from '../../../../Common/TimeLines';
import styles from './detail.scss';
import { Icon, Button, Form, Select, Input } from 'antd';
import HandleForm from '../HandleForm/HandleForm';

const FormItem = Form.Item;

class Detail extends Component {
  static propTypes={
    inspectDetail: PropTypes.object,
    processData: PropTypes.object,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
    onCloseInspectDetail: PropTypes.func,
    form: PropTypes.object,
    // getDeviceTypeList: PropTypes.func,
    deviceTypeList: PropTypes.object,
    stationCode: PropTypes.string,
  }

  constructor(props){
    super(props);
    this.state={

    }
    
  }

  componentDidMount(){
    
  }

  renderForm(){
    let status = this.props.inspectDetail.get("inspectStatus");
    
    if(status === "2"){
      return (
        <HandleForm  
          onCloseInspectDetail={this.props.onCloseInspectDetail}
          // getDeviceTypeList={this.props.getDeviceTypeList}
          deviceTypeList={this.props.deviceTypeList}
          stationCode={this.props.stationCode}
        />
      )
    }else if(status === "3"){
      return (
        <div></div>
      )
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
          <div className={styles.basic} >
            <BasicInfo basicInfo={inspectDetail} />
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

export default Detail;
