import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './basicInfo.scss';
import {Card} from 'antd';
import {getLevel, getStatus} from '../../../../constants/ticket';
import ImgUploader from '../../../Common/Uploader/ImgUploader'

class BasicInfo extends Component {
  static propTypes = {
    basicInfo: PropTypes.object
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };  
  }

  renderBasic() {
    let info = this.props.basicInfo;
    return (
      <div>
        <div>电站名称<span>{info.get("stationName")}</span></div>
        <div>设备类型<span>{info.get("stationName")}</span></div>
        <div>设备名称<span>{info.get("deviceName")}</span></div>
        <div>缺陷类型<span>{info.get("defectTypeName")}</span></div>
        <div>缺陷级别<span>{getLevel(info.get("defectLevel"))}</span></div>
        <div>缺陷描述<span>{info.get("defectDescribe")}</span></div>
        <div>查看照片
          <div>

          </div>
        </div>
      </div>
    )
  }

  render() {   
    return (
      <div className={styles.basicInfo}>
        <Card title="基本信息">
          {this.renderBasic()}
        </Card>
        <Card title="处理信息">
          {this.renderDeal()}
        </Card>
      </div>
    );
  }  
}

export default BasicInfo;