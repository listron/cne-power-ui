import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import { Card } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

class BasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object,
  }

  static defaultProps = {

  }

  constructor(props){
    super(props);
    this.state={

    }
  }

  renderBasic(){
    let info = this.props.basicInfo;
    console.log(info.toJS());
    console.log("basicInfo");
    return (
      <div>
        <div>电站名称<span>{info.stationName}</span></div>
        <div>巡检名称<span>{info.inspectName}</span></div>
        <div>巡检时间<span>{info.createTime}至{info.deadLine}</span></div>
        <div>巡检描述<span>{info.abnormalData}</span></div>
      </div>
    )
  }

  renderAbnormal(){
    // let dealData = this.props.basicInfo.get("");
  }

  render(){
    return (
      <div className={styles.BasicInfo} >
        <Card title="基本信息">
          {this.renderBasic()}
        </Card>
        <Card title="异常设备">
          {this.renderAbnormal()}
        </Card>
      </div>
    )
  }

}

export default BasicInfo;