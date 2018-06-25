import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import styles from './defectBasicInfo.scss';
import {Card} from 'antd';
import {getLevel} from '../../../../../constants/ticket';
import ImgUploader from '../../../../Common/Uploader/ImgUploader';

class DefectBasicInfo extends Component {
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

  getImagesData() {
    if(this.props.basicInfo.get('photoAddress')) {
      let images = this.props.basicInfo.get('photoAddress').split(',');
      return images.map((item, index) => {
        return {
          uid: index,
          rotate: 0,
          thumbUrl: item
        }
      });
    } else {
      return [];
    } 
  }

  renderBasic() {
    let info = this.props.basicInfo;
    return (
      <div>
        <div>电站名称<span>{info.get('stationName')}</span></div>
        <div>设备类型<span>{info.get('stationName')}</span></div>
        <div>设备名称<span>{info.get('deviceName')}</span></div>
        <div>缺陷类型<span>{info.get('defectTypeName')}</span></div>
        <div>缺陷级别<span>{getLevel(info.get('defectLevel'))}</span></div>
        <div>缺陷描述<span>{info.get('defectDescribe')}</span></div>
        <div>查看照片
          <div>
            <ImgUploader editable={false} data={this.getImagesData()} />
          </div>
        </div>
      </div>
    );
  }

  renderDeal() {
    let dealData = this.props.basicInfo.get('handleData');
    return (
      <div>
        <div>
          处理建议
          <span>{dealData.get('defectProposal')}</span>
          </div>
        {dealData.get('status') === '3' &&
          <div>处理结果
            <span>{dealData.get('defectSolveResult') === 0 ?'已解决':'未解决'}</span>
          </div>}
        {dealData.get('status') === '3' &&
          <div>处理过程<span>{dealData.get('defectSolveInfo')}</span></div>}
        {dealData.get('status') === '3' && dealData.get('replaceParts') !== '' &&
          <div>更换备件<span>{dealData.get('replaceParts')}</span></div>}
      </div>
    );
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

export default DefectBasicInfo;