import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import { Card } from 'antd';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

class BasicInfo extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props){
    super(props);
    this.state={

    }
  }

  renderBasic(){
    let info = this.props.BasicInfo;
    return (
      <div>
        
      </div>
    )
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