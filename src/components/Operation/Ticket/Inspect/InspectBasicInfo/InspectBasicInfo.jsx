import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './inspectBasicInfo.scss';
import { Card } from 'antd';

class InspectBasicInfo extends Component {
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
    return (
      <div>
        <div>电站名称<span>{info.get('stationName')}</span></div>
        <div>巡检名称<span>{info.get('inspectName')}</span></div>
        <div>巡检时间<span>{info.get('createTime')}至{info.get('deadLine')}</span></div>
        <div>设备类型<span>{info.get('deviceTypeNames')}</span></div>
      </div>
    )
  }

  render(){ 
    return (
      <div className={styles.inspectBasicInfo} >
        <Card title="基本信息">
          {this.renderBasic()}
        </Card>
      </div>
    )
  }

}

export default InspectBasicInfo;